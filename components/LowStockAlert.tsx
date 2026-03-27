'use client'

import { useState, useRef, useEffect } from 'react'
import { Bell, Package, RefreshCw, X, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

type LowStockProduct = {
  id: string
  name: string
  stockQuantity: number
  storeId: string
  storeName: string
}

export function LowStockAlert({ products }: { products: LowStockProduct[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())
  const ref = useRef<HTMLDivElement>(null)

  const visible = products.filter(p => !dismissed.has(p.id))
  const count = visible.length

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const dismissOne = (id: string) => {
    setDismissed(prev => new Set([...prev, id]))
  }

  const dismissAll = () => {
    setDismissed(new Set(products.map(p => p.id)))
    setIsOpen(false)
  }

  if (products.length === 0) return null

  return (
    <div className="relative" ref={ref}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
        aria-label="Notifikasi stok hampir habis"
      >
        <Bell className={`w-5 h-5 ${count > 0 ? 'text-amber-500' : 'text-gray-400'}`} />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-amber-50 border-b border-amber-100">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span className="font-heading font-bold text-amber-800 text-sm">
                Stok Hampir Habis
              </span>
              {count > 0 && (
                <span className="bg-amber-200 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">
                  {count}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {count > 0 && (
                <button
                  onClick={dismissAll}
                  className="text-xs text-amber-600 hover:text-amber-800 font-medium px-2 py-1 rounded hover:bg-amber-100 transition-colors"
                >
                  Tutup semua
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-amber-400 hover:text-amber-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notification List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
            {visible.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-400">
                <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">Semua notifikasi telah ditutup</p>
              </div>
            ) : (
              visible.map(product => (
                <div key={product.id} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                  {/* Stock indicator */}
                  <div className={`mt-0.5 flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold ${
                    product.stockQuantity === 0
                      ? 'bg-red-100 text-red-600'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {product.stockQuantity === 0 ? '0' : product.stockQuantity}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{product.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                      📍 {product.storeName}
                    </p>
                    <p className={`text-xs font-medium mt-1 ${
                      product.stockQuantity === 0 ? 'text-red-600' : 'text-amber-600'
                    }`}>
                      {product.stockQuantity === 0
                        ? '⛔ Stok habis!'
                        : `⚠️ Sisa ${product.stockQuantity} unit — segera restok`}
                    </p>
                    {/* Action links */}
                    <div className="flex items-center gap-3 mt-2">
                      <Link
                        href={`/stores/${product.storeId}`}
                        onClick={() => setIsOpen(false)}
                        className="text-xs text-primary-600 font-semibold hover:underline"
                      >
                        Lihat produk →
                      </Link>
                      <Link
                        href={`/stores/${product.storeId}/restock`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-1 text-xs text-green-600 font-semibold hover:underline"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Restok sekarang
                      </Link>
                    </div>
                  </div>

                  {/* Dismiss button */}
                  <button
                    onClick={() => dismissOne(product.id)}
                    className="flex-shrink-0 p-1 text-gray-300 hover:text-gray-500 transition-colors mt-0.5"
                    title="Tutup notifikasi ini"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {visible.length > 0 && (
            <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-400">
                Klik &ldquo;Restok sekarang&rdquo; untuk menambah stok produk
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
