'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Grid, BookOpen, Mail, User, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import { SearchModal } from './SearchModal'
import { AccountDropdown } from './AccountDropdown'
import { products } from '@/data/products'

const menuItems = [
    { name: 'Home', url: '/', icon: Home },
    { name: 'Collection', url: '/collection', icon: Grid },
    { name: 'About', url: '/about', icon: BookOpen },
    { name: 'Contact', url: '/contact', icon: Mail },
]

export function Navbar() {
    const { user, loading, signOut } = useAuth()
    const pathname = usePathname()
    const [activeTab, setActiveTab] = useState('Home')
    const [isSearchOpen, setIsSearchOpen] = useState(false)

    // URL이 변경될 때마다 activeTab 업데이트
    useEffect(() => {
        if (pathname === '/auth') {
            setActiveTab('Login')
        } else {
            const currentItem = menuItems.find(item => item.url === pathname)
            if (currentItem) {
                setActiveTab(currentItem.name)
            }
        }
    }, [pathname])

    return (
        <>
            <div className="fixed top-0 left-1/2 -translate-x-1/2 z-50 pt-6">
                <div className="flex items-center gap-3">
                    {/* Main Menu */}
                    <div className="flex items-center gap-2 bg-black/30 border border-white/10 backdrop-blur-lg py-2 px-2 rounded-full shadow-lg">
                        {menuItems.map((item) => {
                            const Icon = item.icon
                            const isActive = activeTab === item.name

                            return (
                                <Link
                                    key={item.name}
                                    href={item.url}
                                    onClick={() => setActiveTab(item.name)}
                                    className={cn(
                                        'relative cursor-pointer text-sm font-[family-name:var(--font-cormorant)] font-semibold px-6 py-2.5 rounded-full transition-all duration-300',
                                        'text-white/80 hover:text-[#E85D04]',
                                        isActive && 'text-[#E85D04]'
                                    )}
                                >
                                    <span className="hidden md:inline tracking-[0.2em] uppercase">
                                        {item.name}
                                    </span>
                                    <span className="md:hidden">
                                        <Icon size={18} strokeWidth={2.5} />
                                    </span>
                                    {isActive && (
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
                                </Link>
                            )
                        })}
                    </div>

                    {/* Search Button */}
                    <div className="bg-black/30 border border-white/10 backdrop-blur-lg py-2 px-4 rounded-full shadow-lg">
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="flex items-center gap-2 text-white/80 hover:text-[#E85D04] transition-colors"
                        >
                            <Search size={18} strokeWidth={2.5} />
                        </button>
                    </div>

                    {/* Auth Section */}
                    {!loading && (
                        <div className="bg-black/30 border border-white/10 backdrop-blur-lg py-2 px-4 rounded-full shadow-lg">
                            {user ? (
                                <AccountDropdown
                                    username={user.email?.split('@')[0] || 'User'}
                                    onLogout={signOut}
                                    activeTab={activeTab}
                                    setActiveTab={setActiveTab}
                                />
                            ) : (
                                <Link
                                    href="/auth"
                                    onClick={() => setActiveTab('Login')}
                                    className={cn(
                                        "relative flex items-center gap-2 transition-colors font-[family-name:var(--font-cormorant)] font-semibold px-2 py-0.5 rounded-full",
                                        activeTab === 'Login' ? "text-[#E85D04]" : "text-white/80 hover:text-[#E85D04]"
                                    )}
                                >
                                    <User size={18} strokeWidth={2.5} />
                                    <span className="hidden md:inline tracking-[0.2em] uppercase text-sm">
                                        Login
                                    </span>
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
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Search Modal */}
            <SearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                products={products}
            />
        </>
    )
}
