import styled from 'styled-components'
import { Button } from 'antd'

export const MainContainer = styled.main`
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 10px;
  background-color: white;
  overflow-x: hidden;
  display: flow-root; /* clear floats */
`

export const Left = styled.div`
  width: 66%;
  float: left;
`

export const Right = styled.div`
  width: 33.33333333%;
  float: left;
  padding-left: 12px;
`

/* Title centered */
export const TitleBlock = styled.div`
  text-align: center;
  margin-bottom: 8px;
`

export const PageTitle = styled.h1`
  margin: 0;
  font-size: 30px;
  font-weight: 800;
  letter-spacing: .2px;
  color: #1f2937;
`

export const UpdatedAt = styled.div`
  margin-top: 4px;
  font-style: italic;
  color: #8c8c8c;
`

export const SectionHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`

export const SectionTitle = styled.h2`
  font-size: 20px;
  color: #2a77c6;
  margin: 0;
  letter-spacing: .2px;
`

/* Summary */
export const TopInfo = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 16px;
  margin-top: 12px;

  .cover { grid-column: 1 / 2; }
  .meta  { grid-column: 2 / 3; }

  .muted { color: #8c8c8c; }
  .strong { font-weight: 700; }
`

/* Rows with icon + label + value */
export const FieldRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;

  .icon {
    color: #9ca3af;
    width: 18px;
    text-align: center;
  }
  .label {
    color: #6b7280;
    font-weight: 700;
  }
  .value {
    color: #111827;
    font-weight: 600;
  }
`

export const CategoryLink = styled.a`
  color: #2a77c6;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`

export const RatingLine = styled.div`
  margin-top: 4px;
  color: #111827;
  a {
    color: #2a77c6;
    text-decoration: none;
  }
  a:hover { text-decoration: underline; }
`

export const ActionRow = styled.div`
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`

/* Buttons similar to sample */
export const FollowButton = styled(Button)`
  background-color: #e74c3c;
  border-color: #e74c3c;
  color: #fff;
  font-weight: 700;
  height: 40px;
  padding: 0 18px;
  border-radius: 8px;

  &:hover, &:focus {
    background-color: #d94a3a !important;
    border-color: #d94a3a !important;
    color: #fff !important;
  }
`

export const ReadButton = styled(Button)`
  background-color: #f5a623;
  border-color: #f5a623;
  color: #fff;
  font-weight: 700;
  height: 40px;
  padding: 0 18px;
  border-radius: 8px;

  &:hover, &:focus {
    background-color: #e79b1e !important;
    border-color: #e79b1e !important;
    color: #fff !important;
  }
`

/* Chapter links: black, no underline */
export const ChapterLink = styled.a`
  color: #111;
  text-decoration: none;

  &:hover,
  &:focus {
    text-decoration: none;
  }
`
