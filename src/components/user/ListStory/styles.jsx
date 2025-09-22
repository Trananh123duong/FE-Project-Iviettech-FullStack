import styled from 'styled-components'

/**
 * Lưới truyện
 * - 4 cột (>= 1100), 3 cột (>= 900), 2 cột (>= 640), 1 cột (mobile)
 * - Khoảng cách đều, ô tự cao theo ảnh (aspect-ratio)
 */
export const Grid = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px 14px;
  padding-left: 0;

  @media (max-width: 1100px) { grid-template-columns: repeat(3, 1fr); }
  @media (max-width: 900px)  { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 640px)  { grid-template-columns: 1fr; }
`

/** Dòng thông tin trạng thái (loading/error) */
export const Info = styled.div`
  grid-column: 1 / -1;
  padding: 8px 4px;
  color: #555;
  &.error { color: #d32f2f; }
`

/**
 * Card
 * - Bo góc + shadow nhẹ, hover nhô lên chút xíu
 */
export const Card = styled.article`
  background: #fff;
  border: 1px solid #ececec;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 14px rgba(0,0,0,.04);
  transition: transform .15s ease, box-shadow .15s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0,0,0,.08);
  }
`

/**
 * Ảnh bìa + overlay thống kê
 */
export const ThumbWrap = styled.div`
  position: relative;
  background: #f2f2f2;
  aspect-ratio: 3 / 4;         /* giữ tỷ lệ ảnh; fallback: height nếu thiếu */
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
  background: linear-gradient( to top, rgba(0,0,0,.55), rgba(0,0,0,.05) );
  backdrop-filter: saturate(120%);

  span { display: inline-flex; align-items: center; gap: 6px; }
  i { opacity: .95; }
`

/**
 * Tiêu đề truyện
 * - 2 dòng tối đa, bold nhẹ
 */
export const Title = styled.h3`
  margin: 10px 10px 6px 10px;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.3;
  color: #111;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 38px;

  a {
    color: inherit;
    text-decoration: none;
  }
  a:hover { color: #2f6fea; }
`

/**
 * Danh sách 3 chapter gần nhất
 */
export const ChapterList = styled.ul`
  list-style: none;
  margin: 0 10px 8px 10px;
  padding: 0;

  .chapter-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
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
    font-size: 10px;
    color: #8b9099;
    white-space: nowrap;
    font-style: italic;
  }
`

/**
 * Khu vực action (bỏ theo dõi)
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
    transition: all .15s ease;
  }
  .btn-unfollow:hover:not([disabled]) { background: #e74c3c; color: #fff; }
  .btn-unfollow[disabled] { opacity: .6; cursor: not-allowed; }
`
