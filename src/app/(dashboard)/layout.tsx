import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gray-50/50">
      {/* Sidebar - Always visible for debugging */}
      <div className="w-64 flex-shrink-0 fixed inset-y-0 left-0 z-30">
        <div className="flex h-full flex-col bg-white border-r border-gray-200">
          <Sidebar />
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex-1 pl-64">
        <Header />
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}