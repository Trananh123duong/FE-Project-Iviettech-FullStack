import { useEffect } from 'react'
import { Form, Input, Alert, notification } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import * as S from './styles'
import { ROUTES } from '../../../constants/routes'
import { login } from '../../../redux/thunks/auth.thunk'

const Login = () => {
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { loginData } = useSelector((state) => state.auth)

  const onFinish = (values) => {
    dispatch(
      login({
        data: values,
        callback: (role) => {
          notification.success({
            message: 'Đăng nhập thành công',
            description: 'Bạn đã đăng nhập vào hệ thống.',
          })
          navigate(role === 'admin' ? '/admin/dashboard' : ROUTES.USER.HOME)
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
    <S.Card>
      <S.Title level={2}>ĐĂNG NHẬP</S.Title>
      <S.Underline />

      {loginData.error && (
        <Alert
          type="error"
          showIcon
          message={loginData.error}
          style={{ marginBottom: 16 }}
        />
      )}

      <Form layout="vertical" form={form} onFinish={onFinish}>
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
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
        >
          <Input.Password size="large" placeholder="Mật khẩu" />
        </Form.Item>

        <S.Actions>
          <Link to={ROUTES.AUTH.FORGOT_PASSWORD || '/quen-mat-khau'}>
            Quên mật khẩu
          </Link>
          <Link to={ROUTES.AUTH.REGISTER}>Đăng ký</Link>
        </S.Actions>

        <Form.Item style={{ marginTop: 16 }}>
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
    </S.Card>
  )
}

export default Login
