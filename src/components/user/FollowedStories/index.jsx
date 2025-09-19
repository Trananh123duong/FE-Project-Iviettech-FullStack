import { Avatar, Button, Empty, List, Popconfirm, Typography } from 'antd'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { ROUTES } from '@constants/routes'
import { getMyFollows, unfollowStory } from '@redux/thunks/follow.thunk'
import { END_POINT } from '@services/api'
import * as S from './styles'

function FollowedStories() {
  const dispatch = useDispatch()

  // Lấy danh sách truyện đang theo dõi & thông tin user
  const { followedStoryList } = useSelector((s) => s.follow)
  const { data: user } = useSelector((s) => s.auth.myProfile)

  // Khi đã có user → gọi API lấy 5 truyện theo dõi đầu tiên
  useEffect(() => {
    if (user) {
      dispatch(getMyFollows({ page: 1, limit: 5 }))
    }
  }, [dispatch, user])

  // Nếu chưa đăng nhập → không hiển thị widget này
  if (!user) return null

  // Bỏ theo dõi 1 truyện rồi reload danh sách (đảm bảo UI luôn cập nhật)
  const handleUnfollow = (storyId) => {
    dispatch(
      unfollowStory({
        storyId,
        callback: () => dispatch(getMyFollows({ page: 1, limit: 5 })),
      })
    )
  }

  // Lấy tối đa 5 truyện để hiển thị
  const list = (followedStoryList.data || []).slice(0, 5)

  return (
    <S.Wrapper>
      {/* Header: tiêu đề + link “Xem tất cả” tới trang Theo dõi */}
      <S.Header>
        <Typography.Title level={5}>Truyện đang theo dõi</Typography.Title>
        <Link to={ROUTES.USER.FOLLOW}>Xem tất cả</Link>
      </S.Header>

      <List
        loading={followedStoryList.status === 'loading'}
        itemLayout="horizontal"
        dataSource={list}
        locale={{
          // Khi rỗng → hiển thị Empty của AntD
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Chưa theo dõi truyện nào"
            />
          ),
        }}
        renderItem={(story) => {
          // Chuẩn hoá ảnh thumbnail:
          // - Nếu là URL đầy đủ (http/https) thì dùng trực tiếp
          // - Nếu là path tương đối thì nối với END_POINT
          const thumb = story?.thumbnail
            ? story.thumbnail.startsWith('http')
              ? story.thumbnail
              : `${END_POINT}${story.thumbnail.startsWith('/') ? '' : '/'}${story.thumbnail}`
            : undefined

          // Link chi tiết truyện & chapter mới nhất: dùng ROUTES để đồng bộ route
          const storyHref = ROUTES.USER.STORY.replace(':id', story.id)
          const latestChapter = story?.chapters?.[0]

          return (
            <List.Item
              actions={[
                // Nút bỏ theo dõi có Popconfirm để xác nhận
                <Popconfirm
                  key="unfollow"
                  title="Bỏ theo dõi"
                  description="Bạn chắc chắn muốn bỏ theo dõi truyện này?"
                  okText="Bỏ"
                  cancelText="Huỷ"
                  onConfirm={() => handleUnfollow(story.id)}
                >
                  <Button size="small" danger>
                    Xoá
                  </Button>
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                // Ảnh avatar (vuông) của truyện
                avatar={<Avatar shape="square" size={48} src={thumb} />}

                // Tiêu đề: link tới trang chi tiết truyện
                title={<Link to={storyHref}>{story.name}</Link>}

                // Mô tả: nếu có chapter mới nhất → cho phép click vào
                description={
                  latestChapter ? (
                    <Link to={ROUTES.USER.CHAPTER.replace(':id', latestChapter.id)}>
                      Chap mới nhất: {latestChapter.chapter_number}
                    </Link>
                  ) : (
                    'Chưa có chap'
                  )
                }
              />
            </List.Item>
          )
        }}
      />
    </S.Wrapper>
  )
}

export default FollowedStories
