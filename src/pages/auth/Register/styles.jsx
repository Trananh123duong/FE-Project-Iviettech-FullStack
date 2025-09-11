import styled from 'styled-components'
import { Form, Input, Button, Typography } from 'antd'

export const Wrapper = styled.div`
  max-width: 520px;
  margin: 40px auto;
  background: #fff;
  padding: 32px 28px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
`

export const Title = styled(Typography.Title)`
  && {
    text-align: center;
    font-weight: 800;
    margin-bottom: 8px;
  }
`

export const Underline = styled.div`
  width: 56px;
  height: 4px;
  background: #e91e63;
  border-radius: 4px;
  margin: 0 auto 24px;
`

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 8px;

  a {
    color: #3b82f6;
    text-decoration: none;
    &:hover { text-decoration: underline; }
  }
`

export const SubmitButton = styled(Button)`
  && {
    width: 100%;
    height: 44px;
    background: #ffd54f;
    border-color: #ffd54f;
    color: #111;
    font-weight: 600;
  }
  &&:hover {
    filter: brightness(0.98);
  }
`