import styled from 'styled-components'

export const Wrap = styled.section`
  margin-top: 20px;

  .header {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-bottom: 12px;
  }
  .count { color: #6b7280; }

  .form {
    margin-bottom: 16px;
  }
  .form .actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 8px;
    gap: 8px;
  }

  .item {
    padding: 10px 0;
    border-bottom: 1px solid #e5e7eb;
  }
  .top {
    display: flex;
    gap: 10px;
  }
  .meta {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #6b7280;
    margin-bottom: 2px;
  }
  .author { color: #111827; font-weight: 600; }
  .time { color: #6b7280; }
  .dot { color: #9ca3af; }

  .body {
    white-space: pre-wrap;
    color: #111827;
  }

  .actions {
    display: flex;
    gap: 12px;
    margin-top: 6px;
  }
  .actions .ant-btn {
    padding: 0 6px;
    height: 28px;
  }

  .reply-form {
    margin-top: 8px;
  }

  .replies {
    margin-top: 10px;
    padding-left: 14px;
    border-left: 2px solid #e5e7eb;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .reply {
    display: flex;
    gap: 8px;
  }
  .reply .meta {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #6b7280;
    margin-bottom: 2px;
  }
  .reply .author { color: #111827; font-weight: 600; }

  .load-more {
    display: flex;
    justify-content: center;
    margin-top: 12px;
  }
`
