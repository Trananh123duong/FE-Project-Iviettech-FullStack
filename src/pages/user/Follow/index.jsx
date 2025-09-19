import { Button, Empty, message } from 'antd'
import qs from 'qs'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import ListStory from '@components/user/ListStory'
import Paginate from '@components/user/Paginate'
import ReadingHistory from '@components/user/ReadingHistory'
import TopStory from '@components/user/TopStory'

import { STORY_LIMIT } from '@constants/paging'
import { ROUTES } from '@constants/routes'
import { getMyFollows, unfollowStory } from '@redux/thunks/follow.thunk'
import * as S from './styles'

const FollowPage = () => {
  // ===== Hook core =====
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()

  // ===== Thông tin user (để bật/tắt gate) =====
  const { data: currentUser } = useSelector((s) => s.auth.myProfile)

  // ===== Danh sách truyện theo dõi =====
  const {
    data: followedStories = [],
    meta = {},
    status,
    error,
  } = useSelector((s) => s.follow.followedStoryList)

  // ===== Trạng thái hành động bỏ theo dõi =====
  const isUnfollowLoading = useSelector(
    (s) => s.follow.unfollowAction.status === 'loading'
  )

  // ===== Đọc page/limit từ URL =====
  const queryObj = qs.parse(location.search, { ignoreQueryPrefix: true })
  const urlPage = Number(queryObj.page || 1)
  const urlLimit = Number(queryObj.limit || STORY_LIMIT)

  // ===== Load danh sách khi đã đăng nhập =====
  useEffect(() => {
    if (currentUser?.id) {
      dispatch(getMyFollows({ page: urlPage, limit: urlLimit, more: false }))
    }
  }, [dispatch, currentUser?.id, urlPage, urlLimit])

  // ===== Bỏ theo dõi -> refresh danh sách =====
  const handleUnfollow = async (story) => {
    if (!story?.id) return
    try {
      const res = await dispatch(unfollowStory({ storyId: story.id })).unwrap()
      message.success(res?.message || 'Đã bỏ theo dõi')
      dispatch(getMyFollows({ page: urlPage, limit: urlLimit, more: false }))
    } catch (e) {
      message.error(e?.message || 'Bỏ theo dõi thất bại')
    }
  }

  // ===== Thông tin phân trang =====
  const currentPage = meta.page || urlPage
  const pageSize = meta.limit || urlLimit
  const totalItems = meta.total || 0

  // ===== Điều hướng phân trang bằng query string =====
  const handlePaginate = (page, size) => {
    const newQuery = qs.stringify({ ...queryObj, page, limit: size }, { addQueryPrefix: true })
    navigate(`${location.pathname}${newQuery}`)
  }

  // ===== Gate khi chưa đăng nhập =====
  if (!currentUser?.id) {
    return (
      <S.Page>
        <S.Breadcrumb>
          <Link to={ROUTES.USER.HOME}>Trang chủ</Link>
          <span className="sep">»</span>
          <span className="current">Theo dõi</span>
        </S.Breadcrumb>

        <S.GateCard>
          <h2>Truyện đang theo dõi</h2>
          <p>Bạn cần đăng nhập để xem danh sách truyện đang theo dõi.</p>
          <Link to={ROUTES.AUTH.LOGIN}>
            <Button type="primary" size="large">Đăng nhập</Button>
          </Link>
        </S.GateCard>
      </S.Page>
    )
  }

  // ===== Trạng thái đã đăng nhập =====
  return (
    <S.Page>
      {/* Breadcrumb */}
      <S.Breadcrumb>
        <Link to={ROUTES.USER.HOME}>Trang chủ</Link>
        <span className="sep">»</span>
        <span className="current">Theo dõi</span>
      </S.Breadcrumb>

      <S.ContentGrid>
        {/* Cột trái: danh sách theo dõi */}
        <section>
          <S.SectionHeader>
            <S.SectionTitle>
              Truyện đang theo dõi <i className="fa-solid fa-angle-right" />
            </S.SectionTitle>
          </S.SectionHeader>

          {status === 'loading' && <div style={{ padding: 8 }}>Đang tải...</div>}
          {status === 'failed' && <div style={{ padding: 8, color: 'red' }}>Lỗi: {String(error)}</div>}

          {status === 'succeeded' && followedStories.length === 0 ? (
            <Empty style={{ margin: '16px 0' }} description="Bạn chưa theo dõi truyện nào." />
          ) : (
            <>
              <ListStory
                stories={followedStories}
                status={status}
                error={error}
                onUnfollow={handleUnfollow}
                unfollowLoading={isUnfollowLoading}
              />
              <Paginate
                current={currentPage}
                pageSize={pageSize}
                total={totalItems}
                onChange={handlePaginate}
              />
            </>
          )}
        </section>

        {/* Sidebar: lịch sử đọc + top */}
        <aside>
          <ReadingHistory />
          <TopStory />
        </aside>
      </S.ContentGrid>
    </S.Page>
  )
}

export default FollowPage
