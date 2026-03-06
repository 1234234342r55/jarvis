'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Waves } from '@/components/main/hero/Waves'
import { XCircle } from 'lucide-react'
import Link from 'next/link'

function PaymentFailContent() {
    const searchParams = useSearchParams()
    const message = searchParams.get('message') || '결제 처리 중 오류가 발생했습니다.'

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
                        <XCircle className="w-20 h-20 mx-auto mb-6 text-red-500" strokeWidth={1.5} />

                        <h1 className="font-[family-name:var(--font-cormorant)] text-4xl font-bold mb-4 text-gray-900">
                            결제 실패
                        </h1>

                        <p className="font-[family-name:var(--font-cormorant)] text-lg text-gray-600 mb-4">
                            {message}
                        </p>

                        <p className="font-[family-name:var(--font-cormorant)] text-sm text-gray-500 mb-8">
                            다시 시도해주시거나 문제가 계속되면 고객센터로 문의해주세요.
                        </p>

                        <div className="flex gap-4 justify-center">
                            <Link href="/cart">
                                <button className="px-8 py-3 bg-[#E85D04] text-white font-[family-name:var(--font-cormorant)] font-semibold tracking-wider rounded-full hover:bg-[#D04D03] transition-colors">
                                    장바구니로 돌아가기
                                </button>
                            </Link>
                            <Link href="/contact">
                                <button className="px-8 py-3 border border-gray-300 text-gray-700 font-[family-name:var(--font-cormorant)] font-semibold tracking-wider rounded-full hover:bg-gray-50 transition-colors">
                                    고객센터 문의
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function PaymentFailPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-gray-900 font-[family-name:var(--font-cormorant)] text-xl">Loading...</div></div>}>
            <PaymentFailContent />
        </Suspense>
    )
}
