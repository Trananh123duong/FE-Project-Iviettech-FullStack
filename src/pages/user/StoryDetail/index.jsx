import { HeartFilled } from '@ant-design/icons'
import { Button, Divider, Empty, Image, message, Rate, Skeleton, Space, Table, Typography } from 'antd'
import qs from 'qs'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import { getChaptersByStory } from '@redux/thunks/chapter.thunk'
import { followStory, unfollowStory } from '@redux/thunks/follow.thunk'
import { getStory } from '@redux/thunks/story.thunk'

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
  const { followAction, unfollowAction } = useSelector((s) => s.follow)
  const { chaptersByStory } = useSelector((s) => s.chapter)
  const { data: chapterList = [], status: chaptersStatus, history } = chaptersByStory

  /* ===== Nạp chi tiết truyện + danh sách chapter ===== */
  useEffect(() => {
    if (!id) return
    dispatch(getStory({ id }))
    dispatch(getChaptersByStory({ storyId: id }))
  }, [dispatch, id])

  /* ===== Hiển thị đủ/ít chương ===== */
  const [showAllChapters, setShowAllChapters] = useState(false)
  const MAX_SHOWN = 18

  /* ===== Thể loại (từ quan hệ category_id_categories) ===== */
  const categories = useMemo(() => story?.category_id_categories || [], [story])

  /* ===== Bảng chapter (giới hạn theo showAllChapters) ===== */
  const chapterRows = useMemo(() => {
    const src = showAllChapters ? chapterList : chapterList.slice(0, MAX_SHOWN)
    return src.map((c) => {
      const num = getChapterNum(c)
      const rel = timeAgo(c.updatedAt || c.createdAt || c.updated_at || c.created_at) || '—'
      return { key: c.id, id: c.id, number: num ?? '?', rel, _num: num }
    })
  }, [chapterList, showAllChapters])

  /* ===== Danh sách chapter sort tăng dần để lấy first/last ===== */
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

  /* ===== Điều hướng đọc từ đầu / mới nhất ===== */
  const goFirst = () => firstChapterId && navigate(ROUTES.USER.CHAPTER.replace(':id', firstChapterId))
  const goLast  = () => lastChapterId  && navigate(ROUTES.USER.CHAPTER.replace(':id', lastChapterId))

  /* ===== Số chapter đã đọc gần nhất để highlight bảng ===== */
  const lastReadNum = useMemo(() => {
    if (!history?.chapter_id) return null
    const found = chapterList.find((c) => c.id === history.chapter_id)
    return getChapterNum(found)
  }, [history, chapterList])

  /* ===== Cột bảng chapter (click row -> tới chapter) ===== */
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

  /* ===== Fallback UI fields ===== */
  const cover          = story?.thumbnail || 'https://placehold.co/200x270?text=No+Image'
  const title          = story?.name || 'Đang cập nhật'
  const updatedAtLabel = fmtDT(story?.updatedAt)
  const author         = (story?.author || '').trim() || 'Đang cập nhật'
  const statusText     = viStatus(story?.status)
  const follows        = story?.total_follow ?? 0
  const rating         = Number(story?.rating || 0)
  const ratingCount    = story?.ratingCount ?? 0
  const description    = stripHtml(story?.description)

  /* ===== Theo dõi / Bỏ theo dõi ===== */
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
      // Reload lại detail để đồng bộ is_followed & total_follow
      dispatch(getStory({ id }))
    } catch (err) {
      message.error(err?.message || 'Có lỗi xảy ra')
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

                {/* Metadata truyện */}
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

                  <S.RatingLine>
                    <a href="#top">{title}</a> Xếp hạng: {rating}/5 - {ratingCount} lượt đánh giá.
                  </S.RatingLine>
                  <div style={{ marginTop: 6 }}>
                    <Rate allowHalf disabled defaultValue={rating} style={{ color: '#f5a623' }} />
                  </div>

                  {/* Hành động: Theo dõi + đọc */}
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
                {description || 'Đang cập nhật nội dung...'}
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
