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
                    {slides.map((src, i) => (
                        <div key={i} className="flex-[0_0_100%] min-w-0 relative">
                            <img src={src} alt={`Slide ${i + 1}`} className="w-full object-cover transition-all duration-1400 ease-out scale-100 group-hover:scale-[1.02]" />
                        </div>
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