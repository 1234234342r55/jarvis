'use client'
import { Waves } from '@/components/main/hero/Waves'
import { Mail, Instagram, MapPin } from 'lucide-react'

export default function ContactPage() {
    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Waves Background - White with Light Gray */}
            <Waves
                strokeColor="#d0d0d0"
                backgroundColor="#ffffff"
                pointerSize={0.5}
            />

            {/* Contact Content */}
            <div className="relative z-10 container mx-auto px-6 pt-32 pb-20 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-20">
                    <h1 className="font-[family-name:var(--font-cormorant)] text-5xl md:text-7xl font-light tracking-[0.2em] mb-4 text-gray-900">
                        CONTACT
                    </h1>
                    <p className="font-[family-name:var(--font-cormorant)] text-lg md:text-xl tracking-wider text-gray-700">
                        당신의 공간을 위한 특별한 작품
                    </p>
                </div>

                {/* Contact Information */}
                <div className="space-y-12 max-w-2xl mx-auto">
                    {/* Email */}
                    <div className="flex items-start gap-6 group">
                        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                            <Mail className="w-6 h-6 text-[#E85D04] group-hover:scale-110 transition-transform" />
                        </div>
                        <div>
                            <h3 className="font-[family-name:var(--font-cormorant)] text-2xl font-light tracking-wider mb-2 text-gray-900">
                                이메일
                            </h3>
                            <a
                                href="mailto:unorma1717@gmail.com"
                                className="font-[family-name:var(--font-cormorant)] text-lg tracking-wide text-gray-700 hover:text-[#E85D04] transition-colors"
                            >
                                unorma1717@gmail.com
                            </a>
                        </div>
                    </div>

                    {/* Instagram */}
                    <div className="flex items-start gap-6 group">
                        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                            <Instagram className="w-6 h-6 text-[#E85D04] group-hover:scale-110 transition-transform" />
                        </div>
                        <div>
                            <h3 className="font-[family-name:var(--font-cormorant)] text-2xl font-light tracking-wider mb-2 text-gray-900">
                                인스타그램
                            </h3>
                            <a
                                href="https://instagram.com/_unorma"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-[family-name:var(--font-cormorant)] text-lg tracking-wide text-gray-700 hover:text-[#E85D04] transition-colors"
                            >
                                @_unorma
                            </a>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-6 group">
                        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                            <MapPin className="w-6 h-6 text-[#E85D04] group-hover:scale-110 transition-transform" />
                        </div>
                        <div>
                            <h3 className="font-[family-name:var(--font-cormorant)] text-2xl font-light tracking-wider mb-2 text-gray-900">
                                쇼룸
                            </h3>
                            <p className="font-[family-name:var(--font-cormorant)] text-lg tracking-wide text-gray-700">
                                서울특별시 강남구<br />
                                사전 예약제로 운영됩니다
                            </p>
                        </div>
                    </div>
                </div>

                {/* Message */}
                <div className="mt-20 text-center">
                    <p className="font-[family-name:var(--font-cormorant)] text-xl md:text-2xl font-light tracking-wider text-gray-700">
                        문의사항이 있으시면<br className="md:hidden" />
                        언제든 연락주세요
                    </p>
                </div>
            </div>
        </div>
    )
}
