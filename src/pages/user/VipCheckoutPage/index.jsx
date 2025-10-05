import { Button, Form, InputNumber, Input, Skeleton, Typography, message } from 'antd'
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import { ROUTES } from '@constants/routes'
import { getMyProfile } from '@redux/thunks/auth.thunk'
import { checkoutVip, getVipStatus } from '@redux/thunks/vip.thunk'
import * as S from './styles'

const { Title, Text } = Typography

const VipCheckoutPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // --- Auth & VIP state
  const { data: profile, status: profileStatus } = useSelector((s) => s.auth.myProfile)
  const vipStatus = useSelector((s) => s.vip.vipStatus)         // { data, status, error }
  const checkoutState = useSelector((s) => s.vip.checkoutData)  // { status, error, last }

  const loadingProfile = profileStatus === 'loading'
  const loadingVip = vipStatus.status === 'loading'
  const paying = checkoutState.status === 'loading'
  const { isVip, vip_expires_at } = vipStatus.data || {}

  // --- Effects: fetch profile & VIP status
  useEffect(() => {
    if (profileStatus === 'idle') dispatch(getMyProfile())
  }, [profileStatus, dispatch])

  useEffect(() => {
    if (vipStatus.status === 'idle') dispatch(getVipStatus())
  }, [vipStatus.status, dispatch])

  // --- Helpers
  const vipExpDate = vip_expires_at ? new Date(vip_expires_at) : null
  const remainText = useMemo(() => {
    if (!vipExpDate) return '-'
    const ms = vipExpDate.getTime() - Date.now()
    if (ms <= 0) return 'Đã hết hạn'
    const d = Math.floor(ms / 86400000)
    const h = Math.floor((ms % 86400000) / 3600000)
    return `${d} ngày ${h} giờ`
  }, [vip_expires_at])
  const fmtVN = (d) => d ? new Date(d).toLocaleString('vi-VN', { hour12: false }) : ''

  // --- Handlers
  const onPay = async (values) => {
    try {
      const payload = {
        price: Number(values?.price ?? 49000),
        note: values?.note || 'Fake payment (click-to-pay)'
      }
      const res = await dispatch(checkoutVip(payload)).unwrap()
      message.success(res?.message || 'Thanh toán VIP thành công')
      navigate(ROUTES.USER.PROFILE)
    } catch (err) {
      const msg = typeof err === 'string' ? err : err?.message || 'Thanh toán thất bại'
      message.error(msg)
    }
  }

  return (
    <>
      {/* Breadcrumb */}
      <S.BreadcrumbBar>
        <S.Breadcrumb>
          <Link to={ROUTES.USER.HOME}>Trang chủ</Link>
          <span className="sep">»</span>
          <span className="current">Thanh toán VIP</span>
        </S.Breadcrumb>
      </S.BreadcrumbBar>

      <S.Wrapper>
        {/* Left: tóm tắt gói */}
        <S.LeftCol>
          <S.Card>
            <S.CardHead>
              <S.CardTitle>Gói VIP 30 ngày</S.CardTitle>
            </S.CardHead>

            <div style={{ marginBottom: 8 }}>
              {isVip ? <S.VipBadge $active>Đang là VIP</S.VipBadge> : <S.VipBadge>Chưa VIP</S.VipBadge>}
            </div>

            {loadingVip ? (
              <Skeleton active paragraph={{ rows: 3 }} />
            ) : (
              <>
                <Text>Quyền lợi:</Text>
                <ul style={{ marginTop: 8, paddingLeft: 18 }}>
                  <li>Đọc mượt, không quảng cáo</li>
                  <li>Hỗ trợ dự án & mở khóa tiện ích</li>
                  <li>Gia hạn cộng dồn thời gian</li>
                </ul>

                <div style={{ marginTop: 10 }}>
                  <Text strong>Trạng thái hiện tại</Text>
                  <div>
                    <Text type="secondary">Hết hạn: </Text>
                    <Text>{fmtVN(vipExpDate) || '-'}</Text>
                  </div>
                  <div>
                    <Text type="secondary">Còn lại: </Text>
                    <Text>{remainText}</Text>
                  </div>
                </div>
              </>
            )}
          </S.Card>
        </S.LeftCol>

        {/* Right: form thanh toán */}
        <S.RightCol>
          <S.Card>
            <S.CardHead>
              <S.CardTitle>Thanh toán ảo</S.CardTitle>
            </S.CardHead>

            {(loadingProfile || loadingVip) ? (
              <Skeleton active paragraph={{ rows: 6 }} />
            ) : (
              <Form
                layout="vertical"
                className="nt-form"
                initialValues={{ price: 49000, note: '' }}
                onFinish={onPay}
              >
                <Form.Item label="Tài khoản" colon={false}>
                  <Title level={5} style={{ margin: 0 }}>{profile?.username || profile?.email || 'Người dùng'}</Title>
                  <Text type="secondary">{profile?.email}</Text>
                </Form.Item>

                <Form.Item
                  label="Số tiền (VND)"
                  name="price"
                  rules={[{ required: true, message: 'Vui lòng nhập số tiền' }]}
                >
                  <InputNumber min={0} step={1000} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item label="Ghi chú" name="note">
                  <Input placeholder="(tuỳ chọn) ví dụ: tặng bạn bè, ủng hộ dự án..." />
                </Form.Item>

                <S.FormActions>
                  <Button
                    type="primary"
                    size="large"
                    htmlType="submit"
                    loading={paying}
                    disabled={paying}
                  >
                    Thanh toán & kích hoạt VIP 30 ngày
                  </Button>
                  <Button size="large" onClick={() => navigate(ROUTES.USER.HOME)}>
                    Về trang chủ
                  </Button>
                </S.FormActions>

                {checkoutState.error ? (
                  <S.ErrorBox style={{ marginTop: 10 }}>
                    {String(checkoutState.error)}
                  </S.ErrorBox>
                ) : null}

                {checkoutState.last ? (
                  <div style={{ marginTop: 10 }}>
                    <Text type="secondary">
                      {checkoutState.last.plan} • {checkoutState.last.duration_days} ngày • {checkoutState.last.message}
                    </Text>
                  </div>
                ) : null}
              </Form>
            )}
          </S.Card>
        </S.RightCol>
      </S.Wrapper>
    </>
  )
}

export default VipCheckoutPage
