import styled from 'styled-components'

/* Breakpoints đồng nhất với các widget khác */
const bp = {
  xs: '360px',
  sm: '480px',
  md: '768px',
  lg: '1024px',
}

/* Card chứa toàn bộ TopStory */
export const Card = styled.section`
  border: 1px solid #e9e9e9;
  border-radius: 12px;
  background: #fff;
  overflow: hidden;
  margin-bottom: 16px;
  box-shadow: 0 6px 18px rgba(0,0,0,.04);

  @media (prefers-reduced-motion: reduce) {
    * { transition: none !important; }
  }
`

/* Tabs: 3 nút chia đều; trên màn rất nhỏ chuyển sang cuộn ngang */
export const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: stretch;
  border-bottom: 1px solid #eee;

  .tab {
    height: 44px;
    padding: 0 16px;
    background: #fafafa;
    border: none;
    border-right: 1px solid #eee;
    color: #222;
    font-size: 15.5px;
    font-weight: 700;
    cursor: pointer;
    outline: none;
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    line-height: 1;
    transition: background .15s ease, color .15s ease;
  }
  .tab:last-child { border-right: none; }

  .tab:hover { background: #f2f2f2; color: #7c3aed; }

  .tab.active {
    background: #fff;
    color: #000;
    position: relative;
  }
  .tab.active::after {
    content: '';
    position: absolute;
    left: 0; right: 0; bottom: 0;
    height: 3px;
    background: #7c3aed;
  }

  /* Tablet/phone: co chữ & padding để giữ 1 dòng */
  @media (max-width: ${bp.md}) {
    .tab { font-size: 15px; padding: 0 12px; height: 42px; }
  }
  @media (max-width: 640px) {
    .tab { font-size: 14px; padding: 0 10px; height: 40px; }
  }

  /* Màn cực nhỏ: chuyển sang flex + cuộn ngang, tránh vỡ hàng */
  @media (max-width: ${bp.xs}) {
    display: flex;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    gap: 6px;
    padding: 0 6px;

    .tab {
      flex: 0 0 auto;
      border-right: 0;
      border-radius: 8px 8px 0 0;
      padding: 0 12px;
      height: 38px;
      background: #f7f7f7;
    }
    .tab.active::after { height: 2px; }
  }
`

/* Panel danh sách */
export const Panel = styled.div`
  padding: 6px 10px;

  .list {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .row {
    display: grid;
    grid-template-columns: 42px 56px 1fr; /* rank | thumb | meta */
    gap: 10px;
    align-items: center;
    padding: 10px 4px;
    border-bottom: 1px solid #f2f2f2;
    transition: background .15s ease;
  }
  .row:last-child { border-bottom: none; }
  .row:hover { background: #fafafa; }

  /* Thumb */
  .thumb {
    width: 56px; height: 56px;
    border-radius: 6px;
    overflow: hidden;
    display: block;
    box-shadow: 0 1px 4px rgba(0,0,0,.06);
  }
  .thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }

  /* Meta */
  .meta { min-width: 0; }
  .title {
    margin: 0 0 2px 0;
    font-size: 16px;
    font-weight: 700;
    line-height: 1.25;
    color: #111;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .title a { color: inherit; text-decoration: none; }
  .title a:hover { color: #2f6fea; }

  .subline {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .chapter-link {
    font-size: 13.5px;
    color: #333;
    text-decoration: none;
  }
  .chapter-link:hover { color: #2f6fea; }
  .chapter-link.muted { color: #999; cursor: default; }

  .views {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: #666;
    font-size: 13px;
    white-space: nowrap;
  }

  /* Tablet */
  @media (max-width: ${bp.md}) {
    .row { grid-template-columns: 40px 52px 1fr; padding: 10px 2px; }
    .title { font-size: 15.5px; }
    .chapter-link { font-size: 13px; }
    .views { font-size: 12.5px; }
  }

  /* Phone: co mọi thứ + subline chuyển 2 hàng (chapter trên, view dưới) */
  @media (max-width: 640px) {
    .row { grid-template-columns: 36px 48px 1fr; gap: 8px; }
    .thumb { width: 48px; height: 48px; border-radius: 5px; }
    .title { font-size: 15px; }

    .subline {
      flex-direction: column;
      align-items: flex-start;
      gap: 2px;
    }
    .views { opacity: .9; }
  }

  /* Very small phones */
  @media (max-width: ${bp.xs}) {
    padding: 6px 8px;

    .row { grid-template-columns: 32px 44px 1fr; gap: 8px; }
    .thumb { width: 44px; height: 44px; }
    .title { font-size: 14px; }
    .chapter-link { font-size: 12.5px; }
    .views { font-size: 12px; }
  }
`

/* Số hạng */
export const RankBadge = styled.span`
  width: 42px;
  text-align: center;
  font-weight: 900;
  font-size: 20px;
  line-height: 1;
  user-select: none;

  color: ${({ rank }) => {
    if (rank === 1) return '#2f80ed';
    if (rank === 2) return '#27ae60';
    if (rank === 3) return '#f2994a';
    return '#9ca3af';
  }};

  @media (max-width: ${bp.md}) {
    width: 40px; font-size: 19px;
  }
  @media (max-width: 640px) {
    width: 36px; font-size: 18px;
  }
  @media (max-width: ${bp.xs}) {
    width: 32px; font-size: 17px;
  }
`

/* Dòng thông báo loading/error */
export const InfoLine = styled.div`
  padding: 8px 10px;
  font-size: 13.5px;
  color: #555;
  &.error { color: #d32f2f; }

  @media (max-width: ${bp.xs}) {
    font-size: 13px;
  }
`
