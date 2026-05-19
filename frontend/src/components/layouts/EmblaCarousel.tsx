import React, { useEffect, useCallback, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'


const SLIDE_DURATION = 5000

export function EmblaCarousel() {
    const autoplay = Autoplay({ delay: SLIDE_DURATION, stopOnInteraction: false })
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [autoplay])
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [progress, setProgress] = useState(0)
    const [slideCount, setSlideCount] = useState(0)

    const slides = [
        "../src/assets/Landingpage_pc_01_1ce72cc9-426e-4a68-941f-0f3f1ecf134f-done.webp",
        "../src/assets/file_thiet_ke_nhan_Polaris_Voyage_v2_19x9_31129b03-7322-472f-8ce0-d576c23560c5.webp",
        "../src/assets/Landingpage_pc_01_1ce72cc9-426e-4a68-941f-0f3f1ecf134f-done.webp",
    ]

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
    }, [emblaApi, onSelect])

    // Progress bar ticker
    useEffect(() => {
        setProgress(0)
        const start = performance.now()

        const tick = (now: number) => {
            const elapsed = now - start
            const pct = Math.min((elapsed / SLIDE_DURATION) * 100, 100)
            setProgress(pct)
            if (elapsed < SLIDE_DURATION) {
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
        <div className="relative w-full overflow-hidden h-screen">
            {/* Viewport */}
            <div ref={emblaRef} className="overflow-hidden">
                <div className="flex">
                    {slides.map((src, i) => (
                        <div key={i} className="flex-[0_0_100%] min-w-0">
                            <img src={src} alt={`Slide ${i + 1}`} className="w-full object-cover" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom controls */}
            <div className="absolute bottom-0 left-0 right-0 px-6 pb-4  gap-2">

                {/* Dot indicators */}
                <div className="flex justify-center gap-2">
                    {Array.from({ length: slideCount }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            className={`rounded-full transition-all duration-300 ${
                                i === selectedIndex
                                    ? 'w-2 h-2 bg-white'
                                    : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}