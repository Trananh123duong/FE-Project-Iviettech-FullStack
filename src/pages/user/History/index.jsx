import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { Empty, Button } from 'antd'
import qs from 'qs'

import HistoryList from '@components/user/HistoryList'
import Paginate from '@components/user/Paginate'
import TopStory from '@components/user/TopStory'
import FollowedStories from '@components/user/FollowedStories'

import { STORY_LIMIT } from '@constants/paging'
import { ROUTES } from '@constants/routes'
import { getMyHistory } from '@redux/thunks/history.thunk'
import * as S from './styles'

const HistoryPage = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()

  const { data: user } = useSelector((s) => s.auth.myProfile)
  const {
    data: items = [],
    meta = {},
    status,
    error,
  } = useSelector((s) => s.history.historyList)

  const query = qs.parse(location.search, { ignoreQueryPrefix: true })
  const urlPage = parseInt(query.page || 1, 10)
  const urlLimit = parseInt(query.limit || STORY_LIMIT, 10)

  useEffect(() => {
    if (user?.id) {
      dispatch(getMyHistory({ page: urlPage, limit: urlLimit, more: false }))
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
            <span className="current">Lịch sử</span>
          </S.Breadcrumb>
        </S.BreadcrumbBar>

        <S.Gate>
          <h2>Lịch sử đọc truyện</h2>
          <p>Bạn cần đăng nhập để xem lịch sử đọc.</p>
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
          <span className="current">Lịch sử</span>
        </S.Breadcrumb>
      </S.BreadcrumbBar>

      <S.MainContainer>
        <S.ListColumn>
          <S.SectionHeader>
            <S.SectionTitle>
              Lịch sử đọc truyện <i className="fa-solid fa-angle-right" />
            </S.SectionTitle>
          </S.SectionHeader>

          {status === 'succeeded' && items.length === 0 ? (
            <Empty style={{ margin: '16px 0' }} description="Bạn chưa có lịch sử đọc." />
          ) : (
            <>
              <HistoryList items={items} status={status} error={error} />
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
          <FollowedStories />
          <TopStory />
        </S.SideColumn>
      </S.MainContainer>
    </>
  )
}

export default HistoryPage
