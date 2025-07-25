import styled from 'styled-components';

export const UpdatedComic = styled.div`
  position: relative !important;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

export const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Title = styled.h2`
  font-size: 20px;
  color: #2980b9;
`;

export const Item = styled.div`
  width: 23.5%;
  padding: 0 7px;
  margin: 0 0 10px;
`;

export const ImageWrapper = styled.div`
  position: relative;
  height: 200px;
  line-height: 200px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: #000 0 0 0;
  text-align: center;
  overflow: hidden;
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const View = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 26px;
  line-height: 25px;
  padding: 0 2px;
  color: #fff;
  background-color: #000;
  opacity: 0.65;

  i {
    margin-left: 5px;
  }

  span {
    float: left;
    font-size: 10px;
  }
`;

export const TitleH3 = styled.h3`
  font-size: 16px;
  margin: 0 0 7px;
  font-weight: 400;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;

  &:hover {
    color: #0074cc;
    cursor: pointer;
  }
`;

export const ChapterList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const ChapterItem = styled.li`
  margin-bottom: 6px;
  display: flex;
  justify-content: space-between;
`;

export const ChapterLink = styled.a`
  color: #2980b9;
  text-decoration: none;
  color: black;

  &:hover {
    text-decoration: underline;
    color: #70c1f7;
    cursor: pointer;
  }
`;

export const ChapterTime = styled.i`
  color: silver;
  font-size: 11px;
  line-height: 20px;
  font-style: italic;
  float: right;
  max-width: 47%;
  overflow: hidden;
  white-space: nowrap;
`;
