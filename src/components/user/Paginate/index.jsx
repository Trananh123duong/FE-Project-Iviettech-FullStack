import { Pagination } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import qs from 'qs'

import { STORY_LIMIT } from '@constants/paging'
import { getStories } from '@redux/thunks/story.thunk'
import * as S from './styles'

const selectBucket = (state, scope) => {
  if (scope === 'sliderbar') return state.story.sliderbarList
  if (scope === 'updated') return state.story.updatedList
  return state.story[scope] || state.story.updatedList
}

const Paginate = ({ scope = 'updated', baseParams = {} }) => {
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()

  const query = qs.parse(location.search, { ignoreQueryPrefix: true })
  const urlPage = parseInt(query.page || 1, 10)
  const urlLimit = parseInt(query.limit || STORY_LIMIT, 10)

  const { meta = {}, status } = useSelector((state) => selectBucket(state, scope))

  const current = meta.page || urlPage
  const pageSize = meta.limit || urlLimit
  const total = meta.total || 0

  const onChange = (page, size) => {
    // cập nhật URL
    const newQuery = qs.stringify({ ...query, page, limit: size }, { addQueryPrefix: true })
    navigate(`${location.pathname}${newQuery}`, { replace: false })

    dispatch(getStories({ scope, page, limit: size, ...baseParams }))
  }

  if (!total && status !== 'loading') return null

  return (
    <S.CenteredPagination>
      <Pagination
        current={current}
        total={total}
        pageSize={pageSize}
        onChange={onChange}
        showSizeChanger
        onShowSizeChange={onChange}
      />
    </S.CenteredPagination>
  )
}

export default Paginate
