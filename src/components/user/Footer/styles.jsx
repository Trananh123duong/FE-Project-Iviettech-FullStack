import styled from 'styled-components'

/* Breakpoints tiện dụng */
const bp = {
  xs: '360px',
  sm: '480px',
  md: '820px',
  lg: '1100px',
}

/* Footer nền tối – có safe-area & giảm padding trên mobile */
export const Footer = styled.footer`
  color: #cfd3da;
  background: radial-gradient(1200px 300px at 10% 0%, rgba(124,58,237,.08), transparent) #111;
  border-top: 1px solid rgba(255,255,255,.06);
  padding: 20px 0 18px;
  padding-left: max(12px, env(safe-area-inset-left));
  padding-right: max(12px, env(safe-area-inset-right));

  @media (max-width: ${bp.sm}) {
    padding: 16px 0 16px;
  }

  /* Tắt animation tinh tế nếu user chọn reduce motion */
  @media (prefers-reduced-motion: reduce) {
    * { transition: none !important; }
  }
`

/* Container: 2 cột trên desktop, 1 cột ở ≤ md; bó sát site width */
export const Container = styled.div`
  max-width: var(--site-width, 1100px);
  margin: 0 auto;
  padding: 0 12px;

  display: grid;
  grid-template-columns: 1.1fr 1.9fr;
  gap: 24px;

  @media (max-width: ${bp.lg}) {
    padding: 0 16px;
  }

  @media (max-width: ${bp.md}) {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  @media (max-width: ${bp.sm}) {
    gap: 12px;
    padding: 0 12px;
  }
`

/* Cột trái: logo + link + copy — co kích thước hợp lý theo viewport */
export const BrandCol = styled.div`
  .logo {
    height: 40px;
    object-fit: contain;
    display: block;
    filter: drop-shadow(0 2px 6px rgba(0,0,0,.35));
    margin-bottom: 10px;

    @media (max-width: ${bp.sm}) {
      height: 34px;
      margin-bottom: 8px;
    }
  }

  .note {
    margin: 2px 0 10px;
    color: #aeb3bb;
    font-size: 13px;

    @media (max-width: ${bp.sm}) {
      font-size: 12px;
      margin-bottom: 8px;
    }
  }

  .links {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 6px 0 8px;
    flex-wrap: wrap;

    a {
      color: #e6e9ef;
      text-decoration: none;
      font-size: 14px;
    }
    a:hover { color: #ffffff; text-decoration: underline; }
    .dot { color: #7d8490; }

    @media (max-width: ${bp.sm}) {
      gap: 8px;
      a { font-size: 13px; }
    }
  }

  .copy {
    margin: 0;
    color: #9aa1aa;
    font-size: 13px;

    @media (max-width: ${bp.sm}) {
      font-size: 12px;
    }
  }
`

/* Cột phải: “Từ khoá” + chip — wrap/scroll tốt trên mobile rất nhỏ */
export const KeywordsCol = styled.div`
  .title {
    margin: 4px 0 10px;
    color: #fff;
    font-weight: 800;
    font-size: 18px;

    @media (max-width: ${bp.sm}) {
      font-size: 16px;
      margin: 2px 0 8px;
    }
  }

  /* Lưới chip:
     - Desktop/Tablet: wrap nhiều hàng
     - Mobile rất nhỏ (≤ xs): chuyển sang cuộn ngang để đỡ cao */
  .tags {
    list-style: none;
    margin: 0;
    padding: 0;

    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    @media (max-width: ${bp.xs}) {
      flex-wrap: nowrap;
      overflow-x: auto;
      gap: 6px;
      padding-bottom: 2px;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: thin;
    }
  }

  .tags li {
    flex: 0 0 auto; /* để cuộn ngang hoạt động mượt khi ≤ xs */
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
    transition: transform .15s ease, background .15s ease, border-color .15s ease;

    @media (max-width: ${bp.sm}) {
      padding: 6px 9px;
      font-size: 12px;
    }

    @media (max-width: ${bp.xs}) {
      padding: 6px 8px;
      font-size: 12px;
    }
  }

  .tags li a:hover {
    background: rgba(255,255,255,.14);
    border-color: rgba(255,255,255,.32);
    color: #fff;
    transform: translateY(-1px);
  }
`
