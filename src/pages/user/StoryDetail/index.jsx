import {
  DeleteOutlined,
  HeartFilled,
  LikeFilled,
  LikeOutlined,
  LoginOutlined,
  MessageOutlined,
} from '@ant-design/icons'
import {
  Avatar,
  Button,
  Divider,
  Empty,
  Image,
  Input,
  message,
  Popconfirm,
  Rate,
  Skeleton,
  Space,
  Spin,
  Table,
  Tooltip,
  Typography,
} from 'antd'
import qs from 'qs'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import {
  createChapterComment as createChapterCommentThunk,
  deleteComment as deleteCommentThunk,
  getChaptersByStory,
  toggleLikeComment as toggleLikeCommentThunk,
} from '@redux/thunks/chapter.thunk'
import { followStory, unfollowStory } from '@redux/thunks/follow.thunk'
import {
  getStory,
  getStoryComments as getStoryCommentsThunk,
  getStoryRatingSummary,
  rateStory,
} from '@redux/thunks/story.thunk'

import FollowedStories from '@components/user/FollowedStories'
import ReadingHistory from '@components/user/ReadingHistory'
import TopStory from '@components/user/TopStory'
import { ROUTES } from '@constants/routes'
import { fmtDT, timeAgo } from '@utils/date'
import * as S from './styles'

const { Paragraph, Text } = Typography
const { TextArea } = Input

/* ===== Helper: map status BE -> tiếng Việt ===== */
const viStatus = (s) => {
  if (!s) return 'Đang cập nhật'
  const map = {
    ongoing: 'Đang Tiến Hành',
    completed: 'Hoàn Thành',
    hiatus: 'Tạm Dừng',
    coming_soon: 'Sắp Ra Mắt',
  }
  return map[s] || 'Đang cập nhật'
}

/* ===== Helper: bỏ thẻ HTML khỏi description ===== */
const stripHtml = (html) => (html || '').replace(/<[^>]*>/g, '').trim()

/* ===== Helpers về số chapter ===== */
const extractNum = (v) => {
  if (v == null) return null
  if (typeof v === 'number') return v
  const m = String(v).match(/\d+/)
  return m ? Number(m[0]) : null
}
const getChapterNum = (c) =>
  extractNum(c?.chapter_number ?? c?.number ?? c?.order ?? c?.index ?? c?.name)

