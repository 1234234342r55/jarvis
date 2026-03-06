'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu as MenuIcon, X } from 'lucide-react'
import { IMenu } from './Menu'

interface MobileMenuProps {
    list: IMenu[]
    user: any
    loading: boolean
    signOut: () => void
}

export function MobileMenu({ list, user, loading, signOut }: MobileMenuProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            {/* Hamburger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative z-[60] p-2 text-white hover:text-[#E85D04] transition-colors"
                aria-label="Toggle menu"
            >
                {isOpen ? (
                    <X className="w-6 h-6" />
                ) : (
                    <MenuIcon className="w-6 h-6" />
                )}
            </button>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55]"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Menu Panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed top-0 right-0 bottom-0 w-80 bg-black/95 backdrop-blur-lg z-[60] shadow-2xl"
                        >
                            <div className="flex flex-col h-full p-8 pt-20">
                                {/* Menu Items */}
                                <nav className="flex-1">
                                    <ul className="space-y-6">
                                        {list.map((item) => (
                                            <li key={item.id}>
                                                <Link
                                                    href={item.url}
                                                    onClick={() => setIsOpen(false)}
                                                    className="block font-[family-name:var(--font-cormorant)] text-2xl font-semibold tracking-[0.2em] uppercase text-white hover:text-[#E85D04] transition-colors"
                                                >
                                                    {item.title}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>

                                {/* Auth Section */}
                                <div className="border-t border-white/10 pt-6 mt-6">
                                    {!loading && (
                                        user ? (
                                            <div className="space-y-4">
                                                <p className="font-[family-name:var(--font-cormorant)] text-lg text-white/70">
                                                    {user.email?.split('@')[0]}
                                                </p>
                                                <button
                                                    onClick={() => {
                                                        signOut()
                                                        setIsOpen(false)
                                                    }}
                                                    className="w-full py-3 px-6 font-[family-name:var(--font-cormorant)] text-lg font-semibold tracking-wider uppercase text-white border border-white/20 rounded hover:bg-white/10 transition-colors"
                                                >
                                                    Logout
                                                </button>
                                            </div>
                                        ) : (
                                            <Link
                                                href="/auth"
                                                onClick={() => setIsOpen(false)}
                                                className="block w-full py-3 px-6 font-[family-name:var(--font-cormorant)] text-lg font-semibold tracking-wider uppercase text-center text-white bg-[#E85D04] rounded hover:bg-[#D04D03] transition-colors"
                                            >
                                                Login
                                            </Link>
                                        )
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
