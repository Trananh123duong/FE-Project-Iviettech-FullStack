import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Rate, Typography, Image, Table, Space, Divider, Skeleton, Empty, message } from 'antd'
import { HeartFilled } from '@ant-design/icons'

import { getStory } from '@redux/thunks/story.thunk'
import { followStory, unfollowStory } from '@redux/thunks/follow.thunk'
import { getChaptersByStory } from '@redux/thunks/chapter.thunk'

import TopStory from '@components/user/TopStory'
import ReadingHistory from '@components/user/ReadingHistory'
import FollowedStories from '@components/user/FollowedStories'
import * as S from './styles'
import qs from 'qs'
import { ROUTES } from '@constants/routes'

const { Paragraph } = Typography

// helpers
const viStatus = (s) => {
  if (!s) return 'Đang cập nhật'
  const map = { ongoing: 'Đang Tiến Hành', completed: 'Hoàn Thành', hiatus: 'Tạm Dừng' }
  return map[s] || 'Đang cập nhật'
}
const stripHtml = (html) => (html || '').replace(/<[^>]*>/g, '').trim()
const fmtDT = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

const timeAgo = (dateString) => {
  if (!dateString) return '—'
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

  const { data: user } = useSelector((s) => s.auth.myProfile)
  const { data: story = {}, status, error } = useSelector((s) => s.story.storyDetail)
  const { followAction, unfollowAction } = useSelector((s) => s.follow)
  const { chaptersByStory } = useSelector((s) => s.chapter)
  const { data: chapterList = [], status: chaptersStatus, history } = chaptersByStory

  useEffect(() => {
    if (id) {
      dispatch(getStory({ id }))
      dispatch(getChaptersByStory({ storyId: id }))
    }
  }, [dispatch, id])

  const [showAllChapters, setShowAllChapters] = useState(false)
  const MAX_SHOWN = 18

  const categories = useMemo(() => story?.category_id_categories || [], [story])

  const chapterRows = useMemo(() => {
    const src = showAllChapters ? chapterList : chapterList.slice(0, MAX_SHOWN)
    return src.map((c) => {
      const num = getChapterNum(c)
      const rel = timeAgo(c.updatedAt || c.createdAt || c.updated_at || c.created_at)
      return { key: c.id, id: c.id, number: num ?? '?', rel, _num: num }
    })
  }, [chapterList, showAllChapters])

  const lastReadNum = useMemo(() => {
    if (!history?.chapter_id) return null
    const found = chapterList.find((c) => c.id === history.chapter_id)
    return getChapterNum(found)
  }, [history, chapterList])

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
          onClick={() => navigate(`/chapters/${row.id}`)}
          onKeyDown={(e) => e.key === 'Enter' && navigate(`/chapters/${row.id}`)}
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

  // UI fallbacks
  const cover = story?.thumbnail || 'https://placehold.co/200x270?text=No+Image'
  const title = story?.name || 'Đang cập nhật'
  const updatedAt = fmtDT(story?.updatedAt)
  const author = story?.author?.trim() || 'Đang cập nhật'
  const statusText = viStatus(story?.status)
  const follows = story?.total_follow ?? 0
  const rating = story?.rating ?? 0
  const ratingCount = story?.ratingCount ?? 0
  const descriptionText = stripHtml(story?.description)

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
      
      dispatch(getStory({ id }))
    } catch (err) {
      message.error(err?.message || 'Có lỗi xảy ra')
    }
  }

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
        <S.Left>
          <S.TitleBlock>
            <S.PageTitle>{title}</S.PageTitle>
            <S.UpdatedAt>{updatedAt ? `[Cập nhật lúc: ${updatedAt}]` : ''}</S.UpdatedAt>
          </S.TitleBlock>

          {status === 'loading' ? (
            <Skeleton active paragraph={{ rows: 6 }} />
          ) : error ? (
            <Empty description="Không tải được dữ liệu truyện" />
          ) : (
            <>
              {/* Summary */}
              <S.TopInfo>
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
                    <a href="#top">{title}</a> Xếp hạng: {rating}/5 - {ratingCount} Lượt đánh giá.
                  </S.RatingLine>
                  <div style={{ marginTop: 6 }}>
                    <Rate allowHalf disabled defaultValue={Number(rating) || 0} style={{ color: '#f5a623' }} />
                  </div>

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
                        {story?.total_follow ?? 0}
                      </span>
                      <span style={{ fontWeight: 600 }}>Người Đã Theo Dõi</span>
                    </Space>

                    <Space size="middle" wrap style={{ marginTop: 12 }}>
                      <S.ReadButton>Đọc từ đầu</S.ReadButton>
                      <S.ReadButton>Đọc mới nhất</S.ReadButton>
                    </Space>
                  </S.ActionRow>
                </div>
              </S.TopInfo>

              <Divider />

              {/* Nội dung */}
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

              {/* Danh sách chương */}
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
        </S.Left>

        {/* RIGHT */}
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
