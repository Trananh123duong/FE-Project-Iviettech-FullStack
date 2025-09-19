export const timeAgo = (dateString) => {
  if (!dateString) return ''
  const diff = Date.now() - new Date(dateString).getTime()
  const s = Math.floor(diff / 1000)
  const m = Math.floor(s / 60)
  const h = Math.floor(m / 60)
  const d = Math.floor(h / 24)
  if (d > 0) return `${d} ngày trước`
  if (h > 0) return `${h} giờ trước`
  if (m > 0) return `${m} phút trước`
  return `${s} giây trước`
}

export const fmtDT = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}