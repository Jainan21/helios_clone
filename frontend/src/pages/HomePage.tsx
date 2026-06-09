import { useContext, useEffect, useState } from 'react'
import { EmblaCarousel } from '@/components/layouts/EmblaCarousel'
import Header from '@/components/ui/header'
import ProductGrid from '@/components/ui/products_grid'
import MainHeader from '@/components/ui/main_header'
import Footer from '@/components/ui/footer'
import { JewelryContext, type JewelryItem } from '@/context/JewelryContext'

type HomeProduct = {
  id: number
  name: string
  slug: string
  price: number
  status: string
  thumbnail: string
  hoverThumbnail?: string
}

const toHomeProduct = (item: JewelryItem): HomeProduct | null => {
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

export default function HomePage() {
  const { getJewelry } = useContext(JewelryContext)
  const [products, setProducts] = useState<HomeProduct[]>([])
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    getJewelry({ page: 1, limit: 8 })
      .then((response) => {
        if (!isMounted) {
          return
        }

        setProducts(response.data.map(toHomeProduct).filter((product): product is HomeProduct => Boolean(product)))
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
  }, [getJewelry])

  return (
    <div className="min-h-screen bg-black text-black">
      <Header />
      <div className="relative">
        <div className="absolute z-10 w-full">
          <MainHeader />
        </div>
        <EmblaCarousel />
        {message ? <div className="bg-black px-6 py-4 text-sm text-white">{message}</div> : null}
        <ProductGrid products={products} />
      </div>
      <Footer />
    </div>
  )
}
