import styled from 'styled-components';

export const NavbarContainer = styled.nav`
  width: 100%;
  height: 44px;
  background: #e9e9e9;
  border-top: 1px solid rgba(0,0,0,.04);
  border-bottom: 1px solid rgba(0,0,0,.08);
`

export const NavInner = styled.div`
  max-width: var(--site-width, 1100px);
  height: 44px;
  margin: 0 auto;
  display: flex;
  align-items: stretch;
  padding: 0 12px;

  /* Hamburger (ẩn desktop) */
  .menu-btn {
    display: none;
    width: 36px;
    height: 36px;
    margin: 4px 8px 4px 0;
    border: 0;
    border-radius: 8px;
    background: #fff;
    cursor: pointer;
    align-items: center;
    justify-content: center;
  }
  .menu-btn .anticon { font-size: 18px; }

  .nav {
    display: flex; align-items: stretch; height: 100%;
    width: 100%; margin: 0; padding: 0; list-style: none; overflow: hidden;
  }

  .nav-item {
    position: relative; display: flex; align-items: stretch;
    border-left: 1px solid #d8d8d8; background: #fff; flex: 0 0 auto;
  }
  .nav-item:first-child { border-left: none; }

  .nav-link {
    display: inline-flex; align-items: center; gap: 8px;
    height: 44px; padding: 0 18px; color: #111; text-decoration: none;
    font-size: 14px; line-height: 44px; white-space: nowrap;
    background: #fff; border: 0; cursor: pointer;
  }
  .nav-link .anticon { font-size: 16px; }
  .nav-link .caret { font-size: 12px; margin-left: 2px; opacity: .9; }

  .nav-item:hover .nav-link { background: #f4f4f4; color: #7c3aed; }
  .nav-item.active .nav-link { color: #000; font-weight: 600; }
  .nav-item.active::after {
    content: ""; position: absolute; left: 0; right: 0; bottom: -1px;
    height: 2px; background: #2f6fea;
  }

  :global(.nt-dropdown) .ant-dropdown { margin-left: -12px; }

  @media (max-width: 900px) { .nav-link { padding: 0 14px; } }
  @media (max-width: 768px) { .nav-link { padding: 0 12px; font-size: 13px; } }

  /* Phone: ẩn dãy tab, dùng hamburger */
  @media (max-width: 640px) {
    .menu-btn { display: inline-flex; }
    .nav { display: none; }
  }
`;

/* Panel dropdown cũ (desktop/tablet) – giữ nguyên gần như trước */
export const MegaPanel = styled.div`
  background: #fff;
  border: 1px solid #e6e6e6;
  box-shadow: 0 8px 26px rgba(0,0,0,.12);
  border-radius: 10px;
  padding: 10px;
  min-width: 560px;
  max-width: 860px;

  &.compact { min-width: 420px; padding: 8px; }

  .panel-body.center {
    display: flex; align-items: center; gap: 8px; justify-content: center;
    padding: 16px 8px;
  }
  .panel-body.center .hint { color: #666; font-size: 13px; }
  .panel-body.center.error { color: #d32f2f; }

  ul { list-style: none; margin: 0; padding: 0; }

  .grid { display: grid; gap: 4px 12px; }
  .grid-4 { grid-template-columns: repeat(4, minmax(140px, 1fr)); }
  .grid-2 { grid-template-columns: repeat(2, minmax(150px, 1fr)); }

  li a {
    display: flex; align-items: center; gap: 6px;
    padding: 6px 8px; border-radius: 8px;
    color: #111; text-decoration: none; font-size: 13.5px; line-height: 1.15;
  }
  li a:hover { background: #f5f5f5; color: #7c3aed; }
  li a .anticon { width: 18px; text-align: center; opacity: .9; }
  li.highlight a { color: #d32f2f; font-weight: 600; }

  @media (max-width: 768px) {
    min-width: 360px;
    .grid-4 { grid-template-columns: repeat(2, minmax(140px, 1fr)); }
  }
`;

/* Drawer (mobile menu) */
export const MobileMenu = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;

  .mm-section ul { list-style: none; margin: 0; padding: 0; }

  .mm-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 12px; border-bottom: 1px solid #eee;
  }
  .mm-header .title { font-weight: 800; font-size: 16px; }
  .mm-header .close {
    width: 32px; height: 32px; display: inline-flex; align-items: center; justify-content: center;
    border: 0; border-radius: 8px; background: #f5f5f5; cursor: pointer;
  }

  .mm-section { padding: 8px 10px; }
  .mm-divider { margin: 4px 0; }

  .list { display: grid; gap: 4px; }
  /* Áp dụng style link CHUNG cho tất cả menu item trong Drawer */
  .mm-section a {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 8px 8px;
    border-radius: 8px;
    text-decoration: none;       /* bỏ gạch chân */
    color: #111;                 /* về đen */
  }
  .mm-section a:hover { background: #f5f5f5; color: #7c3aed; }
  .list a .anticon { width: 18px; text-align: center; }

  .section-title { font-weight: 700; margin: 4px 0 8px; }

  .grid { display: grid; gap: 6px 10px; }
  .grid.grid-2 { grid-template-columns: repeat(2, minmax(120px, 1fr)); }

  .loading, .error { padding: 8px; color: #666; }
`
