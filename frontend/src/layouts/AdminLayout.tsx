import { Link, NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', to: '/admin' },
  { label: 'Jewelry', to: '/admin/jewelry' },
  { label: 'Collections', to: '/admin/collections' },
]

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-white text-black">
      <div className="mx-auto w-[90%] px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
          <aside className="rounded-4xl border border-zinc-200 bg-zinc-50 p-6 shadow-sm shadow-zinc-100">
            <div className="mb-8 space-y-2">
              <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">Admin panel</p>
              <h2 className="text-2xl font-semibold text-zinc-900">Manage store</h2>
            </div>
            <nav className="space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/admin'}
                  className={({ isActive }) =>
                    `block rounded-3xl px-5 py-4 text-sm font-medium transition ${
                      isActive
                        ? 'bg-black text-white shadow-sm shadow-black/10'
                        : 'text-zinc-700 hover:bg-zinc-100'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="mt-8 border-t border-zinc-200 pt-4">
              <Link
                to="/"
                className="block rounded-3xl border border-zinc-200 bg-white px-5 py-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
              >
                Back to web page
              </Link>
            </div>
          </aside>

          <main>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
