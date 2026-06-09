import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '@/components/ui/header'
import MainHeader from '@/components/ui/main_header'
import Footer from '@/components/ui/footer'
import { CollectionContext, type CollectionItem } from '@/context/CollectionContext'

const getCollectionThumbnail = (collection: CollectionItem) => {
  const sortedMedia = [...(collection.medias ?? [])].sort((first, second) => (first.sortOrder ?? 0) - (second.sortOrder ?? 0))
  return sortedMedia.find((media) => media.isThumbnail) ?? sortedMedia[0]
}

export default function CollectionsPage() {
  const { getCollections } = useContext(CollectionContext)
  const [collections, setCollections] = useState<CollectionItem[]>([])
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    getCollections({ page: 1, limit: 1000 })
      .then((response) => {
        if (isMounted) {
          setCollections(response.data)
        }
      })
      .catch((error) => {
        if (isMounted) {
          setMessage('Could not load collections.')
        }
        console.error(error)
      })

    return () => {
      isMounted = false
    }
  }, [getCollections])

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="relative">
        <div className="absolute z-10 w-full">
          <MainHeader />
        </div>

        <main className="mx-auto w-[90%] py-36">
          <div className="mb-10">
            <p className="text-xs uppercase tracking-[0.35em] text-white/45">Discover</p>
            <h1 className="mt-5 text-4xl font-semibold uppercase tracking-wide">Collections</h1>
          </div>

          {message ? <div className="mb-6 border border-white/15 bg-white/5 px-4 py-3 text-sm text-white/70">{message}</div> : null}

          {collections.length === 0 && !message ? (
            <div className="flex min-h-96 items-center justify-center border border-white/15 bg-white/5 text-sm uppercase tracking-[0.35em] text-white/40">
              No collections
            </div>
          ) : null}

          <div className="grid gap-5 md:grid-cols-2">
            {collections.map((collection) => {
              const thumbnail = getCollectionThumbnail(collection)

              return (
                <Link key={collection.id} to={`/collections/${collection.id}`} className="group block overflow-hidden bg-zinc-950">
                  <div className="relative aspect-4/3 overflow-hidden bg-zinc-900">
                    {thumbnail ? (
                      <img
                        src={thumbnail.url}
                        alt={collection.name}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6">
                      <h2 className="text-2xl font-semibold uppercase tracking-wide">{collection.name}</h2>
                      <p className="mt-3 line-clamp-2 max-w-xl text-sm leading-6 text-white/75">{collection.description}</p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}
