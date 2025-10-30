import styled from 'styled-components'

export const Wrap = styled.section`
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed #e5e7eb;
`

export const Header = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;

  .count {
    color: #6b7280;
  }
`

export const Form = styled.div`
  margin-bottom: 16px;

  .actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 8px;
    gap: 8px;
    flex-wrap: wrap;
  }
`

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;

  .load-more {
    display: flex;
    justify-content: center;
    margin-top: 8px;
  }
`

export const Item = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-start;

  .avatar {
    flex: 0 0 36px;
  }

  .content {
    flex: 1;
    min-width: 0;
  }

  .meta {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #6b7280;
    margin-bottom: 2px;
    flex-wrap: wrap; /* thời gian dài có thể xuống hàng */

    .author { color: #111827; font-weight: 600; }
    .dot { color: #9ca3af; }
  }

  .body {
    color: #111827;
    white-space: pre-wrap;
    word-break: break-word;     /* cắt từ dài */
    overflow-wrap: anywhere;    /* chống tràn layout bởi url/quãng trắng dài */
  }

  .actions {
    display: flex;
    gap: 8px;
    margin-top: 4px;
    flex-wrap: wrap;      /* hàng nút có thể xuống dòng */
    row-gap: 6px;

    .ant-btn {
      padding: 0 8px;
      height: 28px;
      flex: 0 0 auto;  /* giữ kích thước nút, tránh bị nén quá mức */
    }
  }

  .replies {
    margin-top: 10px;
    padding-left: 14px;
    border-left: 2px solid #e5e7eb;
    display: flex;
    flex-direction: column;
    gap: 10px;

    .reply {
      display: flex;
      gap: 8px;

      .avatar {
        flex: 0 0 28px;
      }
      .content {
        flex: 1;
        min-width: 0;
      }

      .meta {
        display: flex;
        align-items: center;
        gap: 6px;
        color: #6b7280;
        margin-bottom: 2px;
        flex-wrap: wrap;

        .author {
          color: #111827;
          font-weight: 600;
        }
        .dot {
          color: #9ca3af;
        }
      }

      .actions {
        display: flex;
        gap: 8px;
        margin-top: 4px;
        flex-wrap: wrap;
        row-gap: 6px;

        .ant-btn {
          padding: 0 8px;
          height: 28px;
        }
      }
    }
  }
`
