import styled from 'styled-components'

// Container bọc toàn bộ widget “Truyện đang theo dõi”
export const Wrapper = styled.div`
  width: 100%;
  background: #fff;
  border: 1px solid #eee;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 16px;

  /* Link trong block này: bỏ gạch chân + giữ màu chữ hiện tại (thường là đen) */
  a,
  .ant-list-item-meta-title a,
  .ant-list-item-meta-description a {
    text-decoration: none !important;
    color: inherit; /* giữ đồng nhất màu với text xung quanh */
  }

  a:hover,
  a:focus,
  a:active {
    text-decoration: none !important;
    color: inherit;
  }
`

// Header: tiêu đề + link “Xem tất cả”
export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;

  a {
    font-size: 13px;
    white-space: nowrap; /* tránh xuống dòng gây xô lệch header */
  }
`
