import Link from 'next/link'
import { LayoutDashboard, Store as StoreIcon, FileSpreadsheet, LogOut, X } from 'lucide-react'
import { logoutAction } from '@/lib/actions/auth'

interface SidebarProps {
  onClose?: () => void
  showCloseButton?: boolean
}

export function Sidebar({ onClose, showCloseButton }: SidebarProps) {
  return (
    <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 h-full flex flex-col flex-shrink-0">
      {/* Header */}
      <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center p-0.5 shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
            <img src="/logo.png" alt="Family Bakery Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-base font-heading font-bold text-gray-900 dark:text-white">Family Bakery</h1>
        </div>
        {showCloseButton && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-800 transition-colors"
            aria-label="Tutup menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 mb-3">Menu Utama</p>
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:bg-primary-950/20 hover:text-primary-700 transition-colors font-medium text-sm"
        >
          <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
          <span>Dashboard</span>
        </Link>
        <Link
          href="/stores"
          onClick={onClose}
          className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:bg-primary-950/20 hover:text-primary-700 transition-colors font-medium text-sm"
        >
          <StoreIcon className="w-5 h-5 flex-shrink-0" />
          <span>Manajemen Cabang</span>
        </Link>
        <Link
          href="/reports"
          onClick={onClose}
          className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:bg-primary-950/20 hover:text-primary-700 transition-colors font-medium text-sm"
        >
          <FileSpreadsheet className="w-5 h-5 flex-shrink-0" />
          <span>Laporan</span>
        </Link>
      </nav>

      {/* Footer: Logout */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800">
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors font-medium text-sm"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span>Logout</span>
          </button>
        </form>
      </div>
    </div>
  )
}
