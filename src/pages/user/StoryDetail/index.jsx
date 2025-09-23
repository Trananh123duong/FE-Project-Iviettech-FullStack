import { HeartFilled } from '@ant-design/icons'
import { Button, Divider, Empty, Image, message, Rate, Skeleton, Space, Table, Typography } from 'antd'
import qs from 'qs'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import { getChaptersByStory } from '@redux/thunks/chapter.thunk'
import { followStory, unfollowStory } from '@redux/thunks/follow.thunk'
import { getStory, getStoryRatingSummary, rateStory } from '@redux/thunks/story.thunk'

import FollowedStories from '@components/user/FollowedStories'
import ReadingHistory from '@components/user/ReadingHistory'
import TopStory from '@components/user/TopStory'
import { ROUTES } from '@constants/routes'
import { fmtDT, timeAgo } from '@utils/date'
import * as S from './styles'

const { Paragraph } = Typography

/* ===== Helper: map status BE -> tiếng Việt ===== */
const viStatus = (s) => {
  if (!s) return 'Đang cập nhật'
  const map = { ongoing: 'Đang Tiến Hành', completed: 'Hoàn Thành', hiatus: 'Tạm Dừng' }
  return map[s] || 'Đang cập nhật'
}

/* ===== Helper: bỏ thẻ HTML khỏi description ===== */
const stripHtml = (html) => (html || '').replace(/<[^>]*>/g, '').trim()

/* ===== Helper: rút số chapter từ nhiều trường có thể có ===== */
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
  const ratingSummary = useSelector((s) => s.story.ratingSummary)         // 👈 {data,status,error}
  const { followAction, unfollowAction } = useSelector((s) => s.follow)
  const { chaptersByStory } = useSelector((s) => s.chapter)
  const { data: chapterList = [], status: chaptersStatus, history } = chaptersByStory

  /* ===== Nạp chi tiết truyện + danh sách chapter + rating summary ===== */
  useEffect(() => {
    if (!id) return
    dispatch(getStory({ id }))
    dispatch(getChaptersByStory({ storyId: id }))
    dispatch(getStoryRatingSummary({ storyId: id })) // tải tổng quan rating
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

  /* ===== Chấm sao của riêng user (state cục bộ) ===== */
  const [myRating, setMyRating] = useState(0) // chưa có API get "my rating", tạm để 0
  const isLoggedIn  = !!currentUser?.id
  const isFollowed  = !!story?.is_followed
  const isActing    = followAction.status === 'loading' || unfollowAction.status === 'loading'

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
    try {
      setMyRating(value) // UX: phản hồi ngay
      const res = await dispatch(rateStory({ storyId: story.id, rating: value })).unwrap()
      // res.summary đã cập nhật avg & count trong store.ratingSummary; storyDetail cũng sync từ extraReducer
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
                        value={myRating || 0}
                        onChange={onRate}
                        allowClear
                        disabled={!isLoggedIn}
                      />
                      {!isLoggedIn && <div className="hint">Đăng nhập để chấm sao</div>}
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
