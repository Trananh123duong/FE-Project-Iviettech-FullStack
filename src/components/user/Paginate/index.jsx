import { Pagination } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { STORY_LIMIT } from '../../../constants/paging'
import { getStories } from '../../../redux/thunks/story.thunk'
import * as S from './styles'

const selectBucket = (state, scope) => {
  if (scope === 'sliderbar') return state.story.sliderbarList
  if (scope === 'updated')   return state.story.updatedList

  return state.story[scope] || state.story.updatedList
}

const Paginate = ({ scope = 'updated', baseParams = {} }) => {
  const dispatch = useDispatch()
  const { meta = {}, status } = useSelector((state) => selectBucket(state, scope))

  const current  = meta.page  || 1
  const pageSize = meta.limit || STORY_LIMIT
  const total    = meta.total || 0

  const onChange = (page, size) => {
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
