import {
  HeartFilled,
  HomeFilled,
  LeftOutlined,
  RedoOutlined,
  RightOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'
import { Alert, Button, Empty, Image, message, Select, Skeleton, Typography } from 'antd'
import { useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import { ROUTES } from '@constants/routes'
import { getChapter, getChaptersByStory } from '@redux/thunks/chapter.thunk'
import { followStory, unfollowStory } from '@redux/thunks/follow.thunk'
import { getStory } from '@redux/thunks/story.thunk'
import { fmtDT } from '@utils/date'
import * as S from './styles'

const { Text } = Typography

// --- Helpers lấy số chương từ nhiều khả năng key khác nhau
const extractNum = (v) => {
  if (v == null) return null
  if (typeof v === 'number') return v
  const m = String(v).match(/\d+/)
  return m ? Number(m[0]) : null
}
const getChapterNum = (c) =>
  extractNum(c?.chapter_number ?? c?.number ?? c?.order ?? c?.index ?? c?.name)

const ChapterDetail = () => {
  // --- Lấy id chapter từ URL params
  const { id: chapterIdParam } = useParams()
  const chapterId = Number(chapterIdParam)

  // --- Hook điều hướng, dispatch
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // --- Lấy thông tin user đăng nhập
  const { data: user } = useSelector((s) => s.auth.myProfile)

  // --- Lấy detail chapter (store đã “flatten” previous/next & is_following)
  const {
    data: chapter = {},
    previousChapterId,
    nextChapterId,
    is_following: chapterIsFollowing,
    status: chapStatus,
    error: chapError,
  } = useSelector((s) => s.chapter.chapterDetail)

  // --- Lấy danh sách chapter theo story (để render Select chuyển nhanh)
  const { chaptersByStory } = useSelector((s) => s.chapter)
  const { data: chapterList = [], status: chaptersStatus } = chaptersByStory

  // --- Lấy detail story (để hiện tên breadcrumb)
  const storyDetail = useSelector((s) => s.story.storyDetail.data)

  // --- Trạng thái follow/unfollow
  const { followAction, unfollowAction } = useSelector((s) => s.follow)

  // --- Khi đổi chapterId -> gọi API lấy chi tiết chapter
  useEffect(() => {
    if (chapterId) dispatch(getChapter({ id: chapterId }))
  }, [dispatch, chapterId])

  // --- Khi đã có chapter.story_id -> load danh sách chapter của story + detail story (nếu cần)
  useEffect(() => {
    const sid = chapter?.story_id
    if (!sid) return
    dispatch(getChaptersByStory({ storyId: sid }))
    if (!storyDetail?.id || storyDetail.id !== sid) {
      dispatch(getStory({ id: String(sid) }))
    }
  }, [dispatch, chapter?.story_id]) // cố ý giữ phụ thuộc như cũ, không đổi logic

  // --- Sắp xếp danh sách chương tăng dần theo số chương (phục vụ Select)
  const sortedChapters = useMemo(() => {
    const arr = [...chapterList]
    arr.sort((a, b) => {
      const na = getChapterNum(a) ?? 0
      const nb = getChapterNum(b) ?? 0
      if (na !== nb) return na - nb
      return (a.id ?? 0) - (b.id ?? 0)
    })
    return arr
  }, [chapterList])

  // --- Options cho Select: hiển thị "Chapter X - title"
  const options = useMemo(
    () =>
      sortedChapters.map((c) => ({
        value: c.id,
        label: `Chapter ${getChapterNum(c) ?? '?'}${c.title ? ` - ${c.title}` : ''}`,
      })),
    [sortedChapters]
  )

  // --- Tính previous/next dựa vào store hoặc fallback theo vị trí trong sortedChapters
  const currentIndex = useMemo(
    () => sortedChapters.findIndex((c) => Number(c.id) === Number(chapterId)),
    [sortedChapters, chapterId]
  )
  const prevId =
    previousChapterId ??
    (currentIndex > 0 ? sortedChapters[currentIndex - 1]?.id : null)

  const nextId =
    nextChapterId ??
    (currentIndex >= 0 && currentIndex < sortedChapters.length - 1
      ? sortedChapters[currentIndex + 1]?.id
      : null)

  // --- Hàm điều hướng tới chapter cụ thể (DÙNG ROUTES)
  const goChapter = useCallback(
    (id) => {
      if (!id) return
      navigate(ROUTES.USER.CHAPTER.replace(':id', id))
    },
    [navigate]
  )
  const goPrev = () => goChapter(prevId)
  const goNext = () => goChapter(nextId)

  // --- Keyboard ← → để chuyển chapter
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goPrev()
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        goNext()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prevId, nextId]) // giữ nguyên dependency và disable-lint như code gốc

  // --- Follow/unfollow theo flag ở chapterDetail (is_following)
  const isLoggedIn = !!user?.id
  const acting = followAction.status === 'loading' || unfollowAction.status === 'loading'
  const isFollowed = !!chapterIsFollowing

  // --- Toggle theo dõi truyện của chapter hiện tại
  const onToggleFollow = async () => {
    if (!isLoggedIn || !chapter?.story_id) return
    try {
      if (isFollowed) {
        const r = await dispatch(unfollowStory({ storyId: chapter.story_id })).unwrap()
        message.success(r?.message || 'Đã bỏ theo dõi')
      } else {
        const r = await dispatch(followStory({ storyId: chapter.story_id })).unwrap()
        message.success(r?.message || 'Đã theo dõi')
      }
      // refresh lại trạng thái is_following trong chapter detail
      dispatch(getChapter({ id: chapterId }))
      // (tuỳ chọn) refresh story để đồng bộ total_follow
      dispatch(getStory({ id: String(chapter.story_id) }))
    } catch (err) {
      message.error(err?.message || 'Có lỗi xảy ra')
    }
  }

  // --- Dữ liệu hiển thị cơ bản
  const chapNum = getChapterNum(chapter)
  const storyName = storyDetail?.name || 'Truyện'
  const updatedAt = fmtDT(chapter?.updated_at || chapter?.updatedAt)

  // --- Ảnh trong chapter: sắp theo sort_order; trường URL là img_path
  const images = useMemo(() => {
    const arr = Array.isArray(chapter?.chapter_images) ? [...chapter.chapter_images] : []
    arr.sort((a, b) => (a?.sort_order ?? 0) - (b?.sort_order ?? 0))
    return arr
  }, [chapter])

  // --- Breadcrumb handlers (DÙNG ROUTES)
  const goHome = () => navigate(ROUTES.USER.HOME)
  const goStory = () => {
    if (!chapter?.story_id) return
    navigate(ROUTES.USER.STORY.replace(':id', chapter.story_id))
  }
  const goStoryChapters = goStory // nếu có trang riêng cho danh sách chương, thay đổi tại đây

  return (
    <S.Wrapper>
      {/* --- Breadcrumb + title */}
      <S.BreadcrumbBar>
        <S.Crumb onClick={goHome}>Trang chủ</S.Crumb>
        <span>›</span>
        <S.Crumb onClick={goStory}>{storyName}</S.Crumb>
        <span>›</span>
        <Text strong>Chapter {chapNum ?? '?'}</Text>
        {updatedAt && <S.UpdatedAt>&nbsp;[Cập nhật lúc: {updatedAt}]</S.UpdatedAt>}
      </S.BreadcrumbBar>

      {/* --- Gợi ý phím tắt */}
      <Alert
        type="info"
        showIcon
        message="Sử dụng mũi tên trái (←) hoặc phải (→) để chuyển chapter"
        style={{ marginBottom: 8 }}
      />

      {/* --- Thanh công cụ cố định (sticky toolbar) */}
      <S.Toolbar>
        <div className="left">
          <Button type="text" icon={<HomeFilled />} onClick={goHome} />
          <Button type="text" icon={<UnorderedListOutlined />} onClick={goStoryChapters} />
          <Button
            type="text"
            icon={<RedoOutlined />}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          />
          <S.NavButton icon={<LeftOutlined />} onClick={goPrev} disabled={!prevId} />
          <Select
            className="chapter-select"
            size="middle"
            value={chapterId}
            onChange={(val) => goChapter(val)}
            loading={chaptersStatus === 'loading'}
            options={options}
            showSearch
            filterOption={(input, opt) =>
              (opt?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          />
          <S.NavButton icon={<RightOutlined />} onClick={goNext} disabled={!nextId} />
        </div>

        <div className="right">
          <S.FollowButton
            icon={<HeartFilled />}
            onClick={onToggleFollow}
            disabled={!isLoggedIn || acting || !chapter?.story_id}
            loading={acting}
            className={isFollowed ? 'is-followed' : ''}
          >
            {isFollowed ? 'Đã theo dõi' : 'Theo dõi'}
          </S.FollowButton>
        </div>
      </S.Toolbar>

      {/* --- Nội dung: render ảnh của chapter */}
      {chapStatus === 'loading' ? (
        <Skeleton active paragraph={{ rows: 8 }} />
      ) : chapError ? (
        <Empty description="Không tải được chapter" />
      ) : (
        <S.Reader>
          {images.length === 0 ? (
            <Empty description="Chưa có ảnh cho chapter này" />
          ) : (
            images.map((img, idx) => (
              <div key={img?.id || idx} className="img-wrap">
                <Image
                  src={img?.img_path || ''}
                  alt={`page-${idx + 1}`}
                  preview={false}
                  loading="lazy"
                />
              </div>
            ))
          )}
        </S.Reader>
      )}
    </S.Wrapper>
  )
}

export default ChapterDetail
