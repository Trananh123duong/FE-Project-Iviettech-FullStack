import styled from 'styled-components';

export const UpdatedComic = styled.div`
  position: relative !important;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding-left: 8px;
`;

export const Item = styled.div`
  width: calc((100% - 40px) / 4);
  padding: 0;
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

  & a {
    color: #000;
    text-decoration: none;
  }
  & a:visited {
    color: #000;
  }
  & a:hover {
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


export const Actions = styled.div`
  margin-top: 6px;

  .unfollow-btn {
    padding: 6px 10px;
    border: 1px solid #e74c3c;
    border-radius: 4px;
    background: transparent;
    color: #e74c3c;
    cursor: pointer;
  }
  .unfollow-btn[disabled] {
    opacity: 0.6;
    cursor: not-allowed;
  }
  .unfollow-btn:hover:not([disabled]) {
    background: #e74c3c;
    color: #fff;
  }
`