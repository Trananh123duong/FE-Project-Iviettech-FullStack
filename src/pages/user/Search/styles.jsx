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

export const ListStory = styled.div`
  width: 66%;
  float: left;
`

export const DeadlineStory = styled.div`
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

export const Keyword = styled.div`
  font-size: 14px;
  color: #666;
`

export const FilterBar = styled.div`
  width: 100%;
  margin: 12px 0 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const GroupRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`

export const GroupLabel = styled.span`
  font-weight: 600;
  color: #444;
  min-width: 105px;
`

export const KeywordInput = styled.input`
  flex: 1 1 360px;
  max-width: 520px;
  height: 38px;
  padding: 0 12px;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 14px;
  color: #333;
  outline: none;
  &:focus {
    border-color: #2980b9;
    box-shadow: 0 0 0 3px rgba(41, 128, 185, 0.12);
  }
  &::placeholder { color: #aaa; }
`

export const ButtonWrap = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`

export const TabButton = styled.button`
  border: 1px solid ${({ $active }) => ($active ? '#2980b9' : '#dcdcdc')};
  background: ${({ $active }) => ($active ? '#2980b9' : '#fff')};
  color: ${({ $active }) => ($active ? '#fff' : '#333')};
  border-radius: 999px;
  padding: 8px 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
`

export const PillButton = styled.button`
  border: 1px solid ${({ $active }) => ($active ? '#f39c12' : '#e0e0e0')};
  background: ${({ $active }) => ($active ? '#f39c12' : '#fff')};
  color: ${({ $active }) => ($active ? '#fff' : '#333')};
  border-radius: 10px;
  padding: 8px 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
  i { font-size: 14px; }
  span { line-height: 1; white-space: nowrap; }
`

export const ActionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 4px;
`

export const ApplyButton = styled.button`
  background: #27ae60;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  font-weight: 700;
  cursor: pointer;
`

export const ClearButton = styled.button`
  background: #fff;
  color: #555;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 10px 12px;
  font-weight: 600;
  cursor: pointer;
`

export const Hint = styled.span`
  font-size: 13px;
  color: #666;
`

export const ErrorText = styled.span`
  font-size: 13px;
  color: #c0392b;
`