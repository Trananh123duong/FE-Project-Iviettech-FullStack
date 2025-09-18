import { Link } from 'react-router-dom'
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

const compact = (n) =>
  new Intl.NumberFormat('en', { notation: 'compact' }).format(Number(n || 0))

const latest3Chapters = (chapters = []) =>
  [...chapters]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 3)

const ListStory = ({ stories = [], status, error, onUnfollow, unfollowLoading = false }) => {
  return (
    <S.UpdatedComic>
      {status === 'loading' && <div style={{ padding: 8 }}>Đang tải...</div>}
      {status === 'failed' && (
        <div style={{ padding: 8, color: 'red' }}>Lỗi: {error}</div>
      )}

      {stories.map((story) => {
        const chapters = latest3Chapters(story.chapters || [])
        return (
          <S.Item key={story.id}>
            <S.ImageWrapper>
              <Link to={`/story/${story.id}`}>
                <S.Image src={story.thumbnail} alt={story.name} />
              </Link>
              <S.View>
                <span>
                  <i className="fa fa-eye" /> {compact(story.total_view)}
                  <i className="fa fa-comment" /> 0
                  <i className="fa fa-heart" /> {compact(story.total_follow)}
                </span>
              </S.View>
            </S.ImageWrapper>

            <S.TitleH3>
              <Link to={`/story/${story.id}`}>{story.name}</Link>
            </S.TitleH3>

            <S.ChapterList>
              {chapters.map((c) => (
                <S.ChapterItem key={c.id}>
                  <S.ChapterLink href={`/chapter/${c.id}`}>
                    Chapter {c.chapter_number}
                  </S.ChapterLink>
                  <S.ChapterTime>{timeAgo(c.updatedAt)}</S.ChapterTime>
                </S.ChapterItem>
              ))}
              {chapters.length === 0 && (
                <S.ChapterItem>
                  <span>Chưa có chapter</span>
                </S.ChapterItem>
              )}
            </S.ChapterList>

            {typeof onUnfollow === 'function' && (
              <S.Actions>
                <button
                  type="button"
                  className="unfollow-btn"
                  disabled={unfollowLoading}
                  onClick={() => onUnfollow(story)}
                  title="Bỏ theo dõi"
                >
                  {unfollowLoading ? 'Đang bỏ theo dõi...' : 'Bỏ theo dõi'}
                </button>
              </S.Actions>
            )}
          </S.Item>
        )
      })}
    </S.UpdatedComic>
  )
}

export default ListStory
