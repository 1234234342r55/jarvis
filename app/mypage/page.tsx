'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Waves } from '@/components/main/hero/Waves'
import { User, Mail, Calendar } from 'lucide-react'

export default function MyPage() {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !user) {
            router.push('/auth')
        }
    }, [user, loading, router])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-white font-[family-name:var(--font-cormorant)] text-xl">
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
                <h1 className="font-[family-name:var(--font-cormorant)] text-5xl font-bold tracking-wider text-center mb-16 text-gray-900">
                    MY PAGE
                </h1>

                <div className="max-w-2xl mx-auto">
                    {/* Profile Card */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-8 shadow-lg">
                        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                            <div className="w-16 h-16 rounded-full bg-[#E85D04] flex items-center justify-center">
                                <User className="w-8 h-8 text-white" strokeWidth={2} />
                            </div>
                            <div>
                                <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold text-gray-900">
                                    {user.email?.split('@')[0]}
                                </h2>
                                <p className="text-gray-500 font-[family-name:var(--font-cormorant)]">
                                    Member
                                </p>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-gray-700">
                                <Mail className="w-5 h-5 text-[#E85D04]" strokeWidth={2} />
                                <span className="font-[family-name:var(--font-cormorant)]">
                                    {user.email}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-700">
                                <Calendar className="w-5 h-5 text-[#E85D04]" strokeWidth={2} />
                                <span className="font-[family-name:var(--font-cormorant)]">
                                    Member since: {new Date(user.created_at || '').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </span>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h3 className="font-[family-name:var(--font-cormorant)] text-lg font-semibold mb-4 text-gray-900">
                                Quick Links
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <a
                                    href="/orders"
                                    className="p-4 border border-gray-200 rounded-lg hover:border-[#E85D04] hover:bg-[#E85D04]/5 transition-colors text-center font-[family-name:var(--font-cormorant)] text-gray-700"
                                >
                                    Orders
                                </a>
                                <a
                                    href="/cart"
                                    className="p-4 border border-gray-200 rounded-lg hover:border-[#E85D04] hover:bg-[#E85D04]/5 transition-colors text-center font-[family-name:var(--font-cormorant)] text-gray-700"
                                >
                                    Cart
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
