import styled from 'styled-components'

/* ---- Breakpoints ---- */
const bp = { xl: 1200, lg: 992, md: 768, sm: 576 }

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

  a {
    color: #2f80ed;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  .sep {
    margin: 0 10px;
    color: #c0c4cc;
  }

  .current {
    color: #9aa1a9;
  }

  @media (max-width: ${bp.md}px) {
    font-size: 16px;

    .sep {
      margin: 0 8px;
    }
  }

  @media (max-width: ${bp.sm}px) {
    font-size: 15px;
  }
`

/* ---- Layout ---- */
export const Wrapper = styled.main`
  --card-bg: #fff;
  --border: #e9eef3;

  max-width: 1000px;
  margin: 0 auto 24px;
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 16px;
  align-items: start;
  padding: 0 8px;

  .nt-form .ant-form-item-label > label {
    font-weight: 600;
  }

  .nt-form .ant-input[disabled] {
    background: #f7f8fa;
    color: #8f96a3;
  }

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

/* ---- Card ---- */
export const Card = styled.div`
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 18px;
  box-shadow: 0 2px 10px rgba(31, 45, 61, 0.04);

  @media (max-width: ${bp.md}px) {
    border-radius: 12px;
    padding: 16px;
  }

  @media (max-width: ${bp.sm}px) {
    border-radius: 10px;
    padding: 14px;
  }
`

export const CardHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  letter-spacing: 0.2px;

  @media (max-width: ${bp.md}px) {
    font-size: 17px;
  }

  @media (max-width: ${bp.sm}px) {
    font-size: 16px;
  }
`

export const FormActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 6px;
  flex-wrap: wrap;

  @media (max-width: ${bp.sm}px) {
    gap: 10px;
  }
`

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

/* ---- VIP badge ---- */
export const VipBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  border: 1px solid ${p => (p.$active ? '#0ea5e9' : '#cbd5e1')};
  background: ${p => (p.$active ? '#ecfeff' : '#f8fafc')};
  color: ${p => (p.$active ? '#0369a1' : '#64748b')};
`
