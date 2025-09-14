import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const Row = styled.div`
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: 12px;
  padding: 8px;
  border: 1px solid #eee;
  border-radius: 6px;
  background: #fff;
`

export const Thumb = styled.div`
  width: 110px;
  height: 150px;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const StoryTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  a {
    color: #000;
    text-decoration: none;
  }
  a:hover { color: #0074cc; }
`

export const MetaLine = styled.div`
  font-size: 14px;
  a { color: #2980b9; text-decoration: none; }
  a:hover { text-decoration: underline; color: #70c1f7; }
`

export const TimeLine = styled.div`
  font-size: 12px;
  color: #888;
`

export const Actions = styled.div`
  margin-top: 6px;
  .read-btn {
    display: inline-block;
    padding: 6px 10px;
    border: 1px solid #2f80ed;
    border-radius: 4px;
    color: #2f80ed;
    text-decoration: none;
  }
  .read-btn:hover {
    background: #2f80ed;
    color: #fff;
  }
`
