'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  Plus,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  Loader2,
  TrendingUp,
  Shield,
  Eye
} from 'lucide-react'
import Link from 'next/link'
import { Scan } from '@/lib/types/database'

export default function ScansPage() {
  const { data: scans, isLoading } = useQuery<Scan[]>({
    queryKey: ['all-scans'],
    queryFn: async () => {
      const response = await fetch('/api/scans')
      if (!response.ok) throw new Error('Failed to fetch scans')
      return response.json()
    }
  })

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default'
      case 'processing': return 'secondary'
      case 'failed': return 'destructive'
      default: return 'outline'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'processing': return <Activity className="h-4 w-4 animate-spin" />
      case 'failed': return <AlertTriangle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const activeScans = scans?.filter(s => s.status === 'processing' || s.status === 'pending') || []
  const completedScans = scans?.filter(s => s.status === 'completed') || []
  const failedScans = scans?.filter(s => s.status === 'failed') || []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Security Scans</h1>
          <p className="text-gray-500 mt-2">
            Manage and monitor all security assessments
          </p>
        </div>
        
        <Button asChild size="lg" className="shadow-sm">
          <Link href="/scans/new">
            <Plus className="mr-2 h-4 w-4" />
            New Scan
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Scans</CardTitle>
            <div className="p-2 bg-blue-50 rounded-full">
              <Shield className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{scans?.length || 0}</div>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active</CardTitle>
            <div className="p-2 bg-orange-50 rounded-full">
              <Activity className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{activeScans.length}</div>
            <p className="text-xs text-gray-500 mt-1">Currently running</p>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
            <div className="p-2 bg-green-50 rounded-full">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{completedScans.length}</div>
            <p className="text-xs text-gray-500 mt-1">Successfully finished</p>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Failed</CardTitle>
            <div className="p-2 bg-red-50 rounded-full">
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{failedScans.length}</div>
            <p className="text-xs text-gray-500 mt-1">Require attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Scans Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            All Scans
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Domain</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scans?.map((scan) => {
                    const progressPercentage = (scan.progress / scan.total_modules) * 100
                    return (
                      <TableRow key={scan.scan_id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          {scan.company_name}
                        </TableCell>
                        <TableCell className="font-mono text-sm text-gray-600">
                          {scan.domain}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(scan.status)} className="gap-1">
                            {getStatusIcon(scan.status)}
                            {scan.status.charAt(0).toUpperCase() + scan.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress value={progressPercentage} className="w-16 h-2" />
                            <span className="text-xs text-gray-500 w-8 tabular-nums">
                              {Math.round(progressPercentage)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {new Date(scan.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {scan.tags && scan.tags.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {scan.tags.slice(0, 2).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {scan.tags.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{scan.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">None</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/scans/${scan.scan_id}`}>
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Link>
                            </Button>
                            {scan.status === 'completed' && (
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/scans/${scan.scan_id}/findings`}>
                                  <Activity className="h-3 w-3 mr-1" />
                                  Findings
                                </Link>
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
          
          {!isLoading && (!scans || scans.length === 0) && (
            <div className="text-center py-12">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No scans yet</h3>
              <p className="text-gray-500 mb-4">
                Start your first security scan to see results here.
              </p>
              <Button asChild>
                <Link href="/scans/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Start First Scan
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}