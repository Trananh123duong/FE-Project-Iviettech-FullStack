import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons'
import { Alert, Form, Input, notification } from 'antd'
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import { ROUTES } from '@constants/routes'
import { register } from '@redux/thunks/auth.thunk'
import * as S from './styles'

const Register = () => {
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { registerData } = useSelector((state) => state.auth)
  const loading = useMemo(() => registerData.status === 'loading', [registerData.status])
  const error = registerData.error

  const handleSubmit = (values) => {
    dispatch(
      register({
        data: {
          username: values.username,
          email: values.email,
          password: values.password,
        },
        callback: () => {
          notification.success({
            message: 'Đăng ký thành công',
            description: 'Tài khoản của bạn đã được tạo.',
          })
          navigate(ROUTES.AUTH.LOGIN)
        },
      })
    )
  }

  useEffect(() => {
    if (error) {
      form.setFields([
        { name: 'username', errors: [' '] },
        { name: 'email', errors: [' '] },
        { name: 'password', errors: [error] },
      ])
    }
  }, [error, form])

  return (
    <S.Page>
      <S.AuthCard>
        <S.Title>ĐĂNG KÝ</S.Title>
        <S.TitleUnderline />

        {!!error && (
          <Alert type="error" showIcon message={error} style={{ marginBottom: 12 }} />
        )}

        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
          autoComplete="on"
        >
          <Form.Item
            label="Name"
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
          >
            <Input
              size="large"
              placeholder="Name"
              prefix={<UserOutlined />}
              autoComplete="name"
            />
          </Form.Item>

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
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu' },
              { min: 6, message: 'Ít nhất 6 ký tự' },
            ]}
            hasFeedback
          >
            <Input.Password
              size="large"
              placeholder="Mật khẩu"
              prefix={<LockOutlined />}
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu"
            name="confirm"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) return Promise.resolve()
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp'))
                },
              }),
            ]}
          >
            <Input.Password
              size="large"
              placeholder="Xác nhận mật khẩu"
              prefix={<LockOutlined />}
              autoComplete="new-password"
            />
          </Form.Item>

          <S.FormExtras>
            <Link to={ROUTES.AUTH.LOGIN}>Đăng nhập</Link>
          </S.FormExtras>

          <Form.Item style={{ marginTop: 8, marginBottom: 0 }}>
            <S.SubmitButton type="primary" htmlType="submit" size="large" loading={loading}>
              Đăng ký
            </S.SubmitButton>
          </Form.Item>
        </Form>
      </S.AuthCard>
    </S.Page>
  )
}

export default Register
