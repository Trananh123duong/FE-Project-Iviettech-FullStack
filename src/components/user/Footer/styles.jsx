import styled from 'styled-components'

/* Footer nền tối – có viền mảnh phía trên cho tách khối */
export const Footer = styled.footer`
  color: #cfd3da;
  background: radial-gradient(1200px 300px at 10% 0%, rgba(124,58,237,.08), transparent) #111;
  border-top: 1px solid rgba(255,255,255,.06);
  padding: 24px 0 22px;
`

/* Container theo site width chung, chia 2 cột linh hoạt */
export const Container = styled.div`
  max-width: var(--site-width, 1000px);
  margin: 0 auto;
  padding: 0 12px;

  display: grid;
  grid-template-columns: 1.1fr 1.9fr;
  gap: 24px;

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`

/* Cột trái: logo + link + copy */
export const BrandCol = styled.div`
  .logo {
    height: 40px;
    object-fit: contain;
    display: block;
    filter: drop-shadow(0 2px 6px rgba(0,0,0,.35));
    margin-bottom: 10px;
  }

  .note {
    margin: 2px 0 10px;
    color: #aeb3bb;
    font-size: 13px;
  }

  .links {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 6px 0 8px;

    a {
      color: #e6e9ef;
      text-decoration: none;
    }
    a:hover { color: #ffffff; text-decoration: underline; }
    .dot { color: #7d8490; }
  }

  .copy {
    margin: 0;
    color: #9aa1aa;
    font-size: 13px;
  }
`

/* Cột phải: “Từ khoá” + chip */
export const KeywordsCol = styled.div`
  .title {
    margin: 4px 0 10px;
    color: #fff;
    font-weight: 800;
    font-size: 18px;
  }

  /* Lưới chip: tự wrap, khoảng cách đều */
  .tags {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .tags li a {
    display: inline-flex;
    align-items: center;
    padding: 6px 10px;
    border-radius: 999px;                       /* pill */
    color: #e8eaed;
    text-decoration: none;
    border: 1px solid rgba(255,255,255,.22);
    background: rgba(255,255,255,.06);
    font-size: 13px;
    transition: all .15s ease;
  }
  .tags li a:hover {
    background: rgba(255,255,255,.14);
    border-color: rgba(255,255,255,.32);
    color: #fff;
    transform: translateY(-1px);
  }

  @media (max-width: 820px) {
    .title { margin-top: 0; }
  }
`
