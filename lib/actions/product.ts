'use server'

import prisma from '@/lib/db'
import { revalidatePath } from 'next/cache'

import { getSession } from '@/lib/session'

// ─────────────────────────────────────────────
// CREATE PRODUCT
// ─────────────────────────────────────────────
export async function createProduct(formData: FormData) {
  if (!(await getSession())) return { error: 'Unauthorized' }
  const storeId = formData.get('storeId') as string
  const name = (formData.get('name') as string)?.trim()
  const description = (formData.get('description') as string)?.trim() || null
  const imageUrl = (formData.get('imageUrl') as string)?.trim() || null
  const price = parseFloat(formData.get('price') as string)
  const stockQuantity = parseInt(formData.get('stockQuantity') as string)

  // FIX: validasi lebih ketat — price harus > 0, stockQuantity tidak boleh negatif
  if (
    !storeId ||
    !name ||
    isNaN(price) ||
    price <= 0 ||
    isNaN(stockQuantity) ||
    stockQuantity < 0
  ) {
    return { error: 'Data tidak lengkap atau tidak valid' }
  }

  try {
    const product = await prisma.product.create({
      data: { storeId, name, description, imageUrl, price, stockQuantity }
    })
    revalidatePath(`/stores/${storeId}`)
    return { success: true, product }
  } catch (error) {
    return { error: 'Gagal menambah produk' }
  }
}

// ─────────────────────────────────────────────
// RECORD SALE
// ─────────────────────────────────────────────
export async function recordSale(
  productId: string,
  storeId: string,
  quantity: number
) {
  if (!(await getSession())) return { error: 'Unauthorized' }
  // FIX: validasi quantity sebelum masuk DB
  if (!productId || !storeId || quantity <= 0 || !Number.isInteger(quantity)) {
    return { error: 'Data penjualan tidak valid' }
  }

  try {
    // FIX: semua operasi (termasuk read product) dilakukan di dalam satu transaction
    // sehingga tidak ada gap antara baca price dan update stok
    await prisma.$transaction(async (tx) => {
      // Baca product di dalam transaction agar price tidak stale
      const product = await tx.product.findUnique({
        where: { id: productId }
      })

      if (!product) throw new Error('PRODUCT_NOT_FOUND')

      const totalAmount = product.price * quantity
      const profitAmount = totalAmount

      // Atomic: updateMany dengan WHERE stockQuantity >= quantity
      // Jika dua request datang bersamaan, hanya satu yang menang
      const updated = await tx.product.updateMany({
        where: {
          id: productId,
          stockQuantity: { gte: quantity } // ← DB-level check, atomic!
        },
        data: { stockQuantity: { decrement: quantity } }
      })

      if (updated.count === 0) {
        throw new Error('INSUFFICIENT_STOCK')
      }

      await tx.sale.create({
        data: {
          storeId,
          productId,
          quantitySold: quantity,
          totalAmount,
          profitAmount
        }
      })
    })

    revalidatePath(`/stores/${storeId}`)
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    if (error?.message === 'PRODUCT_NOT_FOUND') {
      return { error: 'Produk tidak ditemukan' }
    }
    if (error?.message === 'INSUFFICIENT_STOCK') {
      return { error: 'Stok tidak cukup atau sudah habis terjual' }
    }
    return { error: 'Gagal mencatat penjualan' }
  }
}

// ─────────────────────────────────────────────
// DELETE PRODUCT
// ─────────────────────────────────────────────
export async function deleteProduct(productId: string, storeId: string) {
  if (!(await getSession())) return { error: 'Unauthorized' }
  try {
    // FIX: hapus sales terkait terlebih dahulu dalam satu transaction
    // agar tidak terjadi foreign key constraint error
    await prisma.$transaction([
      prisma.sale.deleteMany({ where: { productId } }),
      prisma.product.delete({ where: { id: productId } })
    ])

    revalidatePath(`/stores/${storeId}`)
    return { success: true }
  } catch (error) {
    return { error: 'Gagal menghapus produk' }
  }
}

// ─────────────────────────────────────────────
// BULK RESTOCK
// ─────────────────────────────────────────────
export async function bulkRestockProducts(
  restocks: { productId: string; qty: number }[],
  storeId: string
) {
  if (!(await getSession())) return { error: 'Unauthorized' }
  // FIX: qty harus integer positif, bukan sekadar > 0
  const validRestocks = restocks.filter(
    (r) => Number.isInteger(r.qty) && r.qty > 0
  )

  if (validRestocks.length === 0) {
    return { error: 'Tidak ada produk yang diisi jumlah restoknya' }
  }

  try {
    await prisma.$transaction(
      validRestocks.map((r) =>
        prisma.product.update({
          where: { id: r.productId },
          data: { stockQuantity: { increment: r.qty } }
        })
      )
    )

    revalidatePath(`/stores/${storeId}`)
    revalidatePath(`/stores/${storeId}/restock`)
    return { success: true, count: validRestocks.length }
  } catch (error) {
    return { error: 'Gagal menyimpan restok. Silakan coba lagi.' }
  }
}