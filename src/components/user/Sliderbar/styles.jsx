import styled from 'styled-components'

export const PageTitle = styled.h2`
  margin: 0;
  margin-left: 10px;
  font-weight: 400;
  font-size: 20px;
  color: #2980b9;
`

export const ComicCard = styled.div`
  padding: 8px;
  text-align: center;
  position: relative;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  img {
    width: 100%;
    height: 240px;
    object-fit: cover;
    border-radius: 4px;
  }
`

export const StoryInfo = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  right: 10px;
  height: 52px;
  line-height: 25px;
  padding-left: 5px;
  padding-right: 5px;
  font-size: 13px;
  display: block;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.5);

  a {
    text-decoration: none;
  }

  h3 {
    margin: 1px 0;
    font-weight: 400;
  }
  h3 > a {
    color: #fff;
    font-size: 13px;
    height: 23px;
    overflow: hidden;
    font-size: 15px;
    display: block;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  h3 > a:hover {
    color: #70c1f7;
  }

  a {
    color: #fff;
    font-size: 13px;
    height: 23px;
  }
  a:hover {
    color: #70c1f7;
  }
  
  span {
    color: #fff;
    font-size: 10px;
    height: 15px;
    margin-left: 10px;
  }
`