import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Language = 'en' | 'vi'

type LanguageContextValue = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const STORAGE_KEY = 'helios-language'

const translations: Record<Language, Record<string, string>> = {
  en: {
    menu: 'MENU',
    newIn: 'NEW IN',
    feedback: 'FEEDBACK',
    collab: 'COLLAB',
    discover: 'DISCOVER',
    account: 'Account',
    greeting: 'Hello',
    allProducts: 'All products',
    latest: 'Latest',
    newbieShouldChoose: 'Newbie should choose',
    mostImpressive: 'Most impressive',
    jewelry: 'Jewelry',
    silverRing: 'Silver ring',
    silverBracelet: 'Silver bracelet',
    silverNecklace: 'Silver necklace',
    silverPendant: 'Silver pendant',
    silverCharm: 'Silver charm',
    silverEarrings: 'Silver earrings',
    goldJewelry: 'Gold jewelry',
    accessories: 'Accessories',
    glasses: 'Glasses',
    leatherCraft: 'Leather craft',
    other: 'Other',
    english: 'English',
    vietnamese: 'Tiếng Việt',
  },
  vi: {
    menu: 'DANH MỤC',
    newIn: 'HÀNG MỚI',
    feedback: 'ĐÁNH GIÁ',
    collab: 'HỢP TÁC',
    discover: 'KHÁM PHÁ',
    account: 'Tài khoản',
    greeting: 'Xin chào',
    allProducts: 'Tất cả sản phẩm',
    latest: 'Mới nhất',
    newbieShouldChoose: 'Người mới nên chọn',
    mostImpressive: 'Ấn tượng nhất',
    jewelry: 'Trang sức',
    silverRing: 'Nhẫn bạc',
    silverBracelet: 'Vòng tay bạc',
    silverNecklace: 'Dây chuyền bạc',
    silverPendant: 'Mặt dây chuyền bạc',
    silverCharm: 'Charm bạc',
    silverEarrings: 'Bông tai bạc',
    goldJewelry: 'Trang sức vàng',
    accessories: 'Phụ kiện',
    glasses: 'Kính',
    leatherCraft: 'Đồ da',
    other: 'Khác',
    english: 'English',
    vietnamese: 'Tiếng Việt',
  },
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'vi' || stored === 'en' ? stored : 'en'
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language)
  }, [language])

  const value = useMemo(
    () => ({
      language,
      setLanguage: setLanguageState,
      t: (key: string) => translations[language][key] ?? key,
    }),
    [language],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
