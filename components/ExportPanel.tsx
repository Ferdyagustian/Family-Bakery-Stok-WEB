'use client'

import { useState, useMemo } from 'react'
import { Download, FileSpreadsheet, Calendar, Store, Filter, Loader2, Table2, ChevronDown } from 'lucide-react'
import * as XLSX from 'xlsx'

type StoreOption = { id: string; name: string }

// ── Date Preset Helpers ────────────────────────
function getPresetRange(preset: string): { from: string; to: string } {
  const now = new Date()
  const to = now.toISOString().split('T')[0]

  switch (preset) {
    case 'today': {
      return { from: to, to }
    }
    case '7days': {
      const d = new Date(now)
      d.setDate(d.getDate() - 6)
      return { from: d.toISOString().split('T')[0], to }
    }
    case '30days': {
      const d = new Date(now)
      d.setDate(d.getDate() - 29)
      return { from: d.toISOString().split('T')[0], to }
    }
    case 'month': {
      const first = new Date(now.getFullYear(), now.getMonth(), 1)
      return { from: first.toISOString().split('T')[0], to }
    }
    default:
      return { from: '', to: '' }
  }
}

// ── Main Component ─────────────────────────────
export function ExportPanel({ stores }: { stores: StoreOption[] }) {
  const [type, setType] = useState<'sales' | 'stock'>('sales')
  const [storeId, setStoreId] = useState('')
  const [datePreset, setDatePreset] = useState('30days')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')
  const [loading, setLoading] = useState(false)
  const [previewData, setPreviewData] = useState<any[] | null>(null)
  const [error, setError] = useState('')

  // Computed date range
  const dateRange = useMemo(() => {
    if (datePreset === 'custom') return { from: customFrom, to: customTo }
    return getPresetRange(datePreset)
  }, [datePreset, customFrom, customTo])

  // ── Fetch Data ───────────────────────────────
  async function fetchData() {
    setError('')
    setLoading(true)
    try {
      const params = new URLSearchParams({ type })
      if (storeId) params.set('storeId', storeId)
      if (type === 'sales') {
        if (dateRange.from) params.set('from', dateRange.from)
        if (dateRange.to) params.set('to', dateRange.to)
      }

      const res = await fetch(`/api/export?${params.toString()}`)
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Gagal mengambil data')
      }
      const json = await res.json()
      return json.data as any[]
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan')
      return null
    } finally {
      setLoading(false)
    }
  }

  // ── Preview ──────────────────────────────────
  async function handlePreview() {
    const data = await fetchData()
    if (data) setPreviewData(data)
  }

  // ── Download Excel ───────────────────────────
  async function handleDownload() {
    const data = previewData || (await fetchData())
    if (!data || data.length === 0) {
      setError('Tidak ada data untuk di-export')
      return
    }

    // Map to Indonesian headers
    let sheetData: Record<string, any>[]
    let sheetName: string
    let fileName: string

    if (type === 'sales') {
      sheetName = 'Penjualan'
      fileName = `Laporan_Penjualan_${dateRange.from || 'all'}_${dateRange.to || 'all'}.xlsx`
      sheetData = data.map((r: any) => ({
        'No': r.no,
        'Tanggal': new Date(r.tanggal).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
        'Cabang': r.cabang,
        'Produk': r.produk,
        'Jumlah': r.jumlah,
        'Harga Satuan': r.hargaSatuan,
        'Total': r.total,
      }))
    } else {
      sheetName = 'Stok Produk'
      fileName = `Laporan_Stok_${new Date().toISOString().split('T')[0]}.xlsx`
      sheetData = data.map((r: any) => ({
        'No': r.no,
        'Cabang': r.cabang,
        'Produk': r.produk,
        'Harga': r.harga,
        'Stok Saat Ini': r.stok,
        'Status': r.status,
      }))
    }

    // Generate workbook
    const ws = XLSX.utils.json_to_sheet(sheetData)

    // Auto-width columns
    const colWidths = Object.keys(sheetData[0]).map((key) => {
      const maxLen = Math.max(
        key.length,
        ...sheetData.map((row) => String(row[key] ?? '').length)
      )
      return { wch: Math.min(maxLen + 2, 40) }
    })
    ws['!cols'] = colWidths

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, sheetName)
    XLSX.writeFile(wb, fileName)
  }

  // ── Format currency ──────────────────────────
  const fmtRp = (n: number) => `Rp ${n.toLocaleString('id-ID')}`

  // ── Render ───────────────────────────────────
  return (
    <div className="space-y-5">
      {/* Filter Card */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 sm:p-6">
        <h2 className="text-base sm:text-lg font-heading font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-5">
          <Filter className="w-5 h-5 text-primary-600" />
          Filter Data
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">
              Jenis Data
            </label>
            <div className="relative">
              <select
                value={type}
                onChange={(e) => { setType(e.target.value as any); setPreviewData(null) }}
                className="flex h-11 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
              >
                <option value="sales">📊 Penjualan</option>
                <option value="stock">📦 Stok Produk</option>
              </select>
              <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Store */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">
              Cabang
            </label>
            <div className="relative">
              <select
                value={storeId}
                onChange={(e) => { setStoreId(e.target.value); setPreviewData(null) }}
                className="flex h-11 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
              >
                <option value="">🏪 Semua Cabang</option>
                {stores.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Date Preset (sales only) */}
          {type === 'sales' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">
                Rentang Waktu
              </label>
              <div className="relative">
                <select
                  value={datePreset}
                  onChange={(e) => { setDatePreset(e.target.value); setPreviewData(null) }}
                  className="flex h-11 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
                >
                  <option value="today">📅 Hari Ini</option>
                  <option value="7days">📅 7 Hari Terakhir</option>
                  <option value="30days">📅 30 Hari Terakhir</option>
                  <option value="month">📅 Bulan Ini</option>
                  <option value="custom">📅 Custom</option>
                </select>
                <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Custom date inputs */}
          {type === 'sales' && datePreset === 'custom' && (
            <div className="sm:col-span-2 lg:col-span-1 grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Dari</label>
                <input
                  type="date"
                  value={customFrom}
                  onChange={(e) => { setCustomFrom(e.target.value); setPreviewData(null) }}
                  className="flex h-10 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-1 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Sampai</label>
                <input
                  type="date"
                  value={customTo}
                  onChange={(e) => { setCustomTo(e.target.value); setPreviewData(null) }}
                  className="flex h-10 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-1 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-5 pt-5 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={handlePreview}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-300 text-sm font-semibold hover:bg-primary-100 dark:hover:bg-primary-950/50 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Table2 className="w-4 h-4" />}
            Preview Data
          </button>
          <button
            onClick={handleDownload}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition-colors disabled:opacity-50 shadow-sm"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Download Excel
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* Preview Table */}
      {previewData && previewData.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-green-600" />
              Preview — {previewData.length} baris
            </h3>
            <span className="text-xs text-gray-400">Scroll untuk melihat selengkapnya →</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  {type === 'sales' ? (
                    <>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">No</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">Tanggal</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">Cabang</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">Produk</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">Jumlah</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">Harga Satuan</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">Total</th>
                    </>
                  ) : (
                    <>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">No</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">Cabang</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">Produk</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">Harga</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">Stok</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">Status</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {previewData.slice(0, 50).map((row: any, idx: number) => (
                  <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    {type === 'sales' ? (
                      <>
                        <td className="px-4 py-2.5 text-gray-500 dark:text-gray-400">{row.no}</td>
                        <td className="px-4 py-2.5 text-gray-800 dark:text-gray-100 whitespace-nowrap">
                          {new Date(row.tanggal).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', dateStyle: 'short', timeStyle: 'short' })}
                        </td>
                        <td className="px-4 py-2.5 text-gray-800 dark:text-gray-100">{row.cabang}</td>
                        <td className="px-4 py-2.5 text-gray-800 dark:text-gray-100 font-medium">{row.produk}</td>
                        <td className="px-4 py-2.5 text-right text-gray-800 dark:text-gray-100">{row.jumlah}</td>
                        <td className="px-4 py-2.5 text-right text-gray-600 dark:text-gray-300">{fmtRp(row.hargaSatuan)}</td>
                        <td className="px-4 py-2.5 text-right font-semibold text-gray-900 dark:text-white">{fmtRp(row.total)}</td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-2.5 text-gray-500 dark:text-gray-400">{row.no}</td>
                        <td className="px-4 py-2.5 text-gray-800 dark:text-gray-100">{row.cabang}</td>
                        <td className="px-4 py-2.5 text-gray-800 dark:text-gray-100 font-medium">{row.produk}</td>
                        <td className="px-4 py-2.5 text-right text-gray-600 dark:text-gray-300">{fmtRp(row.harga)}</td>
                        <td className="px-4 py-2.5 text-right text-gray-800 dark:text-gray-100">{row.stok}</td>
                        <td className="px-4 py-2.5">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                            row.status === 'Habis'
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                              : row.status === 'Hampir Habis'
                              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                              : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          }`}>
                            {row.status}
                          </span>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {previewData.length > 50 && (
            <div className="px-5 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-800 text-center text-xs text-gray-400">
              Menampilkan 50 dari {previewData.length} baris. Download Excel untuk data lengkap.
            </div>
          )}

          {/* Summary */}
          {type === 'sales' && previewData.length > 0 && (
            <div className="px-5 py-3 bg-green-50 dark:bg-green-950/20 border-t border-green-100 dark:border-green-900/30 flex flex-wrap gap-4 sm:gap-8 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Total Transaksi:</span>{' '}
                <span className="font-bold text-gray-900 dark:text-white">{previewData.length}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Total Unit Terjual:</span>{' '}
                <span className="font-bold text-gray-900 dark:text-white">
                  {previewData.reduce((sum: number, r: any) => sum + r.jumlah, 0)}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Total Omzet:</span>{' '}
                <span className="font-bold text-green-700 dark:text-green-400">
                  {fmtRp(previewData.reduce((sum: number, r: any) => sum + r.total, 0))}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {previewData && previewData.length === 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-12 text-center">
          <FileSpreadsheet className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
          <p className="font-semibold text-gray-600 dark:text-gray-300">Tidak ada data ditemukan</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Coba ubah filter atau rentang tanggal</p>
        </div>
      )}
    </div>
  )
}
