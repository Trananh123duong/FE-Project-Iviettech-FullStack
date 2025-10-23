import styled from 'styled-components'

export const Card = styled.section`
  border: 1px solid #e9e9e9;
  border-radius: 12px;
  background: #fff;
  overflow: hidden;
  margin-bottom: 16px;
  box-shadow: 0 6px 18px rgba(0,0,0,.04);
`

/* Tabs: 3 nút chia đều, không xuống dòng */
export const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: stretch;
  border-bottom: 1px solid #eee;

  .tab {
    height: 44px;
    padding: 0 16px;
    background: #fafafa;
    border: none;
    border-right: 1px solid #eee;
    color: #222;
    font-size: 15.5px;
    font-weight: 700;
    cursor: pointer;
    outline: none;
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap; /* không cho xuống dòng */
    line-height: 1;      /* tránh cao thấp kỳ lạ với dấu tiếng Việt */
  }
  .tab:last-child {
    border-right: none;
  }

  .tab:hover {
    background: #f2f2f2;
    color: #7c3aed;
  }

  .tab.active {
    background: #fff;
    color: #000;
    position: relative;
  }
  .tab.active::after {
    content: '';
    position: absolute;
    left: 0; right: 0; bottom: 0;
    height: 3px;
    background: #7c3aed;
  }
`

/* Panel danh sách */
export const Panel = styled.div`
  padding: 6px 10px;

  .list {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .row {
    display: grid;
    grid-template-columns: 42px 56px 1fr; /* rank | thumb | meta */
    gap: 10px;
    align-items: center;
    padding: 10px 4px;
    border-bottom: 1px solid #f2f2f2;
  }
  .row:last-child {
    border-bottom: none;
  }
  .row:hover {
    background: #fafafa;
  }

  /* Thumb */
  .thumb {
    width: 56px; height: 56px;
    border-radius: 6px;
    overflow: hidden;
    display: block;
    box-shadow: 0 1px 4px rgba(0,0,0,.06);
  }
  .thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block; }

  /* Meta */
  .meta {
    min-width: 0;
  }
  .title {
    margin: 0 0 2px 0;
    font-size: 16px;
    font-weight: 700;
    line-height: 1.25;
    color: #111;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .title a {
    color: inherit;
    text-decoration: none;
  }
  .title a:hover {
    color: #2f6fea;
  }

  .subline {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .chapter-link {
    font-size: 13.5px;
    color: #333;
    text-decoration: none;
  }
  .chapter-link:hover {
    color: #2f6fea;
  }
  .chapter-link.muted {
    color: #999;
    cursor: default;
  }
`

/* Số hạng */
export const RankBadge = styled.span`
  width: 42px;
  text-align: center;
  font-weight: 900;
  font-size: 20px;
  line-height: 1;
  user-select: none;

  color: ${({ rank }) => {
    if (rank === 1) return '#2f80ed';
    if (rank === 2) return '#27ae60';
    if (rank === 3) return '#f2994a';
    return '#9ca3af';
  }};
`

export const InfoLine = styled.div`
  padding: 8px 10px;
  font-size: 13.5px;
  color: #555;
  &.error { color: #d32f2f; }
`
