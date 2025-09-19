import styled from 'styled-components'

/**
 * Container của trang: canh theo --site-width để thẳng hàng
 * với Header / Sliderbar / Home.
 */
export const Page = styled.main`
  max-width: var(--site-width, 1000px);
  margin: 0 auto 28px;
  padding: 0 12px;
`

/** Breadcrumb gọn gàng */
export const Breadcrumb = styled.nav`
  font-size: 16px;
  line-height: 1.2;
  margin: 8px 0 14px;

  a { color: #2f6fea; text-decoration: none; }
  a:hover { text-decoration: underline; }

  .sep { margin: 0 8px; color: #c0c4cc; }
  .current { color: #9aa1a9; }
`

/**
 * Lưới 2 cột: nội dung (1fr) + sidebar (320px).
 * Xuống 1 cột khi màn nhỏ.
 */
export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`

/** Phần header mỗi section */
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

/** Gate khi chưa đăng nhập – card đẹp, chính giữa */
export const GateCard = styled.section`
  max-width: 720px;
  margin: 40px auto;
  padding: 24px;
  background: #fff;
  border: 1px solid #ececee;
  border-radius: 12px;
  box-shadow: 0 10px 26px rgba(0,0,0,.06);
  text-align: center;

  h2 {
    margin: 0 0 8px;
    font-size: 22px;
    font-weight: 800;
    color: #1e88e5;
  }
  p { margin: 0 0 16px; color: #444; }
`
