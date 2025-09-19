import qs from 'qs'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import FollowedStories from '@components/user/FollowedStories'
import ListStory from '@components/user/ListStory'
import Paginate from '@components/user/Paginate'
import ReadingHistory from '@components/user/ReadingHistory'
import TopStory from '@components/user/TopStory'

import { STORY_LIMIT } from '@constants/paging'
import { ROUTES } from '@constants/routes'
import { getCategories } from '@redux/thunks/category.thunk'
import { getStories } from '@redux/thunks/story.thunk'
import * as S from './styles'

/** Tabs trạng thái */
const STATUS_TABS = [
  { key: 'all',         label: 'Tất cả' },
  { key: 'coming_soon', label: 'Sắp ra mắt' },
  { key: 'ongoing',     label: 'Đang phát hành' },
  { key: 'completed',   label: 'Hoàn thành' },
]

/** Tùy chọn sắp xếp hiển thị ở UI */
const SORT_OPTIONS = [
  { key: 'updated',    label: 'Mới cập nhật', icon: 'fa-rotate' },
  { key: 'new',        label: 'Truyện mới',   icon: 'fa-calendar-plus' },
  { key: 'top_all',    label: 'Top all',      icon: 'fa-chart-line' },
  { key: 'top_month',  label: 'Top tháng',    icon: 'fa-chart-column' },
  { key: 'top_week',   label: 'Top tuần',     icon: 'fa-eye' },
  { key: 'top_day',    label: 'Top ngày',     icon: 'fa-eye' },
  { key: 'top_follow', label: 'Top Follow',   icon: 'fa-users' },
]

/** Map khóa UI -> khóa BE */
const SORT_MAP = {
  updated: 'updated_at',
  new: 'created_at',
  top_all: 'view_all',
  top_month: 'view_month',
  top_week: 'view_week',
  top_day: 'view_day',
  top_follow: 'total_follow',
}

/** Map ngược BE -> UI (để đọc từ URL) */
const REVERSE_SORT_MAP = Object.fromEntries(
  Object.entries(SORT_MAP).map(([ui, be]) => [be, ui])
)

