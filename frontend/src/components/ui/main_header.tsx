import { ChevronDown, Search, ShoppingBasket } from "lucide-react";

export default function MainHeader() {
    return (

        <div className="relative flex items-center w-full p-3 text-white hover:bg-black">
            <div className="flex gap-2">
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
                    <p>Account</p>
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