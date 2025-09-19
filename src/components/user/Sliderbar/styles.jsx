import styled from 'styled-components'

export const Container = styled.div`
  max-width: var(--site-width, 1000px);
  margin: 0 auto;
  padding: 0 12px;
  margin-bottom: 16px;
`;

/* Tiêu đề khu vực */
export const SectionHeader = styled.h2`
  margin: 0 0 12px 10px;
  font-weight: 700;
  font-size: 22px;
  color: #1e88e5;
  line-height: 1.2;

  i { margin-left: 4px; }
`

/* Dòng thông báo trạng thái */
export const Info = styled.div`
  padding: 8px 10px;
  color: #555;
  &.error { color: #d32f2f; }
`

/* Bọc slider để canh mũi tên tuyệt đối theo container */
export const SliderWrap = styled.div`
  position: relative;
  .slick-slider { padding: 0 4px; }
  .slick-list { margin: 0 -8px; }
  .slick-slide > div { padding: 0 8px; }
  margin-bottom: 4px;
`;

/* Nút điều hướng trái/phải */
export const ArrowBtn = styled.button`
  position: absolute;
  top: 40%;
  transform: translateY(-50%);
  z-index: 2;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 999px;
  background: rgba(0,0,0,.6);
  color: #fff;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  display: grid;
  place-items: center;
  box-shadow: 0 4px 14px rgba(0,0,0,.2);
  transition: transform .15s ease, background .15s ease, opacity .15s ease;

  &:hover { background: rgba(0,0,0,.8); transform: translateY(-50%) scale(1.05); }
  &.prev { left: 6px; }
  &.next { right: 6px; }

  /* Ẩn mũi tên khi không thể click (react-slick sẽ thêm class slick-disabled) */
  &.slick-disabled { opacity: 0; pointer-events: none; }
`

/* Card item bên trong slider */
export const Card = styled.article`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: #f2f2f2;
  box-shadow: 0 8px 22px rgba(0,0,0,.06);
  transition: transform .15s ease, box-shadow .15s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 26px rgba(0,0,0,.10);
  }

  .thumb {
    display: block;
    width: 100%;
    height: 100%;
  }
  .thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    aspect-ratio: 3 / 4;      /* giữ tỉ lệ ảnh nhất quán */
    display: block;
  }
`

/* Overlay thông tin ở đáy ảnh */
export const Overlay = styled.div`
  position: absolute;
  left: 0; right: 0; bottom: 0;
  padding: 10px 12px 12px 12px;
  color: #fff;
  background: linear-gradient(180deg, rgba(0,0,0,0) 10%, rgba(0,0,0,.65) 80%);
  backdrop-filter: saturate(120%);

  .title {
    margin: 0 0 4px 0;
    font-size: 18px;
    font-weight: 800;
    line-height: 1.25;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .title a { color: #fff; text-decoration: none; }
  .title a:hover { color: #cde3ff; }

  .meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .chapter {
    color: #fff;
    text-decoration: none;
    font-weight: 700;
  }
  .chapter.muted { opacity: .85; font-weight: 500; }
  .chapter:hover { color: #cde3ff; text-decoration: underline; }

  .time {
    color: #eaeaea;
    font-size: 8px;
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
`