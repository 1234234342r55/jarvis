'use client'
import Link from 'next/link'
import { Waves } from './Waves'

export function Hero() {
    return (
        <section className="relative w-full h-screen overflow-hidden">
            <Waves
                strokeColor="#E85D04"
                backgroundColor="#0a0604"
                pointerSize={0.5}
            />

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
                <div className="text-center text-white max-w-4xl">
                    {/* Brand Logo as SVG Typography */}
                    <div className="mb-8">
                        <h1 className="font-[family-name:var(--font-cormorant)] text-6xl md:text-7xl font-light tracking-[0.2em] text-white">
                            UNORMA
                        </h1>
                    </div>

                    {/* Decorative SVG Line */}
                    <div className="mb-6">
                        <svg
                            width="120"
                            height="2"
                            viewBox="0 0 120 2"
                            className="mx-auto"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <line
                                x1="0"
                                y1="1"
                                x2="120"
                                y2="1"
                                stroke="white"
                                strokeWidth="1"
                                opacity="0.6"
                            />
                        </svg>
                    </div>

                    {/* Tagline */}
                    <div className="mb-4">
                        <p className="font-[family-name:var(--font-cormorant)] text-lg md:text-xl tracking-wider font-normal opacity-90 mb-2">
                            자리를 만드는 러그
                        </p>
                        <p className="font-[family-name:var(--font-cormorant)] text-lg md:text-xl tracking-wider font-normal opacity-90">
                            A Rug That Creates Space
                        </p>
                    </div>

                    {/* CTA Button */}
                    <div className="mt-12">
                        <Link href="/collection">
                            <button className="group relative px-8 py-3 overflow-hidden">
                                <span className="relative z-10 text-white tracking-widest text-sm font-light font-[family-name:var(--font-cormorant)]">
                                    EXPLORE COLLECTION
                                </span>
                                <svg
                                    className="absolute inset-0 w-full h-full"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <rect
                                        x="0"
                                        y="0"
                                        width="100%"
                                        height="100%"
                                        fill="none"
                                        stroke="white"
                                        strokeWidth="1"
                                        opacity="0.6"
                                        className="group-hover:opacity-100 transition-opacity"
                                    />
                                </svg>
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-white text-xs tracking-widest opacity-60 font-[family-name:var(--font-cormorant)]">SCROLL</span>
                        <svg
                            width="24"
                            height="36"
                            viewBox="0 0 24 36"
                            className="animate-bounce"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <rect
                                x="1"
                                y="1"
                                width="22"
                                height="34"
                                rx="11"
                                fill="none"
                                stroke="white"
                                strokeWidth="1"
                                opacity="0.6"
                            />
                            <circle
                                cx="12"
                                cy="10"
                                r="2"
                                fill="white"
                                opacity="0.6"
                            />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Decorative Corner SVG Elements */}
            <svg
                className="absolute top-0 left-0 w-32 h-32 opacity-20"
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M 0 0 L 100 0 L 100 20 L 20 20 L 20 100 L 0 100 Z"
                    fill="white"
                    opacity="0.1"
                />
            </svg>

            <svg
                className="absolute bottom-0 right-0 w-32 h-32 opacity-20"
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M 100 100 L 0 100 L 0 80 L 80 80 L 80 0 L 100 0 Z"
                    fill="white"
                    opacity="0.1"
                />
            </svg>
        </section>
    )
}
