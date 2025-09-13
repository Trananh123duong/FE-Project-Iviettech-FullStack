import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import qs from 'qs'

import { STORY_LIMIT } from '@constants/paging'
import { getStories } from '@redux/thunks/story.thunk'
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

const ListStory = () => {
  const dispatch = useDispatch()
  const location = useLocation()

  const { data: stories = [], meta = {}, status, error } = useSelector(
    (state) => state.story.updatedList
  )

  useEffect(() => {
    if (status === 'idle') {
      const query = qs.parse(location.search, { ignoreQueryPrefix: true })
      const page = parseInt(query.page || 1, 10)
      const limit = parseInt(query.limit || STORY_LIMIT, 10)
      dispatch(getStories({ scope: 'updated', page, limit }))
    }
  }, [status, dispatch, location.search])

  return (
    <S.UpdatedComic>
      <S.Header>
        <S.Title>
          Truyện mới cập nhật <i className="fa-solid fa-angle-right"></i>
        </S.Title>
      </S.Header>

      {status === 'loading' && <div style={{ padding: 8 }}>Đang tải...</div>}
      {status === 'failed' && (
        <div style={{ padding: 8, color: 'red' }}>Lỗi: {error}</div>
      )}

      {stories.map((story) => {
        const chapters = latest3Chapters(story.chapters || [])
        return (
          <S.Item key={story.id}>
            <S.ImageWrapper>
              <Link to={`/truyen/${story.id}`}>
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
              <Link to={`/truyen/${story.id}`}>{story.name}</Link>
            </S.TitleH3>

            <S.ChapterList>
              {chapters.map((c) => (
                <S.ChapterItem key={c.id}>
                  <S.ChapterLink href={`/truyen/${story.id}/chap/${c.chapter_number}`}>
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
          </S.Item>
        )
      })}
    </S.UpdatedComic>
  )
}

export default ListStory
