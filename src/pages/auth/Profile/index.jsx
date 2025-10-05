import { Button, Form, Input, Skeleton, Typography, message } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'; // 👈 cần navigate để chuyển trang sau khi đổi mật khẩu

import { ROUTES } from '@constants/routes';
import { changePassword, getMyProfile, updateProfile, uploadAvatar } from '@redux/thunks/auth.thunk';
import * as S from './styles';

const { Title, Text } = Typography
const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB

const ProfilePage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const fileRef = useRef(null)

  // --- Redux state
  const { data: profile, status: profileStatus, error: profileError } = useSelector(
    (s) => s.auth.myProfile
  )
  const updatingProfile = useSelector((s) => s.auth.updateData.status === 'loading')
  const updatingAvatar = useSelector((s) => s.auth.avatarData.status === 'loading')

  // NEW: trạng thái đổi mật khẩu
  const changingPwd = useSelector((s) => s.auth.changePwdData.status === 'loading')
  const changePwdError = useSelector((s) => s.auth.changePwdData.error)

  // --- Form
  const [form] = Form.useForm()
  const [pwdForm] = Form.useForm()

  // --- Ảnh xem trước cục bộ
  const [localAvatar, setLocalAvatar] = useState('')
  const avatarUrl = useMemo(
    () => localAvatar || profile?.avatar || 'https://placehold.co/160x160?text=Avatar',
    [localAvatar, profile?.avatar]
  )

  // ========================= VIP helpers =========================
  const isVip = !!profile?.isVip || (!!profile?.vip_expires_at && new Date(profile.vip_expires_at) > new Date())
  const vipExpiresAt = profile?.vip_expires_at ? new Date(profile.vip_expires_at) : null
  const fmtVN = (d) => d ? new Date(d).toLocaleString('vi-VN', { hour12: false }) : ''
  const remain = useMemo(() => {
    if (!vipExpiresAt) return null
    const ms = vipExpiresAt.getTime() - Date.now()
    if (ms <= 0) return { expired: true, text: 'Đã hết hạn' }
    const day = Math.floor(ms / 86400000)
    const hour = Math.floor((ms % 86400000) / 3600000)
    return { expired: false, text: `${day} ngày ${hour} giờ` }
  }, [profile?.vip_expires_at])

  // --- Lấy profile khi vào trang
  useEffect(() => {
    if (profileStatus === 'idle') dispatch(getMyProfile())
  }, [profileStatus, dispatch])

  // --- Đổ dữ liệu vào form khi có profile
  useEffect(() => {
    if (profile?.id) {
      form.setFieldsValue({
        username: profile.username || '',
        email: profile.email || '',
      })
    }
  }, [profile, form])

  // =========================================================
  // Handlers
  // =========================================================

  // Lưu thay đổi thông tin (chỉ username)
  const onSave = async () => {
    try {
      const values = await form.validateFields()
      const res = await dispatch(
        updateProfile({
          data: { username: values.username },
        })
      ).unwrap()
      message.success(res?.message || 'Cập nhật thông tin thành công')
    } catch (err) {
      if (!err) return
      const msg = typeof err === 'string' ? err : err?.message || 'Cập nhật thất bại'
      message.error(msg)
    }
  }

  // Chọn file avatar
  const onPickFile = () => fileRef.current?.click()

  // Upload avatar
  const onFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate
    if (!file.type.startsWith('image/')) {
      message.error('Chỉ chấp nhận file ảnh')
      e.target.value = ''
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      message.error('Ảnh tối đa 2MB')
      e.target.value = ''
      return
    }

    const previewURL = URL.createObjectURL(file)
    setLocalAvatar(previewURL)

    try {
      const fd = new FormData()
      fd.append('avatar', file)

      const res = await dispatch(uploadAvatar({ data: fd })).unwrap()
      message.success(res?.message || 'Đã cập nhật avatar')
    } catch (err) {
      setLocalAvatar('')
      const msg = typeof err === 'string' ? err : err?.message || 'Upload avatar thất bại'
      message.error(msg)
    } finally {
      URL.revokeObjectURL(previewURL)
      e.target.value = ''
    }
  }

  // NEW: Đổi mật khẩu
  const onChangePassword = async () => {
    try {
      const values = await pwdForm.validateFields()
      const payload = {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }
      const res = await dispatch(changePassword(payload)).unwrap()
      message.success(res?.message || 'Đổi mật khẩu thành công')

      // Sau khi slice tự clear token + profile, điều hướng tới trang đăng nhập
      navigate(ROUTES.AUTH.LOGIN)
    } catch (err) {
      if (!err) return
      const msg = typeof err === 'string' ? err : err?.message || 'Đổi mật khẩu thất bại'
      message.error(msg)
    }
  }

  // =========================================================
  // Render
  // =========================================================

  return (
    <>
      {/* Breadcrumb */}
      <S.BreadcrumbBar>
        <S.Breadcrumb>
          <Link to={ROUTES.USER.HOME}>Trang chủ</Link>
          <span className="sep">»</span>
          <span className="current">Trang cá nhân</span>
        </S.Breadcrumb>
      </S.BreadcrumbBar>

      <S.Wrapper>
        {/* Cột trái: avatar + info ngắn */}
        <S.LeftCol>
          <S.ProfileCard>
            <S.AvatarWrap>
              <img src={avatarUrl} alt="avatar" />
            </S.AvatarWrap>

            <div className="meta">
              <Title level={4} className="name">
                {profile?.username || 'Người dùng'}
              </Title>
              <Text type="secondary" className="email">
                {profile?.email || ''}
              </Text>
            </div>

            {/* Nhãn VIP nhỏ gọn bên dưới tên */}
            <div style={{ marginTop: 6 }}>
              {isVip ? (
                <S.VipBadge $active>VIP</S.VipBadge>
              ) : (
                <S.VipBadge>NON-VIP</S.VipBadge>
              )}
            </div>

            <S.ActionRow>
              <Button onClick={onPickFile} loading={updatingAvatar} disabled={updatingAvatar}>
                Đổi avatar
              </Button>
              <input
                ref={fileRef}
                type="file"
                hidden
                accept="image/*"
                onChange={onFileChange}
              />
            </S.ActionRow>
          </S.ProfileCard>

          {/* Card: Trạng thái VIP */}
          <S.Card>
            <S.CardHead>
              <S.CardTitle>Trạng thái VIP</S.CardTitle>
            </S.CardHead>

            {isVip ? (
              <div>
                <div style={{ marginBottom: 6 }}>
                  <S.VipBadge $active>VIP đang hoạt động</S.VipBadge>
                </div>
                <Text>Hết hạn: <b>{fmtVN(vipExpiresAt)}</b></Text>
                <div>
                  <Text type="secondary">Còn lại: {remain?.text || '-'}</Text>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: 6 }}>
                  <S.VipBadge>Chưa là VIP</S.VipBadge>
                </div>
                <Text type="secondary">
                  Nâng cấp để đọc mượt hơn, không quảng cáo và các đặc quyền khác.
                </Text>
                <S.FormActions>
                  {/* Chưa có trang thanh toán → để trống logic */}
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => navigate(ROUTES.USER.VIP_CHECKOUT)}
                  >
                    Đăng ký VIP 30 ngày
                  </Button>
                </S.FormActions>
              </div>
            )}
          </S.Card>
        </S.LeftCol>

        {/* Cột phải: form chỉnh sửa + đổi mật khẩu */}
        <S.RightCol>
          {/* Card: Thông tin cá nhân */}
          <S.Card>
            <S.CardHead>
              <S.CardTitle>Thông tin cá nhân</S.CardTitle>
            </S.CardHead>

            {profileStatus === 'loading' ? (
              <Skeleton active paragraph={{ rows: 6 }} />
            ) : profileError ? (
              <S.ErrorBox>Lỗi: {String(profileError)}</S.ErrorBox>
            ) : (
              <Form form={form} layout="vertical" onFinish={onSave} className="nt-form">
                <Form.Item
                  label="Tên hiển thị"
                  name="username"
                  rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                >
                  <Input size="large" placeholder="Tên hiển thị" />
                </Form.Item>

                <Form.Item label="Email" name="email">
                  <Input size="large" disabled />
                </Form.Item>

                <S.FormActions>
                  <Button
                    type="primary"
                    size="large"
                    htmlType="submit"
                    loading={updatingProfile}
                    disabled={updatingProfile}
                  >
                    Lưu thay đổi
                  </Button>
                </S.FormActions>
              </Form>
            )}
          </S.Card>

          {/* NEW: Card: Đổi mật khẩu */}
          <S.Card style={{ marginTop: 16 }}>
            <S.CardHead>
              <S.CardTitle>Đổi mật khẩu</S.CardTitle>
            </S.CardHead>

            <Form form={pwdForm} layout="vertical" className="nt-form" onFinish={onChangePassword}>
              <Form.Item
                label="Mật khẩu hiện tại"
                name="currentPassword"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }]}
              >
                <Input.Password size="large" placeholder="Nhập mật khẩu hiện tại" />
              </Form.Item>

              <Form.Item
                label="Mật khẩu mới"
                name="newPassword"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu mới' },
                  { min: 6, message: 'Mật khẩu mới phải tối thiểu 6 ký tự' },
                ]}
              >
                <Input.Password size="large" placeholder="Ít nhất 6 ký tự" />
              </Form.Item>

              <Form.Item
                label="Xác nhận mật khẩu mới"
                name="confirmNewPassword"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: 'Vui lòng xác nhận mật khẩu mới' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) return Promise.resolve()
                      return Promise.reject(new Error('Mật khẩu xác nhận không khớp'))
                    },
                  }),
                ]}
              >
                <Input.Password size="large" placeholder="Nhập lại mật khẩu mới" />
              </Form.Item>

              {changePwdError ? (
                <S.ErrorBox style={{ marginBottom: 8 }}>
                  {String(changePwdError)}
                </S.ErrorBox>
              ) : null}

              <S.FormActions>
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  loading={changingPwd}
                  disabled={changingPwd}
                >
                  Đổi mật khẩu
                </Button>
              </S.FormActions>
            </Form>
          </S.Card>
        </S.RightCol>
      </S.Wrapper>
    </>
  )
}

export default ProfilePage
