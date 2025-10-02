import styled from 'styled-components'

/* Breakpoints */
const bp = {
  xs: '360px',
  sm: '480px',
  md: '768px',
  lg: '1100px',
}

/**
 * Lưới truyện
 * - 4 cột (>= lg), 3 cột (>= 900), 2 cột (>= 640), 1 cột (mobile)
 * - Tối ưu khoảng cách theo breakpoint
 */
export const Grid = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px 14px;
  padding-left: 0;

  @media (max-width: ${bp.lg}) { grid-template-columns: repeat(3, 1fr); }
  @media (max-width: 900px)    { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 640px)    { grid-template-columns: 1fr; }

  @media (max-width: ${bp.sm}) {
    gap: 12px 10px;
  }
`

/** Dòng thông tin trạng thái (loading/error) */
export const Info = styled.div`
  grid-column: 1 / -1;
  padding: 8px 4px;
  color: #555;
  &.error { color: #d32f2f; }

  @media (max-width: ${bp.sm}) {
    padding: 6px 2px;
  }
`

/**
 * Card
 * - Bo góc + shadow nhẹ, hover nhô lên chút xíu
 * - Giảm shadow/transform ở mobile để mượt
 */
export const Card = styled.article`
  background: #fff;
  border: 1px solid #ececec;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 14px rgba(0,0,0,.04);

  @media (prefers-reduced-motion: no-preference) {
    transition: transform .15s ease, box-shadow .15s ease, border-color .15s ease;
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(0,0,0,.08);
      border-color: #e9e9e9;
    }
  }

  @media (max-width: ${bp.sm}) {
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0,0,0,.03);
    &:hover { transform: none; box-shadow: 0 4px 10px rgba(0,0,0,.03); }
  }
`

/**
 * Ảnh bìa + overlay thống kê
 */
export const ThumbWrap = styled.div`
  position: relative;
  background: #f2f2f2;
  aspect-ratio: 3 / 4;         /* giữ tỷ lệ ảnh */
  overflow: hidden;

  a { display: block; width: 100%; height: 100%; }
  img {
    width: 100%; height: 100%;
    object-fit: cover; display: block;
  }
`

export const OverlayStats = styled.div`
  position: absolute;
  left: 0; right: 0; bottom: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 8px;
  color: #fff;
  font-size: 12px;
  background: linear-gradient(to top, rgba(0,0,0,.55), rgba(0,0,0,.05));
  backdrop-filter: saturate(120%);

  span { display: inline-flex; align-items: center; gap: 6px; }
  i { opacity: .95; }

  @media (max-width: ${bp.md}) {
    font-size: 11.5px;
    gap: 8px;
    padding: 4px 7px;
  }
  @media (max-width: ${bp.sm}) {
    font-size: 11px;
    gap: 6px;
    padding: 3px 6px;
  }
  @media (max-width: ${bp.xs}) {
    /* Khi quá hẹp, cho phép wrap 2 hàng để không đè chữ */
    flex-wrap: wrap;
    row-gap: 4px;
  }
`

/**
 * Tiêu đề truyện
 * - Clamp 2 dòng desktop, 1 dòng mobile
 */
export const Title = styled.h3`
  margin: 10px 10px 6px 10px;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.3;
  color: #111;
  height: 40px;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  a {
    color: inherit;
    text-decoration: none;
  }
  a:hover { color: #2f6fea; }

  @media (max-width: ${bp.md}) {
    font-size: 15.5px;
  }
  @media (max-width: ${bp.sm}) {
    font-size: 15px;
    -webkit-line-clamp: 1; /* gọn gàng ở mobile */
    margin: 8px 8px 4px 8px;
  }
`

/**
 * Danh sách 3 chapter gần nhất
 * - Desktop: tên chap trái, thời gian phải (một hàng)
 * - Mobile: thời gian xuống dòng thứ 2 (đỡ chật)
 */
export const ChapterList = styled.ul`
  list-style: none;
  margin: 0 10px 8px 10px;
  padding: 0;

  .chapter-row {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 8px;
    padding: 3px 0;
    border-top: 1px dashed #f1f1f1;
  }
  .chapter-row:first-child { border-top: none; }

  .chapter-link {
    color: #333;
    text-decoration: none;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .chapter-link:hover { color: #2f6fea; text-decoration: underline; }
  .chapter-link.muted { color: #999; cursor: default; text-decoration: none; }

  .chapter-time {
    font-size: 9px;
    color: #8b9099;
    white-space: nowrap;
    font-style: italic;
    justify-self: end;
  }

  @media (max-width: ${bp.md}) {
    margin: 0 9px 8px 9px;
    .chapter-link { font-size: 13.5px; }
    .chapter-time { font-size: 10px; }
  }

  @media (max-width: ${bp.sm}) {
    margin: 0 8px 8px 8px;

    /* Đưa thời gian xuống dòng thứ 2 để tiết kiệm chiều ngang */
    .chapter-row {
      grid-template-columns: 1fr;
      align-items: start;
      gap: 2px;
      padding: 6px 0;
    }
    .chapter-time {
      justify-self: start;
      font-size: 11px;
      opacity: .9;
    }
  }

  @media (max-width: ${bp.xs}) {
    .chapter-link { font-size: 13px; }
    .chapter-time { font-size: 10.5px; }
  }
`

/**
 * Khu vực action (bỏ theo dõi)
 * - Desktop: nút chuẩn
 * - Mobile: full width, tăng chiều cao chạm tay
 */
export const Actions = styled.div`
  padding: 6px 10px 12px 10px;

  .btn-unfollow {
    width: 100%;
    padding: 8px 10px;
    border-radius: 8px;
    border: 1px solid #e74c3c;
    background: transparent;
    color: #e74c3c;
    font-weight: 600;
    cursor: pointer;

    @media (prefers-reduced-motion: no-preference) {
      transition: background .15s ease, color .15s ease, transform .15s ease, border-color .15s ease;
      &:hover:not([disabled]) {
        background: #e74c3c;
        color: #fff;
        transform: translateY(-1px);
        border-color: #e74c3c;
      }
    }
  }
  .btn-unfollow[disabled] { opacity: .6; cursor: not-allowed; }

  @media (max-width: ${bp.md}) {
    padding: 6px 9px 10px 9px;
    .btn-unfollow { border-radius: 8px; }
  }
  @media (max-width: ${bp.sm}) {
    padding: 6px 8px 10px 8px;
    .btn-unfollow {
      padding: 10px 12px;      /* lớn hơn cho ngón tay */
      border-radius: 9px;
      font-size: 14px;
    }
  }
`
