import { Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLanguage } from '@/context/LanguageContext'

const footerContent = {
  en: {
    target: 'HELIOS creates unique creations for mature men who dare to change, dare to be different and worship freedom even in their souls. Each creation has a distinct spirit, handmade by pure Vietnamese hands with the desire to bring the works to the world.',
    connect: 'Connect with us',
    customerCare: 'Customer care',
    about: 'About us',
    forCustomers: 'For customers',
    hotline: 'Hotline',
    email: 'Email',
    storeSystem: 'Store system',
    orderGuide: 'Order guide',
    shipping: 'Shipping policy',
    exchange: 'Exchange policy',
    warranty: 'Warranty policy',
    story: 'Brand story',
    careers: 'Careers',
    contact: 'Contact',
    privacy: 'Privacy policy',
    terms: 'Terms of service',
    sizeGuide: 'Size guide',
    copyright: 'HELIOS. All rights reserved.',
  },
  vi: {
    target: 'HELIOS là thương hiệu trang sức bạc thủ công cho nam, tạo nên những dấu ấn mang tính biểu tượng của bản lĩnh và hành trình trưởng thành, dành cho những người đàn ông dám lựa chọn, dám giữ lấy khác biệt và sống tự do theo cách của mình. Mỗi chế tác mang một tinh thần riêng, được hoàn thiện bằng tay bởi nghệ nhân Việt.',
    connect: 'Kết nối với chúng tôi',
    customerCare: 'Chăm sóc khách hàng',
    about: 'Về chúng tôi',
    forCustomers: 'Dành cho khách hàng',
    hotline: 'Hotline',
    email: 'Email',
    storeSystem: 'Hệ thống cửa hàng',
    orderGuide: 'Hướng dẫn đặt hàng',
    shipping: 'Chính sách vận chuyển',
    exchange: 'Chính sách đổi trả',
    warranty: 'Chính sách bảo hành',
    story: 'Câu chuyện thương hiệu',
    careers: 'Tuyển dụng',
    contact: 'Liên hệ',
    privacy: 'Chính sách bảo mật',
    terms: 'Điều khoản dịch vụ',
    sizeGuide: 'Hướng dẫn chọn size',
    copyright: 'HELIOS. Đã đăng ký bản quyền.',
  },
}

export default function Footer() {
  const { language } = useLanguage()
  const t = footerContent[language]

  return (
    <footer className="border-t border-zinc-900 bg-black text-white">
      <div className="mx-auto grid w-[90%] gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
        <section className="space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-400">{t.connect}</h2>
          <div className="space-y-3 text-sm text-zinc-300">
            <p className="flex items-center">
              {t.target}
            </p>
            <p className="flex items-center gap-3">
              <Phone className="size-4 text-amber-400" />
              {t.hotline}: 0981.956.116
            </p>
            <p className="flex items-center gap-3">
              <Mail className="size-4 text-amber-400" />
              {t.email}: support@helios.vn
            </p>
            <p className="flex items-center gap-3">
              <MapPin className="size-4 text-amber-400" />
              {t.storeSystem}
            </p>
          </div>
          <div className="flex gap-3">
            <a href="https://www.facebook.com" className="rounded-full border border-zinc-800 px-3 py-2 text-xs font-semibold text-zinc-300 transition hover:border-amber-400 hover:text-amber-400">
              FB
            </a>
            <a href="https://www.instagram.com" className="rounded-full border border-zinc-800 px-3 py-2 text-xs font-semibold text-zinc-300 transition hover:border-amber-400 hover:text-amber-400">
              IG
            </a>
          </div>
        </section>

        <section className="space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-400">{t.customerCare}</h2>
          <nav className="grid gap-3 text-sm text-zinc-300">
            <Link to="/">{t.orderGuide}</Link>
            <Link to="/">{t.shipping}</Link>
            <Link to="/">{t.exchange}</Link>
            <Link to="/">{t.warranty}</Link>
          </nav>
        </section>

        <section className="space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-400">{t.about}</h2>
          <nav className="grid gap-3 text-sm text-zinc-300">
            <Link to="/">{t.story}</Link>
            <Link to="/">{t.careers}</Link>
            <Link to="/">{t.contact}</Link>
          </nav>
        </section>

        <section className="space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-400">{t.forCustomers}</h2>
          <nav className="grid gap-3 text-sm text-zinc-300">
            <Link to="/">{t.privacy}</Link>
            <Link to="/">{t.terms}</Link>
            <Link to="/">{t.sizeGuide}</Link>
          </nav>
        </section>
      </div>
      <div className="border-t border-zinc-900 py-5 text-center text-xs uppercase tracking-[0.25em] text-zinc-600">
        {t.copyright}
      </div>
    </footer>
  )
}