const StoryDetail = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()

  /* ===== Store slices ===== */
  const { data: currentUser } = useSelector((s) => s.auth.myProfile)
  const { data: story = {}, status: storyStatus, error: storyError } = useSelector((s) => s.story.storyDetail)
  const ratingSummary = useSelector((s) => s.story.ratingSummary)         // { data, status, error }
  const storyComments = useSelector((s) => s.story.storyComments)         // { data, meta, status, error }
  const { data: comments = [], meta: cmeta = {}, status: cstatus, error: cerror } = storyComments
  const { followAction, unfollowAction } = useSelector((s) => s.follow)
  const { chaptersByStory } = useSelector((s) => s.chapter)
  const { data: chapterList = [], status: chaptersStatus, history } = chaptersByStory

  const isLoggedIn  = !!currentUser?.id
  const isFollowed  = !!story?.is_followed
  const isActing    = followAction.status === 'loading' || unfollowAction.status === 'loading'
  const ratingBusy  = ratingSummary?.status === 'loading'

  /* ===== Nạp dữ liệu ===== */
  useEffect(() => {
    if (!id) return
    dispatch(getStory({ id }))
    dispatch(getChaptersByStory({ storyId: id }))
    dispatch(getStoryRatingSummary({ storyId: id }))
    dispatch(getStoryCommentsThunk({ storyId: id, page: 1, limit: 20, order: 'desc' }))
  }, [dispatch, id])

  /* ===== Hiển thị đủ/ít chương ===== */
  const [showAllChapters, setShowAllChapters] = useState(false)
  const MAX_SHOWN = 18

  /* ===== Thể loại ===== */
  const categories = useMemo(() => story?.category_id_categories || [], [story])

  /* ===== Bảng chapter ===== */
  const chapterRows = useMemo(() => {
    const src = showAllChapters ? chapterList : chapterList.slice(0, MAX_SHOWN)
    return src.map((c) => {
      const num = getChapterNum(c)
      const rel = timeAgo(c.updatedAt || c.createdAt || c.updated_at || c.created_at) || '—'
      return { key: c.id, id: c.id, number: num ?? '?', rel, _num: num }
    })
  }, [chapterList, showAllChapters])

  /* ===== Sort chương tăng dần để lấy first/last ===== */
  const sortedChapters = useMemo(() => {
    const arr = [...chapterList]
    arr.sort((a, b) => {
      const na = getChapterNum(a)
      const nb = getChapterNum(b)
      if (na == null && nb == null) return (a.id ?? 0) - (b.id ?? 0)
      if (na == null) return 1
      if (nb == null) return -1
      if (na !== nb) return na - nb
      return (a.id ?? 0) - (b.id ?? 0)
    })
    return arr
  }, [chapterList])

  const firstChapterId = sortedChapters[0]?.id ?? null
  const lastChapterId  = sortedChapters[sortedChapters.length - 1]?.id ?? null

  /* ===== Điều hướng đọc ===== */
  const goFirst = () => firstChapterId && navigate(ROUTES.USER.CHAPTER.replace(':id', firstChapterId))
  const goLast  = () => lastChapterId  && navigate(ROUTES.USER.CHAPTER.replace(':id', lastChapterId))

  /* ===== Highlight đã đọc ===== */
  const lastReadNum = useMemo(() => {
    if (!history?.chapter_id) return null
    const found = chapterList.find((c) => c.id === history.chapter_id)
    return getChapterNum(found)
  }, [history, chapterList])

  /* ===== Cột bảng chapter ===== */
  const chapterColumns = [
    {
      title: 'Số chương',
      dataIndex: 'number',
      key: 'number',
      width: 180,
      render: (n, row) => (
        <S.ChapterLinkBtn
          role="link"
          tabIndex={0}
          onClick={() => navigate(ROUTES.USER.CHAPTER.replace(':id', row.id))}
          onKeyDown={(e) => e.key === 'Enter' && navigate(ROUTES.USER.CHAPTER.replace(':id', row.id))}
          aria-label={`Đọc chapter ${n}`}
        >
          Chapter {n}
        </S.ChapterLinkBtn>
      ),
    },
    {
      title: 'Cập nhật',
      dataIndex: 'rel',
      key: 'rel',
      render: (t) => <span className="muted">{t}</span>,
    },
  ]

  /* ===== Meta hiển thị ===== */
  const cover          = story?.thumbnail || 'https://placehold.co/200x270?text=No+Image'
  const title          = story?.name || 'Đang cập nhật'
  const updatedAtLabel = fmtDT(story?.updatedAt)
  const author         = (story?.author || '').trim() || 'Đang cập nhật'
  const statusText     = viStatus(story?.status)
  const follows        = story?.total_follow ?? 0

  /* ===== Rating summary (ưu tiên từ API summary; fallback về fields trong story) ===== */
  const sum = ratingSummary?.data
  const avgRating    = Number(sum?.avg_rating ?? story?.avg_rating ?? 0)
  const ratingsCount = Number(sum?.ratings_count ?? story?.ratings_count ?? 0)
  const dist         = sum?.distribution || { 5:0, 4:0, 3:0, 2:0, 1:0 }
  const userRating   = Number(sum?.user_rating ?? 0)

  const handleToggleFollow = async () => {
    if (!isLoggedIn || !story?.id) return
    try {
      if (!isFollowed) {
        const res = await dispatch(followStory({ storyId: story.id })).unwrap()
        message.success(res?.message || 'Đã theo dõi')
      } else {
        const res = await dispatch(unfollowStory({ storyId: story.id })).unwrap()
        message.success(res?.message || 'Đã bỏ theo dõi')
      }
      dispatch(getStory({ id })) // đồng bộ is_followed & total_follow
    } catch (err) {
      message.error(err?.message || 'Có lỗi xảy ra')
    }
  }

  /* ===== Chấm/đổi sao ===== */
  const onRate = async (value) => {
    if (!isLoggedIn) {
      message.info('Bạn cần đăng nhập để đánh giá.')
      return
    }
    if (!story?.id) return
    if (!Number.isInteger(value) || value < 1 || value > 5) {
      message.warning('Hãy chọn từ 1 đến 5 sao.')
      return
    }
    try {
      await dispatch(rateStory({ storyId: story.id, rating: value })).unwrap()
      message.success('Đã ghi nhận đánh giá')
    } catch (e) {
      message.error(e?.message || 'Không thể gửi đánh giá')
    }
  }

  /* ===== Điều hướng tới trang Search đã lọc theo thể loại ===== */
  const goToCategory = (cat) => {
    const search = qs.stringify(
      { 'categoryIds[]': [cat.id] },
      { addQueryPrefix: true, arrayFormat: 'brackets' }
    )
    navigate(`${ROUTES.USER.SEARCH}${search}`)
  }

  /* ===== Helper % phân phối ===== */
  const distTotal = Object.values(dist).reduce((a, b) => a + Number(b || 0), 0) || 1
  const pct = (n) => Math.round((Number(n || 0) * 100) / distTotal)

  /* ===== Bình luận — state & handlers (đồng bộ cách làm với ChapterDetail) ===== */
  const [newCommentText, setNewCommentText] = useState('')
  const [isPostingComment, setIsPostingComment] = useState(false)
  const [replyBoxOpenMap, setReplyBoxOpenMap] = useState({}) // { [cid]: bool }
  const [replyTextMap, setReplyTextMap] = useState({})       // { [cid]: string }
  const [replyBusyMap, setReplyBusyMap] = useState({})       // { [cid]: bool }

  const toggleReplyBox = (cid) => setReplyBoxOpenMap(m => ({ ...m, [cid]: !m[cid] }))
  const handleChangeReplyText = (cid, val) => setReplyTextMap(m => ({ ...m, [cid]: val }))

  // Đăng bình luận mới: gắn vào chapter mới nhất để tương thích API
  const submitComment = async () => {
    if (!isLoggedIn) return message.info('Bạn cần đăng nhập để bình luận.')
    if (!lastChapterId) return message.warning('Chưa có chapter để bình luận.')
    const body = String(newCommentText || '').trim()
    if (!body) return

    try {
      setIsPostingComment(true)
      await dispatch(createChapterCommentThunk({ chapterId: lastChapterId, body })).unwrap()
      setNewCommentText('')
      // refresh danh sách bình luận theo truyện (trả về page 1)
      await dispatch(getStoryCommentsThunk({ storyId: id, page: 1, limit: cmeta?.limit || 20, order: 'desc' }))
      message.success('Đã đăng bình luận')
    } catch (e) {
      message.error(e?.message || 'Không thể đăng bình luận')
    } finally {
      setIsPostingComment(false)
    }
  }

  // Trả lời bình luận gốc
  const handlePostReply = async (rootCmt) => {
    if (!isLoggedIn) return message.info('Bạn cần đăng nhập để trả lời.')
    const body = String(replyTextMap[rootCmt.id] || '').trim()
    if (!body) return message.warning('Nhập nội dung trả lời.')
    if (!rootCmt.chapter_id) return message.error('Thiếu chapter_id cho bình luận này.')

    try {
      setReplyBusyMap(m => ({ ...m, [rootCmt.id]: true }))
      await dispatch(
        createChapterCommentThunk({
          chapterId: rootCmt.chapter_id,
          body,
          parent_id: rootCmt.id,
        })
      ).unwrap()
      setReplyTextMap(m => ({ ...m, [rootCmt.id]: '' }))
      setReplyBoxOpenMap(m => ({ ...m, [rootCmt.id]: false }))
      await dispatch(getStoryCommentsThunk({ storyId: id, page: 1, limit: cmeta?.limit || 20, order: 'desc' }))
      message.success('Đã trả lời')
    } catch (e) {
      message.error(e?.message || 'Không thể gửi trả lời')
    } finally {
      setReplyBusyMap(m => ({ ...m, [rootCmt.id]: false }))
    }
  }

  // Like/Unlike bình luận → refresh để đồng bộ likes_count
  const handleToggleLike = async (commentId) => {
    if (!isLoggedIn) return message.info('Bạn cần đăng nhập để thích bình luận.')
    try {
      await dispatch(toggleLikeCommentThunk({ commentId })).unwrap()
      await dispatch(getStoryCommentsThunk({
        storyId: id,
        page: cmeta?.page || 1,
        limit: cmeta?.limit || 20,
        order: 'desc',
        more: false,
      }))
    } catch (e) {
      message.error(e?.message || 'Không thể thực hiện')
    }
  }

  // Xoá bình luận
  const handleDeleteComment = async (commentId) => {
    if (!isLoggedIn) return message.info('Bạn cần đăng nhập.')
    try {
      await dispatch(deleteCommentThunk({ commentId })).unwrap()
      await dispatch(getStoryCommentsThunk({ storyId: id, page: 1, limit: cmeta?.limit || 20, order: 'desc' }))
      message.success('Đã xoá bình luận')
    } catch (e) {
      message.error(e?.message || 'Không thể xoá')
    }
  }

  // Load more
  const handleLoadMore = async () => {
    const page = Number(cmeta?.page || 1)
    const totalPages = Number(cmeta?.totalPages || 1)
    if (page >= totalPages) return
    await dispatch(
      getStoryCommentsThunk({
        storyId: id,
        page: page + 1,
        limit: cmeta?.limit || 20,
        order: 'desc',
        more: true,
      })
    )
  }

  return (
    <S.Page>
      {/* Lưới 2 cột: trái nội dung – phải sidebar */}
      <S.ContentGrid>
        {/* Cột trái: nội dung chính */}
        <section>
          <S.TitleBlock>
            <S.PageTitle>{title}</S.PageTitle>
            <S.UpdatedAt>{updatedAtLabel ? `[Cập nhật lúc: ${updatedAtLabel}]` : ''}</S.UpdatedAt>
          </S.TitleBlock>

          {storyStatus === 'loading' ? (
            <Skeleton active paragraph={{ rows: 6 }} />
          ) : storyError ? (
            <Empty description="Không tải được dữ liệu truyện" />
          ) : (
            <>
              {/* ===== Tóm tắt + meta ===== */}
              <S.TopInfo>
                {/* Bìa truyện */}
                <div className="cover">
                  <Image
                    src={cover}
                    alt={title}
                    width={200}
                    height={270}
                    preview={false}
                    style={{ objectFit: 'cover', borderRadius: 10 }}
                  />
                </div>

                {/* Metadata + Rating */}
                <div className="meta">
                  <S.FieldRow>
                    <i className="fa fa-user icon" />
                    <span className="label">Tác giả</span>
                    <span className="value">{author}</span>
                  </S.FieldRow>

                  <S.FieldRow>
                    <i className="fa fa-rss icon" />
                    <span className="label">Tình trạng</span>
                    <span className="value">{statusText}</span>
                  </S.FieldRow>

                  <S.FieldRow>
                    <i className="fa fa-tags icon" />
                    <span className="label">Thể loại</span>
                    <span className="value">
                      {categories.length
                        ? categories.map((c, i) => (
                            <span key={c.id}>
                              <S.CategoryLink
                                role="link"
                                tabIndex={0}
                                onClick={() => goToCategory(c)}
                                onKeyDown={(e) => e.key === 'Enter' && goToCategory(c)}
                                title={`Tìm truyện thuộc ${c.name}`}
                              >
                                {c.name}
                              </S.CategoryLink>
                              {i < categories.length - 1 ? ' - ' : ''}
                            </span>
                          ))
                        : 'Đang cập nhật'}
                    </span>
                  </S.FieldRow>

                  {/* ===== Xếp hạng & Đánh giá ===== */}
                  <S.RatingWrap>
                    <div className="left">
                      <div className="avg">{avgRating.toFixed(2)}</div>
                      <div className="sub">/ 5 điểm</div>
                      <div className="count">{ratingsCount} lượt</div>

                      <Rate
                        value={userRating || 0}
                        onChange={onRate}
                        allowClear={false}
                        disabled={!isLoggedIn || ratingBusy}
                      />
                      {!isLoggedIn && <div className="hint">Đăng nhập để chấm sao</div>}
                      {isLoggedIn && userRating > 0 && (
                        <div className="hint">Bạn đã đánh giá: <strong>{userRating}★</strong></div>
                      )}
                    </div>

                    <div className="right">
                      {[5,4,3,2,1].map((star) => (
                        <S.DistRow key={star}>
                          <span className="label">{star}★</span>
                          <S.DistBar>
                            <span className="bar" style={{ width: `${pct(dist[star])}%` }} />
                          </S.DistBar>
                          <span className="value">{dist[star] || 0} ({pct(dist[star])}%)</span>
                        </S.DistRow>
                      ))}
                    </div>
                  </S.RatingWrap>

                  {/* Follow + Read */}
                  <S.ActionRow>
                    <Space size="middle" wrap>
                      <S.FollowButton
                        icon={<HeartFilled />}
                        disabled={!isLoggedIn || isActing}
                        loading={isActing}
                        onClick={handleToggleFollow}
                        className={isFollowed ? 'is-followed' : ''}
                      >
                        {isFollowed ? 'Đã theo dõi' : 'Theo dõi'}
                      </S.FollowButton>

                      <span className="value strong" style={{ fontSize: 18 }}>
                        {follows}
                      </span>
                      <span style={{ fontWeight: 600 }}>Người đã theo dõi</span>
                    </Space>

                    <Space size="middle" wrap style={{ marginTop: 12 }}>
                      <S.ReadButton onClick={goFirst} disabled={!firstChapterId}>
                        Đọc từ đầu
                      </S.ReadButton>
                      <S.ReadButton onClick={goLast} disabled={!lastChapterId}>
                        Đọc mới nhất
                      </S.ReadButton>
                    </Space>
                  </S.ActionRow>
                </div>
              </S.TopInfo>

              <Divider />

              {/* ===== Nội dung mô tả ===== */}
              <S.SectionHeader>
                <S.SectionTitle>
                  <i className="fa fa-list-ul" /> NỘI DUNG TRUYỆN {title.toUpperCase()} TRÊN NETTRUYEN
                </S.SectionTitle>
              </S.SectionHeader>

              <Paragraph style={{ marginTop: 8 }} ellipsis={{ rows: 3, expandable: true, symbol: 'Xem thêm' }}>
                {stripHtml(story?.description) || 'Đang cập nhật nội dung...'}
              </Paragraph>

              <Divider />

              {/* ===== Danh sách chương ===== */}
              <S.SectionHeader>
                <S.SectionTitle>
                  <i className="fa fa-list-ul" /> DANH SÁCH CHƯƠNG
                </S.SectionTitle>
              </S.SectionHeader>

              <S.ChapterTableWrap>
                <Table
                  size="middle"
                  pagination={false}
                  loading={chaptersStatus === 'loading'}
                  columns={chapterColumns}
                  dataSource={chapterRows}
                  rowClassName={(row) => {
                    const isLast = history?.chapter_id && row.id === history.chapter_id
                    const isRead = lastReadNum != null && row._num != null && row._num <= lastReadNum
                    return `${isLast ? 'is-last-read' : ''} ${isRead ? 'is-read' : ''}`.trim()
                  }}
                  style={{ marginTop: 12 }}
                  locale={{ emptyText: 'Chưa có dữ liệu chương' }}
                />
              </S.ChapterTableWrap>

              {!showAllChapters && chapterList.length > MAX_SHOWN && (
                <div style={{ textAlign: 'center', marginTop: 12 }}>
                  <Button type="link" onClick={() => setShowAllChapters(true)}>
                    + Xem thêm
                  </Button>
                </div>
              )}

              <Divider />

              {/* ===== BÌNH LUẬN ===== */}
              <S.SectionHeader>
                <S.SectionTitle>
                  <i className="fa fa-comments" /> BÌNH LUẬN
                </S.SectionTitle>
              </S.SectionHeader>

              {/* Ô nhập bình luận mới */}
              <div style={{ margin: '8px 0 16px' }}>
                {!isLoggedIn && (
                  <div style={{ marginBottom: 8 }}>
                    <Text type="secondary">
                      <LoginOutlined /> Bạn cần đăng nhập để bình luận và thích.
                    </Text>
                  </div>
                )}
                <TextArea
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  autoSize={{ minRows: 3, maxRows: 6 }}
                  maxLength={2000}
                  placeholder={isLoggedIn ? 'Viết bình luận của bạn…' : 'Đăng nhập để bình luận'}
                  disabled={!isLoggedIn || isPostingComment}
                />
                <div style={{ marginTop: 8, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <Button
                    type="primary"
                    onClick={submitComment}
                    loading={isPostingComment}
                    disabled={!isLoggedIn || !newCommentText.trim()}
                  >
                    Gửi bình luận
                  </Button>
                  {!lastChapterId && (
                    <span className="muted" style={{ alignSelf: 'center' }}>
                      (Chưa có chapter → không thể gắn bình luận)
                    </span>
                  )}
                </div>
              </div>

              <S.CommentsWrap>
                {cstatus === 'loading' && comments.length === 0 && <Spin style={{ margin: '12px 0' }} />}

                {cerror ? (
                  <Empty description="Không tải được bình luận" />
                ) : (comments || []).length === 0 ? (
                  <Empty description="Chưa có bình luận" />
                ) : (
                  <div>
                    {(comments || []).map((c) => {
                      const me = currentUser?.id
                      const canDelete = me && (me === c.user_id || currentUser?.role === 'admin')

                      return (
                        <div key={c.id} style={{ padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}>
                          <div style={{ display: 'flex', gap: 10 }}>
                            <Avatar size={36} src={c.user?.avatar} alt={c.user?.username} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                                <span style={{ fontWeight: 700 }}>{c.user?.username || 'Ẩn danh'}</span>
                                <span className="muted">•</span>
                                <Tooltip title={fmtDT(c.created_at || c.createdAt)}>
                                  <span className="muted">{fmtDT(c.created_at || c.createdAt)}</span>
                                </Tooltip>
                              </div>

                              <div style={{ whiteSpace: 'pre-wrap' }}>{c.body}</div>

                              <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
                                <Button
                                  type="text"
                                  icon={c.is_liked ? <LikeFilled /> : <LikeOutlined />}
                                  onClick={() => handleToggleLike(c.id)}
                                  disabled={!isLoggedIn}
                                  style={{ padding: 0, height: 28 }}
                                >
                                  {c.likes_count ?? 0}
                                </Button>

                                <Button
                                  type="text"
                                  icon={<MessageOutlined />}
                                  onClick={() => toggleReplyBox(c.id)}
                                  disabled={!isLoggedIn}
                                  style={{ padding: 0, height: 28 }}
                                >
                                  Trả lời
                                </Button>

                                {canDelete && (
                                  <Popconfirm
                                    title="Xoá bình luận này?"
                                    okText="Xoá"
                                    cancelText="Huỷ"
                                    onConfirm={() => handleDeleteComment(c.id)}
                                  >
                                    <Button type="text" danger icon={<DeleteOutlined />} style={{ padding: 0, height: 28 }}>
                                      Xoá
                                    </Button>
                                  </Popconfirm>
                                )}
                              </div>

                              {/* Form trả lời */}
                              {replyBoxOpenMap[c.id] && (
                                <div style={{ marginTop: 8 }}>
                                  <TextArea
                                    value={replyTextMap[c.id] || ''}
                                    onChange={(e) => handleChangeReplyText(c.id, e.target.value)}
                                    autoSize={{ minRows: 2, maxRows: 6 }}
                                    maxLength={2000}
                                    placeholder="Nhập trả lời…"
                                    disabled={!isLoggedIn || !!replyBusyMap[c.id]}
                                  />
                                  <div style={{ marginTop: 6, display: 'flex', gap: 8 }}>
                                    <Button
                                      type="primary"
                                      size="small"
                                      loading={!!replyBusyMap[c.id]}
                                      disabled={!isLoggedIn}
                                      onClick={() => handlePostReply(c)}
                                    >
                                      Gửi trả lời
                                    </Button>
                                    <Button size="small" onClick={() => toggleReplyBox(c.id)}>
                                      Huỷ
                                    </Button>
                                  </div>
                                </div>
                              )}

                              {/* Replies */}
                              {!!(c.story_comments || []).length && (
                                <div style={{ marginTop: 10, paddingLeft: 14, borderLeft: '2px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: 10 }}>
                                  {c.story_comments.map((r) => {
                                    const canDeleteReply = me && (me === r.user_id || currentUser?.role === 'admin')
                                    return (
                                      <div key={r.id} style={{ display: 'flex', gap: 8 }}>
                                        <Avatar size={28} src={r.user?.avatar} alt={r.user?.username} />
                                        <div style={{ flex: 1 }}>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                                            <span style={{ fontWeight: 700 }}>{r.user?.username || 'Ẩn danh'}</span>
                                            <span className="muted">•</span>
                                            <Tooltip title={fmtDT(r.created_at || r.createdAt)}>
                                              <span className="muted">{fmtDT(r.created_at || r.createdAt)}</span>
                                            </Tooltip>
                                          </div>
                                          <div style={{ whiteSpace: 'pre-wrap' }}>{r.body}</div>
                                          <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
                                            <Button
                                              type="text"
                                              icon={r.is_liked ? <LikeFilled /> : <LikeOutlined />}
                                              onClick={() => handleToggleLike(r.id)}
                                              disabled={!isLoggedIn}
                                              style={{ padding: 0, height: 28 }}
                                            >
                                              {r.likes_count ?? 0}
                                            </Button>

                                            {canDeleteReply && (
                                              <Popconfirm
                                                title="Xoá bình luận này?"
                                                okText="Xoá"
                                                cancelText="Huỷ"
                                                onConfirm={() => handleDeleteComment(r.id)}
                                              >
                                                <Button type="text" danger icon={<DeleteOutlined />} style={{ padding: 0, height: 28 }}>
                                                  Xoá
                                                </Button>
                                              </Popconfirm>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}

                    {/* Load more */}
                    {Number(cmeta?.page || 1) < Number(cmeta?.totalPages || 1) && (
                      <div className="load-more" style={{ textAlign: 'center', marginTop: 12 }}>
                        <Button onClick={handleLoadMore} loading={cstatus === 'loading'}>
                          Tải thêm
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </S.CommentsWrap>
            </>
          )}
        </section>

        {/* Cột phải: sidebar */}
        <aside>
          {currentUser?.id && (
            <>
              <FollowedStories />
              <ReadingHistory />
            </>
          )}
          <TopStory />
        </aside>
      </S.ContentGrid>
    </S.Page>
  )
}

export default StoryDetail
