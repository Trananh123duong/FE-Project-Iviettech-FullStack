import { Pagination } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { getStories } from '../../../redux/thunks/story.thunk'
import { STORY_LIMIT } from '../../../constants/paging'
import * as S from './styles'

const Paginate = () => {
  const dispatch = useDispatch()
  const { meta = {}, status } = useSelector((state) => state.story.storyList)
  const current = meta.page || 1
  const pageSize = meta.limit || STORY_LIMIT
  const total = meta.total || 0

  const onChange = (page, size) => {
    dispatch(getStories({ page, limit: size }))
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
