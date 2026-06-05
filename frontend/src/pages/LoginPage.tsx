import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const from = (location.state as { from?: string })?.from || '/'

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!username.trim()) {
      setError('Vui lòng nhập tên tài khoản.')
      return
    }

    login(username.trim())
    navigate(from, { replace: true })
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-md px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-4xl border border-zinc-200 bg-zinc-50 p-10 shadow-sm shadow-zinc-100">
          <div className="space-y-3 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">Account login</p>
            <h1 className="text-4xl font-bold">Welcome back</h1>
            <p className="text-sm leading-relaxed text-zinc-600">
              Sign in to personalize your account experience. Access is optional for browsing.
            </p>
          </div>

          <Separator className="my-8" />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-2">
              <label htmlFor="username" className="text-sm font-medium text-zinc-700">
                Username
              </label>
              <input
                id="username"
                name="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full rounded-3xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/10"
                placeholder="Enter your username"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="password" className="text-sm font-medium text-zinc-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-3xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/10"
                placeholder="Enter your password"
              />
            </div>

            {error ? (
              <div className="rounded-3xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            ) : null}

            <Button type="submit" className="w-full rounded-full px-6 py-3 text-base">
              Log in
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-600">
            Not ready to sign in? Continue browsing and click Account when you want to log in.
          </p>

          <div className="mt-6 text-center text-sm text-zinc-500">
            <Link to="/" className="underline hover:text-zinc-900">
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
