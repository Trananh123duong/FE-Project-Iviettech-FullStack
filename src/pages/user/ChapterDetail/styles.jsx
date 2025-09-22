import styled from 'styled-components'
import { Button } from 'antd'

/* ===== Khung trang: đồng bộ site-width với Header/Nav ===== */
export const Page = styled.main`
  max-width: var(--site-width, 1100px);
  margin: 0 auto 28px;
  padding: 10px 12px 24px;
  background: #fff;
`

/* ===== Breadcrumb ===== */
export const BreadcrumbBar = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 8px;
  color: #374151;
  flex-wrap: wrap;
`
export const Crumb = styled.span`
  color: #1e88e5;
  cursor: pointer;
  &:hover { text-decoration: underline; }
`
export const UpdatedAt = styled.span`
  font-style: italic;
  color: #8c8c8c;
`

/* ===== Thanh công cụ sticky =====
 * top: 8px để tránh dính sát cạnh trên & không bị header đè.
 */
export const Toolbar = styled.div`
  position: sticky;
  top: 8px;
  z-index: 50;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 8px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 10px;

  .left { display: flex; align-items: center; gap: 8px; }
  .right { display: flex; align-items: center; gap: 8px; }

  /* Select responsive bằng clamp để hợp mọi màn */
  .chapter-select { width: clamp(250px, 50vw, 560px); }

  @media (max-width: 640px) {
    flex-wrap: wrap;
    .chapter-select { width: 100%; }
  }
`

export const NavButton = styled(Button)`
  border: 0;
  background: #d1d5db;
  color: #111;
  border-radius: 8px;
  &:hover { background: #cbd5e1 !important; color: #111 !important; }
  &:disabled { opacity: .6; cursor: not-allowed; }
`

export const FollowButton = styled(Button)`
  background-color: #e74c3c;
  border-color: #e74c3c;
  color: #fff;
  font-weight: 700;
  height: 36px;
  padding: 0 16px;
  border-radius: 10px;

  &:hover, &:focus {
    background-color: #d94a3a !important;
    border-color: #d94a3a !important;
    color: #fff !important;
  }
  &.is-followed {
    background-color: #16a34a;
    border-color: #16a34a;
  }
  &.is-followed:hover,
  &.is-followed:focus {
    background-color: #15803d !important;
    border-color: #15803d !important;
  }
  &:disabled,
  &[disabled],
  &.ant-btn[disabled] {
    background-color: #f1a5a0 !important;
    border-color: #f1a5a0 !important;
    color: #fff !important;
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
    box-shadow: none;
  }
`

/* ===== Khu đọc ảnh ===== */
export const Reader = styled.div`
  margin-top: 12px;

  .img-wrap {
    max-width: 900px;
    margin: 0 auto 8px;
  }
  .img-wrap .ant-image { width: 100%; }
  .img-wrap img {
    width: 100%;
    height: auto;
    display: block;
  }
`
