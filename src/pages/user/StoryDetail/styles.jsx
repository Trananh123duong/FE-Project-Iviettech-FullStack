import { Button } from 'antd'
import styled from 'styled-components'

/* =========================
 * Bảng màu/tokens đơn giản
 * ========================= */
const palette = {
  text: '#111827',
  textMuted: '#6b7280',
  textLighter: '#9ca3af',
  textLabel: '#374151',
  primary: '#1e88e5',
  primaryHover: '#187bd0',
  warn: '#f59e0b',
  bgSubtle: '#f9fafb',
  border: '#e5e7eb',
  danger: '#e74c3c',
  dangerHover: '#d94a3a',
  success: '#16a34a',
  successHover: '#15803d',
  btnRead: '#f5a623',
  btnReadHover: '#e79b1e',
  tableReadBg: '#fffbe6',
}

/* ===== Khung trang & lưới 2 cột ===== */
export const Page = styled.main`
  max-width: var(--site-width, 1100px);
  margin: 0 auto;
  padding: 10px 12px 20px;
  background: #fff;
  overflow-x: hidden;
  color: ${palette.text};

  .muted { color: ${palette.textLighter}; }
  .strong { font-weight: 700; }

  /* Focus ring nhất quán */
  *:focus-visible {
    outline: 2px solid ${palette.primary};
    outline-offset: 2px;
    border-radius: 6px;
  }
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
  font-size: clamp(22px, 2.2vw, 28px);
  font-weight: 800;
  letter-spacing: .2px;
  color: #1f2937;
  line-height: 1.2;
  word-break: break-word;
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
  margin: 10px 0 6px;
`

export const SectionTitle = styled.h2`
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  color: ${palette.primary};
  letter-spacing: .2px;
  display: flex;
  align-items: center;
  gap: 6px;

  i { margin-right: 2px; }
`

/* ===== Summary + meta ===== */
export const TopInfo = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 16px;
  margin-top: 12px;

  .cover { grid-column: 1 / 2; }
  .meta  { grid-column: 2 / 3; }

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
  .label { color: ${palette.textMuted}; font-weight: 700; }
  .value { color: ${palette.text}; font-weight: 600; word-break: break-word; }
`

export const CategoryLink = styled.span`
  color: ${palette.primary};
  cursor: pointer;
  text-decoration: none;
  &:hover, &:focus { text-decoration: underline; outline: none; }
`

export const RatingLine = styled.div`
  margin-top: 4px;
  color: ${palette.text};

  a {
    color: ${palette.primary};
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

/* ===== Rating box ===== */
export const RatingWrap = styled.div`
  margin-top: 8px;
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 16px;
  align-items: center;
  padding: 10px;
  background: ${palette.bgSubtle};
  border: 1px solid ${palette.border};
  border-radius: 10px;

  .left {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;

    .avg {
      font-size: 32px;
      font-weight: 800;
      line-height: 1;
      color: ${palette.text};
    }
    .sub {
      color: ${palette.textMuted};
      font-size: 12px;
      margin-top: -2px;
    }
    .count {
      color: ${palette.textLabel};
      font-weight: 600;
      margin: 2px 0 4px;
    }
    .hint {
      color: ${palette.textLighter};
      font-size: 12px;
    }
    .ant-rate {
      font-size: 20px;
      gap: 2px; /* thu nhỏ khoảng cách các sao */
    }
  }

  .right {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

export const DistRow = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr 90px;
  align-items: center;
  gap: 8px;

  .label { color: ${palette.textLabel}; font-weight: 600; width: 40px; }
  .value { color: ${palette.textMuted}; text-align: right; font-variant-numeric: tabular-nums; }
`

export const DistBar = styled.div`
  position: relative;
  height: 10px;
  background: ${palette.border};
  border-radius: 999px;
  overflow: hidden;

  .bar {
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 0%;
    background: ${palette.warn};
    transition: width .25s ease; /* animation mượt khi phân phối thay đổi */
  }
`

/* ===== Buttons ===== */
export const FollowButton = styled(Button)`
  background-color: ${palette.danger};
  border-color: ${palette.danger};
  color: #fff;
  font-weight: 700;
  height: 40px;
  padding: 0 18px;
  border-radius: 10px;

  &:hover, &:focus {
    background-color: ${palette.dangerHover} !important;
    border-color: ${palette.dangerHover} !important;
    color: #fff !important;
  }

  &.is-followed {
    background-color: ${palette.success};
    border-color: ${palette.success};
  }
  &.is-followed:hover,
  &.is-followed:focus {
    background-color: ${palette.successHover} !important;
    border-color: ${palette.successHover} !important;
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

export const ReadButton = styled(Button)`
  background-color: ${palette.btnRead};
  border-color: ${palette.btnRead};
  color: #fff;
  font-weight: 700;
  height: 40px;
  padding: 0 18px;
  border-radius: 10px;

  &:hover, &:focus {
    background-color: ${palette.btnReadHover} !important;
    border-color: ${palette.btnReadHover} !important;
    color: #fff !important;
  }
`

/* ===== Bảng chapter ===== */
export const ChapterTableWrap = styled.div`
  .ant-table {
    border-radius: 10px;
    overflow: hidden;
  }
  .ant-table-thead > tr > th {
    background: ${palette.bgSubtle};
    color: ${palette.textLabel};
    font-weight: 700;
  }
  .ant-table-tbody > tr.is-last-read > td { background: ${palette.tableReadBg}; }
  .ant-table-tbody > tr.is-read > td { color: ${palette.textMuted}; }
  .ant-table-tbody > tr.is-read .chapter-link-btn { color: ${palette.textMuted}; }
  .ant-table-tbody > tr > td {
    transition: background-color .15s ease;
  }
  .ant-table-tbody > tr:hover > td {
    background: #fafafa;
  }
`

export const ChapterLinkBtn = styled.span.attrs({ className: 'chapter-link-btn' })`
  color: ${palette.text};
  text-decoration: none;
  cursor: pointer;
  &:hover, &:focus { text-decoration: underline; color: ${palette.primary}; }
`

/* ===== BÌNH LUẬN (Story comments) ===== */
export const CommentsWrap = styled.div`
  margin-top: 8px;

  /* Ô nhập */
  .ant-input-textarea {
    border-radius: 8px;
  }

  /* Comment card */
  .ant-comment {
    padding: 10px 0;
    border-bottom: 1px solid ${palette.border};
  }
  .ant-comment-inner { padding: 0; }
  .ant-comment-content-author-name {
    font-weight: 700;
    color: ${palette.text};
  }
  .ant-comment-content-detail {
    color: ${palette.text};
    line-height: 1.6;
    word-break: break-word;
  }
  .ant-comment-actions { margin-top: 6px; }
  .ant-comment-actions > li { margin-right: 12px; }
  .ant-avatar { border: 1px solid ${palette.border}; }

  /* Replies thụt vào */
  .ant-comment-nested { margin-left: 42px; }
  @media (max-width: 640px) {
    .ant-comment-nested { margin-left: 36px; }
  }

  /* Load more */
  .load-more {
    text-align: center;
    margin-top: 12px;
  }
`
