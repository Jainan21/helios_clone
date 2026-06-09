import { useEffect, useCallback, useContext, useMemo, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { Link } from 'react-router-dom'
import { CollectionContext, type CollectionItem } from '@/context/CollectionContext'


const SLIDE_DURATION = 5000

export function EmblaCarousel() {
    const { getCollections } = useContext(CollectionContext)
    const autoplay = Autoplay({ delay: SLIDE_DURATION, stopOnInteraction: false })
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [autoplay])
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [progress, setProgress] = useState(0)
    const [slideCount, setSlideCount] = useState(0)
    const [collections, setCollections] = useState<CollectionItem[]>([])

    const slides = useMemo(
        () =>
            collections
                .map((collection) => {
                    const sortedMedia = [...(collection.medias ?? [])].sort(
                        (first, second) => (first.sortOrder ?? 0) - (second.sortOrder ?? 0),
                    )
                    const media = sortedMedia.find((item) => item.isThumbnail) ?? sortedMedia[0]

                    if (!media) {
                        return null
                    }

                    return {
                        id: collection.id,
                        name: collection.name,
                        description: collection.description,
                        src: media.url,
                    }
                })
                .filter((slide): slide is { id: number; name: string; description: string; src: string } => Boolean(slide)),
        [collections],
    )

    useEffect(() => {
        let isMounted = true

        getCollections({ page: 1, limit: 3 })
            .then((response) => {
                if (isMounted) {
                    setCollections(response.data)
                }
            })
            .catch((error) => {
                console.error(error)
            })

        return () => {
            isMounted = false
        }
    }, [getCollections])

    // Sync selected index
    const onSelect = useCallback(() => {
        if (!emblaApi) return
        setSelectedIndex(emblaApi.selectedScrollSnap())
        setProgress(0) // reset progress on slide change
    }, [emblaApi])

    useEffect(() => {
        if (!emblaApi) return
        setSlideCount(emblaApi.scrollSnapList().length)
        emblaApi.on('select', onSelect)
        onSelect()
        return () => { emblaApi.off('select', onSelect) }
    }, [emblaApi, onSelect, slides.length])

    // Progress bar ticker
    useEffect(() => {
        setProgress(0)
        const start = performance.now()

        const tick = (now: number) => {
            const elapsed = now - start
            const pct = Math.min((elapsed / SLIDE_DURATION) * 100, 100)

            setProgress(pct)

            if (pct < 100) {
                requestAnimationFrame(tick)
            }
        }

        const raf = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(raf)
    }, [selectedIndex])

    const goTo = (index: number) => {
        emblaApi?.scrollTo(index)
        autoplay.reset()
    }

    return (
        <div className="relative w-full overflow-hidden h-225">
            {/* Viewport */}
            <div ref={emblaRef} className="overflow-hidden">
                <div className="flex">
                    {slides.length === 0 ? (
                        <div className="flex h-225 flex-[0_0_100%] min-w-0 items-center justify-center bg-zinc-950 text-sm uppercase tracking-[0.35em] text-white/60">
                            Collections
                        </div>
                    ) : null}

                    {slides.map((slide, i) => (
                        <Link key={slide.id} to={`/collections/${slide.id}`} className="group flex-[0_0_100%] min-w-0 relative">
                            <img src={slide.src} alt={slide.name || `Collection ${i + 1}`} className="h-225 w-full object-cover transition-all duration-1400 ease-out scale-100 group-hover:scale-[1.02]" />
                            <div className="absolute bottom-16 left-6 max-w-xl text-white sm:left-10 lg:left-16">
                                <h2 className="text-3xl font-semibold uppercase tracking-wide sm:text-5xl">{slide.name}</h2>
                                <p className="mt-3 max-w-lg text-sm leading-6 text-white/85 sm:text-base">{slide.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Bottom controls */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
                {Array.from({ length: slideCount }).map((_, i) => {
                    const active = i === selectedIndex

                    const radius = 7
                    const circumference = 2 * Math.PI * radius

                    return (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            className="relative flex items-center justify-center w-6 h-6 transition-transform duration-300"
                        >
                            {/* inactive dot */}
                            {!active && (
                                <div className="w-2 h-2 rounded-full bg-white/90" />
                            )}

                            {/* active progress ring */}
                            {active && (
                                <svg
                                    className="absolute inset-0 -rotate-90"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        cx="12"
                                        cy="12"
                                        r={radius}
                                        fill="none"
                                        stroke="rgba(255,255,255,0.25)"
                                        strokeWidth="2"
                                    />

                                    <circle
                                        cx="12"
                                        cy="12"
                                        r={radius}
                                        fill="none"
                                        stroke="white"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={
                                            circumference - (circumference * progress) / 100
                                        }
                                        className="transition-all duration-75 linear"
                                    />
                                </svg>
                            )}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
