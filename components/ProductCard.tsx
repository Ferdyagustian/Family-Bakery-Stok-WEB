'use client'

import { useState } from 'react'
import { recordSale, deleteProduct } from '@/lib/actions/product'
import { Trash2, Package, Tag, ShoppingCart, Minus, Plus, AlertTriangle, X } from 'lucide-react'

// ── Delete Confirmation Modal ──────────────────────────────────────
function DeleteConfirmModal({
  productName,
  onConfirm,
  onCancel,
  loading,
}: {
  productName: string
  onConfirm: () => void
  onCancel: () => void
  loading: boolean
}) {
  const [typed, setTyped] = useState('')
  const isMatch = typed === 'pastikan'

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative">
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          disabled={loading}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning icon */}
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-100 mx-auto mb-4">
          <AlertTriangle className="w-7 h-7 text-red-600" />
        </div>

        <h3 className="text-lg font-heading font-bold text-gray-900 text-center">
          Hapus Produk?
        </h3>
        <p className="text-gray-500 text-sm text-center mt-1 mb-5">
          Produk <span className="font-semibold text-gray-800">"{productName}"</span> akan
          dihapus beserta semua riwayat penjualannya dan{' '}
          <span className="text-red-600 font-semibold">tidak dapat dikembalikan</span>.
        </p>

        {/* Typing confirmation */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Ketik{' '}
            <code className="bg-gray-100 text-red-600 px-1.5 py-0.5 rounded font-mono text-sm">
              pastikan
            </code>{' '}
            untuk melanjutkan:
          </label>
          <input
            type="text"
            value={typed}
            onChange={e => setTyped(e.target.value)}
            className={`w-full h-11 rounded-lg border px-3 text-sm focus:outline-none focus:ring-2 transition-colors ${
              typed.length > 0 && !isMatch
                ? 'border-red-300 bg-red-50 focus:ring-red-400'
                : isMatch
                ? 'border-green-400 bg-green-50 focus:ring-green-400'
                : 'border-gray-300 focus:ring-primary-500'
            }`}
            placeholder='Ketik "pastikan"'
            disabled={loading}
            autoFocus
          />
          {typed.length > 0 && !isMatch && (
            <p className="text-red-500 text-xs mt-1">Teks tidak sesuai. Ketik persis: pastikan</p>
          )}
          {isMatch && (
            <p className="text-green-600 text-xs mt-1 font-medium">✓ Konfirmasi diterima</p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={!isMatch || loading}
            className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Menghapus...' : 'Hapus Produk'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Product Card ───────────────────────────────────────────────────
export function ProductCard({ product, storeId }: { product: any, storeId: string }) {
  const [loading, setLoading] = useState(false)
  const [saleQty, setSaleQty] = useState(1)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const adjustQty = (delta: number) => {
    setSaleQty(prev => Math.max(1, Math.min(product.stockQuantity, prev + delta)))
  }

  async function handleSale() {
    if (saleQty <= 0 || product.stockQuantity === 0) return
    setLoading(true)
    const res = await recordSale(product.id, storeId, saleQty)
    setLoading(false)
    if (res?.error) alert(res.error)
    else setSaleQty(1)
  }

  async function handleDeleteConfirmed() {
    setLoading(true)
    const res = await deleteProduct(product.id, storeId)
    setLoading(false)
    if (res?.error) {
      alert(res.error)
      setShowDeleteModal(false)
    }
    // On success, the page refreshes via revalidatePath — modal disappears naturally
  }

  const isOutOfStock = product.stockQuantity === 0
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity < 10

  return (
    <>
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmModal
          productName={product.name}
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setShowDeleteModal(false)}
          loading={loading}
        />
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col h-full overflow-hidden group hover:shadow-md transition-shadow">
        {/* Product Image */}
        {product.imageUrl ? (
          <div className="h-44 sm:h-48 bg-gray-100 overflow-hidden relative">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-bold text-sm bg-red-600 px-3 py-1 rounded-full">Habis</span>
              </div>
            )}
          </div>
        ) : (
          <div className="h-44 sm:h-48 bg-gradient-to-br from-primary-100 to-purple-100 flex items-center justify-center relative">
            <Package className="w-14 h-14 text-primary-300" />
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-white font-bold text-sm bg-red-600 px-3 py-1 rounded-full">Habis</span>
              </div>
            )}
          </div>
        )}

        {/* Card Body */}
        <div className="flex flex-col flex-1 p-4 space-y-3">
          {/* Name + Delete */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-base text-gray-900 leading-tight line-clamp-2 flex-1">{product.name}</h3>
            <button
              onClick={() => setShowDeleteModal(true)}
              disabled={loading}
              className="text-gray-300 hover:text-red-500 transition-colors p-1 flex-shrink-0"
              title="Hapus Produk"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {product.description && (
            <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed">{product.description}</p>
          )}

          {/* Price & Stock */}
          <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
            <div className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" />
              <span className="font-bold text-sm text-gray-800">
                Rp {product.price.toLocaleString('id-ID')}
              </span>
            </div>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              isOutOfStock
                ? 'bg-red-100 text-red-600'
                : isLowStock
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-green-100 text-green-700'
            }`}>
              {isOutOfStock ? 'Habis' : `${product.stockQuantity} stok`}
            </span>
          </div>

          {/* Sale Controls */}
          <div className="flex items-center gap-2 pt-1">
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => adjustQty(-1)}
                disabled={saleQty <= 1 || loading || isOutOfStock}
                className="w-8 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-40 transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center text-sm font-semibold text-gray-800">{saleQty}</span>
              <button
                onClick={() => adjustQty(1)}
                disabled={saleQty >= product.stockQuantity || loading || isOutOfStock}
                className="w-8 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-40 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={handleSale}
              disabled={loading || isOutOfStock}
              className="flex-1 flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-xs font-semibold py-2.5 rounded-lg transition-colors"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              {loading ? 'Mencatat...' : isOutOfStock ? 'Stok Habis' : 'Catat Jual'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
