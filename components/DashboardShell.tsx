'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { LowStockAlert } from '@/components/LowStockAlert'
import { Menu, Store } from 'lucide-react'

type LowStockProduct = {
  id: string
  name: string
  stockQuantity: number
  storeId: string
  storeName: string
}

export function DashboardShell({
  children,
  lowStockProducts = [],
}: {
  children: React.ReactNode
  lowStockProducts?: LowStockProduct[]
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">

      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Mobile Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 flex flex-col
        transform transition-transform duration-300 ease-in-out
        lg:hidden
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar onClose={() => setSidebarOpen(false)} showCloseButton />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">

        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Hamburger */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
              aria-label="Buka menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo (mobile only) */}
            <div className="lg:hidden flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center">
                <Store className="w-4 h-4 text-white" />
              </div>
              <span className="font-heading font-bold text-gray-900 text-sm">Vanilla Bakery</span>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* 🔔 Low stock notification bell */}
            <LowStockAlert products={lowStockProducts} />

            {/* Admin avatar */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
                A
              </div>
              <span className="hidden sm:block font-medium text-sm text-gray-700">Admin</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
