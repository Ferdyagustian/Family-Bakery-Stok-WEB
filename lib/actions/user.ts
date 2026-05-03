'use server'

import prisma from '@/lib/db'
import { getSession } from '@/lib/session'
import bcrypt from 'bcryptjs'
import { revalidatePath } from 'next/cache'

export async function createManager(formData: FormData) {
  const session = await getSession()
  if (!session || session.user.role !== 'ADMIN') return { error: 'Unauthorized' }

  const username = formData.get('username') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string
  const storeId = formData.get('storeId') as string

  if (!username || !password || !name) {
    return { error: 'Semua field wajib diisi' }
  }

  try {
    const existing = await prisma.user.findUnique({ where: { username } })
    if (existing) {
      return { error: 'Username sudah digunakan' }
    }

    const passwordHash = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
        username,
        passwordHash,
        name,
        role: 'MANAGER',
        storeId,
      }
    })

    revalidatePath(`/stores/${storeId}`)
    return { success: true }
  } catch (error) {
    console.error('Create manager error:', error)
    return { error: 'Gagal membuat akun kasir' }
  }
}

export async function deleteManager(id: string, storeId: string) {
  const session = await getSession()
  if (!session || session.user.role !== 'ADMIN') return { error: 'Unauthorized' }

  try {
    await prisma.user.delete({ where: { id } })
    revalidatePath(`/stores/${storeId}`)
    return { success: true }
  } catch (error) {
    return { error: 'Gagal menghapus akun kasir' }
  }
}
