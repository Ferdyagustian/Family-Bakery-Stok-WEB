import prisma from '@/lib/db'
import { ExportPanel } from '@/components/ExportPanel'
import { FileSpreadsheet } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ReportsPage() {
  const stores = await prisma.store.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true },
  })

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-heading font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FileSpreadsheet className="w-6 h-6 text-green-600" />
              Laporan
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Export data penjualan dan stok produk ke file Excel
            </p>
          </div>
        </div>
      </div>

      {/* Export Panel */}
      <ExportPanel stores={stores} />
    </div>
  )
}
