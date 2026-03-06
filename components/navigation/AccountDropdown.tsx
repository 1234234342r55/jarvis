'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { User, ShoppingBag, Package, LogOut, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AccountDropdownProps {
    username: string
    onLogout: () => void
    activeTab: string
    setActiveTab: (tab: string) => void
}

const menuItems = [
    { name: 'My Page', url: '/mypage', icon: User },
    { name: 'Orders', url: '/orders', icon: Package },
    { name: 'Cart', url: '/cart', icon: ShoppingBag },
]

export function AccountDropdown({ username, onLogout, activeTab, setActiveTab }: AccountDropdownProps) {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // 외부 클릭 감지
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    return (
        <div ref={dropdownRef} className="relative">
            {/* Account Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "relative flex items-center gap-2 transition-colors font-[family-name:var(--font-cormorant)] font-semibold px-2 py-0.5 rounded-full",
                    isOpen ? "text-[#E85D04]" : "text-white/80 hover:text-[#E85D04]"
                )}
            >
                <User size={18} strokeWidth={2.5} />
                <span className="hidden md:inline tracking-[0.2em] uppercase text-sm">
                    {username}
                </span>
                <ChevronDown
                    size={14}
                    className={cn(
                        "transition-transform duration-200",
                        isOpen && "rotate-180"
                    )}
                />
                {activeTab === 'Login' && (
                    <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 w-full bg-black/30 rounded-full -z-10"
                        initial={false}
                        transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 30,
                        }}
                    >
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#E85D04] rounded-t-full">
                            <div className="absolute w-12 h-6 bg-[#E85D04]/30 rounded-full blur-md -top-2 -left-2" />
                            <div className="absolute w-8 h-6 bg-[#E85D04]/30 rounded-full blur-md -top-1" />
                            <div className="absolute w-4 h-4 bg-[#E85D04]/30 rounded-full blur-sm top-0 left-2" />
                        </div>
                    </motion.div>
                )}
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full right-0 mt-2 w-48 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="py-2">
                            {menuItems.map((item) => {
                                const Icon = item.icon
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.url}
                                        onClick={() => {
                                            setIsOpen(false)
                                            setActiveTab(item.name)
                                        }}
                                        className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-[#E85D04] hover:bg-white/5 transition-colors font-[family-name:var(--font-cormorant)]"
                                    >
                                        <Icon size={18} strokeWidth={2} />
                                        <span>{item.name}</span>
                                    </Link>
                                )
                            })}

                            {/* Divider */}
                            <div className="my-2 h-px bg-white/10" />

                            {/* Logout */}
                            <button
                                onClick={() => {
                                    onLogout()
                                    setIsOpen(false)
                                }}
                                className="flex items-center gap-3 w-full px-4 py-3 text-white/80 hover:text-[#E85D04] hover:bg-white/5 transition-colors font-[family-name:var(--font-cormorant)]"
                            >
                                <LogOut size={18} strokeWidth={2} />
                                <span>Logout</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
