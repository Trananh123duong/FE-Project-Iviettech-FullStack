import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { Empty, Button, message } from 'antd'
import qs from 'qs'

import ListStory from '@components/user/ListStory'
import Paginate from '@components/user/Paginate'
import TopStory from '@components/user/TopStory'
import ReadingHistory from '@components/user/ReadingHistory'

import { STORY_LIMIT } from '@constants/paging'
import { ROUTES } from '@constants/routes'
import { getMyFollows, unfollowStory } from '@redux/thunks/follow.thunk'
import * as S from './styles'

const FollowPage = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()

  const { data: user } = useSelector((s) => s.auth.myProfile)

  const {
    data: stories = [],
    meta = {},
    status,
    error,
  } = useSelector((s) => s.follow.followedStoryList)
  const unfollowLoading = useSelector((s) => s.follow.unfollowAction.status === 'loading')

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

  const query = qs.parse(location.search, { ignoreQueryPrefix: true })
  const urlPage = parseInt(query.page || 1, 10)
  const urlLimit = parseInt(query.limit || STORY_LIMIT, 10)

  useEffect(() => {
    if (user?.id) {
      dispatch(getMyFollows({ page: urlPage, limit: urlLimit, more: false }))
    }
  }, [dispatch, user?.id, urlPage, urlLimit])

  const current = meta.page || urlPage
  const pageSize = meta.limit || urlLimit
  const total = meta.total || 0

  const handlePaginate = (page, size) => {
    const newQuery = qs.stringify({ ...query, page, limit: size }, { addQueryPrefix: true })
    navigate(`${location.pathname}${newQuery}`, { replace: false })
  }

  if (!user?.id) {
    return (
      <>
        <S.BreadcrumbBar>
          <S.Breadcrumb>
            <Link to="/">Trang chủ</Link>
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

  return (
    <>
      <S.BreadcrumbBar>
        <S.Breadcrumb>
          <Link to="/">Trang chủ</Link>
          <span className="sep">»</span>
          <span className="current">Theo dõi</span>
        </S.Breadcrumb>
      </S.BreadcrumbBar>

      <S.MainContainer>
        <S.ListColumn>
          <S.SectionHeader>
            <S.SectionTitle>
              Truyện đang theo dõi <i className="fa-solid fa-angle-right" />
            </S.SectionTitle>
          </S.SectionHeader>

          {status === 'loading' && <div style={{ padding: 8 }}>Đang tải...</div>}
          {status === 'failed' && (
            <div style={{ padding: 8, color: 'red' }}>Lỗi: {error}</div>
          )}

          {status === 'succeeded' && stories.length === 0 ? (
            <Empty
              style={{ margin: '16px 0' }}
              description="Bạn chưa theo dõi truyện nào."
            />
          ) : (
            <>
              <ListStory
                stories={stories}
                status={status}
                error={error}
                onUnfollow={handleUnfollow}
                unfollowLoading={unfollowLoading}
              />
              <Paginate
                current={current}
                pageSize={pageSize}
                total={total}
                onChange={handlePaginate}
              />
            </>
          )}
        </S.ListColumn>

        <S.SideColumn>
          <ReadingHistory />
          <TopStory />
        </S.SideColumn>
      </S.MainContainer>
    </>
  )
}

export default FollowPage
