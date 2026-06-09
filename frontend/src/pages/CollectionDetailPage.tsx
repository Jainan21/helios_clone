import { useContext, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Header from '@/components/ui/header'
import MainHeader from '@/components/ui/main_header'
import Footer from '@/components/ui/footer'
import ProductGrid from '@/components/ui/products_grid'
import { CollectionContext, type CollectionItem } from '@/context/CollectionContext'
import type { JewelryItem } from '@/context/JewelryContext'

type CollectionProduct = {
  id: number
  name: string
  slug: string
  price: number
  status: string
  thumbnail: string
  hoverThumbnail?: string
}

const toCollectionProduct = (item: JewelryItem): CollectionProduct | null => {
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

export default function CollectionDetailPage() {
  const { id } = useParams()
  const collectionId = Number(id)
  const { getCollectionById } = useContext(CollectionContext)
  const [collection, setCollection] = useState<CollectionItem | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!Number.isFinite(collectionId)) {
      setMessage('Collection not found.')
      return
    }

    let isMounted = true

    getCollectionById(collectionId)
      .then((item) => {
        if (isMounted) {
          setCollection(item)
        }
      })
      .catch((error) => {
        if (isMounted) {
          setMessage('Could not load collection.')
        }
        console.error(error)
      })

    return () => {
      isMounted = false
    }
  }, [collectionId, getCollectionById])

  const medias = useMemo(
    () => [...(collection?.medias ?? [])].sort((first, second) => (first.sortOrder ?? 0) - (second.sortOrder ?? 0)),
    [collection],
  )
  const products = useMemo(
    () => (collection?.jewelry ?? []).map(toCollectionProduct).filter((product): product is CollectionProduct => Boolean(product)),
    [collection],
  )

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="relative">
        <div className="absolute z-10 w-full">
          <MainHeader />
        </div>

        <main className="pt-28">
          {message ? (
            <div className="mx-auto w-[90%] py-24 text-center">
              <p className="text-sm uppercase tracking-[0.35em] text-white/50">{message}</p>
              <Link to="/" className="mt-6 inline-flex rounded-full border border-white/30 px-6 py-3 text-sm hover:bg-white hover:text-black">
                Back to home
              </Link>
            </div>
          ) : null}

          {collection ? (
            <>
              <section className="mx-auto grid w-[90%] gap-6 py-12 lg:grid-cols-[360px_1fr] lg:gap-12">
                <div className="lg:sticky lg:top-28 lg:self-start">
                  <p className="text-xs uppercase tracking-[0.35em] text-white/50">Collection</p>
                  <h1 className="mt-4 text-4xl font-semibold uppercase tracking-wide">{collection.name}</h1>
                  <p className="mt-5 text-sm leading-7 text-white/70">{collection.description}</p>
                </div>

                <div className="grid gap-5">
                  {medias.length === 0 ? (
                    <div className="flex min-h-96 items-center justify-center border border-white/15 bg-white/5 text-sm uppercase tracking-[0.35em] text-white/40">
                      No media
                    </div>
                  ) : null}

                  {medias.map((media, index) => (
                    <img
                      key={media.id ?? `${media.url}-${index}`}
                      src={media.url}
                      alt={`${collection.name} media ${index + 1}`}
                      className="w-full bg-zinc-950 object-cover"
                    />
                  ))}
                </div>
              </section>

              <section className="bg-black">
                <div className="mx-auto w-[90%] py-10">
                  <h2 className="text-2xl font-semibold uppercase tracking-wide">Products</h2>
                </div>
                <ProductGrid products={products} />
              </section>
            </>
          ) : null}
        </main>
      </div>
      <Footer />
    </div>
  )
}
