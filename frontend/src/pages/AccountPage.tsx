import { EmblaCarousel } from '@/components/layouts/EmblaCarousel'
import Header from '@/components/ui/header'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import MainHeader from '@/components/ui/main_header'
import { useNavigate } from 'react-router-dom'

export default function AccountPage() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/", { replace: true })
    }
    return (
        <div className="min-h-screen bg-black text-black">
            <Header />
            <div className='relative'>
                <div className='absolute z-10 w-full'>
                    <MainHeader />
                </div>
                <EmblaCarousel />
                <Button onClick={handleLogout} className='text-white'>Log Out</Button>
            </div>
        </div>
    )
}