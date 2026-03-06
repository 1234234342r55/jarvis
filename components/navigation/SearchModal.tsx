'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Search, X } from 'lucide-react'
import { Product } from '@/components/collection/ProductGrid'

interface SearchModalProps {
    isOpen: boolean
    onClose: () => void
    products: Product[]
}

export function SearchModal({ isOpen, onClose, products }: SearchModalProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([])

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredProducts([])
        } else {
            const filtered = products.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase())
            )
            setFilteredProducts(filtered)
        }
    }, [searchQuery, products])

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl z-[101]"
                    >
                        <div className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden mx-4">
                            {/* Search Input */}
                            <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
                                <Search className="w-5 h-5 text-white/50" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    autoFocus
                                    className="flex-1 bg-transparent text-white placeholder:text-white/40 outline-none font-[family-name:var(--font-cormorant)] text-lg"
                                />
                                <button
                                    onClick={onClose}
                                    className="text-white/50 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Search Results */}
                            <div className="max-h-96 overflow-y-auto">
                                {searchQuery.trim() === '' ? (
                                    <div className="px-6 py-12 text-center text-white/40 font-[family-name:var(--font-cormorant)]">
                                        Enter a search term
                                    </div>
                                ) : filteredProducts.length === 0 ? (
                                    <div className="px-6 py-12 text-center text-white/40 font-[family-name:var(--font-cormorant)]">
                                        No results found
                                    </div>
                                ) : (
                                    <div className="py-2">
                                        {filteredProducts.map((product) => (
                                            <Link
                                                key={product.id}
                                                href="/collection"
                                                onClick={onClose}
                                                className="flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-colors group"
                                            >
                                                {/* Product Image */}
                                                <div className="w-16 h-16 bg-white/5 rounded-lg overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>

                                                {/* Product Info */}
                                                <div className="flex-1">
                                                    <h3 className="font-[family-name:var(--font-cormorant)] text-lg font-semibold tracking-wider text-white group-hover:text-[#E85D04] transition-colors">
                                                        {product.name}
                                                    </h3>
                                                    <p className="font-[family-name:var(--font-cormorant)] text-sm text-white/60">
                                                        {product.description}
                                                    </p>
                                                </div>

                                                {/* Price */}
                                                <div className="text-[#E85D04] font-[family-name:var(--font-cormorant)] font-semibold">
                                                    {product.price}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Footer Hint */}
                            <div className="px-6 py-3 border-t border-white/10 flex items-center justify-between text-xs text-white/40 font-[family-name:var(--font-cormorant)]">
                                <span>Press ESC to close</span>
                                <span>{filteredProducts.length > 0 && `${filteredProducts.length} result${filteredProducts.length > 1 ? 's' : ''}`}</span>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
