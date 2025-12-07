export type Category = {
  id: string
  name: string
  slug: string
}

export type Product = {
  id: string
  slug: string
  name: string
  price: number
  description: string
  stock: number
  category: string // slug reference
  imageUrl: string
  featured?: boolean
  trending?: boolean
}

export const categories: Category[] = [
  { id: "c1", name: "Cases", slug: "cases" },
  { id: "c2", name: "Chargers", slug: "chargers" },
  { id: "c3", name: "Cables", slug: "cables" },
  { id: "c4", name: "Headphones", slug: "headphones" },
  { id: "c5", name: "Power Banks", slug: "power-banks" },
  { id: "c6", name: "Screen Protectors", slug: "screen-protectors" },
  { id: "c7", name: "Mounts", slug: "mounts" },
]

export const products: Product[] = [
  {
    id: "p1",
    slug: "ultra-shield-case-iphone-15",
    name: "Ultra Shield Case (iPhone 15)",
    price: 24.99,
    description: "Slim shock-absorbent case with raised edges for camera and screen.",
    stock: 18,
    category: "cases",
    imageUrl: "/iphone-case-black.jpg",
    featured: true,
    trending: true,
  },
  {
    id: "p2",
    slug: "magcharge-30w-fast-charger",
    name: "MagCharge 30W Fast Charger",
    price: 29.99,
    description: "Compact USB-C PD wall charger for rapid charging.",
    stock: 30,
    category: "chargers",
    imageUrl: "/usb-c-pd-charger.jpg",
    featured: true,
  },
  {
    id: "p3",
    slug: "braided-usb-c-cable-2m",
    name: "Braided USB-C Cable (2m)",
    price: 12.99,
    description: "Durable nylon braided cable with 60W charging support.",
    stock: 50,
    category: "cables",
    imageUrl: "/braided-usb-c-cable.jpg",
    trending: true,
  },
  {
    id: "p4",
    slug: "true-wireless-earbuds-pro",
    name: "True Wireless Earbuds Pro",
    price: 79.0,
    description: "Noise-isolating earbuds with 24h battery and touch controls.",
    stock: 12,
    category: "headphones",
    imageUrl: "/true-wireless-earbuds.jpg",
    featured: true,
    trending: true,
  },
  {
    id: "p5",
    slug: "powerbank-20000mah-quickcharge",
    name: "PowerBank 20000mAh QuickCharge",
    price: 49.99,
    description: "High-capacity portable charger with two USB-A and one USB-C.",
    stock: 22,
    category: "power-banks",
    imageUrl: "/portable-power-bank.png",
  },
  {
    id: "p6",
    slug: "tempered-glass-protector-iphone-15",
    name: "Tempered Glass Protector (iPhone 15)",
    price: 9.99,
    description: "9H hardness, oleophobic coating, easy bubble-free install.",
    stock: 0,
    category: "screen-protectors",
    imageUrl: "/tempered-glass-screen-protector.jpg",
    trending: true,
  },
  {
    id: "p7",
    slug: "car-vent-mount-magnetic",
    name: "Car Vent Mount (Magnetic)",
    price: 19.99,
    description: "Secure magnetic grip with 360° rotation for easy viewing.",
    stock: 40,
    category: "mounts",
    imageUrl: "/car-phone-mount.jpg",
  },
  {
    id: "p8",
    slug: "clear-guard-case-samsung-s24",
    name: "Clear Guard Case (Samsung S24)",
    price: 21.99,
    description: "Crystal-clear anti-yellowing case with reinforced corners.",
    stock: 14,
    category: "cases",
    imageUrl: "/clear-phone-case.jpg",
  },
  {
    id: "p9",
    slug: "dual-port-car-charger-42w",
    name: "Dual-Port Car Charger (42W)",
    price: 17.5,
    description: "Fast charging for two devices simultaneously on the go.",
    stock: 28,
    category: "chargers",
    imageUrl: "/car-charger-usb.jpg",
  },
  {
    id: "p10",
    slug: "aux-audio-cable-1-5m",
    name: "AUX Audio Cable (1.5m)",
    price: 7.99,
    description: "Gold-plated connectors for clear audio with durable design.",
    stock: 60,
    category: "cables",
    imageUrl: "/aux-audio-cable.jpg",
  },
  {
    id: "p11",
    slug: "over-ear-headphones-lite",
    name: "Over-Ear Headphones Lite",
    price: 39.99,
    description: "Comfortable design with balanced sound and foldable frame.",
    stock: 10,
    category: "headphones",
    imageUrl: "/over-ear-headphones.png",
  },
  {
    id: "p12",
    slug: "mini-powerbank-5000mah",
    name: "Mini PowerBank 5000mAh",
    price: 22.0,
    description: "Pocket-sized backup power with USB-C in/out.",
    stock: 34,
    category: "power-banks",
    imageUrl: "/mini-power-bank.jpg",
  },
]

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug)
}

export function getProductsByCategory(categorySlug?: string) {
  if (!categorySlug) return products
  return products.filter((p) => p.category === categorySlug)
}
