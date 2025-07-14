'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
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
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Shield className="w-8 h-8 text-blue-600" />
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-gray-900">DealBrief</h1>
            <p className="text-xs text-gray-500">Security Scanner</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-8">
        {/* Core Workflow */}
        <div>
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Security Scanning
          </h3>
          <div className="mt-2 space-y-1">
            {coreNavigation.map((item) => {
              const isActive = pathname === item.href || 
                (pathname.startsWith(item.href) && item.href !== '/scans/new')
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <item.icon
                    className={cn(
                      'mr-3 h-4 w-4',
                      isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                    )}
                  />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Secondary Features */}
        <div>
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Management
          </h3>
          <div className="mt-2 space-y-1">
            {secondaryNavigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href)
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <item.icon
                    className={cn(
                      'mr-3 h-4 w-4',
                      isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                    )}
                  />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
    </div>
  )
}