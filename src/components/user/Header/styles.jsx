import styled from 'styled-components'
import bgHeader from '@assets/bg_header.jpg'

export const HeaderContainer = styled.header`
  background: url(${bgHeader})
    top center repeat-x;
  width: 100%;
  height: 55px;
  color: #fff;
`

export const Navbar = styled.div`
  height: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 12px;
  display: grid;
  grid-template-columns: 220px 1fr auto;
  align-items: center;
  column-gap: 12px;
`

export const LogoBox = styled.div`
  display: flex;
  align-items: center;
  img {
    height: 38px;
    object-fit: contain;
  }
`

export const SearchBox = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  input {
    width: 100%;
    height: 35px;
    border: none;
    border-radius: 4px;
    padding: 0 44px 0 18px;
    outline: none;
  }

  button {
    position: absolute;
    right: 6px;
    height: 32px;
    width: 32px;
    border: none;
    background: transparent;
    cursor: pointer;
    border-radius: 4px;
  }

  button:hover {
    background: #ebebeb;
  }

  i {
    color: #333;
    font-size: 16px;
  }
`

export const RightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const IconGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-right: 6px;

  .toggle-dark {
    color: #ff9601;
    font-size: 22px !important;
    cursor: pointer;
  }
  .notifications {
    color: #fff;
    font-size: 22px !important;
    cursor: pointer;
  }
`

export const Account = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;

  &:hover .menu {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
`

export const AccountBtn = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
  user-select: none;
  font-weight: 600;

  .caret {
    margin-left: 2px;
    font-size: 14px;
  }
`

export const Menu = styled.div`
  position: absolute;
  top: 25px;
  right: 20;
  color: #222;
  min-width: 240px;
  border-radius: 10px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.18);
  padding: 8px 0;
  z-index: 10;

  opacity: 0;
  visibility: hidden;
  transform: translateY(6px);
  transition: all 0.15s ease;

  a,
  button {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    color: inherit;
    text-decoration: none;
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 14px;
    line-height: 1;
    background: #fff;
  }

  a:hover,
  button:hover {
    background: #f5f5f5;
  }

  i {
    width: 18px;
    text-align: center;
    font-size: 16px;
  }
`
