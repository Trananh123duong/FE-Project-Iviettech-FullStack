import styled from 'styled-components'

export const BreadcrumbBar = styled.div`
  width: 100%;
  padding-bottom: 16px;
`

export const Breadcrumb = styled.nav`
  font-size: 18px;
  line-height: 1.2;

  a {
    color: #2f80ed;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }

  .sep {
    margin: 0 10px;
    color: #c0c4cc; /* dấu » màu xám nhạt */
  }

  .current {
    color: #9aa1a9; /* “Theo dõi” màu xám */
  }
`

export const MainContainer = styled.main`
  width: 100%;
`

export const ListColumn = styled.div`
  width: 66%;
  float: left;
`

export const SideColumn = styled.div`
  width: 33.33333333%;
  float: left;
`

export const SectionHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const SectionTitle = styled.h2`
  font-size: 20px;
  color: #2980b9;
`

export const Gate = styled.div`
  max-width: 720px;
  margin: 40px auto;
  padding: 24px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;

  h2 {
    margin: 0 0 8px;
    color: #2980b9;
  }
  p {
    margin: 0 0 16px;
  }
`
