'use client'

import { useState } from 'react'
import { createStore } from '@/lib/actions/store'
import { useRouter } from 'next/navigation'
import { X, Plus } from 'lucide-react'

export function AddStoreForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const res = await createStore(formData)
    setLoading(false)
    if (res?.error) {
      alert(res.error)
    } else {
      setIsOpen(false)
      router.refresh()
    }
  }

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="btn-primary flex items-center gap-2 whitespace-nowrap">
        <Plus className="w-4 h-4" />
        Tambah Cabang
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
          <div className="bg-white w-full sm:rounded-2xl shadow-2xl sm:max-w-md">
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-lg font-heading font-bold text-gray-900">Tambah Cabang Baru</h3>
              <button onClick={() => setIsOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Nama Toko <span className="text-red-500">*</span>
                </label>
                <input 
                  name="name" 
                  required 
                  className="flex h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Misal: Cabang Sudirman" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Lokasi / Alamat</label>
                <input 
                  name="location" 
                  className="flex h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Jl. Sudirman No. 1, Jakarta (opsional)" 
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsOpen(false)} disabled={loading} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors">
                  Batal
                </button>
                <button type="submit" disabled={loading} className="flex-1 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm transition-colors disabled:opacity-60">
                  {loading ? 'Menyimpan...' : 'Simpan Cabang'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
