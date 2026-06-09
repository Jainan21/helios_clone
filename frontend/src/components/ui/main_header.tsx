import { useEffect, useState } from 'react'
import { Search, ShoppingBasket } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useLanguage, type Language } from '@/context/LanguageContext'
import { useCartStore } from '@/features/cart/store/cart.store'
import { getCart } from '@/features/cart/api/cart.api'

const menuGroups = [
  {
    titleKey: 'allProducts',
    items: [
      { labelKey: 'latest', to: '/products?sort=latest' },
      { labelKey: 'newbieShouldChoose', to: '/products?filter=newbie' },
      { labelKey: 'mostImpressive', to: '/products?filter=impressive' },
    ],
  },
  {
    titleKey: 'jewelry',
    items: [
      { labelKey: 'silverRing', to: '/products?type=SILVER_RING' },
      { labelKey: 'silverBracelet', to: '/products?type=SILVER_BRACELET' },
      { labelKey: 'silverNecklace', to: '/products?type=SILVER_NECKLACE' },
      { labelKey: 'silverPendant', to: '/products?type=SILVER_PENDANT' },
      { labelKey: 'silverCharm', to: '/products?type=SILVER_CHARM' },
      { labelKey: 'silverEarrings', to: '/products?type=SILVER_EARRINGS' },
      { labelKey: 'goldJewelry', to: '/products?type=GOLD_JEWELRY' },
    ],
  },
  {
    titleKey: 'accessories',
    items: [
      { labelKey: 'glasses', to: '/products?type=GLASSES' },
      { labelKey: 'leatherCraft', to: '/products?type=LEATHER_CRAFT' },
      { labelKey: 'other', to: '/products?type=OTHER_ACCESSORY' },
    ],
  },
]

const languages: Array<{ value: Language; labelKey: string }> = [
  { value: 'en', labelKey: 'english' },
  { value: 'vi', labelKey: 'vietnamese' },
]

const discoverItems = [
  { labelKey: 'aboutHelios', to: '/about-helios' },
  { labelKey: 'collections', to: '/collections' },
  { labelKey: 'worldOfHelios', to: '/world-of-helios' },
]

export default function MainHeader() {
  const { user } = useAuth()
  const { language, setLanguage, t } = useLanguage()
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const cartCount = useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0))
  const setCartItems = useCartStore((state) => state.setItems)
  const clearCart = useCartStore((state) => state.clearCart)

  useEffect(() => {
    if (!user?.id) {
      clearCart()
      return
    }

    getCart(user.id)
      .then(setCartItems)
      .catch((error) => {
        console.error(error)
      })
  }, [clearCart, setCartItems, user?.id])

  return (
    <div className="group/header relative flex w-full items-center p-7 text-white transition-all duration-400 ease-out hover:bg-black">
      <div className="flex gap-4">
        <div className="group/menu relative flex items-center">
          <button type="button" className="flex items-center text-sm font-medium uppercase">
            {t('menu')}
          </button>

          <div className="invisible fixed left-0 top-[104px] z-50 w-screen translate-y-4 border border-zinc-800 bg-black/95 p-6 opacity-0 shadow-2xl shadow-black transition group-hover/menu:visible group-hover/menu:translate-y-0 group-hover/menu:opacity-100">
            <div className="mx-auto grid w-[90%] grid-cols-3 gap-6">
              {menuGroups.map((group) => (
                <div key={group.titleKey} className="space-y-4">
                  <h3 className="border-b border-zinc-800 pb-3 text-sm font-semibold uppercase tracking-[0.25em] text-amber-400">
                    {t(group.titleKey)}
                  </h3>
                  <div className="grid gap-2">
                    {group.items.map((item) => (
                      <Link
                        key={item.labelKey}
                        to={item.to}
                        className="text-sm text-zinc-300 transition hover:text-white"
                      >
                        {t(item.labelKey)}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Link to="/products?sort=latest" className="flex items-center text-sm font-medium uppercase">
          {t('newIn')}
        </Link>
        <span className="flex items-center text-sm font-medium uppercase">
          {t('feedback')}
        </span>
        <span className="flex items-center text-sm font-medium uppercase">
          {t('collab')}
        </span>
        <div className="group/discover relative flex items-center">
          <button type="button" className="flex items-center text-sm font-medium uppercase">
            {t('discover')}
          </button>

          <div className="invisible absolute left-0 top-full z-50 w-64 translate-y-4 border border-zinc-800 bg-black/95 p-3 opacity-0 shadow-2xl shadow-black transition group-hover/discover:visible group-hover/discover:translate-y-0 group-hover/discover:opacity-100">
            <div className="grid gap-1">
              {discoverItems.map((item) => (
                <Link
                  key={item.labelKey}
                  to={item.to}
                  className="border-b border-zinc-900 px-4 py-3 text-sm font-medium uppercase tracking-[0.18em] text-zinc-300 transition last:border-b-0 hover:bg-zinc-900 hover:text-amber-400"
                >
                  {t(item.labelKey)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2">
        <Link to="/" aria-label="Back to home">
          <img src="../src/assets/header/logo.png" className="w-40" />
        </Link>
      </div>

      <div className="ml-auto flex items-center gap-5">
        <div
          className="relative flex items-center"
          onMouseEnter={() => setIsLanguageOpen(true)}
          onMouseLeave={() => setIsLanguageOpen(false)}
        >
          <button type="button" className="flex items-center" onClick={() => setIsLanguageOpen((current) => !current)}>
            <span>{language === 'en' ? t('english') : t('vietnamese')}</span>
          </button>
          <div
            className={`absolute right-0 top-full z-50 w-40 border border-zinc-800 bg-black/95 p-2 shadow-xl shadow-black transition ${
              isLanguageOpen ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-2 opacity-0'
            }`}
          >
            {languages.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => {
                  setLanguage(item.value)
                  setIsLanguageOpen(false)
                }}
                className={`block w-full px-3 py-2 text-left text-sm transition hover:bg-zinc-900 ${
                  language === item.value ? 'text-amber-400' : 'text-zinc-300'
                }`}
              >
                {t(item.labelKey)}
              </button>
            ))}
          </div>
        </div>

        <span className="flex items-center gap-2">
          {user ? (
            <Link to="/account" className="font-medium text-white">
              {t('greeting')}, {user.firstName ?? user.username ?? user.email}
            </Link>
          ) : (
            <Link to="/login" className="font-medium text-white">
              {t('account')}
            </Link>
          )}
        </span>
        <span>
          <Search />
        </span>
        <Link to="/cart" className="relative" aria-label="Cart">
          <ShoppingBasket />
          {cartCount > 0 ? (
            <span className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-amber-400 text-[11px] font-bold text-black">
              {cartCount}
            </span>
          ) : null}
        </Link>
      </div>
    </div>
  )
}
