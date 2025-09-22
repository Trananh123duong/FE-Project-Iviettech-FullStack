import styled /*, { css }*/ from 'styled-components'

/* ===================== Navbar: vỏ bọc ngoài ===================== */
export const NavbarContainer = styled.nav`
  width: 100%;
  height: 44px;
  background: #e9e9e9;
  border-top: 1px solid rgba(0,0,0,.04);
  border-bottom: 1px solid rgba(0,0,0,.08);
`

/* ===================== Navbar: khối bên trong (layout 3 phần) ===================== */
export const NavInner = styled.div`
  /* -- Layout & canh hàng với Header/Main -- */
  max-width: var(--site-width, 1100px);
  height: 44px;
  margin: 0 auto;
  display: flex;
  align-items: stretch;
  padding: 0 12px;

  /* -- Danh sách tab điều hướng -- */
  .nav {
    display: flex;
    align-items: stretch;
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    list-style: none;
    overflow: hidden; /* tránh tràn gây lệch */
  }

  /* -- Từng tab -- */
  .nav-item {
    position: relative;
    display: flex;
    align-items: stretch;
    border-left: 1px solid #d8d8d8;
    background: #fff; /* ô trắng trên nền xám nhạt */
  }
  .nav-item:first-child { border-left: none; }

  /* -- Link trong tab -- */
  .nav-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 44px;
    padding: 0 18px;
    color: #111;
    text-decoration: none;
    font-size: 14px;
    line-height: 44px;
    white-space: nowrap;
    background: #fff;
    border: 0;
    cursor: pointer;
  }
  .nav-link .anticon { font-size: 16px; }
  .nav-link .caret { font-size: 12px; margin-left: 2px; opacity: .9; }

  /* -- Hover/Active state -- */
  .nav-item:hover .nav-link { background: #f4f4f4; color: #7c3aed; }
  .nav-item.active .nav-link { color: #000; font-weight: 600; }
  .nav-item.active::after {
    content: "";
    position: absolute;
    left: 0; right: 0; bottom: -1px;
    height: 2px;
    background: #2f6fea; /* trùng màu nút search ở Header */
  }

  /* ========== Marker: canh mép trái dropdown trùng container ========== */
  ${/* các panel dropdown mang overlayClassName="nt-dropdown" */ ''}

  :global(.nt-dropdown) .ant-dropdown {
    margin-left: -12px; /* khớp đúng padding 12px của container */
  }

  /* -- Responsive -- */
  @media (max-width: 900px) { .nav-link { padding: 0 14px; } }
  @media (max-width: 768px) { .nav-link { padding: 0 12px; font-size: 13px; } }
`

/* ===================== Panel dropdown dùng chung (Thể loại/Xếp hạng) ===================== */
export const MegaPanel = styled.div`
  /* -- Hộp panel thả xuống -- */
  background: #fff;
  border: 1px solid #e6e6e6;
  box-shadow: 0 8px 26px rgba(0,0,0,.12);
  border-radius: 10px;
  padding: 10px;              /* tổng thể gọn */
  min-width: 560px;
  max-width: 860px;

  /* ========== Marker: phiên bản gọn cho Xếp hạng ========== */
  ${/* áp dụng khi thêm className="compact" trong overlay */ ''}

  &.compact {
    min-width: 420px;
    padding: 8px;
  }

  /* -- Trạng thái loading/error -- */
  .panel-body.center {
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: center;
    padding: 16px 8px;
  }
  .panel-body.center .hint { color: #666; font-size: 13px; }
  .panel-body.center.error { color: #d32f2f; }

  /* -- Lưới bên trong panel -- */
  ul { list-style: none; margin: 0; padding: 0; }

  .grid { display: grid; gap: 4px 12px; }    /* gap nhỏ cho chặt chẽ */
  .grid-4 { grid-template-columns: repeat(4, minmax(140px, 1fr)); }
  .grid-2 { grid-template-columns: repeat(2, minmax(150px, 1fr)); }

  /* -- Item link -- */
  li a {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 8px;          /* item nhỏ gọn */
    border-radius: 8px;
    color: #111;
    text-decoration: none;
    font-size: 13.5px;
    line-height: 1.15;
  }
  li a:hover { background: #f5f5f5; color: #7c3aed; }

  /* -- Icon cố định độ rộng để chữ thẳng hàng -- */
  li a .anticon {
    width: 18px;
    text-align: center;
    opacity: .9;
  }

  /* -- Mục nổi bật (Truyện full) -- */
  li.highlight a { color: #d32f2f; font-weight: 600; }

  /* -- Responsive panel -- */
  @media (max-width: 768px) {
    min-width: 360px;
    .grid-4 { grid-template-columns: repeat(2, minmax(140px, 1fr)); }
  }
`
