import styled from 'styled-components'

export const Main = styled.div`
  /* Chiều cao tối thiểu linh hoạt theo breakpoint */
  --header-h: 56px;  /* Header 1 hàng */
  --navbar-h: 44px;
  --footer-h: 200px; /* ước lượng footer */

  width: 100%;
  background-color: #eeeeee;
  min-height: calc(100svh - var(--header-h) - var(--navbar-h) - var(--footer-h));

  @media (max-width: 768px) {
    /* Header xếp 2 hàng (logo+actions, dưới là search) */
    --header-h: 96px;
    --footer-h: 220px;
  }

  @media (max-width: 480px) {
    --header-h: 100px;
    --footer-h: 240px;
  }
`

export const MainContainer = styled.div`
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 10px 12px;
  background-color: #fafafa;
  overflow-x: hidden;

  @media (max-width: 640px) {
    padding: 10px 10px;
  }
`
