import qs from 'qs'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

import FollowedStories from '@components/user/FollowedStories'
import ListStory from '@components/user/ListStory'
import Paginate from '@components/user/Paginate'
import ReadingHistory from '@components/user/ReadingHistory'
import Sliderbar from '@components/user/Sliderbar'
import TopStory from '@components/user/TopStory'

import { STORY_LIMIT } from '@constants/paging'
import { getStories } from '@redux/thunks/story.thunk'
import * as S from './styles'

const Home = () => {
  // ====== Hook core ======
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()

  // ====== Thông tin user để hiện “Đang theo dõi / Lịch sử” ở sidebar ======
  const { data: currentUser } = useSelector((state) => state.auth.myProfile)

  // ====== Danh sách “Truyện mới cập nhật” ======
  const {
    data: updatedStories = [],
    meta = {},
    status: updatedStatus,
    error: updatedError,
  } = useSelector((state) => state.story.updatedList)

  // ====== Đọc page/limit từ URL ======
  const queryObj = qs.parse(location.search, { ignoreQueryPrefix: true })
  const urlPage = Number(queryObj.page || 1)
  const urlLimit = Number(queryObj.limit || STORY_LIMIT)

  // ====== Load dữ liệu theo page/limit hiện tại ======
  useEffect(() => {
    dispatch(getStories({ scope: 'updated', page: urlPage, limit: urlLimit }))
  }, [dispatch, urlPage, urlLimit])

  // ====== Thông tin phân trang (fallback sang URL khi meta chưa có) ======
  const currentPage = meta.page || urlPage
  const pageSize = meta.limit || urlLimit
  const totalItems = meta.total || 0

  // ====== Chuyển trang: cập nhật query string ======
  const handlePaginate = (page, size) => {
    const newQuery = qs.stringify(
      { ...queryObj, page, limit: size },
      { addQueryPrefix: true }
    )
    navigate(`${location.pathname}${newQuery}`)
  }

  return (
    <>
      {/* Slider đề cử */}
      <Sliderbar />

      <S.Page>
        <S.ContentGrid>
          {/* ===== Cột trái: danh sách truyện mới cập nhật ===== */}
          <section>
            <S.SectionHeader>
              <S.SectionTitle>
                Truyện mới cập nhật <i className="fa-solid fa-angle-right" />
              </S.SectionTitle>
            </S.SectionHeader>

            <ListStory stories={updatedStories} status={updatedStatus} error={updatedError} />

            <Paginate
              current={currentPage}
              pageSize={pageSize}
              total={totalItems}
              onChange={handlePaginate}
            />
          </section>

          {/* ===== Sidebar: theo dõi + lịch sử (nếu đăng nhập) + top story ===== */}
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
    </>
  )
}

export default Home
