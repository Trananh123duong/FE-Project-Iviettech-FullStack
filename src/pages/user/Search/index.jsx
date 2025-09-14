import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import qs from 'qs'

import ListStory from '@components/user/ListStory'
import Paginate from '@components/user/Paginate'
import TopStory from '@components/user/TopStory'
import ReadingHistory from '@components/user/ReadingHistory'
import FollowedStories from '@components/user/FollowedStories'

import { STORY_LIMIT } from '@constants/paging'
import { getStories } from '@redux/thunks/story.thunk'
import { getCategories } from '@redux/thunks/category.thunk'
import * as S from './styles'

const STATUS_TABS = [
  { key: 'all',         label: 'Tất cả' },
  { key: 'coming_soon', label: 'Sắp ra mắt' },
  { key: 'ongoing',     label: 'Đang phát hành' },
  { key: 'completed',   label: 'Hoàn thành' },
]

const SORT_OPTIONS = [
  { key: 'updated',   label: 'Mới cập nhật', icon: 'fa-rotate' },
  { key: 'new',       label: 'Truyện mới',    icon: 'fa-calendar-plus' },
  { key: 'top_all',   label: 'Top all',       icon: 'fa-chart-line' },
  { key: 'top_month', label: 'Top tháng',     icon: 'fa-chart-column' },
  { key: 'top_week',  label: 'Top tuần',      icon: 'fa-eye' },
  { key: 'top_day',   label: 'Top ngày',      icon: 'fa-eye' },
  { key: 'top_follow',label: 'Top Follow',    icon: 'fa-users' },
]
const SORT_MAP = {
  updated: 'updated_at',
  new: 'created_at',
  top_all: 'view_all',
  top_month: 'view_month',
  top_week: 'view_week',
  top_day: 'view_day',
  top_follow: 'total_follow',
}
const REVERSE_SORT_MAP = Object.fromEntries(
  Object.entries(SORT_MAP).map(([ui, be]) => [be, ui])
)

