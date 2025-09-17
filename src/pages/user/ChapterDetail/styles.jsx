import styled from 'styled-components'
import { Button } from 'antd'

export const Wrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 10px 10px 40px;
  background: #fff;
`

export const BreadcrumbBar = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 8px;
  color: #374151;
  flex-wrap: wrap;
`
export const Crumb = styled.span`
  color: #2a77c6;
  cursor: pointer;
  &:hover { text-decoration: underline; }
`
export const UpdatedAt = styled.span`
  font-style: italic;
  color: #8c8c8c;
`

/* Sticky tool bar */
export const Toolbar = styled.div`
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 8px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 6px;

  .left { display: flex; align-items: center; gap: 8px; }
  .right { display: flex; align-items: center; gap: 8px; }

  .chapter-select {
    width: 600px;
  }
`

export const NavButton = styled(Button)`
  border: 0;
  background: #d1d5db;
  color: #111;
  &:hover { background: #cbd5e1 !important; }
  &:disabled { opacity: .6; cursor: not-allowed; }
`

export const FollowButton = styled(Button)`
  background-color: #e74c3c;
  border-color: #e74c3c;
  color: #fff;
  font-weight: 700;
  height: 36px;
  padding: 0 16px;
  border-radius: 8px;

  &:hover, &:focus {
    background-color: #d94a3a !important;
    border-color: #d94a3a !important;
    color: #fff !important;
  }
  &.is-followed {
    background-color: #16a34a;
    border-color: #16a34a;
  }
  &.is-followed:hover,
  &.is-followed:focus {
    background-color: #15803d !important;
    border-color: #15803d !important;
  }
  &:disabled,
  &[disabled],
  &.ant-btn[disabled] {
    background-color: #f1a5a0 !important;
    border-color: #f1a5a0 !important;
    color: #fff !important;
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
    box-shadow: none;
  }
`

/* Reader area */
export const Reader = styled.div`
  margin-top: 10px;
  border-radius: 6px;

  .img-wrap {
    max-width: 900px;
    margin: 0 auto;
  }
  .img-wrap .ant-image {
    width: 100%;
  }
  .img-wrap img {
    width: 100%;
    height: auto;
    display: block;
  }
`
