import { useContext, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Header from '@/components/ui/header'
import MainHeader from '@/components/ui/main_header'
import ProductGrid from '@/components/ui/products_grid'
import Footer from '@/components/ui/footer'
import { JewelryContext, type JewelryItem, type JewelryType } from '@/context/JewelryContext'

type Product = {
  id: number
  name: string
  slug: string
  price: number
  status: string
  thumbnail: string
  hoverThumbnail?: string
}

const jewelryTypes: JewelryType[] = [
  'SILVER_RING',
  'SILVER_BRACELET',
  'SILVER_NECKLACE',
  'SILVER_PENDANT',
  'SILVER_CHARM',
  'SILVER_EARRINGS',
  'GOLD_JEWELRY',
  'GLASSES',
  'LEATHER_CRAFT',
  'OTHER_ACCESSORY',
]

const toProduct = (item: JewelryItem): Product | null => {
  const sortedMedia = [...(item.medias ?? [])].sort((first, second) => (first.sortOrder ?? 0) - (second.sortOrder ?? 0))
  const thumbnail = sortedMedia.find((media) => media.isThumbnail) ?? sortedMedia[0]
  const hoverThumbnail = sortedMedia.find((media) => media.url !== thumbnail?.url)

  if (!thumbnail) {
    return null
  }

  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    price: item.price,
    status: item.status,
    thumbnail: thumbnail.url,
    hoverThumbnail: hoverThumbnail?.url,
  }
}

const formatTitle = (value: string | null) => {
  if (!value) {
    return 'All products'
  }

  return value.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (letter: string) => letter.toUpperCase())
}

export default function ProductsPage() {
  const { getJewelry } = useContext(JewelryContext)
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [message, setMessage] = useState<string | null>(null)
  const typeParam = searchParams.get('type')
  const type = jewelryTypes.includes(typeParam as JewelryType) ? (typeParam as JewelryType) : undefined

  const title = useMemo(() => formatTitle(type ?? searchParams.get('filter') ?? searchParams.get('sort')), [searchParams, type])

  useEffect(() => {
    let isMounted = true

    getJewelry({ page: 1, limit: 24, type })
      .then((response) => {
        if (!isMounted) {
          return
        }

        setProducts(response.data.map(toProduct).filter((product): product is Product => Boolean(product)))
      })
      .catch((error) => {
        if (isMounted) {
          setMessage('Could not load products.')
        }
        console.error(error)
      })

    return () => {
      isMounted = false
    }
  }, [getJewelry, type])

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="relative">
        <div className="absolute z-10 w-full">
          <MainHeader />
        </div>
        <div className="mx-auto w-[90%] pt-36">
          <p className="text-sm uppercase tracking-[0.35em] text-amber-400">Catalog</p>
          <h1 className="mt-3 text-4xl font-bold uppercase">{title}</h1>
          {message ? <div className="mt-6 text-sm text-zinc-300">{message}</div> : null}
        </div>
        <div className="mx-auto w-[90%] py-8">
          <ProductGrid products={products} />
        </div>
      </div>
      <Footer />
    </div>
  )
}
