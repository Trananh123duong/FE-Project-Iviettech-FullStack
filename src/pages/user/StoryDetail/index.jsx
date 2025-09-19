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

// --- Helper: map status BE -> tiếng Việt
const viStatus = (s) => {
  if (!s) return 'Đang cập nhật'
  const map = { ongoing: 'Đang Tiến Hành', completed: 'Hoàn Thành', hiatus: 'Tạm Dừng' }
  return map[s] || 'Đang cập nhật'
}

// --- Helper: bỏ thẻ HTML khỏi description (hiển thị gọn)
const stripHtml = (html) => (html || '').replace(/<[^>]*>/g, '').trim()

// --- Helper: rút số chapter từ nhiều trường có thể có
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
  const { id } = useParams() // id truyện từ URL

  // --- Store slices cần dùng
  const { data: user } = useSelector((s) => s.auth.myProfile)
  const { data: story = {}, status, error } = useSelector((s) => s.story.storyDetail)
  const { followAction, unfollowAction } = useSelector((s) => s.follow)
  const { chaptersByStory } = useSelector((s) => s.chapter)
  const { data: chapterList = [], status: chaptersStatus, history } = chaptersByStory

  // --- Nạp chi tiết truyện + danh sách chapter của truyện
  useEffect(() => {
    if (id) {
      dispatch(getStory({ id }))
      dispatch(getChaptersByStory({ storyId: id }))
    }
  }, [dispatch, id])

  // --- Hiển thị đủ/ít chương
  const [showAllChapters, setShowAllChapters] = useState(false)
  const MAX_SHOWN = 18

  // --- Thể loại (nếu API trả về qua quan hệ category_id_categories)
  const categories = useMemo(() => story?.category_id_categories || [], [story])

  // --- Dòng dữ liệu cho bảng chapter (giới hạn theo showAllChapters)
  const chapterRows = useMemo(() => {
    const src = showAllChapters ? chapterList : chapterList.slice(0, MAX_SHOWN)
    return src.map((c) => {
      const num = getChapterNum(c)
      const rel = timeAgo(c.updatedAt || c.createdAt || c.updated_at || c.created_at) || '—'
      return { key: c.id, id: c.id, number: num ?? '?', rel, _num: num }
    })
  }, [chapterList, showAllChapters])

  // --- Danh sách chapter đã sort tăng dần theo số chương (để lấy first/last)
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
  const lastChapterId = sortedChapters[sortedChapters.length - 1]?.id ?? null

  // --- Điều hướng đọc từ đầu / mới nhất (DÙNG ROUTES)
  const goFirst = () => {
    if (!firstChapterId) return
    navigate(ROUTES.USER.CHAPTER.replace(':id', firstChapterId))
  }
  const goLast = () => {
    if (!lastChapterId) return
    navigate(ROUTES.USER.CHAPTER.replace(':id', lastChapterId))
  }

  // --- Số chapter đã đọc gần nhất của user (để highlight row)
  const lastReadNum = useMemo(() => {
    if (!history?.chapter_id) return null
    const found = chapterList.find((c) => c.id === history.chapter_id)
    return getChapterNum(found)
  }, [history, chapterList])

  // --- Cột bảng chapter (click vào để đi tới chapter) (DÙNG ROUTES)
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
          onKeyDown={(e) => {
            if (e.key === 'Enter') navigate(ROUTES.USER.CHAPTER.replace(':id', row.id))
          }}
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

  // --- UI fallbacks
  const cover = story?.thumbnail || 'https://placehold.co/200x270?text=No+Image'
  const title = story?.name || 'Đang cập nhật'
  const updatedAt = fmtDT(story?.updatedAt)
  const author = (story?.author || '').trim() || 'Đang cập nhật'
  const statusText = viStatus(story?.status)
  const follows = story?.total_follow ?? 0
  const rating = story?.rating ?? 0
  const ratingCount = story?.ratingCount ?? 0
  const descriptionText = stripHtml(story?.description)

  // --- Theo dõi / bỏ theo dõi
  const isLoggedIn = !!user?.id
  const isFollowed = !!story?.is_followed
  const isActing = followAction.status === 'loading' || unfollowAction.status === 'loading'

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
      // reload lại detail để đồng bộ is_followed & total_follow
      dispatch(getStory({ id }))
    } catch (err) {
      message.error(err?.message || 'Có lỗi xảy ra')
    }
  }

  // --- Điều hướng tới trang Search đã lọc theo 1 thể loại
  const goToCategory = (cat) => {
    const search = qs.stringify(
      { 'categoryIds[]': [cat.id] },
      { addQueryPrefix: true, arrayFormat: 'brackets' }
    )
    navigate(`${ROUTES.USER.SEARCH}${search}`)
  }

  return (
    <>
      <S.MainContainer>
        {/* --- LEFT: nội dung chính --- */}
        <S.Left>
          {/* Tiêu đề + thời gian cập nhật */}
          <S.TitleBlock>
            <S.PageTitle>{title}</S.PageTitle>
            <S.UpdatedAt>{updatedAt ? `[Cập nhật lúc: ${updatedAt}]` : ''}</S.UpdatedAt>
          </S.TitleBlock>

          {/* Trạng thái tải dữ liệu truyện */}
          {status === 'loading' ? (
            <Skeleton active paragraph={{ rows: 6 }} />
          ) : error ? (
            <Empty description="Không tải được dữ liệu truyện" />
          ) : (
            <>
              {/* --- Summary --- */}
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

                  {/* Xếp hạng + hiển thị sao */}
                  <S.RatingLine>
                    <a href="#top">{title}</a> Xếp hạng: {rating}/5 - {ratingCount} Lượt đánh giá.
                  </S.RatingLine>
                  <div style={{ marginTop: 6 }}>
                    <Rate allowHalf disabled defaultValue={Number(rating) || 0} style={{ color: '#f5a623' }} />
                  </div>

                  {/* Hành động: Theo dõi + nút đọc */}
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
                      <span style={{ fontWeight: 600 }}>Người Đã Theo Dõi</span>
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

              {/* --- Nội dung mô tả --- */}
              <S.SectionHeader>
                <S.SectionTitle>
                  <i className="fa fa-list-ul" /> NỘI DUNG TRUYỆN {title.toUpperCase()} TRÊN NETTRUYEN
                </S.SectionTitle>
              </S.SectionHeader>

              <Paragraph
                style={{ marginTop: 8 }}
                ellipsis={{ rows: 3, expandable: true, symbol: 'Xem thêm' }}
              >
                {descriptionText || 'Đang cập nhật nội dung...'}
              </Paragraph>

              <Divider />

              {/* --- Danh sách chương --- */}
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
                    // tô đậm chapter đọc gần nhất và các chapter đã đọc
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
        </S.Left>

        {/* --- RIGHT: sidebar --- */}
        <S.Right>
          {user?.id && (
            <>
              <FollowedStories />
              <ReadingHistory />
            </>
          )}
          <TopStory />
        </S.Right>
      </S.MainContainer>
    </>
  )
}

export default StoryDetail
