import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { api } from '@/api/axios'
import { useAuth } from '@/context/AuthContext'
import Header from '@/components/ui/header'
import MainHeader from '@/components/ui/main_header'
import Footer from '@/components/ui/footer'

type RegisterForm = {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState<RegisterForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.password) {
      setError('Please fill in all fields.')
      return
    }

    setLoading(true)

    try {
      const response = await api.post('/users', form)
      login(response.data.user)
      navigate('/account', { replace: true })
    } catch (error) {
      setError('Register failed. Please check your information and try again.')
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
          <div className="w-full max-w-xl border border-zinc-800 bg-black/90 p-8 shadow-2xl shadow-black">
            <div className="space-y-3 text-center">
              <p className="text-sm uppercase tracking-[0.35em] text-amber-400">Account register</p>
              <h1 className="text-4xl font-bold uppercase">Create account</h1>
            </div>

            <Separator className="my-8 bg-zinc-800" />

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <input value={form.firstName} disabled={loading} onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))} className="border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-amber-400" placeholder="First name" />
                <input value={form.lastName} disabled={loading} onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))} className="border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-amber-400" placeholder="Last name" />
              </div>
              <input type="email" value={form.email} disabled={loading} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} className="w-full border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-amber-400" placeholder="Email" />
              <input value={form.phone} disabled={loading} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} className="w-full border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-amber-400" placeholder="Phone" />
              <input type="password" value={form.password} disabled={loading} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} className="w-full border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-amber-400" placeholder="Password" />

              {error ? <div className="border border-red-900 bg-red-950/60 px-4 py-3 text-sm text-red-200">{error}</div> : null}

              <Button type="submit" disabled={loading} className="h-12 w-full rounded-none bg-white text-base text-black hover:bg-zinc-200">
                {loading ? 'Creating account...' : 'Register'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-zinc-400">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-white underline">
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
