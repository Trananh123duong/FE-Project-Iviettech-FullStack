import styled from 'styled-components'

export const Wrapper = styled.div`
  width: 100%;
  background: #fff;
  border: 1px solid #eee;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 16px;

  a,
  .ant-list-item-meta-title a,
  .ant-list-item-meta-description a {
    text-decoration: none !important;
  }
  a:hover,
  a:focus,
  a:active {
    text-decoration: none !important;
  }
`

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;

  a { font-size: 13px; }
`
