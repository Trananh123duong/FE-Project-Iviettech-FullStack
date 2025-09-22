import styled from 'styled-components'
import bgHeader from '@assets/bg_header.jpg'

/**
 * HeaderContainer
 * - Sticky trên cùng
 * - Nền pháo hoa giống Nettruyen
 * - Viền bóng nhẹ bên dưới
 */
export const HeaderContainer = styled.header`
  z-index: 1000;
  width: 100%;
  background: url(${bgHeader}) top center repeat-x;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.12);
`

/**
 * Inner
 * - Lưới 3 cột: Logo | Search | Actions
 * - Chiều cao 56px để cân cụm search 40px
 */
export const Inner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  height: 56px;
  padding: 0 12px;

  display: grid;
  grid-template-columns: 220px 1fr auto;
  align-items: center;
  column-gap: 12px;

  /* Cho phép cột giữa co giãn đúng cách, tránh tràn đè */
  min-width: 0;
  & > .logo,
  & > .search-wrap,
  & > .right {
    min-width: 0;
  }

  /* ---------------------- Logo ---------------------- */
  .logo img {
    height: 36px;
    display: block;
    object-fit: contain;
  }

  /* ---------------------- Search ---------------------- */
  .search-wrap {
    position: relative;
    display: block;
  }

  /* Input của antd nhưng style như native để kiểm soát tuyệt đối */
  .nt-input.ant-input {
    height: 40px;
    border-radius: 999px;
    padding: 0 48px 0 16px; /* chừa chỗ cho nút bên phải */
    border: 0;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  }

  .nt-input.ant-input:focus {
    box-shadow: 0 0 0 2px rgba(47, 111, 234, 0.15),
      0 2px 6px rgba(0, 0, 0, 0.08);
  }

  /* Nút search đặt absolute để luôn cân giữa theo input */
  .nt-search-btn {
    position: absolute;
    top: 50%;
    right: 2px;
    transform: translateY(-50%);
    height: 36px;
    width: 42px;
    border: none;
    border-radius: 999px;
    background: #2f6fea;
    color: #fff;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .nt-search-btn:hover {
    filter: brightness(1.05);
  }

  .nt-search-btn .anticon {
    font-size: 18px;
  }

  /* ---------------------- Actions bên phải ---------------------- */
  .right {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap; /* tránh rớt dòng gây chồng chéo */
  }

  .icon-btn {
    color: #fff;
    width: 32px;
    height: 32px;
    padding: 0;
    border-radius: 8px;
    flex: 0 0 auto; /* không co giãn */
  }

  .icon-btn .anticon {
    font-size: 16px;
  }

  .icon-btn:hover {
    background: rgba(255, 255, 255, 0.14);
  }

  /* Trigger mở menu tài khoản */
  .account-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 32px;
    padding: 0 8px;
    border: none;
    background: transparent;
    color: #fff;
    border-radius: 10px;
    cursor: pointer;
    flex: 0 0 auto;
  }

  .account-btn:hover {
    background: rgba(255, 255, 255, 0.14);
  }

  .account-btn .name {
    max-width: 150px;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .account-btn .caret {
    font-size: 12px;
    opacity: 0.85;
  }

  /* Dropdown tài khoản */
  .account-menu .ant-dropdown-menu {
    min-width: 240px;
    border-radius: 10px;
    padding: 8px 0;
    box-shadow: 0 8px 26px rgba(0, 0, 0, 0.18);
  }

  /* Giảm viền xám mặc định của antd để sạch mắt hơn */
  .ant-input {
    border-color: transparent;
  }

  /* ---------------------- Responsive ---------------------- */
  @media (max-width: 900px) {
    .account-btn .name {
      display: none; /* thu gọn tên khi hẹp để tránh đè nút */
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: 160px 1fr auto;
  }
`
