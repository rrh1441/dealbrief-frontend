'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  Shield, 
  Activity, 
  Plus, 
  FileText, 
  Search,
  Users,
  CheckCircle,
  BarChart3
} from 'lucide-react'

const coreNavigation = [
  { name: 'Single Scan', href: '/scans/new', icon: Plus },
  { name: 'Bulk Scan', href: '/scans/bulk', icon: Users },
  { name: 'All Scans', href: '/scans', icon: Activity },
  { name: 'Findings', href: '/findings', icon: Search },
  { name: 'Reports', href: '/reports', icon: FileText },
]

const secondaryNavigation = [
  { name: 'Verified', href: '/verified', icon: CheckCircle },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="pb-12 w-64">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-8 h-8 text-primary" />
            <h2 className="text-lg font-semibold tracking-tight">DealBrief</h2>
          </div>
          
          {/* Core Workflow */}
          <div className="space-y-1 mb-6">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">
              Security Scanning
            </h3>
            {coreNavigation.map((item) => {
              const isActive = pathname === item.href || 
                (pathname.startsWith(item.href) && item.href !== '/scans/new')
              
              return (
                <Button
                  key={item.name}
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start',
                    isActive && 'bg-secondary'
                  )}
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                </Button>
              )
            })}
          </div>

          {/* Secondary Features */}
          <div className="space-y-1">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">
              Management
            </h3>
            {secondaryNavigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href)
              
              return (
                <Button
                  key={item.name}
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start',
                    isActive && 'bg-secondary'
                  )}
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                </Button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}