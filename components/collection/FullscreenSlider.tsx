'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

export interface Product {
    id: string
    name: string
    description: string
    price: string
    image: string
}

interface FullscreenSliderProps {
    products: Product[]
}

export function FullscreenSlider({ products }: FullscreenSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [showInfo, setShowInfo] = useState(false)
    const [touchStart, setTouchStart] = useState(0)
    const [touchEnd, setTouchEnd] = useState(0)
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState(0)
    const [offset, setOffset] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)

    // Minimum swipe distance (in pixels)
    const minSwipeDistance = 50

    // Handle touch start
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(0)
        setTouchStart(e.targetTouches[0].clientX)
    }

    // Handle touch move
    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX)
    }

    // Handle touch end
    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return

        const distance = touchStart - touchEnd
        const isLeftSwipe = distance > minSwipeDistance
        const isRightSwipe = distance < -minSwipeDistance

        if (isLeftSwipe && currentIndex < products.length - 1) {
            setCurrentIndex(currentIndex + 1)
        }

        if (isRightSwipe && currentIndex > 0) {
            setCurrentIndex(currentIndex - 1)
        }
    }

    // Handle mouse drag
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true)
        setDragStart(e.clientX)
        setOffset(0)
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return
        const currentOffset = e.clientX - dragStart
        setOffset(currentOffset)
    }

    const handleMouseUp = () => {
        if (!isDragging) return
        setIsDragging(false)

        if (Math.abs(offset) > minSwipeDistance) {
            if (offset < 0 && currentIndex < products.length - 1) {
                setCurrentIndex(currentIndex + 1)
            } else if (offset > 0 && currentIndex > 0) {
                setCurrentIndex(currentIndex - 1)
            }
        }
        setOffset(0)
    }

    const handleMouseLeave = () => {
        if (isDragging) {
            setIsDragging(false)
            setOffset(0)
        }
    }

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft' && currentIndex > 0) {
                setCurrentIndex(currentIndex - 1)
            } else if (e.key === 'ArrowRight' && currentIndex < products.length - 1) {
                setCurrentIndex(currentIndex + 1)
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [currentIndex, products.length])

    const currentProduct = products[currentIndex]

    return (
        <div
            ref={containerRef}
            className="relative w-full h-screen overflow-hidden cursor-grab active:cursor-grabbing"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onClick={() => setShowInfo(!showInfo)}
            onMouseEnter={() => setShowInfo(true)}
            onMouseLeave={() => {
                setShowInfo(false)
                handleMouseLeave()
            }}
        >
            {/* Image Slider */}
            <div
                className="flex h-full transition-transform duration-500 ease-out"
                style={{
                    transform: `translateX(calc(-${currentIndex * 100}% + ${offset}px))`,
                }}
            >
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="relative min-w-full h-full flex items-center justify-center"
                    >
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-contain"
                            priority={product.id === currentProduct.id}
                        />
                    </div>
                ))}
            </div>

            {/* Product Info Overlay */}
            <div
                className={`absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 pointer-events-none ${
                    showInfo ? 'opacity-100' : 'opacity-0'
                }`}
            >
                <div className="text-center text-white max-w-2xl px-8">
                    <h2 className="font-[family-name:var(--font-cormorant)] text-5xl md:text-7xl font-light tracking-[0.2em] mb-6">
                        {currentProduct.name}
                    </h2>
                    <p className="font-[family-name:var(--font-cormorant)] text-xl md:text-2xl tracking-wider opacity-80 mb-8">
                        {currentProduct.description}
                    </p>
                    <p
                        className="text-3xl md:text-4xl font-light tracking-widest"
                        style={{ color: '#E85D04' }}
                    >
                        {currentProduct.price}
                    </p>
                </div>
            </div>

            {/* Navigation Dots */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
                {products.map((_, index) => (
                    <button
                        key={index}
                        onClick={(e) => {
                            e.stopPropagation()
                            setCurrentIndex(index)
                        }}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === currentIndex
                                ? 'w-8 opacity-100'
                                : 'opacity-40 hover:opacity-70'
                        }`}
                        style={{
                            backgroundColor: '#E85D04',
                        }}
                        aria-label={`Go to product ${index + 1}`}
                    />
                ))}
            </div>

            {/* Swipe Hint (shows on first load) */}
            {currentIndex === 0 && (
                <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 text-white opacity-50 animate-pulse">
                    <p className="font-[family-name:var(--font-cormorant)] text-sm tracking-widest">
                        SWIPE OR DRAG
                    </p>
                </div>
            )}
        </div>
    )
}
