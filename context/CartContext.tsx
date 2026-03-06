'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface CartItem {
    id: string
    name: string
    price: number
    quantity: number
    image: string
    size?: string
    color?: string
}

interface CartContextType {
    cart: CartItem[]
    addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
    removeFromCart: (itemId: string) => void
    updateQuantity: (itemId: string, quantity: number) => void
    clearCart: () => void
    getCartTotal: () => number
    getCartCount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('unorma_cart')
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart))
            } catch (error) {
                console.error('Failed to load cart:', error)
            }
        }
        setIsLoaded(true)
    }, [])

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('unorma_cart', JSON.stringify(cart))
        }
    }, [cart, isLoaded])

    const addToCart = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
        setCart(prev => {
            const existingItem = prev.find(i => i.id === item.id)
            if (existingItem) {
                return prev.map(i =>
                    i.id === item.id
                        ? { ...i, quantity: i.quantity + (item.quantity || 1) }
                        : i
                )
            }
            return [...prev, { ...item, quantity: item.quantity || 1 }]
        })
    }

    const removeFromCart = (itemId: string) => {
        setCart(prev => prev.filter(item => item.id !== itemId))
    }

    const updateQuantity = (itemId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(itemId)
            return
        }
        setCart(prev =>
            prev.map(item =>
                item.id === itemId ? { ...item, quantity } : item
            )
        )
    }

    const clearCart = () => {
        setCart([])
    }

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0)
    }

    const getCartCount = () => {
        return cart.reduce((count, item) => count + item.quantity, 0)
    }

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getCartTotal,
                getCartCount,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}
