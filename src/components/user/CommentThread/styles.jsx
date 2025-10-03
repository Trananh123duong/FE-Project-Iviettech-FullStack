import styled from 'styled-components'

/* Breakpoints nhanh dùng lại */
const bp = {
  sm: '480px',
  md: '768px',
  lg: '1024px',
}

export const Wrap = styled.section`
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed #e5e7eb;

  @media (max-width: ${bp.md}) {
    margin-top: 8px;
    padding-top: 8px;
  }
`

export const Header = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap; /* tránh vỡ hàng */

  .count { color: #6b7280; }

  @media (max-width: ${bp.sm}) {
    gap: 6px;
    margin-bottom: 10px;
  }
`

export const Form = styled.div`
  margin-bottom: 16px;

  .actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 8px;
    gap: 8px;
    flex-wrap: wrap; /* cho nút xuống hàng khi chật */
  }

  @media (max-width: ${bp.sm}) {
    margin-bottom: 12px;

    .actions {
      justify-content: space-between; /* trải đều khi thu nhỏ */
      row-gap: 6px;
    }
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

  @media (max-width: ${bp.sm}) {
    gap: 12px;

    .load-more > .ant-btn {
      width: 100%; /* nút tải thêm full width trên mobile */
    }
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
    min-width: 0; /* cho phép nội dung co lại, tránh tràn */
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

      .avatar { flex: 0 0 28px; }
      .content { flex: 1; min-width: 0; }

      .meta {
        display: flex;
        align-items: center;
        gap: 6px;
        color: #6b7280;
        margin-bottom: 2px;
        flex-wrap: wrap;

        .author { color: #111827; font-weight: 600; }
        .dot { color: #9ca3af; }
      }

      .actions {
        display: flex;
        gap: 8px;
        margin-top: 4px;
        flex-wrap: wrap;
        row-gap: 6px;

        .ant-btn { padding: 0 8px; height: 28px; }
      }
    }
  }

  /* === Tablet: gọn hơn một chút === */
  @media (max-width: ${bp.md}) {
    gap: 8px;

    .avatar { flex-basis: 32px; }
    .replies {
      padding-left: 12px;

      .reply .avatar { flex-basis: 26px; }
    }
  }

  /* === Mobile: ưu tiên nội dung + icon-only cho actions === */
  @media (max-width: ${bp.sm}) {
    gap: 8px;

    .avatar { flex-basis: 28px; }
    .replies {
      padding-left: 10px;
      gap: 8px;

      .reply { gap: 6px; }
      .reply .avatar { flex-basis: 24px; }
    }

    .meta { gap: 4px; }

    .actions {
      gap: 6px;

      /* Ẩn text của Button, chỉ giữ icon để không bị tràn khi màn nhỏ */
      .ant-btn .anticon + span {
        display: none;
      }

      /* Giữ kích thước icon thoáng hơn */
      .ant-btn .anticon {
        font-size: 16px;
      }

      /* Có thể giảm padding để gọn gàng */
      .ant-btn {
        padding: 0 6px;
        height: 28px;
      }
    }
  }
`
