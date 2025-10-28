import { LockOutlined, MailOutlined } from '@ant-design/icons'
import { Alert, Form, Input, notification } from 'antd'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import { ROUTES } from '@constants/routes'
import { login } from '@redux/thunks/auth.thunk'
import * as S from './styles'

const Login = () => {
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { loginData } = useSelector((state) => state.auth)

  const handleSubmit = (values) => {
    dispatch(
      login({
        data: values,
        callback: () => {
          notification.success({
            message: 'Đăng nhập thành công',
            description: 'Bạn đã đăng nhập vào hệ thống.',
          })
          navigate(ROUTES.USER.HOME)
        },
      })
    )
  }

  useEffect(() => {
    if (loginData.error) {
      form.setFields([
        { name: 'email', errors: [' '] },
        { name: 'password', errors: [loginData.error] },
      ])
    }
  }, [loginData.error, form])

  return (
    <S.Page>
      <S.AuthCard>
        <S.Title>ĐĂNG NHẬP</S.Title>
        <S.TitleUnderline />

        {!!loginData.error && (
          <Alert
            type="error"
            showIcon
            message={loginData.error}
            style={{ marginBottom: 12 }}
          />
        )}

        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
          autoComplete="on"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' },
            ]}
          >
            <Input
              size="large"
              placeholder="Email"
              prefix={<MailOutlined />}
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
          >
            <Input.Password
              size="large"
              placeholder="Mật khẩu"
              prefix={<LockOutlined />}
              autoComplete="current-password"
            />
          </Form.Item>

          <S.FormExtras>
            <Link to={ROUTES.AUTH.FORGOT_PASSWORD}>Quên mật khẩu</Link>
            <span className="sep">•</span>
            <Link to={ROUTES.AUTH.REGISTER}>Đăng ký</Link>
          </S.FormExtras>

          <Form.Item style={{ marginTop: 8, marginBottom: 0 }}>
            <S.SubmitButton
              type="primary"
              htmlType="submit"
              size="large"
              loading={loginData.status === 'loading'}
            >
              Đăng nhập
            </S.SubmitButton>
          </Form.Item>
        </Form>
      </S.AuthCard>
    </S.Page>
  )
}

export default Login
