import { createBrowserRouter } from 'react-router-dom'
import HomePage from '@/pages/HomePage'
import ProductDetailPage from '@/pages/ProductDetailPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/products/:slug',
    element: <ProductDetailPage />,
  },
])