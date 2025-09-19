// ========================= IMPORTS =========================
import { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { ROUTES } from '@constants/routes'
import { getStories } from '@redux/thunks/story.thunk'
import * as S from './styles'

// ========================= CONSTANTS =========================
const TAB_LABELS = ['Top Tháng', 'Top Tuần', 'Top Ngày']
const SORT_KEYS   = ['view_month', 'view_week', 'view_day']

// Lấy chapter mới nhất theo updatedAt
const getLatestChapterByUpdatedAt = (chapters = []) => {
  if (!Array.isArray(chapters) || !chapters.length) return null
  return chapters.reduce((a, b) =>
    new Date(a?.updatedAt || 0) >= new Date(b?.updatedAt || 0) ? a : b
  )
}

// Format số lượt xem dạng compact (12K, 3.4M…)
const formatCompact = (n) =>
  new Intl.NumberFormat('en', { notation: 'compact' }).format(Number(n || 0))

// ========================= COMPONENT =========================
const TopStory = () => {
  const dispatch = useDispatch()

  // Tab đang chọn
  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const activeSortKey = SORT_KEYS[activeTabIndex]

  // Lấy bucket dữ liệu top từ Redux
  const topSlice = useSelector((s) => s.story?.topLists || {})
  const bucket   = topSlice[activeSortKey] || { data: [], meta: {}, status: 'idle', error: null }
  const { data = [], status = 'idle', error = null } = bucket

  // Nạp dữ liệu cho tab hiện tại nếu chưa có
  useEffect(() => {
    if (status === 'idle') {
      dispatch(getStories({ scope: 'top', sort: activeSortKey }))
    }
  }, [status, activeSortKey, dispatch])

  // Tối ưu: map dữ liệu hiển thị
  const items = useMemo(() => {
    return (data || []).map((story) => {
      const latest = getLatestChapterByUpdatedAt(story?.chapters)
      const viewsForTab =
        story?.[activeSortKey] ??
        story?.view_day ??
        story?.view_week ??
        story?.view_month ??
        story?.total_view ?? 0

      return {
        id: story?.id,
        name: story?.name,
        thumbnail: story?.thumbnail,
        latestChapterId: latest?.id,
        latestChapterNumber: latest?.chapter_number,
        viewsText: formatCompact(viewsForTab),
      }
    })
  }, [data, activeSortKey])

  return (
    <S.Card>
      {/* Tabs */}
      <S.Tabs role="tablist" aria-label="Bảng xếp hạng truyện">
        {TAB_LABELS.map((label, idx) => (
          <button
            key={label}
            className={`tab ${activeTabIndex === idx ? 'active' : ''}`}
            onClick={() => setActiveTabIndex(idx)}
            role="tab"
            aria-selected={activeTabIndex === idx}
          >
            {label}
          </button>
        ))}
      </S.Tabs>

      {/* Nội dung tab */}
      <S.Panel role="tabpanel">
        {status === 'loading' && <S.InfoLine>Đang tải…</S.InfoLine>}
        {status === 'failed'   && <S.InfoLine className="error">Lỗi: {String(error)}</S.InfoLine>}

        <ul className="list">
          {items.map((it, idx) => (
            <li key={it.id ?? `${activeSortKey}-${idx}`} className="row">
              <S.RankBadge rank={idx + 1}>{String(idx + 1).padStart(2, '0')}</S.RankBadge>

              <Link to={ROUTES.USER.STORY.replace(':id', it.id)} className="thumb">
                <img src={it.thumbnail} alt={it.name} loading="lazy" />
              </Link>

              <div className="meta">
                <h4 className="title">
                  <Link to={ROUTES.USER.STORY.replace(':id', it.id)}>{it.name}</Link>
                </h4>

                <div className="subline">
                  {it.latestChapterId ? (
                    <Link to={ROUTES.USER.CHAPTER.replace(':id', it.latestChapterId)} className="chapter-link">
                      Chapter {it.latestChapterNumber}
                    </Link>
                  ) : (
                    <span className="chapter-link muted">Chưa có chap</span>
                  )}

                  <span className="views">
                    <i className="fa fa-eye" aria-hidden="true" /> {it.viewsText}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </S.Panel>
    </S.Card>
  )
}

export default TopStory