const SearchPage = () => {
  // ===== Hook core =====
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()

  // ===== Thông tin user (dùng cho sidebar) =====
  const { data: currentUser } = useSelector((s) => s.auth.myProfile)

  // ===== Danh mục thể loại =====
  const {
    data: categories = [],
    status: cateStatus,
    error: cateError,
  } = useSelector((s) => s.category.categoryList)

  // ===== Kết quả tìm kiếm =====
  const {
    data: stories = [],
    meta = {},
    status,
    error,
  } = useSelector((s) => (s.story.searchList ? s.story.searchList : s.story.updatedList))

  // ===== Đọc query string hiện tại =====
  const query = useMemo(
    () => qs.parse(location.search, { ignoreQueryPrefix: true }),
    [location.search]
  )
  const urlPage  = parseInt(query.page  || 1, 10)
  const urlLimit = parseInt(query.limit || STORY_LIMIT, 10)

  // ===== Lấy từ khóa, sort UI đọc từ URL =====
  const keywordFromURL = (query.keyword ?? query.q ?? '').toString()
  const sortUIFromURL  = REVERSE_SORT_MAP[query.sort] || ''

  // ===== Chuẩn hóa categoryIds từ URL (hỗ trợ nhiều biến thể) =====
  const catsFromURL = Array.isArray(query.categoryIds)
    ? query.categoryIds
    : Array.isArray(query['categoryIds[]'])
    ? query['categoryIds[]']
    : typeof query.categoryIds === 'string'
    ? query.categoryIds.split(',')
    : []

  // ===== State bộ lọc tại UI =====
  const [statusTab, setStatusTab] = useState(query.status || 'all')
  const [sortBy, setSortBy] = useState(sortUIFromURL)
  const [selectedCategories, setSelectedCategories] = useState(
    catsFromURL.map((v) => Number(v)).filter(Number.isInteger)
  )
  const [keyword, setKeyword] = useState(keywordFromURL)

  // Đồng bộ lại state khi URL đổi
  useEffect(() => {
    setKeyword(keywordFromURL)
    setStatusTab(query.status || 'all')
    setSortBy(sortUIFromURL)
    setSelectedCategories(catsFromURL.map((v) => Number(v)).filter(Number.isInteger))
  }, [keywordFromURL, query.status, sortUIFromURL, location.search]) // eslint-disable-line

  // Tải danh mục
  useEffect(() => {
    if (cateStatus === 'idle') dispatch(getCategories())
  }, [cateStatus, dispatch])

  // Gọi API tìm truyện mỗi khi tham số URL thay đổi
  useEffect(() => {
    const params = { page: urlPage, limit: urlLimit }

    if (query.sort)  params.sort  = query.sort
    if (query.order) params.order = query.order

    const kw = query.keyword ?? query.q
    if (kw) params.keyword = kw

    if (query.status) params.status = query.status

    const catIds = Array.isArray(query.categoryIds)
      ? query.categoryIds
      : Array.isArray(query['categoryIds[]'])
      ? query['categoryIds[]']
      : typeof query.categoryIds === 'string'
      ? query.categoryIds.split(',')
      : []

    if (catIds.length) params.categoryIds = catIds

    dispatch(getStories({ scope: 'search', ...params }))
  }, [dispatch, location.search, urlPage, urlLimit, query.sort, query.order]) // eslint-disable-line

  // Phân trang: cập nhật query string
  const handlePaginate = (page, size) => {
    const newQuery = qs.stringify(
      { ...query, page, limit: size },
      { addQueryPrefix: true, arrayFormat: 'brackets', skipNulls: true }
    )
    navigate(`${location.pathname}${newQuery}`)
  }

  // Toggle chọn thể loại
  const toggleCategory = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  // Áp dụng bộ lọc -> đẩy lên URL (reset về page 1)
  const applyFilters = () => {
    const queryObj = { page: 1, limit: urlLimit }

    // trạng thái
    if (statusTab && statusTab !== 'all') queryObj.status = statusTab

    // sort (map UI -> BE)
    if (sortBy) {
      queryObj.sort  = SORT_MAP[sortBy]
      queryObj.order = 'desc'
    }

    // thể loại
    if (selectedCategories.length > 0) queryObj.categoryIds = selectedCategories

    // từ khóa
    const kw = (keyword || '').trim()
    if (kw) queryObj.keyword = kw

    const newQuery = qs.stringify(queryObj, {
      addQueryPrefix: true,
      arrayFormat: 'brackets',
      skipNulls: true,
    })
    navigate(`${location.pathname}${newQuery}`)
  }

  // Xóa toàn bộ bộ lọc
  const clearFilters = () => {
    setStatusTab('all')
    setSortBy('')
    setSelectedCategories([])
    setKeyword('')
    navigate(location.pathname)
  }

  // Thông tin phân trang
  const current  = meta.page  || urlPage
  const pageSize = meta.limit || urlLimit
  const total    = meta.total || 0

  return (
    <S.Page>
      {/* Breadcrumb: dùng ROUTES thay vì path cứng */}
      <S.Breadcrumb>
        <Link to={ROUTES.USER.HOME}>Trang chủ</Link>
        <span className="sep">»</span>
        <span className="current">Tìm truyện</span>
      </S.Breadcrumb>

      <S.ContentGrid>
        {/* Cột trái: bộ lọc + danh sách kết quả */}
        <section>
          <S.SectionHeader>
            <S.SectionTitle>
              Tìm truyện <i className="fa-solid fa-angle-right" />
            </S.SectionTitle>
            {keywordFromURL && <S.KeywordHint>Từ khóa: “{keywordFromURL}”</S.KeywordHint>}
          </S.SectionHeader>

          {/* Filter bar */}
          <S.FilterCard>
            {/* Từ khóa */}
            <S.FilterRow>
              <S.FilterLabel>Từ khóa</S.FilterLabel>
              <S.KeywordInput
                type="text"
                value={keyword}
                placeholder="Nhập tên truyện, tác giả..."
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
              />
            </S.FilterRow>

            {/* Trạng thái */}
            <S.FilterRow>
              <S.FilterLabel>Trạng thái</S.FilterLabel>
              <S.ButtonGroup>
                {STATUS_TABS.map((tab) => (
                  <S.TabButton
                    key={tab.key}
                    $active={statusTab === tab.key}
                    onClick={() => setStatusTab(tab.key)}
                    type="button"
                  >
                    {tab.label}
                  </S.TabButton>
                ))}
              </S.ButtonGroup>
            </S.FilterRow>

            {/* Sắp xếp */}
            <S.FilterRow>
              <S.FilterLabel>Sắp xếp theo</S.FilterLabel>
              <S.ButtonGroup>
                {SORT_OPTIONS.map((opt) => (
                  <S.PillButton
                    key={opt.key}
                    $active={sortBy === opt.key}
                    onClick={() => setSortBy(opt.key)}
                    type="button"
                  >
                    <i className={`fa-solid ${opt.icon}`} />
                    <span>{opt.label}</span>
                  </S.PillButton>
                ))}
              </S.ButtonGroup>
            </S.FilterRow>

            {/* Thể loại */}
            <S.FilterRow>
              <S.FilterLabel>Thể loại</S.FilterLabel>
              <S.ButtonGroup>
                {cateStatus === 'loading' && <S.Hint>Đang tải thể loại...</S.Hint>}
                {cateStatus === 'failed'  && <S.ErrorText>{cateError || 'Không tải được thể loại'}</S.ErrorText>}
                {cateStatus === 'succeeded' &&
                  categories.map((c) => (
                    <S.PillButton
                      key={c.id}
                      $active={selectedCategories.includes(c.id)}
                      onClick={() => toggleCategory(c.id)}
                      type="button"
                      title={c.name}
                    >
                      <span>{c.name}</span>
                    </S.PillButton>
                  ))}
              </S.ButtonGroup>
            </S.FilterRow>

            {/* Hành động */}
            <S.Actions>
              <S.ApplyButton type="button" onClick={applyFilters}>
                <i className="fa-solid fa-magnifying-glass" /> Tìm kiếm
              </S.ApplyButton>
              <S.ClearButton type="button" onClick={clearFilters}>
                Xóa bộ lọc
              </S.ClearButton>
              {selectedCategories.length > 0 && (
                <S.Hint>Đã chọn {selectedCategories.length} thể loại</S.Hint>
              )}
            </S.Actions>
          </S.FilterCard>

          {/* Kết quả + paginate */}
          <ListStory stories={stories} status={status} error={error} />
          <Paginate
            current={current}
            pageSize={pageSize}
            total={total}
            onChange={handlePaginate}
          />
        </section>

        {/* Sidebar: theo dõi + lịch sử (nếu đã đăng nhập) + top story */}
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

export default SearchPage
