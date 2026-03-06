'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { Waves } from '@/components/main/hero/Waves'
import { CheckCircle } from 'lucide-react'
import Link from 'next/link'

function PaymentSuccessContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const { clearCart } = useCart()
    const { user } = useAuth()
    const [isProcessing, setIsProcessing] = useState(true)
    const [orderInfo, setOrderInfo] = useState<any>(null)

    useEffect(() => {
        const processPayment = async () => {
            const paymentKey = searchParams.get('paymentKey')
            const orderId = searchParams.get('orderId')
            const amount = searchParams.get('amount')

            if (!paymentKey || !orderId || !amount) {
                router.push('/cart')
                return
            }

            try {
                // Here you would verify the payment with Toss Payments API
                // and save the order to Firestore

                // For now, we'll just store basic info
                const order = {
                    orderId,
                    paymentKey,
                    amount: parseInt(amount),
                    status: 'completed',
                    createdAt: new Date().toISOString(),
                    userId: user?.uid
                }

                setOrderInfo(order)

                // Clear cart after successful payment
                clearCart()

                // Save to localStorage temporarily (should be Firestore in production)
                const existingOrders = JSON.parse(localStorage.getItem('unorma_orders') || '[]')
                localStorage.setItem('unorma_orders', JSON.stringify([...existingOrders, order]))

                setIsProcessing(false)
            } catch (error) {
                console.error('Error processing payment:', error)
                router.push('/payment/fail')
            }
        }

        processPayment()
    }, [searchParams, router, clearCart, user])

    if (isProcessing) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-900 font-[family-name:var(--font-cormorant)] text-xl">
                    결제 처리 중...
                </div>
            </div>
        )
    }

    return (
        <div className="relative min-h-screen">
            <div className="fixed inset-0 -z-10">
                <Waves
                    strokeColor="#d0d0d0"
                    backgroundColor="#ffffff"
                    pointerSize={0.5}
                />
            </div>

            <div className="container mx-auto px-6 pt-32 pb-20">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-12 shadow-lg text-center">
                        <CheckCircle className="w-20 h-20 mx-auto mb-6 text-green-500" strokeWidth={1.5} />

                        <h1 className="font-[family-name:var(--font-cormorant)] text-4xl font-bold mb-4 text-gray-900">
                            결제 완료
                        </h1>

                        <p className="font-[family-name:var(--font-cormorant)] text-lg text-gray-600 mb-8">
                            주문이 성공적으로 완료되었습니다.
                        </p>

                        {orderInfo && (
                            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
                                <div className="space-y-2 font-[family-name:var(--font-cormorant)]">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">주문번호</span>
                                        <span className="font-semibold text-gray-900">{orderInfo.orderId}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">결제금액</span>
                                        <span className="font-semibold text-gray-900">
                                            ₩{orderInfo.amount.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <p className="font-[family-name:var(--font-cormorant)] text-sm text-gray-500 mb-8">
                            주문 확인 이메일이 발송되었습니다.
                        </p>

                        <div className="flex gap-4 justify-center">
                            <Link href="/orders">
                                <button className="px-8 py-3 bg-[#E85D04] text-white font-[family-name:var(--font-cormorant)] font-semibold tracking-wider rounded-full hover:bg-[#D04D03] transition-colors">
                                    주문내역 확인
                                </button>
                            </Link>
                            <Link href="/collection">
                                <button className="px-8 py-3 border border-gray-300 text-gray-700 font-[family-name:var(--font-cormorant)] font-semibold tracking-wider rounded-full hover:bg-gray-50 transition-colors">
                                    쇼핑 계속하기
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-gray-900 font-[family-name:var(--font-cormorant)] text-xl">Loading...</div></div>}>
            <PaymentSuccessContent />
        </Suspense>
    )
}
