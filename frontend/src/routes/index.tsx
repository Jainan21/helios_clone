import { createBrowserRouter } from 'react-router-dom'
import HomePage from '@/pages/HomePage'
import ProductDetailPage from '@/pages/ProductDetailPage'
import LoginPage from '@/pages/LoginPage'
import AdminLayout from '@/layouts/AdminLayout'
import AdminPage from '@/pages/AdminPage'
import AdminJewelryPage from '@/pages/admin/JewelryPage'
import AccountPage from '@/pages/AccountPage'
import AdminCollectionsPage from '@/pages/admin/CollectionsPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/products/:slug',
    element: <ProductDetailPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/account',
    element: <AccountPage />
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminPage />,
      },
      {
        path: 'jewelry',
        element: <AdminJewelryPage />,
      },
      {
        path: 'collections',
        element: <AdminCollectionsPage />,
      },
    ],
  },

])