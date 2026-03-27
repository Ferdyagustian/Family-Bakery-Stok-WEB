import { cookies } from 'next/headers'

export async function createSession() {
  const cookieStore = await cookies()
  cookieStore.set('admin_session', 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })
}

export async function getSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  return session?.value === 'authenticated'
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
}
