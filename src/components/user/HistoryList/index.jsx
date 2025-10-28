import { ROUTES } from '@constants/routes'
import { END_POINT } from '@services/api'
import { timeAgo } from '@utils/date'
import { Link } from 'react-router-dom'
import * as S from './styles'

// Chuyển URL ảnh (tương đối hoặc tuyệt đối) thành URL đầy đủ
function toAbsolute(url) {
  if (!url) {
    return '';
  }

  // Nếu URL đã là link đầy đủ (bắt đầu bằng http hoặc https)
  const isFullUrl = url.startsWith('http://') || url.startsWith('https://');
  if (isFullUrl) {
    return url; // Giữ nguyên
  }

  // Nếu là đường dẫn tương đối, đảm bảo có dấu '/' đúng cách
  const hasSlash = url.startsWith('/');
  const fullPath = hasSlash ? url : `/${url}`;

  // Ghép END_POINT với đường dẫn để tạo URL tuyệt đối
  return `${END_POINT}${fullPath}`;
}

const HistoryList = ({ items = [], status, error }) => {
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
              <S.StoryTitle>
                <Link to={ROUTES.USER.STORY.replace(':id', story.id)}>
                  {story.name || '—'}
                </Link>
              </S.StoryTitle>

              {/* đọc tới chapter nào */}
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

              <S.TimeLine>
                Lần cuối đọc: <i>{timeAgo(h.last_read_at)}</i>
              </S.TimeLine>

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
