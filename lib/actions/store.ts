'use server'

import prisma from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function createStore(formData: FormData) {
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
