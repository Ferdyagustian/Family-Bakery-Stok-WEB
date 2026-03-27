import { DashboardShell } from '@/components/DashboardShell'
import prisma from '@/lib/db'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Fetch products where stock < 3, include store name for notification
  const lowStockProducts = await prisma.product.findMany({
    where: { stockQuantity: { lt: 3 } },
    include: { store: { select: { name: true } } },
    orderBy: { stockQuantity: 'asc' },
  })

  const lowStockData = lowStockProducts.map((p: any) => ({
    id: p.id,
    name: p.name,
    stockQuantity: p.stockQuantity,
    storeId: p.storeId,
    storeName: p.store.name,
  }))

  return <DashboardShell lowStockProducts={lowStockData}>{children}</DashboardShell>
}
