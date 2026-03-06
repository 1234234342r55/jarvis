'use client'

import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Waves } from '@/components/main/hero/Waves'
import { loadTossPayments } from '@tosspayments/payment-sdk'
import Image from 'next/image'

export default function CheckoutPage() {
    const { user, loading: authLoading } = useAuth()
    const { cart, getCartTotal } = useCart()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        email: user?.email || '',
        phone: '',
        address: '',
        zipCode: '',
        message: ''
    })

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/auth')
        }
        if (!authLoading && cart.length === 0) {
            router.push('/cart')
        }
    }, [user, authLoading, cart, router])

    useEffect(() => {
        if (user?.email) {
            setCustomerInfo(prev => ({ ...prev, email: user.email || '' }))
        }
    }, [user])

    if (authLoading || !user || cart.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-900 font-[family-name:var(--font-cormorant)] text-xl">
                    Loading...
                </div>
            </div>
        )
    }

    const total = getCartTotal()

    const handlePayment = async () => {
        // Validate form
        if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
            alert('필수 정보를 모두 입력해주세요.')
            return
        }

        setLoading(true)
        try {
            const tossPayments = await loadTossPayments(
                process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || ''
            )

            // Generate order ID
            const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

            // Request payment
            await tossPayments.requestPayment('카드', {
                amount: total,
                orderId: orderId,
                orderName: cart.length === 1
                    ? cart[0].name
                    : `${cart[0].name} 외 ${cart.length - 1}건`,
                customerName: customerInfo.name,
                customerEmail: customerInfo.email,
                customerMobilePhone: customerInfo.phone,
                successUrl: `${window.location.origin}/payment/success`,
                failUrl: `${window.location.origin}/payment/fail`,
            })
        } catch (error) {
            console.error('Payment error:', error)
            alert('결제 처리 중 오류가 발생했습니다.')
        } finally {
            setLoading(false)
        }
    }

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
                <h1 className="font-[family-name:var(--font-cormorant)] text-5xl font-bold tracking-wider text-center mb-16 text-gray-900">
                    CHECKOUT
                </h1>

                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Customer Information Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-8 shadow-lg">
                            <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold mb-6 text-gray-900">
                                배송 정보
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block font-[family-name:var(--font-cormorant)] text-sm font-semibold mb-2 text-gray-700">
                                        이름 *
                                    </label>
                                    <input
                                        type="text"
                                        value={customerInfo.name}
                                        onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E85D04] focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block font-[family-name:var(--font-cormorant)] text-sm font-semibold mb-2 text-gray-700">
                                        이메일
                                    </label>
                                    <input
                                        type="email"
                                        value={customerInfo.email}
                                        onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                                        readOnly
                                    />
                                </div>

                                <div>
                                    <label className="block font-[family-name:var(--font-cormorant)] text-sm font-semibold mb-2 text-gray-700">
                                        전화번호 *
                                    </label>
                                    <input
                                        type="tel"
                                        value={customerInfo.phone}
                                        onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                                        placeholder="010-1234-5678"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E85D04] focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block font-[family-name:var(--font-cormorant)] text-sm font-semibold mb-2 text-gray-700">
                                        우편번호
                                    </label>
                                    <input
                                        type="text"
                                        value={customerInfo.zipCode}
                                        onChange={(e) => setCustomerInfo({ ...customerInfo, zipCode: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E85D04] focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block font-[family-name:var(--font-cormorant)] text-sm font-semibold mb-2 text-gray-700">
                                        주소 *
                                    </label>
                                    <textarea
                                        value={customerInfo.address}
                                        onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E85D04] focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block font-[family-name:var(--font-cormorant)] text-sm font-semibold mb-2 text-gray-700">
                                        배송 메시지
                                    </label>
                                    <textarea
                                        value={customerInfo.message}
                                        onChange={(e) => setCustomerInfo({ ...customerInfo, message: e.target.value })}
                                        rows={2}
                                        placeholder="배송 시 요청사항을 입력해주세요"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E85D04] focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-6 shadow-lg sticky top-24">
                            <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold mb-6 text-gray-900">
                                주문 상품
                            </h2>

                            <div className="space-y-4 mb-6">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex gap-3">
                                        <div className="relative w-16 h-16 flex-shrink-0 rounded overflow-hidden">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-[family-name:var(--font-cormorant)] text-sm font-semibold text-gray-900">
                                                {item.name}
                                            </h3>
                                            <p className="font-[family-name:var(--font-cormorant)] text-xs text-gray-600">
                                                수량: {item.quantity}
                                            </p>
                                            <p className="font-[family-name:var(--font-cormorant)] text-sm font-semibold text-[#E85D04]">
                                                ₩{(item.price * item.quantity).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-200 pt-4 space-y-2 mb-6">
                                <div className="flex justify-between font-[family-name:var(--font-cormorant)] text-gray-600">
                                    <span>상품 금액</span>
                                    <span>₩{total.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between font-[family-name:var(--font-cormorant)] text-gray-600">
                                    <span>배송비</span>
                                    <span>무료</span>
                                </div>
                                <div className="border-t border-gray-200 pt-2 mt-2">
                                    <div className="flex justify-between font-[family-name:var(--font-cormorant)] text-xl font-semibold text-gray-900">
                                        <span>총 결제금액</span>
                                        <span>₩{total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handlePayment}
                                disabled={loading}
                                className="w-full px-6 py-4 bg-[#E85D04] text-white font-[family-name:var(--font-cormorant)] font-semibold tracking-wider rounded-full hover:bg-[#D04D03] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? '처리중...' : '결제하기'}
                            </button>

                            <p className="text-xs text-center text-gray-500 mt-4 font-[family-name:var(--font-cormorant)]">
                                결제 정보는 안전하게 암호화되어 처리됩니다
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
