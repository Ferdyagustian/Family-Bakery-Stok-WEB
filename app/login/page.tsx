import { Store } from 'lucide-react'
import { loginAction } from '@/lib/actions/auth'

type SearchParams = Promise<{ error?: string }>

export default async function LoginPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams
  const error = searchParams?.error

  const errorMessages: Record<string, string> = {
    EmptyFields: 'Username dan password tidak boleh kosong.',
    UserNotFound: 'Username tidak ditemukan.',
    WrongPassword: 'Password salah. Coba lagi.',
    ServerError: 'Terjadi kesalahan pada server. Coba lagi.',
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-primary-600 flex items-center justify-center shadow-xl shadow-primary-200">
            <Store className="w-10 h-10 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-heading font-extrabold text-gray-900">
          Family Bakery
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500">
          Panel Admin — Masuk untuk melanjutkan
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-8 shadow-xl border border-gray-100 rounded-2xl">

          {error && errorMessages[error] && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              ⚠️ {errorMessages[error]}
            </div>
          )}

          <form className="space-y-5" action={loginAction}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                autoComplete="username"
                className="flex h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Masukkan username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="flex h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Masukkan password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-md shadow-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Masuk
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-100 text-center text-xs text-gray-400">
            Hubungi admin jika Anda lupa kata sandi.
          </div>
        </div>
      </div>
    </div>
  )
}
