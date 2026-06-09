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
    aboutHelios: 'About Helios',
    collections: 'Collections',
    worldOfHelios: 'World of Helios',
    aboutHeliosEyebrow: 'About Helios',
    aboutHeliosIntro:
      'Helios not only tells our spirit through each creation, but also accompanies you to deepen your story in each item you own. We are individuals, so let us make our own story in a different way.',
    aboutHeliosStory1:
      'Each of us is unique. Some choose to be tall trees that reach the sky, while others find beauty as a delicate flower hidden in the corner of the garden. But no matter who you are, no matter where you stand, differences always exist. And that is the spirit that gave birth to Helios, a place for mature men who dare to change, dare to be different, and worship freedom from the soul.',
    aboutHeliosStory2:
      'What Helios brings is more than just jewelry. Each product has its own story, and the journey of each item never really ends. With each scratch and each crack that forms, it becomes a mark that reminds you of the experiences you have gone through.',
    aboutHeliosStory3:
      'We believe that when you choose Helios, you are choosing more than just an accessory. You are choosing a lifestyle: to dare to push boundaries, embrace new experiences, and pursue what you believe is right.',
    aboutHeliosStory4:
      'Behind each creation is the dedication of Vietnamese artisans with over 20 years of experience, combined with young designers with innovative thinking. Helios does not only create jewelry. We affirm the value of Vietnamese craftsmanship on the world map. From a domestic brand, we set the first milestones on the journey to international expansion, carrying the spirit of men who dare to be different.',
    aboutHeliosClosing:
      'And Helios is here to share your story. We are glad you found and made a difference with us, and we hope you do too.',
    bestRegards: 'Best regards,',
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
    aboutHelios: 'Về Helios',
    collections: 'Bộ sưu tập',
    worldOfHelios: 'Thế giới Helios',
    aboutHeliosEyebrow: 'Về Helios',
    aboutHeliosIntro:
      "Helios không chỉ kể tinh thần của chúng tôi qua từng chế tác, mà còn đồng hành để khắc sâu câu chuyện của bạn ở từng món đồ bạn sở hữu. Chúng ta là cá thể riêng biệt nên hãy biến câu chuyện của riêng chúng ta theo 1 cách KHÁC BIỆT.",
    aboutHeliosStory1:
      'Mỗi người chúng ta đều là duy nhất. Một số người chọn trở thành những cây cao vươn tới bầu trời, trong khi những người khác lại tìm thấy vẻ đẹp như một bông hoa mỏng manh ẩn mình trong góc vườn. Nhưng dù là ai, dù đứng ở đâu, sự khác biệt luôn tồn tại. Và đó chính là tinh thần đã khai sinh ra Helios – nơi dành cho những người đàn ông trưởng thành, dám thay đổi, dám khác biệt, và tôn thờ tự do từ trong tâm hồn.',
    aboutHeliosStory2:
      'Thứ Helios mang đến không đơn thuần là trang sức. Với mỗi sản phẩm là một câu chuyện riêng, hành trình của mỗi món đồ không bao giờ thực sự kết thúc. Với mỗi vết xước, một vết nứt hình thành, nó lại trở thành một dấu ấn mà mỗi khi nhìn vào, bạn sẽ nhớ lại những trải nghiệm mà mình đã đi qua.',
    aboutHeliosStory3:
      'Chúng tôi tin rằng, khi bạn chọn Helios, thứ bạn chọn không chỉ là một món phụ kiện. Bạn đang chọn phong cách sống – dám phá bỏ giới hạn, đón nhận trải nghiệm mới, và theo đuổi những gì bạn cho là đúng đắn.',
    aboutHeliosStory4:
      'Đứng sau mỗi chế tác là sự tận tâm của những nghệ nhân Việt với hơn 20 năm kinh nghiệm, kết hợp cùng những nhà thiết kế trẻ mang tư duy đột phá. Helios không chỉ tạo ra trang sức – chúng tôi khẳng định giá trị của sự thủ công Việt Nam trên bản đồ thế giới. Từ một thương hiệu nội địa, chúng tôi đặt ra những cột mốc đầu tiên trên hành trình vươn ra quốc tế, mang theo tinh thần của những người đàn ông dám khác biệt.',
    aboutHeliosClosing:
      'Và, Helios ở đây đề đồng hành cùng câu chuyện của bạn. Chúng tôi rất vui vì bạn đã tìm thấy và khác biệt cùng chúng tôi, hy vọng bạn cũng vậy. ',
    bestRegards: 'Trân trọng,',
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
