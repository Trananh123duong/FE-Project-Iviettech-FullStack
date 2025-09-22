import styled from 'styled-components'

/**
 * Trang Home
 * - Canh theo --site-width để thẳng hàng với Header/Navbar/Footer
 * - Khoảng đệm đều 12px
 */
export const Page = styled.main`
  max-width: var(--site-width, 1100px);
  margin: 0 auto 28px;
  padding: 0 12px;
`

/**
 * Lưới 2 cột: nội dung (1fr) + sidebar (320px)
 * - Khoảng cách 24px
 * - Xuống 1 cột khi màn hình nhỏ
 */
export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;   /* sidebar xuống dưới */
  }
`

/** Header của từng section */
export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 6px 0 12px;
`

/** Tiêu đề section – đồng bộ toàn site */
export const SectionTitle = styled.h2`
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  color: #1e88e5;
  line-height: 1.25;

  i { margin-left: 4px; }
`
