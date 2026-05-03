'use client'

import { useState } from 'react'
import { ProductCard } from '@/components/ProductCard'
import { Package, Search } from 'lucide-react'

export function ProductSearchList({ products, storeId }: { products: any[], storeId: string }) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Cari nama produk..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors shadow-sm"
        />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} storeId={storeId} />
        ))}
        {filteredProducts.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center p-10 bg-white dark:bg-gray-900 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500">
            <Package className="w-12 h-12 mb-3" />
            <p className="text-base font-semibold text-gray-600 dark:text-gray-300">
              {products.length === 0 
                ? 'Belum ada produk di cabang ini' 
                : 'Produk tidak ditemukan'}
            </p>
            <p className="text-sm text-center mt-1">
              {products.length === 0 
                ? 'Klik "Tambah Produk" untuk mulai mengisi stok'
                : 'Coba gunakan kata kunci pencarian yang lain'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
