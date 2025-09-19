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

/* =========================
 * Helpers về số chapter
 * =======================*/
const extractNum = (value) => {
  if (value == null) return null
  if (typeof value === 'number') return value
  const match = String(value).match(/\d+/)
  return match ? Number(match[0]) : null
}
const getChapterNum = (c) =>
  extractNum(c?.chapter_number ?? c?.number ?? c?.order ?? c?.index ?? c?.name)

const ChapterDetail = () => {
  /* ====== Lấy id chapter từ URL ====== */
  const { id: chapterIdParam } = useParams()
  const chapterId = Number(chapterIdParam)

  /* ====== Hook điều hướng & redux ====== */
  const navigate = useNavigate()
  const dispatch = useDispatch()

  /* ====== Thông tin user đăng nhập ====== */
  const { data: currentUser } = useSelector((s) => s.auth.myProfile)

  /* ====== Detail chapter (đã flatten prev/next/is_following) ====== */
  const {
    data: chapter = {},
    previousChapterId,
    nextChapterId,
    is_following: chapterIsFollowing,
    status: chapterStatus,
    error: chapterError,
  } = useSelector((s) => s.chapter.chapterDetail)

  /* ====== Danh sách chapter theo story để render Select ====== */
  const { chaptersByStory } = useSelector((s) => s.chapter)
  const { data: chapterList = [], status: chaptersStatus } = chaptersByStory

  /* ====== Detail story (hiện tên, dùng breadcrumb) ====== */
  const storyDetail = useSelector((s) => s.story.storyDetail.data)

  /* ====== Trạng thái follow/unfollow ====== */
  const { followAction, unfollowAction } = useSelector((s) => s.follow)

  /* ====== Khi đổi chapterId -> gọi API lấy chi tiết ====== */
  useEffect(() => {
    if (chapterId) dispatch(getChapter({ id: chapterId }))
  }, [dispatch, chapterId])

  /* ====== Khi có story_id -> tải danh sách chapter của story + story detail nếu cần ====== */
  useEffect(() => {
    const storyId = chapter?.story_id
    if (!storyId) return
    dispatch(getChaptersByStory({ storyId }))
    if (!storyDetail?.id || storyDetail.id !== storyId) {
      dispatch(getStory({ id: String(storyId) }))
    }
  }, [dispatch, chapter?.story_id]) // giữ phụ thuộc này để đảm bảo nạp đúng lúc

  /* ====== Danh sách chapter sort tăng dần (phục vụ select) ====== */
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

  /* ====== Options cho Select: "Chapter X - title" ====== */
  const selectOptions = useMemo(
    () =>
      sortedChapters.map((c) => ({
        value: Number(c.id),
        label: `Chapter ${getChapterNum(c) ?? '?'}${c.title ? ` - ${c.title}` : ''}`,
      })),
    [sortedChapters]
  )

  /* ====== Tính previous/next: ưu tiên từ store, fallback theo vị trí ====== */
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

  /* ====== Điều hướng tới chapter cụ thể (kèm scroll top) ====== */
  const goChapter = useCallback(
    (id) => {
      if (!id) return
      navigate(ROUTES.USER.CHAPTER.replace(':id', id))
      // Một số app giữ nguyên scroll; chủ động kéo lên đầu cho chắc
      window.scrollTo({ top: 0, behavior: 'instant' })
    },
    [navigate]
  )
  const goPrev = () => goChapter(prevId)
  const goNext = () => goChapter(nextId)

  /* ====== Keyboard ← → để chuyển chapter ====== */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev() }
      if (e.key === 'ArrowRight') { e.preventDefault(); goNext() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goPrev, goNext])

  /* ====== Follow/unfollow ====== */
  const isLoggedIn = !!currentUser?.id
  const isActing = followAction.status === 'loading' || unfollowAction.status === 'loading'
  const isFollowed = !!chapterIsFollowing

  const onToggleFollow = async () => {
    if (!isLoggedIn || !chapter?.story_id) return
    try {
      if (isFollowed) {
        const res = await dispatch(unfollowStory({ storyId: chapter.story_id })).unwrap()
        message.success(res?.message || 'Đã bỏ theo dõi')
      } else {
        const res = await dispatch(followStory({ storyId: chapter.story_id })).unwrap()
        message.success(res?.message || 'Đã theo dõi')
      }
      // refresh lại trạng thái is_following
      dispatch(getChapter({ id: chapterId }))
      // đồng bộ số follow (tuỳ chọn)
      dispatch(getStory({ id: String(chapter.story_id) }))
    } catch (err) {
      message.error(err?.message || 'Có lỗi xảy ra')
    }
  }

  /* ====== Dữ liệu hiển thị ====== */
  const chapterNumber = getChapterNum(chapter)
  const storyName = storyDetail?.name || 'Truyện'
  const updatedAtLabel = fmtDT(chapter?.updated_at || chapter?.updatedAt)

  // Ảnh trong chapter: sort theo sort_order, key URL là img_path
  const imageList = useMemo(() => {
    const arr = Array.isArray(chapter?.chapter_images) ? [...chapter.chapter_images] : []
    arr.sort((a, b) => (a?.sort_order ?? 0) - (b?.sort_order ?? 0))
    return arr
  }, [chapter])

  /* ====== Breadcrumb handlers ====== */
  const goHome = () => navigate(ROUTES.USER.HOME)
  const goStory = () => chapter?.story_id && navigate(ROUTES.USER.STORY.replace(':id', chapter.story_id))
  const goStoryChapters = goStory // nếu sau có trang "danh sách chương", đổi handler tại đây

  return (
    <S.Page>
      {/* ===== Breadcrumb + tiêu đề rút gọn ===== */}
      <S.BreadcrumbBar>
        <S.Crumb onClick={goHome}>Trang chủ</S.Crumb>
        <span>›</span>
        <S.Crumb onClick={goStory}>{storyName}</S.Crumb>
        <span>›</span>
        <Text strong>Chapter {chapterNumber ?? '?'}</Text>
        {updatedAtLabel && <S.UpdatedAt>&nbsp;[Cập nhật lúc: {updatedAtLabel}]</S.UpdatedAt>}
      </S.BreadcrumbBar>

      {/* ===== Gợi ý phím tắt ===== */}
      <Alert
        type="info"
        showIcon
        message="Mẹo: dùng phím mũi tên trái (←) / phải (→) để chuyển chapter nhanh."
        style={{ marginBottom: 8 }}
      />

      {/* ===== Thanh công cụ sticky ===== */}
      <S.Toolbar>
        <div className="left">
          <Button type="text" icon={<HomeFilled />} onClick={goHome} aria-label="Trang chủ" />
          <Button type="text" icon={<UnorderedListOutlined />} onClick={goStoryChapters} aria-label="Trang truyện" />
          <Button
            type="text"
            icon={<RedoOutlined />}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Lên đầu trang"
          />
          <S.NavButton icon={<LeftOutlined />} onClick={goPrev} disabled={!prevId} aria-label="Chương trước" />

          <Select
            className="chapter-select"
            size="middle"
            value={Number(chapterId) || undefined}
            onChange={(val) => goChapter(val)}
            loading={chaptersStatus === 'loading'}
            options={selectOptions}
            showSearch
            placeholder="Chọn chapter"
            filterOption={(input, opt) =>
              (opt?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            disabled={selectOptions.length === 0}
          />

          <S.NavButton icon={<RightOutlined />} onClick={goNext} disabled={!nextId} aria-label="Chương sau" />
        </div>

        <div className="right">
          <S.FollowButton
            icon={<HeartFilled />}
            onClick={onToggleFollow}
            disabled={!isLoggedIn || isActing || !chapter?.story_id}
            loading={isActing}
            className={isFollowed ? 'is-followed' : ''}
            aria-label={isFollowed ? 'Đã theo dõi' : 'Theo dõi'}
          >
            {isFollowed ? 'Đã theo dõi' : 'Theo dõi'}
          </S.FollowButton>
        </div>
      </S.Toolbar>

      {/* ===== Khu đọc ảnh ===== */}
      {chapterStatus === 'loading' ? (
        <Skeleton active paragraph={{ rows: 8 }} />
      ) : chapterError ? (
        <Empty description="Không tải được chapter" />
      ) : (
        <S.Reader>
          {imageList.length === 0 ? (
            <Empty description="Chưa có ảnh cho chapter này" />
          ) : (
            imageList.map((img, idx) => (
              <div key={img?.id || idx} className="img-wrap">
                <Image
                  src={img?.img_path || ''}
                  alt={`${storyName} - chapter ${chapterNumber ?? '?'} - trang ${idx + 1}`}
                  preview={false}
                  loading="lazy"
                />
              </div>
            ))
          )}
        </S.Reader>
      )}
    </S.Page>
  )
}

export default ChapterDetail
