'use client'
import { Waves } from '@/components/main/hero/Waves'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'

export default function AuthPage() {
    const supabase = createClient()
    const router = useRouter()
    const { user, loading } = useAuth()

    // 이미 로그인된 경우 홈으로 리디렉션
    useEffect(() => {
        if (!loading && user) {
            router.push('/')
        }
    }, [user, loading, router])

    const signInWithGoogle = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        })
    }

    const signInWithKakao = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'kakao',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        })
    }

    const signInWithApple = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'apple',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        })
    }

    if (loading) return null

    return (
        <section className="relative w-full h-screen overflow-hidden">
            <Waves
                strokeColor="#E85D04"
                backgroundColor="#0a0604"
                pointerSize={0.5}
            />

            <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
                <div className="text-center text-white w-full max-w-sm">

                    {/* Brand Logo */}
                    <div className="mb-8">
                        <h1 className="font-[family-name:var(--font-cormorant)] text-6xl md:text-7xl font-light tracking-[0.2em] text-white">
                            UNORMA
                        </h1>
                    </div>

                    {/* Decorative Line */}
                    <div className="mb-10">
                        <svg width="120" height="2" viewBox="0 0 120 2" className="mx-auto" xmlns="http://www.w3.org/2000/svg">
                            <line x1="0" y1="1" x2="120" y2="1" stroke="white" strokeWidth="1" opacity="0.6" />
                        </svg>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="flex flex-col gap-3">

                        {/* Kakao */}
                        <button
                            onClick={signInWithKakao}
                            className="flex items-center justify-center gap-3 w-full py-4 bg-[#FEE500] hover:bg-[#F5DC00] transition-colors duration-200 cursor-pointer"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.636 5.073 4.118 6.51L5.1 21l4.627-3.072c.75.123 1.52.188 2.273.188 5.523 0 10-3.477 10-7.8S17.523 3 12 3z"
                                    fill="#191919"
                                />
                            </svg>
                            <span className="text-[#191919] font-medium text-sm tracking-wider font-[family-name:var(--font-cormorant)]">
                                Continue with Kakao
                            </span>
                        </button>

                        {/* Google */}
                        <button
                            onClick={signInWithGoogle}
                            className="flex items-center justify-center gap-3 w-full py-4 bg-white hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            <span className="text-[#191919] font-medium text-sm tracking-wider font-[family-name:var(--font-cormorant)]">
                                Continue with Google
                            </span>
                        </button>

                        {/* Apple */}
                        <button
                            onClick={signInWithApple}
                            className="group relative flex items-center justify-center gap-3 w-full py-4 overflow-hidden cursor-pointer"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.42c1.3.07 2.2.74 2.96.8.95-.18 1.86-.89 2.83-.95 1.19-.08 2.3.44 3.1 1.36-2.78 1.74-2.25 5.52.49 6.61-.57 1.65-1.38 3.27-2.38 4.04zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
                                    fill="white"
                                />
                            </svg>
                            <span className="relative z-10 text-white font-medium text-sm tracking-wider font-[family-name:var(--font-cormorant)]">
                                Continue with Apple
                            </span>
                            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                                <rect
                                    x="0" y="0" width="100%" height="100%"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="1"
                                    opacity="0.4"
                                    className="group-hover:opacity-80 transition-opacity"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Decorative Corner SVG Elements */}
            <svg className="absolute top-0 left-0 w-32 h-32 opacity-20 z-10" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <path d="M 0 0 L 100 0 L 100 20 L 20 20 L 20 100 L 0 100 Z" fill="white" opacity="0.1" />
            </svg>
            <svg className="absolute bottom-0 right-0 w-32 h-32 opacity-20 z-10" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <path d="M 100 100 L 0 100 L 0 80 L 80 80 L 80 0 L 100 0 Z" fill="white" opacity="0.1" />
            </svg>
        </section>
    )
}
