import prisma from '@/lib/db'
import { SalesChart } from '@/components/SalesChart'
import { ProductSalesBreakdown } from '@/components/ProductSalesBreakdown'
import { Store, Package, TrendingUp, CircleDollarSign } from 'lucide-react'

export default async function DashboardPage() {
  const [stores, products, sales] = await Promise.all([
    prisma.store.findMany(),
    prisma.product.count(),
    prisma.sale.findMany({
      include: {
        store: { select: { name: true } },
        product: { select: { name: true } },
      },
      orderBy: { saleDate: 'asc' }
    })
  ])

  let totalRevenue = 0
  let totalProfit = 0

  const formattedSales = sales.map((s: any) => {
    totalRevenue += s.totalAmount
    totalProfit += s.profitAmount
    return {
      date: s.saleDate.toISOString(),
      revenue: s.totalAmount,
      profit: s.profitAmount,
      store: s.storeId,
    }
  })

  // Product-level breakdown data for ProductSalesBreakdown component
  const productSales = sales.map((s: any) => ({
    productId: s.productId,
    productName: s.product.name,
    storeId: s.storeId,
    storeName: s.store.name,
    quantitySold: s.quantitySold,
    totalAmount: s.totalAmount,
    profitAmount: s.profitAmount,
    date: s.saleDate.toISOString(),
  }))

  const storeList = stores.map((s: any) => ({ id: s.id, name: s.name }))

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-heading font-bold text-gray-900">
          Selamat Datang, Admin! 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Ringkasan kinerja bisnis Vanilla Bakery Anda.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <StatCard
          title="Total Cabang"
          value={stores.length}
          icon={<Store className="w-6 h-6 sm:w-7 sm:h-7 text-primary-600" />}
          bg="bg-primary-50"
        />
        <StatCard
          title="Total Produk"
          value={products}
          icon={<Package className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600" />}
          bg="bg-purple-50"
        />
        <StatCard
          title="Total Transaksi"
          value={sales.length}
          icon={<TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />}
          bg="bg-green-50"
        />
        <StatCard
          title="Total Omzet"
          value={`Rp ${
            totalRevenue >= 1000000
              ? (totalRevenue / 1000000).toFixed(1) + 'jt'
              : totalRevenue.toLocaleString('id-ID')
          }`}
          icon={<CircleDollarSign className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-600" />}
          bg="bg-yellow-50"
        />
      </div>

      {/* Product Breakdown Section */}
      <ProductSalesBreakdown data={productSales} stores={storeList} />

      {/* Time-based Sales Chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
        {stores.length > 0 ? (
          <SalesChart data={formattedSales} stores={storeList} productSales={productSales} />
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <TrendingUp className="w-14 h-14 mb-4 opacity-30" />
            <h3 className="text-lg font-heading font-semibold text-gray-600">
              Belum Ada Data Penjualan
            </h3>
            <p className="text-sm mt-1 text-center max-w-xs">
              Tambahkan cabang toko dan catat penjualan untuk melihat grafik di sini.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon,
  bg,
}: {
  title: string
  value: string | number
  icon: React.ReactNode
  bg: string
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5 hover:-translate-y-0.5 transition-transform">
      <div className={`w-10 h-10 sm:w-12 sm:h-12 ${bg} rounded-xl flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-gray-500 text-xs sm:text-sm font-medium truncate">{title}</p>
      <p className="text-lg sm:text-2xl font-bold font-heading text-gray-900 mt-1 truncate">
        {value}
      </p>
    </div>
  )
}
