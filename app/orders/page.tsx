'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Waves } from '@/components/main/hero/Waves'
import { Package, Calendar, CreditCard } from 'lucide-react'

interface Order {
    orderId: string
    paymentKey: string
    amount: number
    status: string
    createdAt: string
    userId?: string
}

export default function OrdersPage() {
    const { user, loading } = useAuth()
    const router = useRouter()
    const [orders, setOrders] = useState<Order[]>([])

    useEffect(() => {
        if (!loading && !user) {
            router.push('/auth')
        }
    }, [user, loading, router])

    useEffect(() => {
        if (user) {
            // Load orders from localStorage (in production, this would be from Firestore)
            const storedOrders = JSON.parse(localStorage.getItem('unorma_orders') || '[]')
            const userOrders = storedOrders.filter((order: Order) => order.userId === user.uid)
            setOrders(userOrders.sort((a: Order, b: Order) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            ))
        }
    }, [user])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-900 font-[family-name:var(--font-cormorant)] text-xl">
                    Loading...
                </div>
            </div>
        )
    }

    if (!user) return null

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
                    ORDER HISTORY
                </h1>
                <p className="text-center font-[family-name:var(--font-cormorant)] text-gray-600 mb-16">
                    {orders.length} {orders.length === 1 ? 'order' : 'orders'} found
                </p>

                <div className="max-w-4xl mx-auto">
                    {orders.length === 0 ? (
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-16 shadow-lg text-center">
                            <Package className="w-16 h-16 mx-auto mb-6 text-gray-300" strokeWidth={1.5} />
                            <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold mb-4 text-gray-900">
                                No orders yet
                            </h2>
                            <p className="font-[family-name:var(--font-cormorant)] text-gray-500 mb-8">
                                You haven't made any purchases yet
                            </p>
                            <a
                                href="/collection"
                                className="inline-block px-8 py-3 bg-[#E85D04] text-white font-[family-name:var(--font-cormorant)] font-semibold tracking-wider rounded-full hover:bg-[#D04D03] transition-colors"
                            >
                                Shop Now
                            </a>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div
                                    key={order.orderId}
                                    className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <Package className="w-5 h-5 text-[#E85D04]" />
                                                <h3 className="font-[family-name:var(--font-cormorant)] text-lg font-semibold text-gray-900">
                                                    주문번호: {order.orderId.slice(0, 20)}...
                                                </h3>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-600 font-[family-name:var(--font-cormorant)]">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>
                                                        {new Date(order.createdAt).toLocaleDateString('ko-KR', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <CreditCard className="w-4 h-4" />
                                                    <span>
                                                        {new Date(order.createdAt).toLocaleTimeString('ko-KR', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="inline-block px-4 py-1 bg-green-100 text-green-800 rounded-full text-sm font-[family-name:var(--font-cormorant)] font-semibold mb-2">
                                                {order.status === 'completed' ? '결제완료' : order.status}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200 pt-4">
                                        <div className="flex justify-between items-center">
                                            <span className="font-[family-name:var(--font-cormorant)] text-gray-600">
                                                결제금액
                                            </span>
                                            <span className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold text-[#E85D04]">
                                                ₩{order.amount.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <p className="text-xs text-gray-500 font-[family-name:var(--font-cormorant)]">
                                            Payment Key: {order.paymentKey}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
