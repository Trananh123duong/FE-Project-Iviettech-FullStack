import styled from 'styled-components';

export const BoxTab = styled.div`
  border: 1px solid #ddd;
  color: #333;
  margin-bottom: 15px;
`;

export const NavTab = styled.ul`
  padding: 0;
  margin: 0;
  list-style: none;
  display: flex;

  li {
    width: 33.3%;
    height: 42px;
  }
`;

export const TabLink = styled.a`
  display: block;
  width: 100%;
  height: 100%;
  background: #f7f7f7;
  color: #333;
  text-align: center;
  font-size: 15px;
  font-weight: 500;
  line-height: 40px;
  border: 1px solid #ddd;
  border-bottom: none;
  text-decoration: none;

  &.active {
    background: #fff;
    border-top: 2px solid #721799;
    font-weight: bold;
  }
  &:hover {
    color: #2980b9;
    cursor: pointer;
  }
`;

export const TabPane = styled.div`
  padding: 10px;
  border: 1px solid #eaeaea;
  border-top: none;

  ul {
    padding: 0;
  }
`;

export const ComicItem = styled.li`
  border-bottom: 1px solid #eaeaea;
  padding: 10px 0;
  margin: 0;
  list-style: none;
  display: flex;
`;

export const Rank = styled.span`
  width: 40px;
  line-height: 45px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;

  color: ${({ index }) => {
    if (index === 0) return '#3498db';     // Top 1: xanh
    if (index === 1) return '#2ecc71';     // Top 2: lục
    if (index === 2) return '#e67e22';     // Top 3: cam
    return '#888';                         // Các hạng còn lại
  }};
`;

export const ComicBox = styled.div`
  width: calc(100% - 40px);
`;

export const Thumb = styled.a`
  width: 50px;
  height: 50px;
  overflow: hidden;
  float: left;
  margin-right: 10px;
  border-radius: 4px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const Title = styled.h3`
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 2px 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  a {
    color: #333;
    text-decoration: none;
  }

  a:hover {
    color: #2980b9;
  }
`;

export const Chapter = styled.p`
  font-size: 13px;
  margin: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;

  a {
    color: #333;
    text-decoration: none;
  }

  a:hover {
    color: #2980b9;
  }
`;

export const View = styled.span`
  font-style: italic;
  font-size: 12px;
  color: #666;
  display: flex;
  align-items: center;

  i {
    margin-right: 3px;
  }
`;
