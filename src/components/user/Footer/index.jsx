import * as S from './styles';

const keywords = [
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
];

const Footer = () => {
  return (
    <S.Footer>
      <S.Container>
        <S.LeftSection>
          <S.Logo
            src="https://nettruyenvio.com/assets/images/logo-nettruyen.png"
            alt="logo"
          />
          <S.MarginTop>Chỗ để nhúng iframe fb</S.MarginTop>
          <S.MarginTop>
            <S.HalfWidth><S.StyledLink href="#">Liên hệ bản quyền</S.StyledLink></S.HalfWidth>
            <S.HalfWidth><S.StyledLink href="#">Chính sách bảo mật</S.StyledLink></S.HalfWidth>
          </S.MarginTop>
          <S.Text>Copyright © 2022 NetTruyen</S.Text>
        </S.LeftSection>

        <S.RightSection>
          <S.KeywordBlock>
            <S.Title>Từ khoá</S.Title>
            <S.KeywordList>
              {keywords.map(([href, label]) => (
                <S.KeywordItem key={label}>
                  <S.KeywordLink href={href} target="_self">{label}</S.KeywordLink>
                </S.KeywordItem>
              ))}
            </S.KeywordList>
          </S.KeywordBlock>
        </S.RightSection>
      </S.Container>
    </S.Footer>
  );
};

export default Footer;
