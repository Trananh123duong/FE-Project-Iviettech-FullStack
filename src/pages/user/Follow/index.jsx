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
  // --- Hook core
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()

  // --- Lấy thông tin đăng nhập (để quyết định hiển thị gate đăng nhập)
  const { data: user } = useSelector((s) => s.auth.myProfile)

  // --- Lấy danh sách truyện đã theo dõi từ slice follow
  const {
    data: stories = [],
    meta = {},
    status,
    error,
  } = useSelector((s) => s.follow.followedStoryList)

  // --- Trạng thái đang bỏ theo dõi (disable nút khi loading)
  const unfollowLoading = useSelector(
    (s) => s.follow.unfollowAction.status === 'loading'
  )

  // --- Handler bỏ theo dõi một truyện rồi reload lại danh sách theo trang hiện tại
  const handleUnfollow = async (story) => {
    if (!story?.id) return
    try {
      const res = await dispatch(unfollowStory({ storyId: story.id })).unwrap()
      message.success(res?.message || 'Đã bỏ theo dõi')

      // Reload lại danh sách theo URL hiện tại
      dispatch(getMyFollows({ page: urlPage, limit: urlLimit, more: false }))
    } catch (e) {
      message.error(e?.message || 'Bỏ theo dõi thất bại')
    }
  }

  // --- Đọc query string (page, limit) từ URL
  const query = qs.parse(location.search, { ignoreQueryPrefix: true })
  const urlPage = parseInt(query.page || 1, 10)
  const urlLimit = parseInt(query.limit || STORY_LIMIT, 10)

  // --- Khi đã đăng nhập -> gọi API lấy danh sách truyện đã theo dõi
  useEffect(() => {
    if (user?.id) {
      dispatch(getMyFollows({ page: urlPage, limit: urlLimit, more: false }))
    }
  }, [dispatch, user?.id, urlPage, urlLimit])

  // --- Thông tin phân trang từ API (fallback bởi giá trị URL)
  const current = meta.page || urlPage
  const pageSize = meta.limit || urlLimit
  const total = meta.total || 0

  // --- Chuyển trang: cập nhật query string, giữ nguyên pathname hiện tại
  const handlePaginate = (page, size) => {
    const newQuery = qs.stringify(
      { ...query, page, limit: size },
      { addQueryPrefix: true }
    )
    navigate(`${location.pathname}${newQuery}`, { replace: false })
  }

  // --- Nếu chưa đăng nhập thì hiển thị gate + link sang trang đăng nhập (DÙNG ROUTES)
  if (!user?.id) {
    return (
      <>
        <S.BreadcrumbBar>
          <S.Breadcrumb>
            <Link to={ROUTES.USER.HOME}>Trang chủ</Link>
            <span className="sep">»</span>
            <span className="current">Theo dõi</span>
          </S.Breadcrumb>
        </S.BreadcrumbBar>

        <S.Gate>
          <h2>Truyện đang theo dõi</h2>
          <p>Bạn cần đăng nhập để xem danh sách truyện đang theo dõi.</p>
          <Link to={ROUTES.AUTH.LOGIN}>
            <Button type="primary" size="large">Đăng nhập</Button>
          </Link>
        </S.Gate>
      </>
    )
  }

  // --- Trạng thái đã đăng nhập: hiển thị danh sách + paginate + sidebar
  return (
    <>
      {/* Breadcrumb (DÙNG ROUTES) */}
      <S.BreadcrumbBar>
        <S.Breadcrumb>
          <Link to={ROUTES.USER.HOME}>Trang chủ</Link>
          <span className="sep">»</span>
          <span className="current">Theo dõi</span>
        </S.Breadcrumb>
      </S.BreadcrumbBar>

      <S.MainContainer>
        {/* Cột chính: danh sách truyện đang theo dõi */}
        <S.ListColumn>
          <S.SectionHeader>
            <S.SectionTitle>
              Truyện đang theo dõi <i className="fa-solid fa-angle-right" />
            </S.SectionTitle>
          </S.SectionHeader>

          {/* Trạng thái tải */}
          {status === 'loading' && <div style={{ padding: 8 }}>Đang tải...</div>}
          {status === 'failed' && (
            <div style={{ padding: 8, color: 'red' }}>Lỗi: {error}</div>
          )}

          {/* Nếu đã load xong nhưng rỗng */}
          {status === 'succeeded' && stories.length === 0 ? (
            <Empty
              style={{ margin: '16px 0' }}
              description="Bạn chưa theo dõi truyện nào."
            />
          ) : (
            <>
              {/* ListStory sẽ render danh sách + nút bỏ theo dõi từng item */}
              <ListStory
                stories={stories}
                status={status}
                error={error}
                onUnfollow={handleUnfollow}
                unfollowLoading={unfollowLoading}
              />

              {/* Phân trang: điều hướng bằng cách cập nhật query string */}
              <Paginate
                current={current}
                pageSize={pageSize}
                total={total}
                onChange={handlePaginate}
              />
            </>
          )}
        </S.ListColumn>

        {/* Cột bên: lịch sử đọc + top story */}
        <S.SideColumn>
          <ReadingHistory />
          <TopStory />
        </S.SideColumn>
      </S.MainContainer>
    </>
  )
}

export default FollowPage
