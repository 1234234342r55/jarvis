'use client'
import { Waves } from '@/components/main/hero/Waves'
import { ProductGrid } from '@/components/collection/ProductGrid'
import { ImageCarousel } from '@/components/collection/ImageCarousel'
import { products } from '@/data/products'

// Display images for carousel
const displayImages = [
    '/images/rug-display-1.png',
    '/images/rug-display-2.png',
    '/images/rug-display-3.png',
    '/images/rug-display-4.png',
]

export default function CollectionPage() {
    return (
        <div className="relative overflow-hidden">
            {/* Fullscreen Image Carousel */}
            <ImageCarousel images={displayImages} autoplayInterval={5000} />

            {/* Product Grid Section - White Background */}
            <div className="relative min-h-screen bg-white">
                <ProductGrid products={products} />
            </div>
        </div>
    )
}
