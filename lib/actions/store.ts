'use server'

import prisma from '@/lib/db'
import { revalidatePath } from 'next/cache'

import { getSession } from '@/lib/session'

export async function createStore(formData: FormData) {
  if (!(await getSession())) return { error: 'Unauthorized' }
  const name = formData.get('name') as string
  const location = formData.get('location') as string

  if (!name) return { error: 'Nama toko wajib diisi' }

  try {
    const store = await prisma.store.create({
      data: { name, location }
    })
    revalidatePath('/stores')
    return { success: true, store }
  } catch (error) {
    return { error: 'Gagal membuat toko' }
  }
}

export async function updateStore(id: string, formData: FormData) {
  if (!(await getSession())) return { error: 'Unauthorized' }
  const name = formData.get('name') as string
  const location = formData.get('location') as string

  if (!name) return { error: 'Nama toko wajib diisi' }

  try {
    await prisma.store.update({
      where: { id },
      data: { name, location }
    })
    revalidatePath('/stores')
    revalidatePath(`/stores/${id}`)
    return { success: true }
  } catch (error) {
    return { error: 'Gagal mengedit toko' }
  }
}

export async function deleteStore(id: string) {
  if (!(await getSession())) return { error: 'Unauthorized' }
  try {
    await prisma.$transaction(async (tx) => {
      // Delete all products and their sales first
      const products = await tx.product.findMany({ where: { storeId: id } })
      const productIds = products.map((p: any) => p.id)
      
      if (productIds.length > 0) {
        await tx.sale.deleteMany({ where: { productId: { in: productIds } } })
        await tx.product.deleteMany({ where: { storeId: id } })
      }
      
      await tx.store.delete({ where: { id } })
    })

    revalidatePath('/stores')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { error: 'Gagal menghapus toko' }
  }
}
