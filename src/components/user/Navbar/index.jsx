import * as S from './styles';

const Navbar = () => {
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
            <li>Dropdown content</li>
            <li>Dropdown content</li>
            <li>Dropdown content</li>
            <li>Dropdown content</li>
            <li>Dropdown content</li>
            <li>Dropdown content</li>
            <li>Dropdown content</li>
            <li>Dropdown content</li>
            <li>Dropdown content</li>
            <li>Dropdown content</li>
            <li>Dropdown content</li>
            <li>Dropdown content</li>
            <li>Dropdown content</li>
            <li>Dropdown content</li>
            <li>Dropdown content</li>
            <li>Dropdown content</li>
            <li>Dropdown content</li>
            <li>Dropdown content</li>
            <li>Dropdown content</li>
            <li>Dropdown content</li>
            <li>Dropdown content</li>
            <li>Dropdown content</li>
            <li>Dropdown content</li>
            <li>Dropdown content</li>
            <li>Dropdown content</li>
            <li>Dropdown content</li>
            <li>Dropdown content</li>
            <li>Dropdown content</li>
            <li>Dropdown content</li>
            <li>Dropdown content</li>
            <li>Dropdown content</li>
            <li>Dropdown content</li>
            <li>Dropdown content</li>
          </S.Categories>
        </S.ItemCategories>
        <li>
          <S.ItemLink to="">
            XẾP HẠNG <i class="fa-solid fa-caret-down"></i>
          </S.ItemLink>
        </li>
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
