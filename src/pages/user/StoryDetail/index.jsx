import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Button, Rate, Typography, Image, Table, Space, Divider } from 'antd'
import { HeartFilled } from '@ant-design/icons'

import TopStory from '@components/user/TopStory'
import ReadingHistory from '@components/user/ReadingHistory'
import FollowedStories from '@components/user/FollowedStories'

import * as S from './styles'

const { Paragraph } = Typography

const mockStory = {
  title: 'ĐĂNG THIÊN LỘ',
  updatedAt: '2025-09-14 19:53:30',
  cover: 'https://i.imgur.com/yq0cQOa.jpeg',
  status: 'Đang Tiến Hành',
  categories: ['Action', 'Fantasy', 'Manhwa', 'Truyện Màu', 'Tu Tiên'],
  rating: 4.5,
  ratingCount: 25,
  follows: 444,
  description:
    'Chào mừng bạn đến với NetTruyen — không gian đọc truyện tranh online hoàn hảo dành cho tất cả các fan truyện tranh! Tại đây, bạn sẽ luôn trải nghiệm mượt mà, dễ sử dụng, giúp việc đọc truyện trên điện thoại và máy tính trở nên thật tiện lợi. Chúng tôi cập nhật truyện nhanh, ổn định, giao diện thân thiện và không làm phiền bởi quảng cáo quá mức. Hãy theo dõi truyện để nhận thông báo khi có chương mới nhé!',
  chapters: [
    { number: 131, rel: '11 phút trước' },
    { number: 130, rel: '4 giờ trước' },
    { number: 129, rel: '1 tháng trước' },
    { number: 128, rel: '1 tháng trước' },
    { number: 127, rel: '1 tháng trước' },
    { number: 126, rel: '1 tháng trước' },
    { number: 125, rel: '1 tháng trước' },
    { number: 124, rel: '1 tháng trước' },
    { number: 123, rel: '1 tháng trước' },
    { number: 122, rel: '1 tháng trước' },
    { number: 121, rel: '1 tháng trước' },
    { number: 120, rel: '1 tháng trước' },
    { number: 119, rel: '1 tháng trước' },
    { number: 118, rel: '1 tháng trước' },
    { number: 117, rel: '1 tháng trước' },
    { number: 116, rel: '1 tháng trước' },
    { number: 115, rel: '1 tháng trước' },
    { number: 114, rel: '1 tháng trước' },
    { number: 113, rel: '4 tháng trước' },
    { number: 112, rel: '4 tháng trước' },
  ],
}

const StoryDetail = () => {
  const { data: user } = useSelector((s) => s.auth.myProfile)
  const [showAllChapters, setShowAllChapters] = useState(false)

  const chapterColumns = [
    {
      title: 'Số chương',
      dataIndex: 'number',
      key: 'number',
      width: 180,
      render: (n) => (
        <S.ChapterLink href={`/doc-truyen/dang-thien-lo/chapter-${n}`}>
          Chapter {n}
        </S.ChapterLink>
      ),
    },
    {
      title: 'Cập nhật',
      dataIndex: 'rel',
      key: 'rel',
      render: (t) => <span className="muted">{t}</span>,
    },
  ]

  const chapterData = (showAllChapters ? mockStory.chapters : mockStory.chapters.slice(0, 18))
    .map((c) => ({ key: c.number, ...c }))

  return (
    <>
      <S.MainContainer>
        {/* LEFT */}
        <S.Left>
          {/* Title block */}
          <S.TitleBlock>
            <S.PageTitle>{mockStory.title}</S.PageTitle>
            <S.UpdatedAt>[Cập nhật lúc: {mockStory.updatedAt}]</S.UpdatedAt>
          </S.TitleBlock>

          {/* Summary */}
          <S.TopInfo>
            <div className="cover">
              <Image
                src={mockStory.cover}
                alt={mockStory.title}
                width={200}
                height={270}
                preview={false}
                style={{ objectFit: 'cover', borderRadius: 10 }}
              />
            </div>

            <div className="meta">
              <S.FieldRow>
                <i className="fa fa-user icon" />
                <span className="label">Tác giả</span>
                <span className="value">Đang cập nhật</span>
              </S.FieldRow>

              <S.FieldRow>
                <i className="fa fa-rss icon" />
                <span className="label">Tình trạng</span>
                <span className="value">{mockStory.status}</span>
              </S.FieldRow>

              <S.FieldRow>
                <i className="fa fa-tags icon" />
                <span className="label">Thể loại</span>
                <span className="value">
                  {mockStory.categories.map((c, i) => (
                    <span key={c}>
                      <S.CategoryLink href={`/the-loai/${c.toLowerCase().replace(/\s+/g, '-')}`}>
                        {c}
                      </S.CategoryLink>
                      {i < mockStory.categories.length - 1 ? ' - ' : ''}
                    </span>
                  ))}
                </span>
              </S.FieldRow>

              <S.RatingLine>
                <a href="#top">{mockStory.title}</a> Xếp hạng: {mockStory.rating}/5 - {mockStory.ratingCount} Lượt đánh giá.
              </S.RatingLine>

              <div style={{ marginTop: 6 }}>
                <Rate allowHalf disabled defaultValue={mockStory.rating} style={{ color: '#f5a623' }} />
              </div>

              <S.ActionRow>
                <Space size="middle" wrap>
                  <S.FollowButton icon={<HeartFilled />}>Theo dõi</S.FollowButton>
                  <span className="value strong" style={{ fontSize: 18 }}>{mockStory.follows}</span>
                  <span style={{ fontWeight: 600 }}>Người Đã Theo Dõi</span>
                </Space>

                <Space size="middle" wrap style={{ marginTop: 12 }}>
                  <S.ReadButton>Đọc từ đầu</S.ReadButton>
                  <S.ReadButton>Đọc mới nhất</S.ReadButton>
                </Space>
              </S.ActionRow>
            </div>
          </S.TopInfo>

          <Divider />

          {/* Nội dung */}
          <S.SectionHeader>
            <S.SectionTitle>
              <i className="fa fa-list-ul" /> NỘI DUNG TRUYỆN ĐĂNG THIÊN LỘ TRÊN NETTRUYEN
            </S.SectionTitle>
          </S.SectionHeader>

          <Paragraph
            style={{ marginTop: 8 }}
            ellipsis={{ rows: 3, expandable: true, symbol: 'Xem thêm' }}
          >
            {mockStory.description}
          </Paragraph>

          <Divider />

          {/* Danh sách chương */}
          <S.SectionHeader>
            <S.SectionTitle>
              <i className="fa fa-list-ul" /> DANH SÁCH CHƯƠNG
            </S.SectionTitle>
          </S.SectionHeader>

          <Table
            size="middle"
            pagination={false}
            columns={chapterColumns}
            dataSource={chapterData}
            style={{ marginTop: 12 }}
          />

          {!showAllChapters && (
            <div style={{ textAlign: 'center', marginTop: 12 }}>
              <Button type="link" onClick={() => setShowAllChapters(true)}>
                + Xem thêm
              </Button>
            </div>
          )}
        </S.Left>

        {/* RIGHT */}
        <S.Right>
          {user?.id && (
            <>
              <FollowedStories />
              <ReadingHistory />
            </>
          )}
          <TopStory />
        </S.Right>
      </S.MainContainer>
    </>
  )
}

export default StoryDetail
