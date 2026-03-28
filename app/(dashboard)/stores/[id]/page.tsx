import prisma from '@/lib/db'
import { AddProductModal } from '@/components/AddProductModal'
import { ProductCard } from '@/components/ProductCard'
import Link from 'next/link'
import { ChevronLeft, Store, Package, RefreshCw } from 'lucide-react'
import { notFound } from 'next/navigation'
import { DeleteStoreButton } from '@/components/DeleteStoreButton'

export const dynamic = 'force-dynamic'

export default async function StoreDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: storeId } = await params

  const store = await prisma.store.findUnique({
    where: { id: storeId },
    include: {
      products: { orderBy: { createdAt: 'desc' } }
    }
  })

  if (!store) notFound()

  return (
    <div className="space-y-5">
      {/* Breadcrumb + Title */}
      <div className="flex items-center gap-3 flex-wrap">
        <Link 
          href="/stores" 
          className="p-2 bg-white dark:bg-gray-900 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-800 text-gray-500 dark:text-gray-400 shadow-sm transition-colors flex-shrink-0"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-lg sm:text-2xl font-heading font-bold text-gray-900 dark:text-white flex items-center gap-2 min-w-0">
          <Store className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600 flex-shrink-0" />
          <span className="truncate">{store.name}</span>
        </h1>
        <div className="ml-auto flex-shrink-0">
          <DeleteStoreButton storeId={store.id} storeName={store.name} />
        </div>
      </div>

      {/* Sub-header with action */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-100">
              Daftar Produk 
              <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-semibold bg-primary-100 text-primary-700">
                {store.products.length}
              </span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Kelola stok dan catat penjualan produk di cabang ini</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              href={`/stores/${storeId}/restock`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-primary-200 bg-primary-50 dark:bg-primary-950/20 text-primary-700 text-sm font-semibold hover:bg-primary-100 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Restok Barang
            </Link>
            <AddProductModal storeId={storeId} />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {store.products.map((product: any) => (
          <ProductCard key={product.id} product={product} storeId={storeId} />
        ))}
        {store.products.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center p-10 bg-white dark:bg-gray-900 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500">
            <Package className="w-12 h-12 mb-3" />
            <p className="text-base font-semibold text-gray-600 dark:text-gray-300">Belum ada produk di cabang ini</p>
            <p className="text-sm text-center mt-1">Klik "Tambah Produk" untuk mulai mengisi stok</p>
          </div>
        )}
      </div>
    </div>
  )
}
