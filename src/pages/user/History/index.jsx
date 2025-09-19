import { Button, Empty } from 'antd'
import qs from 'qs'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import FollowedStories from '@components/user/FollowedStories'
import HistoryList from '@components/user/HistoryList'
import Paginate from '@components/user/Paginate'
import TopStory from '@components/user/TopStory'

import { STORY_LIMIT } from '@constants/paging'
import { ROUTES } from '@constants/routes'
import { getMyHistory } from '@redux/thunks/history.thunk'
import * as S from './styles'

const HistoryPage = () => {
  // ===== Hook core =====
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()

  // ===== Thông tin user để bật/tắt gate đăng nhập =====
  const { data: currentUser } = useSelector((s) => s.auth.myProfile)

  // ===== Dữ liệu lịch sử từ slice =====
  const {
    data: historyItems = [],
    meta = {},
    status,
    error,
  } = useSelector((s) => s.history.historyList)

  // ===== Đọc page/limit từ URL =====
  const queryObj = qs.parse(location.search, { ignoreQueryPrefix: true })
  const urlPage = Number(queryObj.page || 1)
  const urlLimit = Number(queryObj.limit || STORY_LIMIT)

  // ===== Load lịch sử khi đã đăng nhập =====
  useEffect(() => {
    if (currentUser?.id) {
      dispatch(getMyHistory({ page: urlPage, limit: urlLimit, more: false }))
    }
  }, [dispatch, currentUser?.id, urlPage, urlLimit])

  // ===== Phân trang =====
  const currentPage = meta.page || urlPage
  const pageSize = meta.limit || urlLimit
  const totalItems = meta.total || 0

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
          <span className="current">Lịch sử</span>
        </S.Breadcrumb>

        <S.GateCard>
          <h2>Lịch sử đọc truyện</h2>
          <p>Bạn cần đăng nhập để xem lịch sử đọc.</p>
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
      <S.Breadcrumb>
        <Link to={ROUTES.USER.HOME}>Trang chủ</Link>
        <span className="sep">»</span>
        <span className="current">Lịch sử</span>
      </S.Breadcrumb>

      <S.ContentGrid>
        {/* Cột trái: lịch sử đọc */}
        <section>
          <S.SectionHeader>
            <S.SectionTitle>
              Lịch sử đọc truyện <i className="fa-solid fa-angle-right" />
            </S.SectionTitle>
          </S.SectionHeader>

          {status === 'loading' && <div style={{ padding: 8 }}>Đang tải...</div>}
          {status === 'failed' && (
            <div style={{ padding: 8, color: 'red' }}>Lỗi: {String(error)}</div>
          )}

          {status === 'succeeded' && historyItems.length === 0 ? (
            <Empty style={{ margin: '16px 0' }} description="Bạn chưa có lịch sử đọc." />
          ) : (
            <>
              <HistoryList items={historyItems} status={status} error={error} />
              <Paginate
                current={currentPage}
                pageSize={pageSize}
                total={totalItems}
                onChange={handlePaginate}
              />
            </>
          )}
        </section>

        {/* Sidebar: tiện ích/gợi ý */}
        <aside>
          <FollowedStories />
          <TopStory />
        </aside>
      </S.ContentGrid>
    </S.Page>
  )
}

export default HistoryPage
