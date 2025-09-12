import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCategories } from '@redux/thunks/category.thunk'
import * as S from './styles';

const Navbar = () => {
  const dispatch = useDispatch()
  const { data: categories, status, error } = useSelector(
    (state) => state.category.categoryList
  )

  useEffect(() => {
    if (status === 'idle') {
      dispatch(getCategories())
    }
  }, [status, dispatch])

  return (
    <S.MainNav>
      <S.MainList>
        <li>
          <S.ItemLink to="">
            <i class="icon-home fas fa-home"></i>
          </S.ItemLink>
        </li>
        <li>
          <S.ItemLink to="">
            HOT
          </S.ItemLink>
        </li>
        <li>
          <S.ItemLink to="">
            THEO DÕI
          </S.ItemLink>
        </li>
        <li>
          <S.ItemLink to="">
            LỊCH SỬ
          </S.ItemLink>
        </li>
        <S.ItemCategories>
          <S.ItemLink to="">
            THỂ LOẠI <i class="fa-solid fa-caret-down"></i>
          </S.ItemLink>

          <S.Categories>
            {status === 'loading' && <li>Đang tải...</li>}
            {status === 'failed' && <li>Lỗi: {error}</li>}
            {status === 'succeeded' &&
              categories.map((c) => (
                <S.ItemLink to={`/the-loai/${c.id}`}>{c.name}</S.ItemLink>
              ))
            }
          </S.Categories>
        </S.ItemCategories>

        <S.ItemRanking>
          <S.ItemLink to="">
            XẾP HẠNG <i className="fa-solid fa-caret-down"></i>
          </S.ItemLink>

          <S.RankingMenu>
            <li><i className="fa fa-eye"></i> Top all</li>
            <li className="highlight"><i className="fa fa-signal"></i> Truyện full</li>
            <li><i className="fa fa-eye"></i> Top tháng</li>
            <li><i className="fa fa-thumbs-up"></i> Yêu Thích</li>
            <li><i className="fa fa-eye"></i> Top tuần</li>
            <li><i className="fa fa-sync-alt"></i> Mới cập nhật</li>
            <li><i className="fa fa-eye"></i> Top ngày</li>
            <li><i className="fa fa-star"></i> Truyện mới</li>
            <li><i className="fa fa-eye"></i> Top Follow</li>
            <li><i className="fa fa-list"></i> Số chapter</li>
          </S.RankingMenu>
        </S.ItemRanking>

        <li>
          <S.ItemLink to="">
            TÌM TRUYỆN
          </S.ItemLink>
        </li>
      </S.MainList>
    </S.MainNav>
  );
};

export default Navbar;
