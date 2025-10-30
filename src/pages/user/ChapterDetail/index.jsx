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
  likeComment as likeCommentThunk,
  unlikeComment as unlikeCommentThunk,
} from '@redux/thunks/chapter.thunk'
import { followStory, unfollowStory } from '@redux/thunks/follow.thunk'
import { getStory } from '@redux/thunks/story.thunk'
import { fmtDT } from '@utils/date'
import * as S from './styles'

const { Text } = Typography
const { TextArea } = Input

const getChapterNum = (c) => Number(c?.chapter_number ?? null)

const ChapterDetail = () => {
  const { id: chapterIdParam } = useParams()
  const chapterId = Number(chapterIdParam)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { data: currentUser } = useSelector((s) => s.auth.myProfile)
  const isLoggedIn = !!currentUser?.id

  const {
    data: chapter = {},
    previousChapterId,
    nextChapterId,
    is_following: chapterIsFollowing,
    status: chapterStatus,
    error: chapterError,
  } = useSelector((s) => s.chapter.chapterDetail)

  const { chaptersByStory, chapterComments } = useSelector((s) => s.chapter)
  const { data: chapterList = [], status: chaptersStatus } = chaptersByStory

  const {
    data: comments = [],
    meta: commentsMeta = {},
    status: commentsStatus,
    error: commentsError,
  } = chapterComments

  const [page, setPage] = useState(1)

  // Trạng thái comment tổng quát (đồng bộ với StoryDetail)
  const [newCommentText, setNewCommentText] = useState('')
  const [isPostingComment, setIsPostingComment] = useState(false)

  // Map cho UI trả lời theo từng bình luận gốc
  const [replyBoxOpenMap, setReplyBoxOpenMap] = useState({}) // { [commentId]: boolean }
  const [replyTextMap, setReplyTextMap] = useState({})       // { [commentId]: string }
  const [replyBusyMap, setReplyBusyMap] = useState({})       // { [commentId]: boolean }

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
  }, [dispatch, chapter?.story_id])

  /* ====== Danh sách chapter sort tăng dần (phục vụ select) ====== */
  const sortedChapters = useMemo(() => {
      return [...chapterList].sort((a, b) => {
        return getChapterNum(a) - getChapterNum(b)
      })
    }, [chapterList])

  const selectOptions = useMemo(
    () =>
      sortedChapters.map((c) => ({
        value: Number(c.id),
        label: `Chapter ${getChapterNum(c) ?? '?'}${c.title ? ` - ${c.title}` : ''}`,
      })),
    [sortedChapters]
  )

  /* ====== Điều hướng tới chapter cụ thể ====== */
  const goChapter = useCallback(
    (id) => {
      if (!id) return
      navigate(ROUTES.USER.CHAPTER.replace(':id', id))
      window.scrollTo({ top: 0, behavior: 'instant' })
    },
    [navigate]
  )
  const goPrev = () => goChapter(previousChapterId)
  const goNext = () => goChapter(nextChapterId)

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

  const chapterNumber = getChapterNum(chapter)
  const storyName = storyDetail?.name || 'Truyện'
  const updatedAtLabel = fmtDT(chapter?.updated_at || chapter?.updatedAt)

  const imageList = useMemo(() => {
    const arr = Array.isArray(chapter?.chapter_images) ? [...chapter.chapter_images] : []
    arr.sort((a, b) => (a?.sort_order ?? 0) - (b?.sort_order ?? 0))
    return arr
  }, [chapter])

  const goHome = () => navigate(ROUTES.USER.HOME)
  const goStory = () => chapter?.story_id && navigate(ROUTES.USER.STORY.replace(':id', chapter.story_id))
  const goStoryChapters = goStory

  // Like/Unlike bình luận → refresh để đồng bộ likes_count
  const handleToggleLikeComment = useCallback(async (commentId, nextLiked) => {
    if (!isLoggedIn) return message.info('Bạn cần đăng nhập để thích bình luận.')
    try {
      if (nextLiked) {
        await dispatch(likeCommentThunk({ commentId })).unwrap()
      } else {
        await dispatch(unlikeCommentThunk({ commentId })).unwrap()
      }
      // Không cần refetch; slice đã cập nhật is_liked + likes_count từ BE.
    } catch (e) {
      message.error(e?.message || 'Không thể thực hiện')
    }
  }, [dispatch, isLoggedIn])

  return (
    <S.Page>
      <S.BreadcrumbBar>
        <S.Crumb onClick={goHome}>Trang chủ</S.Crumb>
        <span>›</span>
        <S.Crumb onClick={goStory}>{storyName}</S.Crumb>
        <span>›</span>
        <Text strong>Chapter {chapterNumber ?? '?'}</Text>
        {updatedAtLabel && <S.UpdatedAt>&nbsp;[Cập nhật lúc: {updatedAtLabel}]</S.UpdatedAt>}
      </S.BreadcrumbBar>

      <Alert
        type="info"
        showIcon
        message="Mẹo: dùng phím mũi tên trái (←) / phải (→) để chuyển chapter nhanh."
        style={{ marginBottom: 8 }}
      />

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
          <S.NavButton icon={<LeftOutlined />} onClick={goPrev} disabled={!previousChapterId} aria-label="Chương trước" />

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

          <S.NavButton icon={<RightOutlined />} onClick={goNext} disabled={!nextChapterId} aria-label="Chương sau" />
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

          onToggleLike={handleToggleLikeComment}

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
