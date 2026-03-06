'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

interface ImageCarouselProps {
    images: string[]
    autoplayInterval?: number
}

export function ImageCarousel({ images, autoplayInterval = 4000 }: ImageCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length)
        }, autoplayInterval)

        return () => clearInterval(timer)
    }, [images.length, autoplayInterval])

    const goToSlide = (index: number) => {
        setCurrentIndex(index)
    }

    return (
        <div className="relative h-screen w-full overflow-hidden">
            {/* Images - Placeholder Gradients */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 1, ease: 'easeInOut' }}
                    className="absolute inset-0"
                >
                    {/* Gradient Placeholder */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background: `linear-gradient(135deg,
                                ${currentIndex === 0 ? '#1a1a1a, #2d2d2d' :
                                  currentIndex === 1 ? '#2d1810, #4a2c1a' :
                                  currentIndex === 2 ? '#1a2d1a, #2d4a2d' :
                                  '#1a1a2d, #2d2d4a'})`
                        }}
                    />
                    {/* Overlay for better text readability */}
                    <div className="absolute inset-0 bg-black/20" />
                </motion.div>
            </AnimatePresence>

            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-white">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="font-[family-name:var(--font-cormorant)] text-6xl md:text-8xl font-light tracking-[0.3em] mb-6 drop-shadow-2xl"
                >
                    COLLECTION
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="font-[family-name:var(--font-cormorant)] text-xl md:text-2xl tracking-[0.2em] drop-shadow-lg"
                >
                    깔지 않는 러그, 그 이상의 오브제
                </motion.p>
            </div>

            {/* Dots Navigation */}
            <div className="absolute bottom-32 left-0 right-0 flex justify-center gap-3 z-20">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className="group relative"
                        aria-label={`Go to slide ${index + 1}`}
                    >
                        <div
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                index === currentIndex
                                    ? 'bg-white w-8'
                                    : 'bg-white/50 group-hover:bg-white/75'
                            }`}
                        />
                    </button>
                ))}
            </div>

            {/* Scroll Down Indicator */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, repeat: Infinity, repeatType: 'reverse', duration: 1.5 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 cursor-pointer"
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            >
                <span className="font-[family-name:var(--font-cormorant)] text-white text-sm tracking-widest">
                    SCROLL
                </span>
                <ChevronDown className="w-6 h-6 text-white" />
            </motion.div>
        </div>
    )
}