const SearchPage = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()

  const { data: user } = useSelector((s) => s.auth.myProfile)
  const { data: categories = [], status: cateStatus, error: cateError } =
    useSelector((s) => s.category.categoryList)

  const { data: stories = [], meta = {}, status, error } = useSelector((s) =>
    s.story.searchList ? s.story.searchList : s.story.updatedList
  )

  const query = useMemo(
    () => qs.parse(location.search, { ignoreQueryPrefix: true }),
    [location.search]
  )
  const urlPage  = parseInt(query.page  || 1, 10)
  const urlLimit = parseInt(query.limit || STORY_LIMIT, 10)

  const keywordFromURL = (query.keyword ?? query.q ?? '').toString()
  const sortUIFromURL = REVERSE_SORT_MAP[query.sort] || ''

  const catsFromURL = Array.isArray(query.categoryIds)
    ? query.categoryIds
    : Array.isArray(query['categoryIds[]'])
    ? query['categoryIds[]']
    : typeof query.categoryIds === 'string'
    ? query.categoryIds.split(',')
    : []

  const [statusTab, setStatusTab] = useState(query.status || 'all')
  const [sortBy, setSortBy] = useState(sortUIFromURL)
  const [selectedCategories, setSelectedCategories] = useState(
    catsFromURL.map((v) => Number(v)).filter(Number.isInteger)
  )
  const [keyword, setKeyword] = useState(keywordFromURL)

  useEffect(() => {
    setKeyword(keywordFromURL)
    setStatusTab(query.status || 'all')
    setSortBy(sortUIFromURL)
    setSelectedCategories(
      catsFromURL.map((v) => Number(v)).filter(Number.isInteger)
    )
  }, [keywordFromURL, query.status, sortUIFromURL, location.search]) // eslint-disable-line

  useEffect(() => {
    if (cateStatus === 'idle') dispatch(getCategories())
  }, [cateStatus, dispatch])

  useEffect(() => {
    const params = {
      page: urlPage,
      limit: urlLimit
    }

    if (query.sort) params.sort = query.sort
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

  const handlePaginate = (page, size) => {
    const newQuery = qs.stringify(
      { ...query, page, limit: size },
      { addQueryPrefix: true, arrayFormat: 'brackets', skipNulls: true }
    )
    navigate(`${location.pathname}${newQuery}`, { replace: false })
  }

  const toggleCategory = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const applyFilters = () => {
    const qObj = { page: 1, limit: urlLimit }

    if (statusTab && statusTab !== 'all') qObj.status = statusTab

    if (sortBy) {
      qObj.sort  = SORT_MAP[sortBy]
      qObj.order = 'desc'
    }

    if (selectedCategories.length > 0) qObj.categoryIds = selectedCategories

    const qTrim = (keyword || '').trim()
    if (qTrim) qObj.keyword = qTrim

    const newQuery = qs.stringify(qObj, {
      addQueryPrefix: true,
      arrayFormat: 'brackets',
      skipNulls: true,
    })
    navigate(`${location.pathname}${newQuery}`, { replace: false })
  }

  const clearFilters = () => {
    setStatusTab('all')
    setSortBy('')
    setSelectedCategories([])
    setKeyword('')
    navigate(location.pathname, { replace: false })
  }

  const current  = meta.page  || urlPage
  const pageSize = meta.limit || urlLimit
  const total    = meta.total || 0

  return (
    <>
      <S.BreadcrumbBar>
        <S.Breadcrumb>
          <Link to="/">Trang chủ</Link>
          <span className="sep">»</span>
          <span className="current">Tìm truyện</span>
        </S.Breadcrumb>
      </S.BreadcrumbBar>

      <S.MainContainer>
        <S.ListStory>
          <S.SectionHeader>
            <S.SectionTitle>
              Tìm truyện <i className="fa-solid fa-angle-right" />
            </S.SectionTitle>
            {keywordFromURL && <S.Keyword>Từ khóa: “{keywordFromURL}”</S.Keyword>}
          </S.SectionHeader>

          {/* --- FILTER BAR --- */}
          <S.FilterBar>
            <S.GroupRow>
              <S.GroupLabel>Từ khóa:</S.GroupLabel>
              <S.KeywordInput
                type="text"
                value={keyword}
                placeholder="Nhập tên truyện, tác giả..."
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
              />
            </S.GroupRow>

            <S.GroupRow>
              <S.GroupLabel>Trạng thái:</S.GroupLabel>
              <S.ButtonWrap>
                {STATUS_TABS.map((it) => (
                  <S.TabButton
                    key={it.key}
                    $active={statusTab === it.key}
                    onClick={() => setStatusTab(it.key)}
                    type="button"
                  >
                    {it.label}
                  </S.TabButton>
                ))}
              </S.ButtonWrap>
            </S.GroupRow>

            <S.GroupRow>
              <S.GroupLabel>Sắp xếp theo:</S.GroupLabel>
              <S.ButtonWrap>
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
              </S.ButtonWrap>
            </S.GroupRow>

            <S.GroupRow>
              <S.GroupLabel>Thể loại:</S.GroupLabel>
              <S.ButtonWrap>
                {cateStatus === 'loading' && <S.Hint>Đang tải thể loại...</S.Hint>}
                {cateStatus === 'failed' && <S.ErrorText>{cateError || 'Không tải được thể loại'}</S.ErrorText>}
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
              </S.ButtonWrap>
            </S.GroupRow>

            <S.ActionRow>
              <S.ApplyButton type="button" onClick={applyFilters}>
                <i className="fa-solid fa-magnifying-glass" /> Tìm kiếm
              </S.ApplyButton>
              <S.ClearButton type="button" onClick={clearFilters}>
                Xóa bộ lọc
              </S.ClearButton>
              {selectedCategories.length > 0 && (
                <S.Hint>Đã chọn {selectedCategories.length} thể loại</S.Hint>
              )}
            </S.ActionRow>
          </S.FilterBar>

          <ListStory stories={stories} status={status} error={error} />

          <Paginate
            current={current}
            pageSize={pageSize}
            total={total}
            onChange={handlePaginate}
          />
        </S.ListStory>

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

export default SearchPage
