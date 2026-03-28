'use client'

import { useState } from 'react'
import { bulkRestockProducts } from '@/lib/actions/product'
import { useRouter } from 'next/navigation'
import { Package, RotateCcw, CheckCircle, AlertCircle, Search } from 'lucide-react'

type Product = {
  id: string
  name: string
  imageUrl: string | null
  stockQuantity: number
  price: number
}

export function RestockForm({ products, storeId }: { products: Product[], storeId: string }) {
  const [quantities, setQuantities] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [search, setSearch] = useState('')
  const router = useRouter()

  const updateQty = (id: string, val: string) => {
    // Only allow non-negative integers
    if (val === '' || /^\d+$/.test(val)) {
      setQuantities(prev => ({ ...prev, [id]: val }))
    }
  }

  const totalUpdated = Object.values(quantities).filter(v => parseInt(v) > 0).length
  const totalUnitsAdded = Object.values(quantities).reduce((sum, v) => sum + (parseInt(v) || 0), 0)

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  async function handleSubmit() {
    const restocks = Object.entries(quantities)
      .map(([productId, val]) => ({ productId, qty: parseInt(val) || 0 }))
      .filter(r => r.qty > 0)

    if (restocks.length === 0) {
      setResult({ type: 'error', message: 'Belum ada produk yang diisi jumlah restoknya.' })
      return
    }

    setLoading(true)
    setResult(null)
    const res = await bulkRestockProducts(restocks, storeId)
    setLoading(false)

    if (res?.error) {
      setResult({ type: 'error', message: res.error })
    } else {
      setResult({
        type: 'success',
        message: `✅ Berhasil merestok ${res.count} produk, total ${totalUnitsAdded} unit ditambahkan!`
      })
      setQuantities({}) // Reset all inputs
    }
  }

  const handleReset = () => {
    setQuantities({})
    setResult(null)
  }

  return (
    <div className="space-y-5">
      {/* Result Banner */}
      {result && (
        <div className={`flex items-start gap-3 p-4 rounded-xl border text-sm font-medium ${
          result.type === 'success'
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {result.type === 'success'
            ? <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            : <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          }
          <span>{result.message}</span>
        </div>
      )}

      {/* Toolbar */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Cari produk..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 h-10 rounded-lg border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Stats + Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          {totalUpdated > 0 && (
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 bg-primary-50 dark:bg-primary-950/20 px-3 py-1.5 rounded-lg">
              <span><span className="font-bold text-primary-700">{totalUpdated}</span> produk</span>
              <span><span className="font-bold text-primary-700">+{totalUnitsAdded}</span> unit total</span>
            </div>
          )}
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-200 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-800 transition-colors"
            disabled={loading}
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || totalUpdated === 0}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-200 disabled:text-gray-400 dark:text-gray-500 text-white font-semibold text-sm px-5 py-2 rounded-lg transition-colors"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Simpan Semua ({totalUpdated})
              </>
            )}
          </button>
        </div>
      </div>

      {/* Products List */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium text-gray-500 dark:text-gray-400">Produk tidak ditemukan</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map(product => {
            const qty = parseInt(quantities[product.id] || '0') || 0
            const hasValue = qty > 0
            const isLowStock = product.stockQuantity > 0 && product.stockQuantity < 10
            const isOutOfStock = product.stockQuantity === 0

            return (
              <div
                key={product.id}
                className={`bg-white dark:bg-gray-900 rounded-xl border-2 shadow-sm transition-all duration-200 overflow-hidden ${
                  hasValue
                    ? 'border-primary-300 shadow-primary-100'
                    : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:border-gray-700'
                }`}
              >
                {/* Product image */}
                {product.imageUrl ? (
                  <div className="h-36 overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="h-36 bg-gradient-to-br from-primary-50 dark:from-gray-900 to-purple-100 flex items-center justify-center">
                    <Package className="w-10 h-10 text-primary-200" />
                  </div>
                )}

                <div className="p-4 space-y-3">
                  {/* Product info */}
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">{product.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Rp {product.price.toLocaleString('id-ID')}
                    </p>
                  </div>

                  {/* Current stock badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Stok saat ini:</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      isOutOfStock
                        ? 'bg-red-100 text-red-600'
                        : isLowStock
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {isOutOfStock ? '⚠️ Habis' : `${product.stockQuantity} unit`}
                    </span>
                  </div>

                  {/* Restock input */}
                  <div>
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 block">
                      Tambah stok:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        value={quantities[product.id] ?? ''}
                        onChange={e => updateQty(product.id, e.target.value)}
                        placeholder="0"
                        disabled={loading}
                        className={`flex-1 h-10 rounded-lg border text-sm text-center font-semibold focus:outline-none focus:ring-2 transition-colors ${
                          hasValue
                            ? 'border-primary-400 bg-primary-50 dark:bg-primary-950/20 text-primary-700 focus:ring-primary-500'
                            : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 focus:ring-primary-400'
                        }`}
                      />
                      {hasValue && (
                        <div className="flex-shrink-0 text-xs text-primary-600 font-semibold bg-primary-50 dark:bg-primary-950/20 px-2 py-1.5 rounded-lg border border-primary-200">
                          {product.stockQuantity} → {product.stockQuantity + qty}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Bottom Save Button (for long lists) */}
      {filteredProducts.length > 6 && (
        <div className="sticky bottom-4 flex justify-center pt-2">
          <button
            onClick={handleSubmit}
            disabled={loading || totalUpdated === 0}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:text-gray-500 dark:text-gray-400 text-white font-semibold text-sm px-8 py-3 rounded-full shadow-lg shadow-primary-200 transition-all"
          >
            {loading ? 'Menyimpan...' : `Simpan Restok (${totalUpdated} produk, +${totalUnitsAdded} unit)`}
          </button>
        </div>
      )}
    </div>
  )
}
