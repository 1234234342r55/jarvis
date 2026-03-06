'use client'

import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Waves } from '@/components/main/hero/Waves'
import { ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function CartPage() {
    const { user, loading: authLoading } = useAuth()
    const { cart, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart()
    const router = useRouter()

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/auth')
        }
    }, [user, authLoading, router])

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-900 font-[family-name:var(--font-cormorant)] text-xl">
                    Loading...
                </div>
            </div>
        )
    }

    if (!user) return null

    const total = getCartTotal()
    const itemCount = getCartCount()

    return (
        <div className="relative min-h-screen">
            {/* Background */}
            <div className="fixed inset-0 -z-10">
                <Waves
                    strokeColor="#d0d0d0"
                    backgroundColor="#ffffff"
                    pointerSize={0.5}
                />
            </div>

            {/* Content */}
            <div className="container mx-auto px-6 pt-32 pb-20">
                <h1 className="font-[family-name:var(--font-cormorant)] text-5xl font-bold tracking-wider text-center mb-4 text-gray-900">
                    SHOPPING CART
                </h1>
                <p className="text-center font-[family-name:var(--font-cormorant)] text-gray-600 mb-16">
                    {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
                </p>

                {cart.length === 0 ? (
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-16 shadow-lg text-center">
                            <ShoppingBag className="w-16 h-16 mx-auto mb-6 text-gray-300" strokeWidth={1.5} />
                            <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold mb-4 text-gray-900">
                                Your cart is empty
                            </h2>
                            <p className="font-[family-name:var(--font-cormorant)] text-gray-500 mb-8">
                                Add items you love to your cart
                            </p>
                            <Link
                                href="/collection"
                                className="inline-block px-8 py-3 bg-[#E85D04] text-white font-[family-name:var(--font-cormorant)] font-semibold tracking-wider rounded-full hover:bg-[#D04D03] transition-colors"
                            >
                                Shop Now
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cart.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="flex gap-6">
                                        {/* Product Image */}
                                        <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-[family-name:var(--font-cormorant)] text-xl font-semibold text-gray-900">
                                                    {item.name}
                                                </h3>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>

                                            {item.size && (
                                                <p className="font-[family-name:var(--font-cormorant)] text-sm text-gray-600 mb-1">
                                                    Size: {item.size}
                                                </p>
                                            )}

                                            <p className="font-[family-name:var(--font-cormorant)] text-lg font-semibold text-[#E85D04] mb-4">
                                                ₩{item.price.toLocaleString()}
                                            </p>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center border border-gray-300 rounded-lg">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="p-2 hover:bg-gray-100 transition-colors rounded-l-lg"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus size={16} />
                                                    </button>
                                                    <span className="px-4 font-[family-name:var(--font-cormorant)] font-semibold">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-2 hover:bg-gray-100 transition-colors rounded-r-lg"
                                                    >
                                                        <Plus size={16} />
                                                    </button>
                                                </div>
                                                <span className="font-[family-name:var(--font-cormorant)] text-gray-600">
                                                    Subtotal: ₩{(item.price * item.quantity).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-6 shadow-lg sticky top-24">
                                <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold mb-6 text-gray-900">
                                    Order Summary
                                </h2>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between font-[family-name:var(--font-cormorant)] text-gray-600">
                                        <span>Subtotal</span>
                                        <span>₩{total.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between font-[family-name:var(--font-cormorant)] text-gray-600">
                                        <span>Shipping</span>
                                        <span>Free</span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-3 mt-3">
                                        <div className="flex justify-between font-[family-name:var(--font-cormorant)] text-xl font-semibold text-gray-900">
                                            <span>Total</span>
                                            <span>₩{total.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <Link href="/checkout">
                                    <button className="w-full px-6 py-4 bg-[#E85D04] text-white font-[family-name:var(--font-cormorant)] font-semibold tracking-wider rounded-full hover:bg-[#D04D03] transition-colors">
                                        Proceed to Checkout
                                    </button>
                                </Link>

                                <Link href="/collection">
                                    <button className="w-full mt-3 px-6 py-3 border border-gray-300 text-gray-700 font-[family-name:var(--font-cormorant)] font-semibold tracking-wider rounded-full hover:bg-gray-50 transition-colors">
                                        Continue Shopping
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
