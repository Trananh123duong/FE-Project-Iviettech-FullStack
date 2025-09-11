import { useMemo, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Input, Alert, notification } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import * as S from './styles'

import { ROUTES } from '../../../constants/routes'
import { register } from '../../../redux/thunks/auth.thunk'

const Register = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { registerData } = useSelector((state) => state.auth)
  const loading = useMemo(
    () => registerData.status === 'loading',
    [registerData.status]
  )
  const error = registerData.error

  const onFinish = (values) => {
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
    <S.Wrapper>
      <S.Title level={2}>ĐĂNG KÝ</S.Title>
      <S.Underline />

      {error && (
        <Alert
          type="error"
          showIcon
          message={error}
          style={{ marginBottom: 16 }}
        />
      )}

      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item
          label="Name"
          name="username"
          rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
        >
          <Input size="large" placeholder="Name" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Email không hợp lệ' },
          ]}
        >
          <Input size="large" placeholder="Email" />
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
          <Input.Password size="large" placeholder="Mật khẩu" />
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
                if (!value || getFieldValue('password') === value)
                  return Promise.resolve()
                return Promise.reject(
                  new Error('Mật khẩu xác nhận không khớp')
                )
              },
            }),
          ]}
        >
          <Input.Password size="large" placeholder="Xác nhận mật khẩu" />
        </Form.Item>

        <S.Actions>
          <Link to={ROUTES.AUTH.LOGIN}>Đăng nhập</Link>
        </S.Actions>

        <Form.Item style={{ marginTop: 16 }}>
          <S.SubmitButton
            type="primary"
            htmlType="submit"
            size="large"
            loading={loading}
          >
            Đăng ký
          </S.SubmitButton>
        </Form.Item>
      </Form>
    </S.Wrapper>
  )
}

export default Register
