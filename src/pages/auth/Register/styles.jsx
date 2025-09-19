import styled from 'styled-components'
import { Button } from 'antd'

/* Bọc trang để canh thẳng hàng với layout chung */
export const Page = styled.main`
  max-width: var(--site-width, 1000px);
  margin: 24px auto 48px;
  padding: 0 12px;
`

/* Card chứa form – đồng bộ Login */
export const AuthCard = styled.section`
  max-width: 520px;
  margin: 0 auto;
  background: #fff;
  padding: 28px 24px 24px;
  border: 1px solid #ececee;
  border-radius: 12px;
  box-shadow: 0 10px 26px rgba(0,0,0,.06);

  /* ===== Fix lệch chữ input (không ép height) ===== */
  .ant-input,
  .ant-input-affix-wrapper { border-radius: 10px; }

  .ant-input-affix-wrapper {
    display: inline-flex;
    align-items: center;          /* canh giữa text và icon */
  }

  /* Padding hợp lý cho size="large" */
  .ant-input-lg { padding-block: 10px; padding-inline: 12px; }
  .ant-input-affix-wrapper-lg { padding-block: 6px; padding-inline: 12px; }
  .ant-input-affix-wrapper-lg > input.ant-input { padding: 0; }

  /* Focus ring nhẹ */
  .ant-input-affix-wrapper-focused {
    box-shadow: 0 0 0 2px rgba(47,111,234,.18);
  }

  .ant-form-item { margin-bottom: 14px; }
  .ant-form-item-label > label { font-weight: 600; }
`

/* Tiêu đề + gạch chân */
export const Title = styled.h1`
  margin: 0 0 6px 0;
  text-align: center;
  font-size: 24px;
  font-weight: 900;
  letter-spacing: .5px;
  color: #111;
`
export const TitleUnderline = styled.div`
  width: 56px; height: 4px;
  background: #7c3aed;
  border-radius: 4px;
  margin: 0 auto 18px;
`

/* Link phụ */
export const FormExtras = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 4px;
  margin-bottom: 16px;

  a { color: #2f6fea; text-decoration: none; }
  a:hover { text-decoration: underline; }
`

/* Nút submit – cùng style với Login */
export const SubmitButton = styled(Button)`
  && {
    width: 100%;
    height: 44px;
    border-radius: 10px;
    font-weight: 700;
    background: #2f6fea;
    border-color: #2f6fea;
    color: #fff;
  }
  &&:hover { filter: brightness(1.05); }
`
