import {
  HeartFilled,
  HomeFilled,
  LeftOutlined,
  RedoOutlined,
  RightOutlined,
  UnorderedListOutlined
} from '@ant-design/icons'
import {
  Alert,
  Button,
  Empty,
  Image,
  Input,
  message,
  Select,
  Skeleton,
  Typography
} from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import CommentThread from '@components/user/CommentThread'
import { ROUTES } from '@constants/routes'
import {
  createChapterComment as createChapterCommentThunk,
  deleteComment as deleteCommentThunk,
  getChapter,
  getChapterComments,
  getChaptersByStory,
  toggleLikeComment as toggleLikeCommentThunk,
} from '@redux/thunks/chapter.thunk'
import { followStory, unfollowStory } from '@redux/thunks/follow.thunk'
import { getStory } from '@redux/thunks/story.thunk'
import { fmtDT } from '@utils/date'
import * as S from './styles'

const { Text } = Typography
const { TextArea } = Input

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
  const isLoggedIn = !!currentUser?.id

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
  const { chaptersByStory, chapterComments } = useSelector((s) => s.chapter)
  const { data: chapterList = [], status: chaptersStatus } = chaptersByStory

  /* ====== Comments theo chapter ====== */
  const {
    data: comments = [],
    meta: commentsMeta = {},
    status: commentsStatus,
    error: commentsError,
  } = chapterComments

  // Phân trang "tải thêm"
  const [page, setPage] = useState(1)

  // Trạng thái comment tổng quát (đồng bộ với StoryDetail)
  const [newCommentText, setNewCommentText] = useState('')
  const [isPostingComment, setIsPostingComment] = useState(false)

  // Map cho UI trả lời theo từng bình luận gốc
  const [replyBoxOpenMap, setReplyBoxOpenMap] = useState({}) // { [commentId]: boolean }
  const [replyTextMap, setReplyTextMap] = useState({})       // { [commentId]: string }
  const [replyBusyMap, setReplyBusyMap] = useState({})       // { [commentId]: boolean }

  /* ====== Detail story (hiện tên, dùng breadcrumb) ====== */
  const storyDetail = useSelector((s) => s.story.storyDetail.data)

  /* ====== Trạng thái follow/unfollow ====== */
  const { followAction, unfollowAction } = useSelector((s) => s.follow)
  const isActing = followAction.status === 'loading' || unfollowAction.status === 'loading'
  const isFollowed = !!chapterIsFollowing

  /* ====== Khi đổi chapterId -> gọi API lấy chi tiết & comments ====== */
  useEffect(() => {
    if (!chapterId) return
    dispatch(getChapter({ id: chapterId }))
    setPage(1)
    dispatch(getChapterComments({ chapterId, page: 1, limit: 20 }))
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

  /* ====== previous/next: ưu tiên từ store, fallback theo vị trí ====== */
  const currentIndex = useMemo(
    () => sortedChapters.findIndex((c) => Number(c.id) === Number(chapterId)),
    [sortedChapters, chapterId]
  )
  const prevId =
    previousChapterId ?? (currentIndex > 0 ? sortedChapters[currentIndex - 1]?.id : null)
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
  const goStoryChapters = goStory

  /* =========================
   * Phần BÌNH LUẬN — đồng bộ với StoryDetail
   * ========================= */

  // Tải thêm
  const hasMore = (commentsMeta?.totalPages || 1) > page
  const loadMore = () => {
    const next = page + 1
    setPage(next)
    dispatch(getChapterComments({ chapterId, page: next, limit: 20, more: true }))
  }

  // Mở/đóng ô trả lời cho 1 comment gốc
  const toggleReplyBox = useCallback((commentId) => {
    setReplyBoxOpenMap((m) => ({ ...m, [commentId]: !m[commentId] }))
  }, [])

  // Nhập nội dung trả lời cho 1 comment gốc
  const handleChangeReplyText = useCallback((commentId, text) => {
    setReplyTextMap((m) => ({ ...m, [commentId]: text }))
  }, [])

  // Gửi bình luận mới (comment gốc)
  const submitComment = async () => {
    if (!isLoggedIn) return message.info('Bạn cần đăng nhập để bình luận')
    const content = String(newCommentText || '').trim()
    if (!content) return
    try {
      setIsPostingComment(true)
      await dispatch(
        createChapterCommentThunk({
          chapterId,
          body: content,
          parent_id: null,
        })
      ).unwrap()
      setNewCommentText('')
      // Refresh về page 1 để đảm bảo thấy comment mới nhất
      setPage(1)
      await dispatch(getChapterComments({ chapterId, page: 1, limit: 20 }))
      message.success('Đã gửi bình luận')
    } catch (e) {
      message.error(e?.message || 'Không gửi được bình luận')
    } finally {
      setIsPostingComment(false)
    }
  }

  // Gửi trả lời cho 1 comment gốc
  const handlePostReply = useCallback(async (rootComment) => {
    if (!isLoggedIn) return message.info('Bạn cần đăng nhập để trả lời.')
    const body = String(replyTextMap[rootComment.id] || '').trim()
    if (!body) return message.warning('Nhập nội dung trả lời.')
    if (!rootComment.chapter_id) return message.error('Thiếu chapter_id cho bình luận này.')

    try {
      setReplyBusyMap((m) => ({ ...m, [rootComment.id]: true }))
      await dispatch(
        createChapterCommentThunk({
          chapterId: rootComment.chapter_id,
          body,
          parent_id: rootComment.id,
        })
      ).unwrap()
      setReplyTextMap((m) => ({ ...m, [rootComment.id]: '' }))
      setReplyBoxOpenMap((m) => ({ ...m, [rootComment.id]: false }))

      // Refresh trang hiện tại (quay về page 1 để thấy reply mới)
      setPage(1)
      await dispatch(getChapterComments({ chapterId, page: 1, limit: 20 }))
      message.success('Đã trả lời')
    } catch (e) {
      message.error(e?.message || 'Không thể gửi trả lời')
    } finally {
      setReplyBusyMap((m) => ({ ...m, [rootComment.id]: false }))
    }
  }, [dispatch, isLoggedIn, replyTextMap, chapterId])

  // Like/Unlike bình luận → refresh để đồng bộ likes_count
  const handleToggleLikeComment = useCallback(async (commentId) => {
    if (!isLoggedIn) return message.info('Bạn cần đăng nhập để thích bình luận.')
    try {
      await dispatch(toggleLikeCommentThunk({ commentId })).unwrap()
      await dispatch(getChapterComments({
        chapterId,
        page: commentsMeta?.page || 1,
        limit: commentsMeta?.limit || 20,
        order: 'desc',
        more: false,
      }))
    } catch (e) {
      message.error(e?.message || 'Không thể thực hiện')
    }
  }, [dispatch, isLoggedIn, chapterId, commentsMeta?.page, commentsMeta?.limit])

  // Xoá bình luận → refresh
  const handleDeleteComment = useCallback(async (commentId) => {
    if (!isLoggedIn) return message.info('Bạn cần đăng nhập.')
    try {
      await dispatch(deleteCommentThunk({ commentId })).unwrap()
      setPage(1)
      await dispatch(getChapterComments({ chapterId, page: 1, limit: 20 }))
      message.success('Đã xoá bình luận')
    } catch (e) {
      message.error(e?.message || 'Không thể xoá')
    }
  }, [dispatch, isLoggedIn, chapterId])

  /* ====== Render ====== */
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

      {/* ====== BÌNH LUẬN (đồng bộ cách làm với StoryDetail) ====== */}
      <S.Comments>
        <CommentThread
          isLoggedIn={!!currentUser?.id}
          currentUser={currentUser}
          comments={comments}
          meta={commentsMeta}
          status={commentsStatus}
          error={commentsError}
          title="Bình luận"
          placeholder={isLoggedIn ? 'Nhập bình luận của bạn...' : 'Đăng nhập để bình luận'}

          onCreate={async (body) => {
            await dispatch(createChapterCommentThunk({
              chapterId,
              body,
              parent_id: null,
            })).unwrap()
            await dispatch(getChapterComments({ chapterId, page: 1, limit: 20 }))
          }}

          onReply={async (rootCmt, body) => {
            await dispatch(createChapterCommentThunk({
              chapterId: rootCmt.chapter_id,
              body,
              parent_id: rootCmt.id,
            })).unwrap()
            await dispatch(getChapterComments({ chapterId, page: 1, limit: 20 }))
          }}

          onToggleLike={async (commentId) => {
            await dispatch(toggleLikeCommentThunk({ commentId })).unwrap()
            await dispatch(getChapterComments({
              chapterId,
              page: commentsMeta?.page || 1,
              limit: commentsMeta?.limit || 20,
              order: 'desc',
              more: false,
            }))
          }}

          onDelete={async (commentId) => {
            await dispatch(deleteCommentThunk({ commentId })).unwrap()
            await dispatch(getChapterComments({ chapterId, page: 1, limit: 20 }))
          }}

          onLoadMore={() => {
            const next = Number(commentsMeta?.page || 1) + 1
            return dispatch(getChapterComments({ chapterId, page: next, limit: 20, more: true }))
          }}
        />
      </S.Comments>
    </S.Page>
  )
}

export default ChapterDetail
