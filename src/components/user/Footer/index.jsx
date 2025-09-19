import logoImg from '@assets/logo.png'
import * as S from './styles'

// Danh sách từ khoá (href, label)
const KEYWORDS = [
  ['/', 'Truyện tranh'],
  ['/', 'Truyen tranh online'],
  ['/', 'Đọc truyện tranh'],
  ['/', 'Truyện tranh hot'],
  ['/', 'Truyện tranh hay'],
  ['/', 'Truyện ngôn tình'],
  ['/tim-truyen/manhwa-11400', 'Manhwa'],
  ['/tim-truyen/manga-112', 'Manga'],
  ['/tim-truyen/manhua', 'Manhua'],
  ['/', 'truyenqq'],
  ['/', 'mi2manga'],
  ['/', 'doctruyen3q'],
  ['/', 'toptruyen'],
  ['/', 'cmanga'],
  ['/', 'vlogtruyen'],
  ['/', 'blogtruyen'],
  ['/', 'truyentranhaudio'],
  ['/', 'vcomi'],
]

const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <S.Footer>
      <S.Container>
        {/* ===== Cột trái: logo + link chính sách + copy ===== */}
        <S.BrandCol>
          <img src={logoImg} alt="NetTruyen" className="logo" />

          <p className="note">Chỗ để nhúng iframe fb</p>

          <div className="links">
            <a href="#" target="_self" rel="noopener">Liên hệ bản quyền</a>
            <span className="dot">•</span>
            <a href="#" target="_self" rel="noopener">Chính sách bảo mật</a>
          </div>

          <p className="copy">Copyright © {year} NetTruyen</p>
        </S.BrandCol>

        {/* ===== Cột phải: từ khoá ===== */}
        <S.KeywordsCol>
          <h4 className="title">Từ khoá</h4>
          <ul className="tags">
            {KEYWORDS.map(([href, label]) => (
              <li key={label}>
                <a href={href} target="_self" rel="noopener">{label}</a>
              </li>
            ))}
          </ul>
        </S.KeywordsCol>
      </S.Container>
    </S.Footer>
  )
}

export default Footer
