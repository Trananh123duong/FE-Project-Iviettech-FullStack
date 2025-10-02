import styled from 'styled-components'

/* Breakpoints */
const bp = {
  xs: '360px',
  sm: '480px',
  md: '768px',
  lg: '1024px',
}

/* --- Container chính chứa toàn bộ list --- */
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (max-width: ${bp.sm}) {
    gap: 10px;
  }
`

/* --- Mỗi item trong danh sách --- */
export const Row = styled.div`
  display: grid;
  grid-template-columns: 110px 1fr; /* Ảnh trái, nội dung phải */
  gap: 12px;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fff;

  @media (prefers-reduced-motion: no-preference) {
    transition: box-shadow .18s ease, transform .18s ease, border-color .18s ease;
    &:hover {
      border-color: #e5e7eb;
      box-shadow: 0 2px 10px rgba(0,0,0,.04);
      transform: translateY(-1px);
    }
  }

  @media (max-width: ${bp.md}) {
    grid-template-columns: 96px 1fr;
    gap: 10px;
    padding: 9px;
    border-radius: 7px;
  }

  @media (max-width: ${bp.sm}) {
    grid-template-columns: 86px 1fr;
    gap: 8px;
    padding: 8px;
    border-radius: 6px;
  }

  @media (max-width: ${bp.xs}) {
    grid-template-columns: 78px 1fr;
  }
`

/* --- Ảnh thumbnail --- */
export const Thumb = styled.div`
  width: 110px;
  height: 150px;
  border: 1px solid #ddd;
  border-radius: 6px;
  overflow: hidden;
  background: #f7f7f7;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  @media (max-width: ${bp.md}) {
    width: 96px;
    height: 136px;
    border-radius: 6px;
  }

  @media (max-width: ${bp.sm}) {
    width: 86px;
    height: 122px;
    border-radius: 5px;
  }

  @media (max-width: ${bp.xs}) {
    width: 78px;
    height: 112px;
  }
`

/* --- Cột thông tin bên phải --- */
export const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0; /* cho phép co, tránh đẩy layout */
  
  @media (max-width: ${bp.sm}) {
    gap: 5px;
  }
`

/* --- Tên truyện (clamp dòng để khỏi tràn) --- */
export const StoryTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.25;

  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; /* desktop: 2 dòng */
  overflow: hidden;
  word-break: break-word;

  a {
    color: #111827;
    text-decoration: none;
  }

  a:hover { color: #0b63b8; }

  @media (max-width: ${bp.md}) {
    font-size: 16px;
    -webkit-line-clamp: 2;
  }

  @media (max-width: ${bp.sm}) {
    font-size: 15px;
    -webkit-line-clamp: 1; /* mobile: 1 dòng cho gọn */
  }
`

/* --- Dòng hiển thị "Đọc tới: Chapter X" --- */
export const MetaLine = styled.div`
  font-size: 14px;
  color: #1f2937;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;

  a {
    color: #2980b9;
    text-decoration: none;
  }
  a:hover { text-decoration: underline; color: #70c1f7; }

  @media (max-width: ${bp.md}) {
    font-size: 13.5px;
  }
  @media (max-width: ${bp.sm}) {
    font-size: 13px;
    -webkit-line-clamp: 1; /* tránh cao quá */
  }
`

/* --- Dòng thời gian "Lần cuối đọc" --- */
export const TimeLine = styled.div`
  font-size: 12.5px;
  color: #6b7280;

  @media (max-width: ${bp.md}) {
    font-size: 12px;
  }
  @media (max-width: ${bp.sm}) {
    font-size: 11.5px;
  }
`

/* --- Nút "Tiếp tục đọc" --- */
export const Actions = styled.div`
  margin-top: 6px;

  .read-btn {
    display: inline-block;
    padding: 7px 12px;
    border: 1px solid #2f80ed;
    border-radius: 6px;
    color: #2f80ed;
    text-decoration: none;
    font-weight: 600;
    line-height: 1;

    @media (prefers-reduced-motion: no-preference) {
      transition: background .15s ease, color .15s ease, transform .15s ease, border-color .15s ease;
      &:hover {
        background: #2f80ed;
        color: #fff;
        transform: translateY(-1px);
        border-color: #2f80ed;
      }
    }
  }

  @media (max-width: ${bp.md}) {
    margin-top: 4px;

    .read-btn {
      padding: 7px 11px;
      border-radius: 6px;
      font-weight: 600;
    }
  }

  /* Mobile: nút full width dễ bấm bằng ngón tay */
  @media (max-width: ${bp.sm}) {
    .read-btn {
      display: block;
      text-align: center;
      width: 100%;
      padding: 9px 12px;
      border-radius: 7px;
      font-size: 14px;
    }
  }
`
