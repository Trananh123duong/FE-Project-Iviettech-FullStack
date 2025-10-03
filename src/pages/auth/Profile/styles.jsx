import styled from 'styled-components'

/* ---- Breakpoints ---- */
const bp = {
  xl: 1200,   // >=1200
  lg: 992,    // >=992
  md: 768,    // >=768
  sm: 576,    // >=576
}

/* ---- Breadcrumb ---- */
export const BreadcrumbBar = styled.div`
  width: 100%;
  padding-bottom: 16px;

  @media (max-width: ${bp.md}px) {
    padding-bottom: 12px;
  }
`
export const Breadcrumb = styled.nav`
  font-size: 18px;
  a { color: #2f80ed; text-decoration: none; }
  a:hover { text-decoration: underline; }
  .sep { margin: 0 10px; color: #c0c4cc; }
  .current { color: #9aa1a9; }

  @media (max-width: ${bp.md}px) {
    font-size: 16px;
    .sep { margin: 0 8px; }
  }
  @media (max-width: ${bp.sm}px) {
    font-size: 15px;
  }
`

/* ---- Layout ---- */
export const Wrapper = styled.main`
  --card-bg: #fff;
  --border: #e9eef3;
  --muted: #6b7280;
  --primary: #2f80ed;

  max-width: 1000px;
  margin: 0 auto 24px;
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 16px;
  align-items: start;
  align-content: start;
  padding: 0 8px;

  /* đồng bộ label antd */
  .nt-form .ant-form-item-label > label { font-weight: 600; }
  .nt-form .ant-input[disabled] { background: #f7f8fa; color: #8f96a3; }

  /* <= lg: chuyển sang 1 cột */
  @media (max-width: ${bp.lg}px) {
    grid-template-columns: 1fr;
    gap: 14px;
    padding: 0 12px;
  }

  @media (max-width: ${bp.sm}px) {
    margin-bottom: 16px;
    gap: 12px;
    padding: 0 10px;
  }
`

export const LeftCol = styled.aside`
  display: grid;
  gap: 12px;

  /* sticky chỉ áp dụng màn lớn */
  position: sticky;
  top: 12px;

  @media (max-width: ${bp.lg}px) {
    position: static;
    top: auto;
  }
`

export const RightCol = styled.section`
  display: grid;
  gap: 16px;

  @media (max-width: ${bp.sm}px) {
    gap: 12px;
  }
`

/* ---- Cards ---- */
export const Card = styled.div`
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 18px;
  box-shadow: 0 2px 10px rgba(31,45,61,.04);

  @media (max-width: ${bp.md}px) {
    border-radius: 12px;
    padding: 16px;
  }
  @media (max-width: ${bp.sm}px) {
    border-radius: 10px;
    padding: 14px;
  }
`

export const ProfileCard = styled(Card)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
  align-items: start;

  .meta {
    .name { margin: 0; }
    .email { margin-top: 2px; }
  }
`

export const AvatarWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  img {
    width: clamp(80px, 12vw, 112px);
    height: clamp(80px, 12vw, 112px);
    border-radius: 999px;
    object-fit: cover;
    background: #f5f5f5;
    box-shadow: 0 4px 18px rgba(0,0,0,.08);
    border: 4px solid #fff;
    outline: 1px solid var(--border);
  }

  @media (max-width: ${bp.sm}px) {
    gap: 10px;
  }
`

export const ActionRow = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;

  @media (max-width: ${bp.sm}px) {
    gap: 8px;
  }
`

/* ---- Form card ---- */
export const CardHead = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 6px;

  @media (max-width: ${bp.sm}px) {
    margin-bottom: 4px;
  }
`
export const CardTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: #1f2937;
  letter-spacing: .2px;

  @media (max-width: ${bp.md}px) {
    font-size: 17px;
  }
  @media (max-width: ${bp.sm}px) {
    font-size: 16px;
  }
`

export const FormActions = styled.div`
  display: flex; align-items: center; gap: 12px; margin-top: 6px;
  flex-wrap: wrap;

  @media (max-width: ${bp.sm}px) {
    gap: 10px;
  }
`

/* ---- States ---- */
export const ErrorBox = styled.div`
  color: #d32f2f;
  background: #fff1f1;
  border: 1px solid #f0b6b6;
  padding: 10px 12px;
  border-radius: 10px;

  @media (max-width: ${bp.sm}px) {
    padding: 8px 10px;
    border-radius: 8px;
  }
`
