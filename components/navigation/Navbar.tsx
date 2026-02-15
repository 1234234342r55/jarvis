'use client'

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-6 py-6">
                <div className="flex items-center justify-between">
                    {/* Left - Empty for now */}
                    <div className="flex-1"></div>

                    {/* Center - Navigation Links */}
                    <div className="flex items-center gap-12 flex-1 justify-center">
                        <a
                            href="#story"
                            className="font-[family-name:var(--font-cormorant)] text-white text-sm tracking-widest uppercase hover:opacity-70 transition-opacity"
                        >
                            Story
                        </a>
                        <a
                            href="#contact"
                            className="font-[family-name:var(--font-cormorant)] text-white text-sm tracking-widest uppercase hover:opacity-70 transition-opacity"
                        >
                            Contact
                        </a>
                    </div>

                    {/* Right - Shop Button */}
                    <div className="flex items-center justify-end flex-1">
                        <button className="group relative px-6 py-2 overflow-hidden">
                            <span className="relative z-10 text-white tracking-widest text-sm font-light font-[family-name:var(--font-cormorant)] uppercase">
                                Shop
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
                    </div>
                </div>
            </div>
        </nav>
    )
}
