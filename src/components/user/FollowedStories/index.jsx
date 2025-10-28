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

  const { followedStoryList } = useSelector((s) => s.follow)
  const { data: user } = useSelector((s) => s.auth.myProfile)

  useEffect(() => {
    if (user) {
      dispatch(getMyFollows({ page: 1, limit: 5 }))
    }
  }, [dispatch, user])

  // Nếu chưa đăng nhập → không hiển thị widget này
  if (!user) return null

  // Bỏ theo dõi 1 truyện rồi reload danh sách
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
  const isLoading = followedStoryList.status === 'loading'

  return (
    <S.Wrapper>
      <S.Header>
        <Typography.Title level={5}>Truyện đang theo dõi</Typography.Title>
        <Link to={ROUTES.USER.FOLLOW}>Xem tất cả</Link>
      </S.Header>

      <List
        loading={isLoading}
        itemLayout="horizontal"
        dataSource={list}
        rowKey={(story) => story.id}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Chưa theo dõi truyện nào"
            />
          ),
        }}
        renderItem={(story) => {
          // Chuẩn hoá ảnh thumbnail
          let thumb;
          if (story?.thumbnail) {
            const isFullUrl = story.thumbnail.startsWith('http');

            if (isFullUrl) {
              thumb = story.thumbnail;
            } else {
              const needsSlash = !story.thumbnail.startsWith('/');
              const prefix = needsSlash ? '/' : '';
              thumb = `${END_POINT}${prefix}${story.thumbnail}`;
            }
          } else {
            thumb = undefined;
          }

          // Link chi tiết truyện & chapter mới nhất
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
                avatar={<Avatar shape="square" size={48} src={thumb} />}

                title={<Link to={storyHref}>{story.name}</Link>}

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
