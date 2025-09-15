import { Link } from 'react-router-dom'
import { END_POINT, BASE_URL } from '@services/api'
import * as S from './styles'

const timeAgo = (dateString) => {
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

const toAbsolute = (url) => {
  if (!url) return ''
  if (/^https?:\/\//i.test(url)) return url
  const path = url.startsWith('/') ? url : `/${url}`
  return `${END_POINT}${path}`
}

const HistoryList = ({ items = [], status, error }) => {
  if (status === 'loading') return <div style={{ padding: 8 }}>Đang tải...</div>
  if (status === 'failed') return <div style={{ padding: 8, color: 'red' }}>Lỗi: {error}</div>

  return (
    <S.Container>
      {items.map((h) => {
        console.log(h);
        const story = h.story || {}
        const chapter = h.chapter || {}
        const chapterNumber = chapter.chapter_number ?? chapter.number ?? '-'
        return (
          <S.Row key={h.id}>
            <S.Thumb>
              <Link to={`/story/${story.id}`}>
                <img src={toAbsolute(story.thumbnail)} alt={story.name || 'thumbnail'} />
              </Link>
            </S.Thumb>

            <S.Info>
              <S.StoryTitle>
                <Link to={`/story/${story.id}`}>{story.name || '—'}</Link>
              </S.StoryTitle>

              <S.MetaLine>
                <span>Đọc tới:&nbsp;</span>
                {chapterNumber !== '-' ? (
                  <Link to={`/story/${story.id}/chap/${chapterNumber}`}>
                    Chapter {chapterNumber}
                  </Link>
                ) : (
                  <i>Chưa xác định chapter</i>
                )}
              </S.MetaLine>

              <S.TimeLine>
                Lần cuối đọc: <i>{timeAgo(h.last_read_at)}</i>
              </S.TimeLine>

              {chapterNumber !== '-' && (
                <S.Actions>
                  <Link className="read-btn" to={`/story/${story.id}/chap/${chapterNumber}`}>
                    Tiếp tục đọc
                  </Link>
                </S.Actions>
              )}
            </S.Info>
          </S.Row>
        )
      })}
    </S.Container>
  )
}

export default HistoryList
