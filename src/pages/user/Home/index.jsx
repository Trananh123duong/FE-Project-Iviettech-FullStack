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
  // --- Hook core
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()

  // --- Thông tin user (để hiển thị theo dõi + lịch sử ở sidebar khi đã đăng nhập)
  const { data: user } = useSelector((s) => s.auth.myProfile)

  // --- Danh sách truyện mới cập nhật lấy từ slice story.updatedList
  const {
    data: stories = [],
    meta = {},
    status,
    error,
  } = useSelector((s) => s.story.updatedList)

  // --- Đọc query string (page, limit) từ URL
  const query = qs.parse(location.search, { ignoreQueryPrefix: true })
  const urlPage = parseInt(query.page || 1, 10)
  const urlLimit = parseInt(query.limit || STORY_LIMIT, 10)

  // --- Load danh sách "truyện mới cập nhật" theo page/limit hiện tại
  useEffect(() => {
    dispatch(getStories({ scope: 'updated', page: urlPage, limit: urlLimit }))
  }, [dispatch, urlPage, urlLimit])

  // --- Thông tin phân trang (fallback sang giá trị URL khi meta chưa sẵn)
  const current = meta.page || urlPage
  const pageSize = meta.limit || urlLimit
  const total = meta.total || 0

  // --- Chuyển trang: cập nhật query string, giữ nguyên pathname hiện tại
  const handlePaginate = (page, size) => {
    const newQuery = qs.stringify({ ...query, page, limit: size }, { addQueryPrefix: true })
    navigate(`${location.pathname}${newQuery}`, { replace: false })
  }

  return (
    <>
      {/* Slider đề cử (auto-play) */}
      <Sliderbar />

      <S.MainContainer>
        {/* Cột nội dung chính: danh sách truyện mới cập nhật + phân trang */}
        <S.ListStory>
          <S.SectionHeader>
            <S.SectionTitle>
              Truyện mới cập nhật <i className="fa-solid fa-angle-right" />
            </S.SectionTitle>
          </S.SectionHeader>

          {/* Danh sách truyện; component con sẽ tự xử lý trạng thái loading/failed nếu cần */}
          <ListStory stories={stories} status={status} error={error} />

          {/* Phân trang bằng query string để giữ state URL */}
          <Paginate
            current={current}
            pageSize={pageSize}
            total={total}
            onChange={handlePaginate}
          />
        </S.ListStory>

        {/* Sidebar: khi đã đăng nhập thì hiện "Đang theo dõi" + "Lịch sử"; luôn hiện TopStory */}
        <S.DeadlineStory>
          {user?.id && (
            <>
              <FollowedStories />
              <ReadingHistory />
            </>
          )}
          <TopStory />
        </S.DeadlineStory>
      </S.MainContainer>
    </>
  )
}

export default Home
