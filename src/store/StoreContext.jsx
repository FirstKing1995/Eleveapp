import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { shortId } from '../lib/utils.js'
import { displayPrice, getService } from '../config/services.js'

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
  const [hasDiagnostic, setHasDiagnostic] = useState(() => loadJSON('elev_hasdiag', false))
  const [diagnostic, setDiagnostic] = useState(() => loadJSON('elev_diag', null))
  const [lead, setLead] = useState(() => loadJSON('elev_lead', null))
  const [cart, setCart] = useState(() => loadJSON('elev_cart', []))

  const [seller, setSeller] = useState(() => loadJSON('elev_seller', null))
  const [admin, setAdmin] = useState(() => loadJSON('elev_admin', null))

  const [toasts, setToasts] = useState([])

  // Captura ?ref=CODIGO do vendedor (funciona com HashRouter)
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const ref = params.get('ref')
    if (ref && ref !== sellerRef) {
      setSellerRef(ref)
      localStorage.setItem('elev_ref', ref)
    }
  }, [location.search, sellerRef])

  // Persistencia
  useEffect(() => localStorage.setItem('elev_hasdiag', JSON.stringify(hasDiagnostic)), [hasDiagnostic])
  useEffect(() => localStorage.setItem('elev_diag', JSON.stringify(diagnostic)), [diagnostic])
  useEffect(() => localStorage.setItem('elev_lead', JSON.stringify(lead)), [lead])
  useEffect(() => localStorage.setItem('elev_cart', JSON.stringify(cart)), [cart])

  const toast = useCallback((msg, tone = 'default') => {
    const id = shortId()
    setToasts((t) => [...t, { id, msg, tone }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3400)
  }, [])

  // ---------- Diagnostico ----------
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
    (id) => {
      setCart((c) => (c.includes(id) ? c : [...c, id]))
      const s = getService(id)
      if (s) toast(`${s.name} adicionado ao carrinho.`, 'primary')
    },
    [toast],
  )
  const removeFromCart = useCallback((id) => setCart((c) => c.filter((x) => x !== id)), [])
  const clearCart = useCallback(() => setCart([]), [])
  const setCartItems = useCallback((ids) => setCart(ids), [])

  const cartServices = cart.map(getService).filter(Boolean)
  const cartTotal = cartServices.reduce((sum, s) => sum + priceOf(s), 0)

  // ---------- Sessoes ----------
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
    cartServices,
    cartTotal,
    priceOf,
    addToCart,
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
