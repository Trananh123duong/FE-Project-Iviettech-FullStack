import { ROUTES } from '@constants/routes'
import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

export default function AdOverlay() {
   const { pathname } = useLocation()
  const profile = useSelector((s) => s.auth.myProfile.data)

  // VIP nếu có cờ isVip hoặc còn hạn vip_expires_at
  const isVip =
    !!profile?.isVip ||
    (!!profile?.vip_expires_at && new Date(profile.vip_expires_at) > new Date())

  const isHome = pathname === ROUTES.USER.HOME

  // Tránh mở lại nhiều lần cho cùng 1 path trong vòng đời component
  const lastPathRef = useRef(null)

  useEffect(() => {
    if (isHome || isVip) {
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
  }, [pathname, isVip, isHome])

  return null
}
