import { ChevronLeft, ChevronRight, Mail, MapPin, Phone } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header() {
    const data = [
        {
            id: 1,
            value: "FREE SHIPPING NATIONWIDE"
        },
        {
            id: 2,
            value: "LIFETIME LIGHT"
        },
        {
            id: 3,
            value: "1 FOR 1 EXCHANGE WITHIN 3 DAYS"
        },
    ];

    const [current, setCurrent] = useState(0);
    const prev = () => setCurrent((i) => (i - 1 + data.length) % data.length);
    const next = () => setCurrent((i) => (i + 1 + data.length) % data.length);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((i) => (i + 1) % data.length);
        }, 5000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div>
            <div className="relative flex items-center bg-amber-400 w-full p-2">
                <div className="flex gap-2">
                    <span className="flex items-center">
                        <Phone size={18} className="m-1" />
                        <p>Hotline: 0981.956.116</p>
                    </span>
                    <span className="flex items-center">
                        <Mail size={18} className="m-1" />
                        <p>Email: support@helios.vn</p>
                    </span>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-60">
                    <ChevronLeft className="cursor-pointer" onClick={prev} />
                    <p className="w-64 text-center">
                        {
                            data[current].value
                        }
                    </p>
                    <ChevronRight className="cursor-pointer" onClick={next} />
                </div>
                <div className="ml-auto">
                    <span className="flex items-center gap-2">Store System <MapPin size={18} /></span>
                </div>
            </div>
        </div>
    )
}