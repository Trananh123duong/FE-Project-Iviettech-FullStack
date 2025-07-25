import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const MainNav = styled.div`
  width: 100%;
  height: 43px;
  background-color: rgb(228,228,228);
`

export const MainList = styled.ul`
  display: flex;
  align-items: center;
  height: 100%;
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;

  & > li {
    font-size: 1.6rem;
    line-height: 1.6rem;
    border-left: 1px solid #ccc;
    display: block;
    height: 100%;
    position: relative;
  }

  & > li:first-child {
    border-left: none;
  }
`

export const ItemLink = styled(Link)`
  color: black;
  padding: 10px 20px;
  display: block;
  text-decoration: none;

  &:hover {
    color: violet;
    background-color: rgb(240, 240, 240);
  }
`

export const Categories = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  border: 1px solid #ccc;
  display: none;
  z-index: 9999;
  max-height: 300px;
  min-width: 200px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  padding: 0;
  margin: 0;

  & > li {
    list-style: none;
    padding: 10px;
    white-space: nowrap;
    cursor: pointer;
    background-color: white;
  }

  & > li:hover {
    background-color: #eee;
  }
`

export const ItemCategories = styled.li`
  position: relative;

  &:hover ${Categories} {
    display: block;
  }
`