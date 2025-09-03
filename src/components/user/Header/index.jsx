import * as S from './styles'

const Header = () => {
  return (
    <S.HeaderConatiner>
      <S.Navbar>
        <img
          src="https://nettruyenvia.com/assets/images/logo-nettruyen.png"
          alt=""
        />
        <div class="search-box">
          <input type="text" placeholder="Tìm truyện..." />
          <button>
            <i class="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>
        <S.IconGroup>
          <i class="fa fa-lightbulb-o toggle-dark"></i>
          <i class="fa fa-comment notifications"></i>
        </S.IconGroup>

        <S.SignGroup>
          <a href="/dangnhap.html">Đăng nhập</a> /
          <a href="/dangky.html">Đăng ký</a>
        </S.SignGroup>
      </S.Navbar>
    </S.HeaderConatiner>
  )
}

export default Header
