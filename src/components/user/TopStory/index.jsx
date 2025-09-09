import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getStories } from '../../../redux/thunks/story.thunk'
import * as S from './styles'

const TAB_LABELS = ['Top Tháng', 'Top Tuần', 'Top Ngày']
const SORT_KEYS = ['view_month', 'view_week', 'view_day']

const getLatestChapterByUpdatedAt = (chapters = []) => {
  if (!chapters?.length) return null
  return chapters.reduce((a, b) =>
    new Date(a.updatedAt) >= new Date(b.updatedAt) ? a : b
  )
}

const formatCompact = (n) =>
  new Intl.NumberFormat('en', { notation: 'compact' }).format(n ?? 0)

const TopStory = () => {
  const dispatch = useDispatch()
  const { data, status, error } = useSelector((s) => s.story.storyList)
  const [activeTab, setActiveTab] = useState(0)
  const [cache, setCache] = useState({
    view_month: null,
    view_week: null,
    view_day: null,
  })

  const sortKey = SORT_KEYS[activeTab]

  useEffect(() => {
    if (!cache[sortKey] && status !== 'loading') {
      dispatch(getStories({ sort: sortKey }))
    }
  }, [activeTab, sortKey, cache, status, dispatch])

  useEffect(() => {
    if (status === 'succeeded' && Array.isArray(data) && data.length) {
      setCache((prev) => ({ ...prev, [sortKey]: data }))
    }
  }, [status, data, sortKey])

  const list = useMemo(
    () => cache[sortKey] || (status === 'succeeded' ? data : []),
    [cache, sortKey, status, data]
  )

  return (
    <S.BoxTab>
      <S.NavTab>
        {TAB_LABELS.map((label, index) => (
          <li key={index} onClick={() => setActiveTab(index)}>
            <S.TabLink className={activeTab === index ? 'active' : ''}>
              {label}
            </S.TabLink>
          </li>
        ))}
      </S.NavTab>

      <S.TabPane>
        {status === 'loading' && !cache[sortKey] && <div>Đang tải...</div>}
        {status === 'failed' && !cache[sortKey] && (
          <div style={{ color: 'red' }}>Lỗi: {error}</div>
        )}

        <ul>
          {list.map((story, idx) => {
            const latest = getLatestChapterByUpdatedAt(story.chapters)
            const viewsForTab =
              story[sortKey] ??
              story.view_day ??
              story.view_week ??
              story.view_month ??
              story.total_view

            return (
              <S.ComicItem key={story.id}>
                <S.Rank index={idx}>{String(idx + 1).padStart(2, '0')}</S.Rank>
                <S.ComicBox>
                  <S.Thumb>
                    <Link to={`/truyen/${story.id}`}>
                      <img src={story.thumbnail} alt={story.name} />
                    </Link>
                  </S.Thumb>
                  <S.Title>
                    <Link to={`/truyen/${story.id}`}>{story.name}</Link>
                  </S.Title>
                  <S.Chapter className="chapter top">
                    {latest ? (
                      <Link to={`/truyen/${story.id}/chap/${latest.chapter_number}`}>
                        Chapter {latest.chapter_number}
                      </Link>
                    ) : (
                      <span>Chưa có chap</span>
                    )}
                    <S.View>
                      <i className="fa fa-eye" /> {formatCompact(viewsForTab)}
                    </S.View>
                  </S.Chapter>
                </S.ComicBox>
              </S.ComicItem>
            )
          })}
        </ul>
      </S.TabPane>
    </S.BoxTab>
  )
}

export default TopStory
