import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { shortId } from '../lib/utils.js'
import { displayPrice, getService, isAvulso } from '../config/services.js'
import { computeCart } from '../lib/pricing.js'

const StoreContext = createContext(null)

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function StoreProvider({ children }) {
  const location = useLocation()

  const [sellerRef, setSellerRef] = useState(() => localStorage.getItem('elev_ref') || '')
  const [hasDiagnostic, setHasDiagnostic] = useState(() => loadJSON('elev_hasdiag_v2', false))
  const [diagnostic, setDiagnostic] = useState(() => loadJSON('elev_diag_v2', null))
  const [lead, setLead] = useState(() => loadJSON('elev_lead_v2', null))
  const [cart, setCart] = useState(() => loadJSON('elev_cart_v2', [])) // [{ id, qty }]

  const [seller, setSeller] = useState(() => loadJSON('elev_seller', null))
  const [admin, setAdmin] = useState(() => loadJSON('elev_admin', null))

  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const ref = params.get('ref')
    if (ref && ref !== sellerRef) {
      setSellerRef(ref)
      localStorage.setItem('elev_ref', ref)
    }
  }, [location.search, sellerRef])

  useEffect(() => localStorage.setItem('elev_hasdiag_v2', JSON.stringify(hasDiagnostic)), [hasDiagnostic])
  useEffect(() => localStorage.setItem('elev_diag_v2', JSON.stringify(diagnostic)), [diagnostic])
  useEffect(() => localStorage.setItem('elev_lead_v2', JSON.stringify(lead)), [lead])
  useEffect(() => localStorage.setItem('elev_cart_v2', JSON.stringify(cart)), [cart])

  const toast = useCallback((msg, tone = 'default') => {
    const id = shortId()
    setToasts((t) => [...t, { id, msg, tone }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3400)
  }, [])

  const completeDiagnostic = useCallback((result, leadProfile) => {
    setDiagnostic(result)
    setLead(leadProfile)
    setHasDiagnostic(true)
  }, [])

  const resetDiagnostic = useCallback(() => {
    setDiagnostic(null)
    setHasDiagnostic(false)
  }, [])

  // ---------- Carrinho ----------
  const priceOf = useCallback((service) => displayPrice(service, hasDiagnostic), [hasDiagnostic])

  const addToCart = useCallback(
    (id, qty = 1) => {
      const svc = getService(id)
      if (!svc) return
      setCart((c) => {
        const line = c.find((x) => x.id === id)
        if (line) {
          if (isAvulso(id)) return c.map((x) => (x.id === id ? { ...x, qty: x.qty + qty } : x))
          return c // trilha: não duplica
        }
        return [...c, { id, qty: isAvulso(id) ? qty : 1 }]
      })
      toast(`${svc.name} adicionado ao carrinho.`, 'primary')
    },
    [toast],
  )

  const setQty = useCallback((id, qty) => {
    setCart((c) => c.map((x) => (x.id === id ? { ...x, qty: Math.max(1, qty) } : x)))
  }, [])

  const removeFromCart = useCallback((id) => setCart((c) => c.filter((x) => x.id !== id)), [])
  const clearCart = useCallback(() => setCart([]), [])
  const setCartItems = useCallback((ids) => setCart(ids.map((id) => ({ id, qty: 1 }))), [])

  const cartCount = cart.reduce((a, l) => a + (l.qty || 1), 0)
  const cartPricing = computeCart(cart, hasDiagnostic)

  // ---------- Sessões ----------
  const loginSellerSession = useCallback((s) => {
    setSeller(s)
    localStorage.setItem('elev_seller', JSON.stringify(s))
  }, [])
  const logoutSeller = useCallback(() => {
    setSeller(null)
    localStorage.removeItem('elev_seller')
  }, [])
  const loginAdminSession = useCallback((a) => {
    setAdmin(a)
    localStorage.setItem('elev_admin', JSON.stringify(a))
  }, [])
  const logoutAdmin = useCallback(() => {
    setAdmin(null)
    localStorage.removeItem('elev_admin')
  }, [])

  const value = {
    sellerRef,
    hasDiagnostic,
    diagnostic,
    lead,
    setLead,
    completeDiagnostic,
    resetDiagnostic,
    // cart
    cart,
    cartCount,
    cartPricing,
    priceOf,
    addToCart,
    setQty,
    removeFromCart,
    clearCart,
    setCartItems,
    // sessions
    seller,
    admin,
    loginSellerSession,
    logoutSeller,
    loginAdminSession,
    logoutAdmin,
    // toast
    toasts,
    toast,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore deve ser usado dentro de <StoreProvider>')
  return ctx
}
