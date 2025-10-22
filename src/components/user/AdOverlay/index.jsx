import { ROUTES } from '@constants/routes'
import { useEffect, useMemo, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

export default function AdOverlay() {
  const { pathname } = useLocation()
  const profile = useSelector((s) => s.auth.myProfile.data)

  // VIP nếu có cờ isVip hoặc còn hạn vip_expires_at
  let isVip = false

  if (profile) {
    if (profile.isVip) {
      isVip = true
    }
    else if (profile.vip_expires_at) {
      const expiresAt = new Date(profile.vip_expires_at)
      const now = new Date()
      if (expiresAt > now) {
        isVip = true
      }
    }
  }

  // Các trang không hiện quảng cáo: home, login, register, profile
  const adExemptPaths = useMemo(
    () =>
      new Set([
        ROUTES.USER.HOME,
        ROUTES.AUTH.LOGIN,
        ROUTES.AUTH.REGISTER,
        ROUTES.USER.PROFILE,
      ]),
    []
  )
  const isAdExempt = adExemptPaths.has(pathname)

  // Tránh mở lại nhiều lần cho cùng 1 path trong vòng đời component
  const lastPathRef = useRef(null)

  useEffect(() => {
    if (isAdExempt || isVip) {
      lastPathRef.current = pathname
      return
    }
    if (lastPathRef.current === pathname) return
    lastPathRef.current = pathname

    try {
      window.open('https://shopee.vn', '_blank', 'noopener,noreferrer')
    } catch (_) {
      // ignore
    }
  }, [pathname, isVip, isAdExempt])

  return null
}
