import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import qs from 'qs'

import { getCategories } from '@redux/thunks/category.thunk'
import { ROUTES } from '@constants/routes'
import { STORY_LIMIT } from '@constants/paging'
import * as S from './styles'

const Navbar = () => {
  const dispatch = useDispatch()
  const { data: categories = [], status, error } = useSelector(
    (state) => state.category.categoryList
  )

  useEffect(() => {
    if (status === 'idle') dispatch(getCategories())
  }, [status, dispatch])

  const buildSearchPath = (params = {}) => {
    const search = qs.stringify(
      { page: 1, limit: STORY_LIMIT, order: 'desc', ...params },
      { addQueryPrefix: true, arrayFormat: 'brackets', skipNulls: true }
    )
    return `${ROUTES.USER.SEARCH}${search}`
  }

  return (
    <S.MainNav>
      <S.MainList>
        <li>
          <S.ItemLink to={ROUTES.USER?.HOME || '/'}>
            <i className="icon-home fas fa-home"></i>
          </S.ItemLink>
        </li>

        <li>
          <S.ItemLink to={buildSearchPath({ sort: 'view_day' })}>
            HOT
          </S.ItemLink>
        </li>

        <li>
          <S.ItemLink to={ROUTES.USER.FOLLOW}>
            THEO DÕI
          </S.ItemLink>
        </li>

        <li>
          <S.ItemLink to={ROUTES.USER.HISTORY}>
            LỊCH SỬ
          </S.ItemLink>
        </li>

        <S.ItemCategories>
          <S.ItemLink to={buildSearchPath()}>
            THỂ LOẠI <i className="fa-solid fa-caret-down"></i>
          </S.ItemLink>

          <S.Categories>
            {status === 'loading' && <li>Đang tải...</li>}
            {status === 'failed' && <li>Lỗi: {error}</li>}
            {status === 'succeeded' &&
              categories.map((c) => (
                <li key={c.id}>
                  <S.ItemLink to={buildSearchPath({ categoryIds: [c.id] })}>
                    {c.name}
                  </S.ItemLink>
                </li>
              ))}
          </S.Categories>
        </S.ItemCategories>

        <S.ItemRanking>
          <S.ItemLink to={buildSearchPath()}>
            XẾP HẠNG <i className="fa-solid fa-caret-down"></i>
          </S.ItemLink>

          <S.RankingMenu>
            <li>
              <S.ItemLink to={buildSearchPath({ sort: 'view_all' })}>
                <i className="fa fa-eye"></i> Top all
              </S.ItemLink>
            </li>
            <li className="highlight">
              <S.ItemLink to={buildSearchPath({ status: 'completed' })}>
                <i className="fa fa-signal"></i> Truyện full
              </S.ItemLink>
            </li>
            <li>
              <S.ItemLink to={buildSearchPath({ sort: 'view_month' })}>
                <i className="fa fa-eye"></i> Top tháng
              </S.ItemLink>
            </li>
            <li>
              <S.ItemLink to={buildSearchPath({ sort: 'updated_at' })}>
                <i className="fa fa-sync-alt"></i> Mới cập nhật
              </S.ItemLink>
            </li>
            <li>
              <S.ItemLink to={buildSearchPath({ sort: 'view_week' })}>
                <i className="fa fa-eye"></i> Top tuần
              </S.ItemLink>
            </li>
            <li>
              <S.ItemLink to={buildSearchPath({ sort: 'created_at' })}>
                <i className="fa fa-star"></i> Truyện mới
              </S.ItemLink>
            </li>
            <li>
              <S.ItemLink to={buildSearchPath({ sort: 'view_day' })}>
                <i className="fa fa-eye"></i> Top ngày
              </S.ItemLink>
            </li>
            <li>
              <S.ItemLink to={buildSearchPath({ sort: 'total_follow' })}>
                <i className="fa fa-eye"></i> Top Follow
              </S.ItemLink>
            </li>
          </S.RankingMenu>
        </S.ItemRanking>

        <li>
          <S.ItemLink to={ROUTES.USER.SEARCH}>
            TÌM TRUYỆN
          </S.ItemLink>
        </li>
      </S.MainList>
    </S.MainNav>
  )
}

export default Navbar
