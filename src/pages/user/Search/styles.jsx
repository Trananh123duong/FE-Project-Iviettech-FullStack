import styled from 'styled-components'

export const Page = styled.main`
  max-width: var(--site-width, 1100px);
  margin: 0 auto 28px;
  padding: 0 12px;
`

export const Breadcrumb = styled.nav`
  font-size: 16px;
  line-height: 1.2;
  margin: 8px 0 14px;

  a {
    color: #2f6fea;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }

  .sep {
    margin: 0 8px;
    color: #c0c4cc;
  }
  .current {
    color: #9aa1a9;
    }
`

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 6px 0 12px;
`

export const SectionTitle = styled.h2`
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  color: #1e88e5;
  line-height: 1.25;

  i {
    margin-left: 4px;
  }
`

export const KeywordHint = styled.div`
  font-size: 14px;
  color: #666;
`

export const FilterCard = styled.section`
  background: #fff;
  border: 1px solid #ececee;
  border-radius: 12px;
  box-shadow: 0 10px 26px rgba(0,0,0,.06);
  padding: 14px 14px 12px;
  margin-bottom: 16px;
  display: grid;
  gap: 12px;
`

export const FilterRow = styled.div`
  display: grid;
  grid-template-columns: 130px 1fr;
  align-items: center;
  gap: 12px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    align-items: stretch;
  }
`

export const FilterLabel = styled.span`
  font-weight: 700;
  color: #333;
`

export const KeywordInput = styled.input`
  height: 40px;
  padding: 0 12px;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 14px;
  color: #333;
  outline: none;
  width: 100%;

  &:focus {
    border-color: #1e88e5;
    box-shadow: 0 0 0 3px rgba(30,136,229,.14);
  }
  &::placeholder {
    color: #aaa;
  }
`

export const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`

export const TabButton = styled.button`
  border: 1px solid ${({ $active }) => ($active ? '#1e88e5' : '#dcdcdc')};
  background: ${({ $active }) => ($active ? '#1e88e5' : '#fff')};
  color: ${({ $active }) => ($active ? '#fff' : '#333')};
  border-radius: 999px;
  padding: 8px 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all .15s ease;
  outline-offset: 2px;

  &:hover {
    filter: brightness(0.98);
  }
`

export const PillButton = styled.button`
  border: 1px solid ${({ $active }) => ($active ? '#f39c12' : '#e0e0e0')};
  background: ${({ $active }) => ($active ? '#f39c12' : '#fff')};
  color: ${({ $active }) => ($active ? '#fff' : '#333')};
  border-radius: 10px;
  padding: 8px 12px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all .15s ease;
  outline-offset: 2px;

  i {
    font-size: 14px;
  }
  span {
    white-space: nowrap;
  }
  &:hover {
    filter: brightness(0.98);
  }
`

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-top: 2px;
`

export const ApplyButton = styled.button`
  background: #27ae60;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  font-weight: 800;
  cursor: pointer;
  outline-offset: 2px;

  i {
    margin-right: 6px;
  }
  &:hover {
    filter: brightness(0.98);
  }
`

export const ClearButton = styled.button`
  background: #fff;
  color: #555;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 10px 12px;
  font-weight: 700;
  cursor: pointer;
  outline-offset: 2px;

  &:hover {
    background: #fafafa;
  }
`

export const Hint = styled.span`
  font-size: 13px;
  color: #666;
`

export const ErrorText = styled.span`
  font-size: 13px;
  color: #c0392b;
`
