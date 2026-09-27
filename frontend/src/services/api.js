import { fallbackProducts } from '../data/products'

export const API = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'
export const STORE_KEY = 'shopvibe-session'

export async function apiRequest(path, options = {}, token = '') {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })

  if (!response.ok) {
    const message = await response.text().catch(() => '')
    throw new Error(message || `Request failed with status ${response.status}`)
  }

  if (response.status === 204) return null
  const text = await response.text()
  return text ? JSON.parse(text) : null
}

export function loadRazorpayScript() {
  if (window.Razorpay) return Promise.resolve()
  const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')
  if (existingScript) {
    return new Promise((resolve, reject) => {
      existingScript.addEventListener('load', resolve, { once: true })
      existingScript.addEventListener('error', reject, { once: true })
    })
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = resolve
    script.onerror = reject
    document.body.appendChild(script)
  })
}

export function normalizeProduct(product = {}) {
  return {
    ...product,
    id: Number(product.id),
    price: Number(product.price || 0),
    stockQuantity: Number(product.stockQuantity || 0),
    active: product.active !== false,
    imageUrl: product.imageUrl || fallbackProducts[0].imageUrl,
    category: product.category || 'Featured',
  }
}

export function normalizeCartItem(item = {}) {
  const product = normalizeProduct(item.product || {})
  const quantity = Number(item.quantity || 1)
  const price = Number(item.price || product.price * quantity || 0)

  return {
    ...item,
    productId: Number(item.productId || product.id),
    quantity,
    price,
    product: {
      ...product,
      name: product.name || item.name || 'ShopVibe item',
      imageUrl: product.imageUrl || item.imageUrl,
    },
  }
}
