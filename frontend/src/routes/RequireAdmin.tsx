import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function RequireAdmin() {
  const { user, isReady } = useAuth()
  const location = useLocation()
  const isAdmin = user?.role === 'ADMIN'

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-sm text-white">
        Loading...
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
