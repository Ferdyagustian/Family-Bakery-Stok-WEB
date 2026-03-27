'use server'

import prisma from '@/lib/db'
import { createSession, deleteSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'

export async function loginAction(formData: FormData) {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  if (!username || !password) {
    redirect('/login?error=EmptyFields')
  }

  try {
    const admin = await prisma.admin.findUnique({ where: { username } })

    if (!admin) {
      redirect('/login?error=UserNotFound')
    }

    const passwordMatch = await bcrypt.compare(password, admin.passwordHash)

    if (!passwordMatch) {
      redirect('/login?error=WrongPassword')
    }

    await createSession()
  } catch (error: any) {
    if (error?.digest?.startsWith('NEXT_REDIRECT')) throw error
    console.error('Login error:', error)
    redirect('/login?error=ServerError')
  }

  redirect('/')
}

export async function logoutAction() {
  await deleteSession()
  redirect('/login')
}
