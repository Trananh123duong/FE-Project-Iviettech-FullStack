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
            <li>Action</li>
            <li>Adventure</li>
            <li>Anime</li>
            <li>Comedy</li>
            <li>Comic</li>
            <li>Cooking</li>
            <li>Doujinshi</li>
            <li>Drama</li>
            <li>Fantasy</li>
            <li>Gender Bender</li>
            <li>Historical</li>
            <li>Horror</li>
            <li>Live action</li>
            <li>Manga</li>
            <li>Manhua</li>
            <li>Martial Arts</li>
            <li>Mecha</li>
            <li>Mystery</li>
            <li>Psychological</li>
            <li>Romance</li>
            <li>School Life</li>
            <li>Sci-fi</li>
            <li>Shojo</li>
            <li>Shojo Ai</li>
            <li>Shounen</li>
            <li>Shounen Ai</li>
            <li>Slice of Life</li>
            <li>Sports</li>
            <li>Supernatural</li>
            <li>Thiếu Nhi</li>
            <li>Tragedy</li>
            <li>Trinh Thám</li>
            <li>Truyện scan</li>
            <li>Truyện Màu</li>
            <li>Webtoon</li>
            <li>Xuyên Không</li>
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
