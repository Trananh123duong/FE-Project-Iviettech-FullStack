import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { List, Avatar, Typography, Empty, Button, Popconfirm } from 'antd'
import { Link } from 'react-router-dom'

import { END_POINT } from '@services/api'
import { getMyFollows, unfollowStory } from '@redux/thunks/follow.thunk'
import * as S from './styles'

function FollowedStories() {
  const dispatch = useDispatch()
  const { followedStoryList } = useSelector((state) => state.follow)
  const { data: user } = useSelector((state) => state.auth.myProfile)

  useEffect(() => {
    if (user) {
      dispatch(getMyFollows({ page: 1, limit: 5 }))
    }
  }, [dispatch, user])

  if (!user) return null

  const handleUnfollow = (storyId) => {
    dispatch(
      unfollowStory({
        storyId,
        callback: () => dispatch(getMyFollows({ page: 1, limit: 5 })),
      })
    )
  }

  const list = (followedStoryList.data || []).slice(0, 5)

  return (
    <S.Wrapper>
      <S.Header>
        <Typography.Title level={5}>Truyện đang theo dõi</Typography.Title>
        <Link to="/follow">Xem tất cả</Link>
      </S.Header>

      <List
        loading={followedStoryList.status === 'loading'}
        itemLayout="horizontal"
        dataSource={list}
        locale={{
          emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa theo dõi truyện nào" />,
        }}
        renderItem={(story) => {
          const thumb =
            story?.thumbnail
              ? story.thumbnail.startsWith('http')
                ? story.thumbnail
                : `${END_POINT}${story.thumbnail.startsWith('/') ? '' : '/'}${story.thumbnail}`
              : undefined

          return (
            <List.Item
              actions={[
                <Popconfirm
                  key="unfollow"
                  title="Bỏ theo dõi"
                  description="Bạn chắc chắn muốn bỏ theo dõi truyện này?"
                  okText="Bỏ"
                  cancelText="Huỷ"
                  onConfirm={() => handleUnfollow(story.id)}
                >
                  <Button size="small" danger>Xoá</Button>
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar shape="square" size={48} src={thumb} />}
                title={<Link to={`/truyen/${story.id}`}>{story.name}</Link>}
                description={
                  story?.chapters?.length > 0
                    ? `Chap mới nhất: ${story.chapters[0].chapter_number}`
                    : 'Chưa có chap'
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
