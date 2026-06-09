import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/context/AuthContext'
import { api } from '@/api/axios'
import Header from '@/components/ui/header'
import MainHeader from '@/components/ui/main_header'
import Footer from '@/components/ui/footer'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const from = (location.state as { from?: string })?.from || '/'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!email.trim() || !password) {
      setError('Please enter email and password.')
      return
    }

    setLoading(true)

    try {
      const response = await api.post('/users/login', {
        email: email.trim(),
        password,
      })

      login(response.data.user)
      navigate(from, { replace: true })
    } catch (error) {
      setError('Invalid email or password.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="relative">
        <div className="absolute z-10 w-full">
          <MainHeader />
        </div>
        <div className="mx-auto flex min-h-[calc(100vh-40px)] w-[90%] items-center justify-center pt-28">
          <div className="w-full max-w-md border border-zinc-800 bg-black/90 p-8 shadow-2xl shadow-black">
            <div className="space-y-3 text-center">
              <p className="text-sm uppercase tracking-[0.35em] text-amber-400">Account login</p>
              <h1 className="text-4xl font-bold uppercase">Welcome back</h1>
            </div>

            <Separator className="my-8 bg-zinc-800" />

            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="email"
                value={email}
                disabled={loading}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-amber-400"
                placeholder="Email"
              />
              <input
                type="password"
                value={password}
                disabled={loading}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-amber-400"
                placeholder="Password"
              />

              {error ? <div className="border border-red-900 bg-red-950/60 px-4 py-3 text-sm text-red-200">{error}</div> : null}

              <Button type="submit" disabled={loading} className="h-12 w-full rounded-none bg-white text-base text-black hover:bg-zinc-200">
                {loading ? 'Logging in...' : 'Log in'}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-zinc-400">
              New customer?{' '}
              <Link to="/register" className="font-medium text-white underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
