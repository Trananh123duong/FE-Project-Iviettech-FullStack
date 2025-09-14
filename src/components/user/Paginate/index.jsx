import { Pagination } from 'antd'
import * as S from './styles'

const Paginate = ({ current = 1, pageSize = 20, total = 0, onChange }) => {
  if (!total) return null

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
