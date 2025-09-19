import styled from 'styled-components'
import { Button } from 'antd'

/* ===== Khung trang & lưới 2 cột ===== */
export const Page = styled.main`
  max-width: var(--site-width, 1000px);
  margin: 0 auto;
  padding: 10px 12px 20px;
  background: #fff;
  overflow-x: hidden;
`

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`

/* ===== Tiêu đề ===== */
export const TitleBlock = styled.div`
  text-align: center;
  margin: 4px 0 8px;
`

export const PageTitle = styled.h1`
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: .2px;
  color: #1f2937;
`

export const UpdatedAt = styled.div`
  margin-top: 4px;
  font-style: italic;
  color: #8c8c8c;
`

/* ===== Section heading ===== */
export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`

export const SectionTitle = styled.h2`
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  color: #1e88e5;
  letter-spacing: .2px;

  i { margin-right: 6px; }
`

/* ===== Summary + meta ===== */
export const TopInfo = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 16px;
  margin-top: 12px;

  .cover { grid-column: 1 / 2; }
  .meta  { grid-column: 2 / 3; }

  .muted { color: #8c8c8c; }
  .strong { font-weight: 700; }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    .cover, .meta { grid-column: auto; }
  }
`

/* Hàng icon + label + value */
export const FieldRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;

  .icon { color: #9ca3af; width: 18px; text-align: center; }
  .label { color: #6b7280; font-weight: 700; }
  .value { color: #111827; font-weight: 600; }
`

export const CategoryLink = styled.span`
  color: #1e88e5;
  cursor: pointer;
  text-decoration: none;
  &:hover, &:focus { text-decoration: underline; outline: none; }
`

export const RatingLine = styled.div`
  margin-top: 4px;
  color: #111827;

  a {
    color: #1e88e5;
    text-decoration: none;
  }
  a:hover { text-decoration: underline; }
`

export const ActionRow = styled.div`
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`

/* ===== Buttons ===== */
export const FollowButton = styled(Button)`
  background-color: #e74c3c;
  border-color: #e74c3c;
  color: #fff;
  font-weight: 700;
  height: 40px;
  padding: 0 18px;
  border-radius: 10px;

  &:hover, &:focus {
    background-color: #d94a3a !important;
    border-color: #d94a3a !important;
    color: #fff !important;
  }

  /* Khi đã theo dõi */
  &.is-followed {
    background-color: #16a34a;
    border-color: #16a34a;
  }
  &.is-followed:hover,
  &.is-followed:focus {
    background-color: #15803d !important;
    border-color: #15803d !important;
  }

  /* Disabled */
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

export const ReadButton = styled(Button)`
  background-color: #f5a623;
  border-color: #f5a623;
  color: #fff;
  font-weight: 700;
  height: 40px;
  padding: 0 18px;
  border-radius: 10px;

  &:hover, &:focus {
    background-color: #e79b1e !important;
    border-color: #e79b1e !important;
    color: #fff !important;
  }
`

/* ===== Bảng chapter ===== */
export const ChapterTableWrap = styled.div`
  /* Mốc đã đọc gần nhất: nền vàng nhạt */
  .ant-table-tbody > tr.is-last-read > td { background: #fffbe6; }
  /* Các chương đã đọc: chữ xám */
  .ant-table-tbody > tr.is-read > td { color: #6b7280; }
  .ant-table-tbody > tr.is-read .chapter-link-btn { color: #6b7280; }
`

export const ChapterLinkBtn = styled.span.attrs({ className: 'chapter-link-btn' })`
  color: #111;
  text-decoration: none;
  cursor: pointer;
  &:hover, &:focus { text-decoration: none; }
`