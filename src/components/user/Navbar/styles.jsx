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
  background-color: white;

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
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  padding: 0;
  margin: 0;
  grid-template-columns: repeat(4, minmax(150px, 1fr));
  
  & > li {
    list-style: none;
    padding: 10px;
    white-space: nowrap;
    cursor: pointer;
    background-color: white;
  }

  & > li:hover {
    background-color: #eee;
    color: violet;
  }
`

export const ItemCategories = styled.li`
  position: relative;

  &:hover ${Categories} {
    display: grid;
  }
`

export const RankingMenu = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  border: 1px solid #ccc;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: none;
  z-index: 9999;
  padding: 0;
  margin: 0;
  grid-template-columns: repeat(2, minmax(140px, 1fr));

  & > li {
    list-style: none;
    padding: 6px 10px;
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    font-size: 14px;
    white-space: nowrap;
    color: black;
    background-color: white;
    border: 0.2px solid #eeecec;
  }

  & > li:hover {
    background-color: #eee;
    color: violet;
  }

  & > li.highlight {
    color: red;
    font-weight: bold;
  }
`;

export const ItemRanking = styled.li`
  position: relative;

  &:hover ${RankingMenu} {
    display: grid;
  }
`;