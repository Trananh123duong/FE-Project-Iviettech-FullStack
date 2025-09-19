// ========================= IMPORTS =========================
import { Link } from 'react-router-dom'
import { ROUTES } from '@constants/routes'
import { timeAgo } from '@utils/date'
import * as S from './styles'

// ========================= HELPERS =========================
const compactNumber = (n) =>
  new Intl.NumberFormat('en', { notation: 'compact' }).format(Number(n || 0))

// Lấy 3 chapter cập nhật mới nhất
const pickLatest3 = (chapters = []) =>
  [...(chapters || [])]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 3)

// ========================= COMPONENT =========================
const ListStory = ({
  stories = [],
  status,
  error,
  onUnfollow,
  unfollowLoading = false,
}) => {
  return (
    <S.Grid>
      {/* trạng thái tải / lỗi */}
      {status === 'loading' && <S.Info>Đang tải…</S.Info>}
      {status === 'failed' && <S.Info className="error">Lỗi: {error}</S.Info>}

      {stories.map((story) => {
        const latest3 = pickLatest3(story.chapters)
        const storyLink = ROUTES.USER.STORY.replace(':id', story.id)

        return (
          <S.Card key={story.id}>
            {/* Ảnh + overlay stats */}
            <S.ThumbWrap>
              <Link to={storyLink} aria-label={story.name}>
                <img src={story.thumbnail} alt={story.name} loading="lazy" />
              </Link>

              <S.OverlayStats>
                <span><i className="fa fa-eye" aria-hidden /> {compactNumber(story.total_view)}</span>
                <span><i className="fa fa-comment" aria-hidden /> 0</span>
                <span><i className="fa fa-heart" aria-hidden /> {compactNumber(story.total_follow)}</span>
              </S.OverlayStats>
            </S.ThumbWrap>

            {/* Tên truyện */}
            <S.Title>
              <Link to={storyLink}>{story.name}</Link>
            </S.Title>

            {/* 3 chapter mới nhất */}
            <S.ChapterList>
              {latest3.length > 0 ? (
                latest3.map((c) => {
                  const chapterHref = ROUTES.USER.CHAPTER.replace(':id', c.id)
                  return (
                    <li key={c.id} className="chapter-row">
                      <Link to={chapterHref} className="chapter-link">
                        Chapter {c.chapter_number}
                      </Link>
                      <span className="chapter-time">{timeAgo(c.updatedAt)}</span>
                    </li>
                  )
                })
              ) : (
                <li className="chapter-row">
                  <span className="chapter-link muted">Chưa có chapter</span>
                </li>
              )}
            </S.ChapterList>

            {/* Nút bỏ theo dõi (nếu truyền vào) */}
            {typeof onUnfollow === 'function' && (
              <S.Actions>
                <button
                  type="button"
                  className="btn-unfollow"
                  disabled={unfollowLoading}
                  onClick={() => onUnfollow(story)}
                  title="Bỏ theo dõi"
                >
                  {unfollowLoading ? 'Đang bỏ theo dõi…' : 'Bỏ theo dõi'}
                </button>
              </S.Actions>
            )}
          </S.Card>
        )
      })}
    </S.Grid>
  )
}

export default ListStory
