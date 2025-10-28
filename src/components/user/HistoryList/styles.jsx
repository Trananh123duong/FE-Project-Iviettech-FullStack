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
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fff;
`

/* --- Ảnh thumbnail --- */
export const Thumb = styled.div`
  width: 110px;
  height: 150px;
  border: 1px solid #ddd;
  border-radius: 6px;
  overflow: hidden;
  background: #f7f7f7;

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
  min-width: 0;
`

export const StoryTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.25;

  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  word-break: break-word;

  a {
    color: #111827;
    text-decoration: none;
  }

  a:hover { color: #0b63b8; }
`

/* --- Dòng: đọc tới chapter nào --- */
export const MetaLine = styled.div`
  font-size: 14px;
  color: #1f2937;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;

  a {
    color: #2980b9;
    text-decoration: none;
  }
  a:hover { text-decoration: underline; color: #70c1f7; }
`

export const TimeLine = styled.div`
  font-size: 12.5px;
  color: #6b7280;
`

export const Actions = styled.div`
  margin-top: 6px;

  .read-btn {
    display: inline-block;
    padding: 7px 12px;
    border: 1px solid #2f80ed;
    border-radius: 6px;
    color: #2f80ed;
    text-decoration: none;
    font-weight: 600;
    line-height: 1;
  }
`
