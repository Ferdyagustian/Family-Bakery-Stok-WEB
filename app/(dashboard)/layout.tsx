import { DashboardShell } from '@/components/DashboardShell'
import prisma from '@/lib/db'
import { Suspense } from 'react'

// Komponen async terpisah — tidak blocking shell render
async function LowStockLoader({ children }: { children: (data: any[]) => React.ReactNode }) {
  const lowStockProducts = await prisma.product.findMany({
    where: { stockQuantity: { lt: 7 } },
    select: {
      id: true,
      name: true,
      stockQuantity: true,
      storeId: true,
      store: { select: { name: true } },
    },
    orderBy: { stockQuantity: 'asc' },
    take: 20, // Batasi maksimal 20 item
  })

  const lowStockData = lowStockProducts.map((p: any) => ({
    id: p.id,
    name: p.name,
    stockQuantity: p.stockQuantity,
    storeId: p.storeId,
    storeName: p.store.name,
  }))

  return <>{children(lowStockData)}</>
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={<DashboardShell lowStockProducts={[]}>{children}</DashboardShell>}>
      <LowStockLoader>
        {(lowStockData) => (
          <DashboardShell lowStockProducts={lowStockData}>{children}</DashboardShell>
        )}
      </LowStockLoader>
    </Suspense>
  )
}
