import { Pagination } from 'antd';
import * as S from './styles';

const Paginate = () => (
  <S.CenteredPagination>
    <Pagination defaultCurrent={6} total={500} />
  </S.CenteredPagination>
);

export default Paginate;