import { ROUTES } from '@constants/routes'
import { END_POINT } from '@services/api'
import { timeAgo } from '@utils/date'
import { Link } from 'react-router-dom'
import * as S from './styles'

/**
 * Chuyển URL ảnh (tương đối hoặc tuyệt đối) thành URL đầy đủ
 * - Nếu đã là http/https thì giữ nguyên
 * - Nếu là path thì nối với END_POINT
 */
const toAbsolute = (url) => {
  if (!url) return ''
  if (/^https?:\/\//i.test(url)) return url
  const path = url.startsWith('/') ? url : `/${url}`
  return `${END_POINT}${path}`
}

const HistoryList = ({ items = [], status, error }) => {
  // Trạng thái tải dữ liệu
  if (status === 'loading') {
    return <div style={{ padding: 8 }}>Đang tải...</div>
  }
  if (status === 'failed') {
    return <div style={{ padding: 8, color: 'red' }}>Lỗi: {error}</div>
  }

  return (
    <S.Container>
      {items.map((h) => {
        const story = h.story || {}
        const chapter = h.chapter || {}
        const chapterNumber = chapter.chapter_number ?? chapter.number ?? '-'

        return (
          <S.Row key={h.id}>
            {/* --- ẢNH BÌA --- */}
            <S.Thumb>
              <Link to={ROUTES.USER.STORY.replace(':id', story.id)}>
                <img
                  src={toAbsolute(story.thumbnail)}
                  alt={story.name || 'thumbnail'}
                />
              </Link>
            </S.Thumb>

            {/* --- THÔNG TIN TRUYỆN --- */}
            <S.Info>
              {/* Tiêu đề truyện */}
              <S.StoryTitle>
                <Link to={ROUTES.USER.STORY.replace(':id', story.id)}>
                  {story.name || '—'}
                </Link>
              </S.StoryTitle>

              {/* Dòng: đọc tới chapter nào */}
              <S.MetaLine>
                <span>Đọc tới:&nbsp;</span>
                {chapterNumber !== '-' ? (
                  <Link to={ROUTES.USER.CHAPTER.replace(':id', chapter.id)}>
                    Chapter {chapterNumber}
                  </Link>
                ) : (
                  <i>Chưa xác định chapter</i>
                )}
              </S.MetaLine>

              {/* Thời gian đọc lần cuối */}
              <S.TimeLine>
                Lần cuối đọc: <i>{timeAgo(h.last_read_at)}</i>
              </S.TimeLine>

              {/* Nút tiếp tục đọc */}
              {chapterNumber !== '-' && (
                <S.Actions>
                  <Link
                    className="read-btn"
                    to={ROUTES.USER.CHAPTER.replace(':id', chapter.id)}
                  >
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
