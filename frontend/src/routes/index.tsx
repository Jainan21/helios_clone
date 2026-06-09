import { createBrowserRouter } from 'react-router-dom'
import HomePage from '@/pages/HomePage'
import ProductDetailPage from '@/pages/ProductDetailPage'
import ProductsPage from '@/pages/ProductsPage'
import CollectionDetailPage from '@/pages/CollectionDetailPage'
import CollectionsPage from '@/pages/CollectionsPage'
import AboutHeliosPage from '@/pages/AboutHeliosPage'
import WorldOfHeliosPage from '@/pages/WorldOfHeliosPage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import CartPage from '@/pages/CartPage'
import AdminLayout from '@/layouts/AdminLayout'
import AdminPage from '@/pages/AdminPage'
import AccountPage from '@/pages/AccountPage'
import AdminCollectionsPage from '@/pages/admin/CollectionsPage'
import ListJewelry from '@/pages/admin/jewelry/ListJewelry'
import ActionJewelry from '@/pages/admin/jewelry/ActionJewelry'
import RequireAdmin from '@/routes/RequireAdmin'

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
    path: '/products',
    element: <ProductsPage />,
  },
  {
    path: '/collections/:id',
    element: <CollectionDetailPage />,
  },
  {
    path: '/collections',
    element: <CollectionsPage />,
  },
  {
    path: '/about-helios',
    element: <AboutHeliosPage />,
  },
  {
    path: '/world-of-helios',
    element: <WorldOfHeliosPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/account',
    element: <AccountPage />
  },
  {
    path: '/cart',
    element: <CartPage />,
  },
  {
    element: <RequireAdmin />,
    children: [
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
            element: <ListJewelry />,
          },
          {
            path: 'jewelry/action',
            element: <ActionJewelry />,
          },
          {
            path: 'jewelry/action/:id',
            element: <ActionJewelry />,
          },
          {
            path: 'collections',
            element: <AdminCollectionsPage />,
          },
        ],
      },
    ],
  },

])
