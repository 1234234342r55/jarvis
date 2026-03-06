'use client'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

export default function StoryPage() {
    const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set())
    const [language, setLanguage] = useState<'ko' | 'en'>('ko')
    const sectionRefs = useRef<(HTMLElement | null)[]>([])

    const content = {
        ko: {
            title: 'OUR STORY',
            subtitle: '러그를 넘어선 예술의 여정',
            sections: [
                {
                    title: '시작',
                    lines: [
                        '러그는 왜 항상 깔아야만 할까?',
                        '바닥 위에 놓여, 그 자체로 존재하는 러그.',
                        '우리는 러그의 역할을 다시 정의합니다.'
                    ]
                },
                {
                    title: '철학',
                    lines: [
                        '단순한 인테리어 소품이 아닌, 공간을 완성하는 예술 작품.',
                        '전통적인 수공예 기법에 현대적 감각을 더한 러그.',
                        '각 작품은 공간 속에서 고유한 이야기를 전합니다.'
                    ]
                },
                {
                    title: '비전',
                    lines: [
                        '바닥 위에 놓인 하나의 오브제로서 특별한 자리를 만듭니다.',
                        '깔지 않기에 더욱 특별한 러그.',
                        '당신의 공간에 UNORMA가 만드는 자리를 경험하세요.'
                    ]
                }
            ]
        },
        en: {
            title: 'OUR STORY',
            subtitle: 'A Journey Beyond Rugs',
            sections: [
                {
                    title: 'Beginning',
                    lines: [
                        'Why must rugs always be laid down?',
                        'Rugs that exist on the floor as objects in their own right.',
                        'We redefine the role of the rug.'
                    ]
                },
                {
                    title: 'Philosophy',
                    lines: [
                        'Not mere accessories, but art pieces that complete a space.',
                        'Traditional craftsmanship meets contemporary sensibility.',
                        'Each piece tells its own story, like a sculpture.'
                    ]
                },
                {
                    title: 'Vision',
                    lines: [
                        'As objects placed on the floor, they create a special place.',
                        'Rugs that are special precisely because they are not laid down.',
                        'Experience the place that UNORMA creates in your space.'
                    ]
                }
            ]
        }
    }

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const index = sectionRefs.current.indexOf(entry.target as HTMLElement)
                    if (index !== -1) {
                        setVisibleSections(prev => {
                            const newSet = new Set(prev)
                            if (entry.isIntersecting) {
                                newSet.add(index)
                            } else {
                                newSet.delete(index)
                            }
                            return newSet
                        })
                    }
                })
            },
            { threshold: 0.2, rootMargin: '-50px' }
        )

        sectionRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref)
        })

        return () => observer.disconnect()
    }, [])

    return (
        <div className="relative min-h-screen bg-white">
            {/* Language Toggle */}
            <div className="fixed top-24 right-8 z-20">
                <div className="flex gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                    <button
                        onClick={() => setLanguage('ko')}
                        className={`font-[family-name:var(--font-cormorant)] px-3 py-1 rounded-full transition-all ${
                            language === 'ko'
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        KR
                    </button>
                    <button
                        onClick={() => setLanguage('en')}
                        className={`font-[family-name:var(--font-cormorant)] px-3 py-1 rounded-full transition-all ${
                            language === 'en'
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        EN
                    </button>
                </div>
            </div>

            {/* Header */}
            <div className="text-center pt-40 pb-20 px-6">
                <h1 className="font-[family-name:var(--font-cormorant)] text-6xl md:text-7xl font-light tracking-[0.2em] mb-4 text-gray-900">
                    {content[language].title}
                </h1>
                <p className="font-[family-name:var(--font-cormorant)] text-lg md:text-xl tracking-[0.2em] font-light text-gray-700">
                    {content[language].subtitle}
                </p>
            </div>

            {/* Story Sections - Alternating Layout */}
            <div className="space-y-64 pb-32">
                {/* 시작 - Image Left, Text Right */}
                <section
                    ref={(el) => { sectionRefs.current[0] = el }}
                    className="grid grid-cols-1 md:grid-cols-[500px_auto] gap-8 md:gap-20 items-center pl-12 py-20"
                >
                    <div className={`relative w-full h-[300px] md:h-[400px] overflow-hidden rounded-lg shadow-lg transition-all duration-1000 ${
                        visibleSections.has(0)
                            ? 'opacity-100 translate-x-0'
                            : 'opacity-0 -translate-x-20'
                    }`}>
                        <Image
                            src="/images/rug-1.png"
                            alt="UNORMA 시작"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className={`space-y-6 pl-8 md:pl-0 transition-all duration-1000 delay-200 ${
                        visibleSections.has(0)
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-10'
                    }`}>
                        <h2 className="font-[family-name:var(--font-cormorant)] text-xl md:text-2xl font-light tracking-wider text-gray-900 mb-6">
                            {content[language].sections[0].title}
                        </h2>
                        <div className="font-[family-name:var(--font-cormorant)] text-base md:text-lg leading-loose tracking-wider text-gray-800 space-y-3">
                            {content[language].sections[0].lines.map((line, i) => (
                                <p key={i}>{line}</p>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 철학 - Text Left, Image Right */}
                <section
                    ref={(el) => { sectionRefs.current[1] = el }}
                    className="grid grid-cols-1 md:grid-cols-[auto_500px] gap-8 md:gap-20 items-center justify-end pr-12 py-20"
                >
                    <div className={`space-y-6 pl-8 md:pl-0 transition-all duration-1000 delay-200 ${
                        visibleSections.has(1)
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-10'
                    }`}>
                        <h2 className="font-[family-name:var(--font-cormorant)] text-xl md:text-2xl font-light tracking-wider text-gray-900 mb-6">
                            {content[language].sections[1].title}
                        </h2>
                        <div className="font-[family-name:var(--font-cormorant)] text-base md:text-lg leading-loose tracking-wider text-gray-800 space-y-3">
                            {content[language].sections[1].lines.map((line, i) => (
                                <p key={i}>{line}</p>
                            ))}
                        </div>
                    </div>
                    <div className={`relative w-full h-[300px] md:h-[400px] overflow-hidden rounded-lg shadow-lg transition-all duration-1000 ${
                        visibleSections.has(1)
                            ? 'opacity-100 translate-x-0'
                            : 'opacity-0 translate-x-20'
                    }`}>
                        <Image
                            src="/images/rug-1.png"
                            alt="UNORMA 철학"
                            fill
                            className="object-cover"
                        />
                    </div>
                </section>

                {/* 비전 - Image Left, Text Right */}
                <section
                    ref={(el) => { sectionRefs.current[2] = el }}
                    className="grid grid-cols-1 md:grid-cols-[500px_auto] gap-8 md:gap-20 items-center pl-12 py-20"
                >
                    <div className={`relative w-full h-[300px] md:h-[400px] overflow-hidden rounded-lg shadow-lg transition-all duration-1000 ${
                        visibleSections.has(2)
                            ? 'opacity-100 translate-x-0'
                            : 'opacity-0 -translate-x-20'
                    }`}>
                        <Image
                            src="/images/rug-1.png"
                            alt="UNORMA 비전"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className={`space-y-6 pl-8 md:pl-0 transition-all duration-1000 delay-200 ${
                        visibleSections.has(2)
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-10'
                    }`}>
                        <h2 className="font-[family-name:var(--font-cormorant)] text-xl md:text-2xl font-light tracking-wider text-gray-900 mb-6">
                            {content[language].sections[2].title}
                        </h2>
                        <div className="font-[family-name:var(--font-cormorant)] text-base md:text-lg leading-loose tracking-wider text-gray-800 space-y-3">
                            {content[language].sections[2].lines.map((line, i) => (
                                <p key={i}>{line}</p>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}
