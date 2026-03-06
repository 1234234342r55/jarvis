'use client'

import { useState } from 'react'
import Image from 'next/image'
import { CanvasRevealEffect } from '@/components/ui/canvas-reveal-effect'

export interface Product {
    id: string
    name: string
    description: string
    price: string
    image: string
}

interface ProductGridProps {
    products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
    const [hoveredId, setHoveredId] = useState<string | null>(null)

    return (
        <div className="container mx-auto px-6 py-20 max-w-7xl">
            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="group relative cursor-pointer"
                        onMouseEnter={() => setHoveredId(product.id)}
                        onMouseLeave={() => setHoveredId(null)}
                    >
                        {/* Product Image - Simple */}
                        <div className="relative w-full aspect-square mb-6">
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-contain"
                            />
                        </div>

                        {/* Product Info */}
                        <div className="text-center space-y-2 transition-all duration-700 group-hover:translate-y-1">
                            <h3 className="font-[family-name:var(--font-cormorant)] text-2xl md:text-3xl font-light tracking-[0.2em] text-gray-900">
                                {product.name}
                            </h3>
                            <p className="font-[family-name:var(--font-cormorant)] text-base md:text-lg tracking-wider text-gray-600">
                                {product.description}
                            </p>
                            <p
                                className="text-xl md:text-2xl font-light tracking-widest pt-2"
                                style={{ color: '#E85D04' }}
                            >
                                {product.price}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
