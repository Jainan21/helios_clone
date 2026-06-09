import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import { AuthProvider } from '@/context/AuthContext'
import { JewelryProvider } from '@/context/JewelryContext'
import { LanguageProvider } from '@/context/LanguageContext'
import './index.css'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <JewelryProvider>
          <App />
        </JewelryProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>,
)
