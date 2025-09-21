import { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Form, Input, Skeleton, Typography, message } from 'antd'
import { Link } from 'react-router-dom'

import { ROUTES } from '@constants/routes'
import { getMyProfile, updateProfile, uploadAvatar } from '@redux/thunks/auth.thunk'
import * as S from './styles'

const { Title, Text } = Typography
const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB

const ProfilePage = () => {
  const dispatch = useDispatch()
  const fileRef = useRef(null)

  // --- Redux state
  const { data: profile, status: profileStatus, error: profileError } = useSelector(
    (s) => s.auth.myProfile
  )
  const updatingProfile = useSelector((s) => s.auth.updateData.status === 'loading')
  const updatingAvatar = useSelector((s) => s.auth.avatarData.status === 'loading')

  // --- Form
  const [form] = Form.useForm()

  // --- Ảnh xem trước cục bộ
  const [localAvatar, setLocalAvatar] = useState('')
  const avatarUrl = useMemo(
    () => localAvatar || profile?.avatar || 'https://placehold.co/160x160?text=Avatar',
    [localAvatar, profile?.avatar]
  )

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

  // Upload avatar: validate → preview → dispatch upload → rollback nếu lỗi
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
      fd.append('avatar', file) // 👈 tên field BE nhận

      const res = await dispatch(uploadAvatar({ data: fd })).unwrap()
      message.success(res?.message || 'Đã cập nhật avatar')
      // Sau khi slice cập nhật myProfile, localAvatar có thể để nguyên hoặc xoá; giữ nguyên để tránh “nháy”
    } catch (err) {
      setLocalAvatar('') // rollback preview
      const msg = typeof err === 'string' ? err : err?.message || 'Upload avatar thất bại'
      message.error(msg)
    } finally {
      URL.revokeObjectURL(previewURL)
      e.target.value = '' // cho phép chọn lại cùng file
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
        </S.LeftCol>

        {/* Cột phải: form chỉnh sửa */}
        <S.RightCol>
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
        </S.RightCol>
      </S.Wrapper>
    </>
  )
}

export default ProfilePage
