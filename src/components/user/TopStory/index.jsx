import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getStories } from '../../../redux/thunks/story.thunk'
import * as S from './styles'

const TAB_LABELS = ['Top Tháng', 'Top Tuần', 'Top Ngày']
const SORT_KEYS = ['view_month', 'view_week', 'view_day']

const getLatestChapterByUpdatedAt = (chapters = []) => {
  if (!Array.isArray(chapters) || !chapters.length) return null
  return chapters.reduce((a, b) =>
    new Date(a?.updatedAt || 0) >= new Date(b?.updatedAt || 0) ? a : b
  )
}

const formatCompact = (n) =>
  new Intl.NumberFormat('en', { notation: 'compact' }).format(Number(n || 0))

const TopStory = () => {
  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState(0)
  const sortKey = SORT_KEYS[activeTab]

  const topSlice = useSelector((s) => s.story?.topLists || {})
  const bucket = topSlice[sortKey] || { data: [], meta: {}, status: 'idle', error: null }
  const { data = [], status = 'idle', error = null } = bucket

  useEffect(() => {
    if (status === 'idle') {
      dispatch(getStories({ scope: 'top', sort: sortKey }))
    }
  }, [status, sortKey, dispatch])

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
        {status === 'loading' && <div>Đang tải...</div>}
        {status === 'failed' && <div style={{ color: 'red' }}>Lỗi: {String(error)}</div>}

        <ul>
          {data.map((story, idx) => {
            const latest = getLatestChapterByUpdatedAt(story?.chapters)
            const viewsForTab =
              story?.[sortKey] ??
              story?.view_day ??
              story?.view_week ??
              story?.view_month ??
              story?.total_view ?? 0

            return (
              <S.ComicItem key={story?.id ?? `${sortKey}-${idx}`}>
                <S.Rank index={idx}>{String(idx + 1).padStart(2, '0')}</S.Rank>
                <S.ComicBox>
                  <S.Thumb>
                    <Link to={`/truyen/${story?.id}`}>
                      <img src={story?.thumbnail} alt={story?.name} />
                    </Link>
                  </S.Thumb>
                  <S.Title>
                    <Link to={`/truyen/${story?.id}`}>{story?.name}</Link>
                  </S.Title>
                  <S.Chapter className="chapter top">
                    {latest ? (
                      <Link to={`/truyen/${story?.id}/chap/${latest.chapter_number}`}>
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
