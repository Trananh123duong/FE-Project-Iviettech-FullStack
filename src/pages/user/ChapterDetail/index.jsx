import {
  CloseCircleOutlined,
  DeleteOutlined,
  HeartFilled,
  HomeFilled,
  LeftOutlined,
  LikeFilled,
  LikeOutlined,
  LoginOutlined,
  MessageOutlined,
  RedoOutlined,
  RightOutlined,
  SendOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'
import {
  Alert,
  Avatar,
  Button,
  Empty,
  Image,
  Input,
  message,
  Popconfirm,
  Select,
  Skeleton,
  Tooltip,
  Typography,
} from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import { ROUTES } from '@constants/routes'
import {
  createChapterComment,
  deleteComment as deleteCommentThunk,
  getChapter,
  getChapterComments,
  getChaptersByStory,
  toggleLikeComment,
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
    meta: cmMeta = {},
    status: cmStatus,
    error: cmError,
  } = chapterComments
  const [page, setPage] = useState(1)
  const [commentBody, setCommentBody] = useState('')
  const [replyTo, setReplyTo] = useState(null) // id comment cha (nếu reply)

  /* ====== Detail story (hiện tên, dùng breadcrumb) ====== */
  const storyDetail = useSelector((s) => s.story.storyDetail.data)

  /* ====== Trạng thái follow/unfollow ====== */
  const { followAction, unfollowAction } = useSelector((s) => s.follow)
  const isActing = followAction.status === 'loading' || unfollowAction.status === 'loading'
  const isFollowed = !!chapterIsFollowing

  /* ====== Khi đổi chapterId -> gọi API lấy chi tiết ====== */
  useEffect(() => {
    if (chapterId) {
      dispatch(getChapter({ id: chapterId }))
      // reset comments state theo chapter mới
      setPage(1)
      dispatch(getChapterComments({ chapterId, page: 1, limit: 20 }))
    }
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

  /* ====== Comments: helpers ====== */
  const hasMore =
    (cmMeta?.totalPages || 1) > page

  const loadMore = () => {
    const next = page + 1
    setPage(next)
    dispatch(getChapterComments({ chapterId, page: next, limit: 20, more: true }))
  }

  const onReply = (parentId) => setReplyTo(parentId)
  const cancelReply = () => setReplyTo(null)

  const onLike = async (commentId) => {
    try {
      await dispatch(toggleLikeComment({ commentId })).unwrap()
    } catch (e) {
      message.error(e?.message || 'Không thể thực hiện thao tác')
    }
  }

  const onDelete = async (commentId) => {
    try {
      await dispatch(deleteCommentThunk({ commentId })).unwrap()
      message.success('Đã xoá bình luận')
    } catch (e) {
      message.error(e?.message || 'Không thể xoá bình luận')
    }
  }

  const submitComment = async () => {
    if (!isLoggedIn) {
      return message.info('Bạn cần đăng nhập để bình luận')
    }
    const content = String(commentBody || '').trim()
    if (!content) return

    try {
      await dispatch(
        createChapterComment({
          chapterId,
          body: content,
          parent_id: replyTo || null,
          is_spoiler: false,
        })
      ).unwrap()
      setCommentBody('')
      setReplyTo(null)
      message.success('Đã gửi bình luận')
    } catch (e) {
      message.error(e?.message || 'Không gửi được bình luận')
    }
  }

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

      {/* ====== BÌNH LUẬN ====== */}
      <S.Comments>
        <S.CommentsHeader>
          <Text strong>Bình luận</Text>
          {cmMeta?.total != null && (
            <span className="count">({cmMeta.total} bình luận)</span>
          )}
        </S.CommentsHeader>

        {!isLoggedIn && (
          <Alert
            type="warning"
            showIcon
            icon={<LoginOutlined />}
            message="Bạn cần đăng nhập để bình luận và thích."
            style={{ marginBottom: 12 }}
          />
        )}

        {/* Form comment */}
        <S.CommentForm>
          {replyTo && (
            <S.ReplyTag>
              <MessageOutlined />
              <span>Đang trả lời bình luận #{replyTo}</span>
              <Button
                type="text"
                size="small"
                icon={<CloseCircleOutlined />}
                onClick={cancelReply}
              />
            </S.ReplyTag>
          )}
          <TextArea
            value={commentBody}
            onChange={(e) => setCommentBody(e.target.value)}
            placeholder={isLoggedIn ? 'Nhập bình luận của bạn...' : 'Đăng nhập để bình luận'}
            autoSize={{ minRows: 3, maxRows: 6 }}
            disabled={!isLoggedIn}
            maxLength={2000}
          />
          <div className="actions">
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={submitComment}
              disabled={!isLoggedIn || !commentBody.trim()}
            >
              Gửi
            </Button>
          </div>
        </S.CommentForm>

        {/* Danh sách bình luận */}
        {cmStatus === 'loading' && comments.length === 0 ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : cmError ? (
          <Empty description="Không tải được bình luận" />
        ) : comments.length === 0 ? (
          <Empty description="Chưa có bình luận nào — hãy là người đầu tiên!" />
        ) : (
          <S.CommentList>
            {comments.map((c) => (
              <S.CommentItem key={c.id}>
                <div className="avatar">
                  <Avatar size={36} src={c.user?.avatar} alt={c.user?.username} />
                </div>
                <div className="content">
                  <div className="meta">
                    <span className="author">{c.user?.username || 'Ẩn danh'}</span>
                    <span className="dot">•</span>
                    <Tooltip title={fmtDT(c.created_at || c.createdAt)}>
                      <span className="time">{fmtDT(c.created_at || c.createdAt)}</span>
                    </Tooltip>
                  </div>
                  <div className="body">{c.body}</div>
                  <div className="actions">
                    <Button
                      type="text"
                      icon={c.is_liked ? <LikeFilled /> : <LikeOutlined />}
                      onClick={() => onLike(c.id)}
                      disabled={!isLoggedIn}
                    >
                      {c.likes_count ?? 0}
                    </Button>
                    <Button
                      type="text"
                      icon={<MessageOutlined />}
                      onClick={() => onReply(c.id)}
                      disabled={!isLoggedIn}
                    >
                      Trả lời
                    </Button>
                    {(isLoggedIn && (c.user_id === currentUser?.id || currentUser?.role)) && (
                      <Popconfirm
                        title="Xoá bình luận này?"
                        okText="Xoá"
                        cancelText="Huỷ"
                        onConfirm={() => onDelete(c.id)}
                      >
                        <Button type="text" danger icon={<DeleteOutlined />}>
                          Xoá
                        </Button>
                      </Popconfirm>
                    )}
                  </div>

                  {/* Replies */}
                  {!!c.replies?.length && (
                    <div className="replies">
                      {c.replies.map((r) => (
                        <div key={r.id} className="reply">
                          <div className="avatar">
                            <Avatar size={28} src={r.user?.avatar} alt={r.user?.username} />
                          </div>
                          <div className="content">
                            <div className="meta">
                              <span className="author">{r.user?.username || 'Ẩn danh'}</span>
                              <span className="dot">•</span>
                              <Tooltip title={fmtDT(r.created_at || r.createdAt)}>
                                <span className="time">{fmtDT(r.created_at || r.createdAt)}</span>
                              </Tooltip>
                            </div>
                            <div className="body">{r.body}</div>
                            <div className="actions">
                              <Button
                                type="text"
                                icon={r.is_liked ? <LikeFilled /> : <LikeOutlined />}
                                onClick={() => onLike(r.id)}
                                disabled={!isLoggedIn}
                              >
                                {r.likes_count ?? 0}
                              </Button>
                              {(isLoggedIn && (r.user_id === currentUser?.id || currentUser?.role)) && (
                                <Popconfirm
                                  title="Xoá bình luận này?"
                                  okText="Xoá"
                                  cancelText="Huỷ"
                                  onConfirm={() => onDelete(r.id)}
                                >
                                  <Button type="text" danger icon={<DeleteOutlined />}>
                                    Xoá
                                  </Button>
                                </Popconfirm>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </S.CommentItem>
            ))}

            {hasMore && (
              <div className="load-more">
                <Button onClick={loadMore} loading={cmStatus === 'loading'}>
                  Tải thêm bình luận
                </Button>
              </div>
            )}
          </S.CommentList>
        )}
      </S.Comments>
    </S.Page>
  )
}

export default ChapterDetail
