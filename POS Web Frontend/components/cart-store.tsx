"use client"
import useSWR, { mutate as globalMutate } from "swr"
import { products } from "@/lib/data"

export type CartItem = { productId: string; quantity: number }
type Cart = CartItem[]

const CART_KEY = "cart-v1"

function readFromLocalStorage(): Cart {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(CART_KEY)
    return raw ? (JSON.parse(raw) as Cart) : []
  } catch {
    return []
  }
}

function writeToLocalStorage(cart: Cart) {
  if (typeof window === "undefined") return
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
}

const fetcher = async () => readFromLocalStorage()

export function useCart() {
  const { data, mutate } = useSWR<Cart>(CART_KEY, fetcher, {
    fallbackData: [],
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })
  const cart = data || []

  const setCart = (next: Cart) => {
    writeToLocalStorage(next)
    mutate(next, false)
    // also update any other subscribers
    globalMutate(CART_KEY, next, false)
  }

  const add = (productId: string, quantity = 1) => {
    const existing = cart.find((i) => i.productId === productId)
    if (existing) {
      const next = cart.map((i) =>
        i.productId === productId ? { ...i, quantity: Math.max(1, i.quantity + quantity) } : i,
      )
      setCart(next)
    } else {
      setCart([...cart, { productId, quantity }])
    }
  }

  const update = (productId: string, quantity: number) => {
    const next = cart.map((i) => (i.productId === productId ? { ...i, quantity } : i)).filter((i) => i.quantity > 0)
    setCart(next)
  }

  const remove = (productId: string) => {
    setCart(cart.filter((i) => i.productId !== productId))
  }

  const clear = () => setCart([])

  const count = cart.reduce((acc, i) => acc + i.quantity, 0)

  const enriched = cart.map((i) => {
    const prod = products.find((p) => p.id === i.productId)
    return prod ? { ...i, product: prod } : i
  }) as Array<CartItem & { product: (typeof products)[number] }>

  const subtotal = enriched.reduce((acc, i) => acc + i.product.price * i.quantity, 0)

  return { cart, add, update, remove, clear, count, subtotal, items: enriched }
}
