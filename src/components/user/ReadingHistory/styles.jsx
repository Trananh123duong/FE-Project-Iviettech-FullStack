import styled from 'styled-components'

const bp = {
  xs: '360px',
  sm: '480px',
  md: '768px',
  lg: '1024px',
}

export const Wrapper = styled.div`
  width: 100%;
  background: #fff;
  border: 1px solid #eee;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;

  /* Link trong block */
  a,
  .ant-list-item-meta-title a,
  .ant-list-item-meta-description a {
    text-decoration: none !important;
  }
  a:hover,
  a:focus,
  a:active {
    text-decoration: none !important;
  }

  /* Ant List tối ưu khoảng cách + wrap hợp lý khi màn hẹp */
  .ant-list-item {
    align-items: flex-start;
    gap: 8px;
  }
  .ant-list-item-action {
    margin-inline-start: 8px;
  }
  .ant-list-item-action > li {
    margin-inline-start: 8px;
  }

  /* Avatar co theo breakpoint */
  .ant-list-item-meta-avatar .ant-avatar {
    width: 48px;
    height: 48px;
    line-height: 48px;
    border-radius: 6px;
  }

  /* Tiêu đề clamp để không tràn */
  .ant-list-item-meta-title {
    margin-bottom: 2px;
    font-weight: 600;
    color: #111827;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    word-break: break-word;
  }

  /* Mô tả clamp gọn trên mobile */
  .ant-list-item-meta-description {
    color: #6b7280;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    word-break: break-word;
  }

  /* Nút trong actions: giữ kích thước hợp lý */
  .ant-list-item-action .ant-btn {
    height: 28px;
    padding: 0 10px;
  }

  @media (max-width: ${bp.md}) {
    padding: 10px;
    border-radius: 8px;

    .ant-list-item {
      gap: 6px;
    }
    .ant-list-item-meta-avatar .ant-avatar {
      width: 44px;
      height: 44px;
      line-height: 44px;
    }
    .ant-list-item-meta-title { -webkit-line-clamp: 2; }
    .ant-list-item-meta-description { -webkit-line-clamp: 1; }

    .ant-list-item-action {
      position: absolute;
      top: 50%;
      right: 8px;
      transform: translateY(-50%);
      margin: 0;
      padding: 0;
      display: flex;
      gap: 0;
    }
  }

  @media (max-width: ${bp.sm}) {
    padding: 8px;
    border-radius: 7px;
    overflow: hidden;

    .ant-list-item {
      position: relative;
      gap: 8px;
      padding: 8px 48px 8px 8px; /* chừa chỗ cho nút nổi bên phải */
      box-sizing: border-box;
    }

    .ant-list-item-meta { min-width: 0; flex: 1; }

    .ant-list-item-meta-avatar .ant-avatar {
      width: 40px; height: 40px; line-height: 40px; border-radius: 5px;
    }

    .ant-list-item-meta-title { -webkit-line-clamp: 1; font-size: 14px; line-height: 20px; }
    .ant-list-item-meta-description { -webkit-line-clamp: 1; font-size: 13px; }

    /* Nút tròn nổi */
    .ant-list-item-action {
      position: absolute;
      top: 50%;
      right: 8px;
      transform: translateY(-50%);
      margin: 0; padding: 0;
      display: flex; gap: 0;
    }
    .ant-list-item-action .ant-btn {
      width: 32px; height: 32px; padding: 0;
      display: inline-flex; align-items: center; justify-content: center;
      border-radius: 999px; background: #fff;
      border-color: #fecaca; color: #ef4444;
    }
    /* Ẩn nhãn text, chỉ giữ icon (đúng cho AntD v5) */
    .ant-list-item-action .ant-btn > span:not(.ant-btn-icon),
    .ant-list-item-action .ant-popover-open.ant-btn > span:not(.ant-btn-icon) { display: none; }

    .ant-list-item-action .ant-btn:hover,
    .ant-list-item-action .ant-popover-open.ant-btn {
      background: #fee2e2; border-color: #fca5a5; color: #dc2626;
    }
  }

  @media (min-width: calc(${bp.sm} + 1px)) {
    .ant-list-item { padding: 8px; }
    .ant-list-item-action {
      position: static; right: auto; top: auto; transform: none;
      width: auto; margin-top: 0; padding: 0; gap: 8px; display: flex; flex-wrap: wrap;
      justify-content: flex-end;
    }
    .ant-list-item-action .ant-btn {
      width: auto; height: 28px; padding: 0 10px;
      border-radius: 6px; display: inline-flex; align-items: center;
    }
    /* Hiện lại nhãn nút */
    .ant-list-item-action .ant-btn > span:not(.ant-btn-icon) { display: inline; }
  }


  @media (max-width: ${bp.xs}) {
    .ant-list-item-meta-title { font-size: 13.5px; }
    .ant-list-item-meta-description { font-size: 12.5px; }
  }
`

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  gap: 8px;
  flex-wrap: wrap;

  a { font-size: 13px; white-space: nowrap; }

  @media (max-width: ${bp.sm}) {
    margin-bottom: 6px;

    h5.ant-typography {
      margin: 0;
      font-size: 14px;
      line-height: 20px;
      flex: 1 1 auto;
    }
  }
`
