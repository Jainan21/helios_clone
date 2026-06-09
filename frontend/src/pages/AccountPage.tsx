import { useNavigate } from 'react-router-dom'
import Header from '@/components/ui/header'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import MainHeader from '@/components/ui/main_header'
import Footer from '@/components/ui/footer'

export default function AccountPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="relative">
        <div className="absolute z-10 w-full">
          <MainHeader />
        </div>
        <div className="mx-auto flex min-h-[calc(100vh-40px)] w-[90%] items-center justify-center pt-28">
          <div className="w-full max-w-xl border border-zinc-800 bg-black/90 p-8 text-center shadow-2xl shadow-black">
            <p className="text-sm uppercase tracking-[0.35em] text-amber-400">Account</p>
            <h1 className="mt-3 text-4xl font-bold uppercase">{user?.firstName ?? user?.email ?? 'Customer'}</h1>
            {user?.email ? <p className="mt-4 text-zinc-400">{user.email}</p> : null}
            <Button onClick={handleLogout} className="mt-8 h-12 w-full rounded-none bg-white text-base text-black hover:bg-zinc-200">
              Log out
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
