import { ChevronDown, Search, ShoppingBasket } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function MainHeader() {
    const { user } = useAuth()

    return (

        <div className="relative flex items-center w-full p-7 text-white transition-all ease-out duration-400 hover:bg-black">
            <div className="flex gap-4">
                <span className="flex items-center">
                    <p>MENU</p>
                </span>
                <span className="flex items-center">
                    <p>NEW IN</p>
                </span>
                <span className="flex items-center">
                    <p>FEEDBACK</p>
                </span>
                <span className="flex items-center">
                    <p>COLLAB</p>
                </span>
                <span className="flex items-center">
                    <p>DISCOVER</p>
                </span>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-60">
                <img src="../src/assets/header/logo.png" className="w-40" />
            </div>
            <div className="flex items-center gap-5 ml-auto">
                <span className="flex items-center gap-2">
                    <p>English</p>
                    <ChevronDown />
                </span>
                <span className="flex items-center gap-2">
                    {user ? (
                        <Link to="/account" className="font-medium text-white">
                            Xin chào, {user.username}
                        </Link>
                    ) : (
                        <Link to="/login" className="font-medium text-white">
                            Account
                        </Link>
                    )}
                </span>
                <span>
                    <Search />
                </span>
                <span>
                    <ShoppingBasket />
                </span>
            </div>
        </div>
    )
}