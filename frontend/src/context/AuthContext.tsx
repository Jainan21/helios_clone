import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

type User = {
  id?: number
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  username?: string
  role?: 'ADMIN' | 'USER'
}

type AuthContextValue = {
  user: User | null
  isReady: boolean
  login: (user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)
const STORAGE_KEY = 'helios-user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setUser(JSON.parse(stored) as User)
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    setIsReady(true)
  }, [])

  useEffect(() => {
    if (!isReady) {
      return
    }

    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [isReady, user])

  const value = useMemo(
    () => ({
      user,
      isReady,
      login: (user: User) => setUser(user),
      logout: () => setUser(null),
    }),
    [isReady, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
