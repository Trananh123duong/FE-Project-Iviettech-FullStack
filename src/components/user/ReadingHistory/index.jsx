import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { List, Avatar, Popconfirm, Button, Typography, Empty } from 'antd'
import { Link } from 'react-router-dom'
import { ROUTES } from '@constants/routes'

import { END_POINT } from '@services/api'
import { getMyHistory, deleteHistoryItem } from '@redux/thunks/history.thunk'
import * as S from './styles'

function ReadingHistory() {
  const dispatch = useDispatch()
  const { historyList } = useSelector((state) => state.history)
  const list = (historyList.data || []).slice(0, 5).map((it) => ({ ...it, key: it.id }))

  const handleDelete = (id) => {
    dispatch(
      deleteHistoryItem({
        id,
        callback: () => {
          dispatch(getMyHistory({ page: 1, limit: 5 }))
        },
      })
    )
  }

  useEffect(() => {
    dispatch(getMyHistory({ page: 1, limit: 5 }))
  }, [dispatch])

  return (
    <S.Wrapper>
      <S.Header>
        <Typography.Title level={5}>Lịch sử đọc truyện</Typography.Title>
        <Link to={ROUTES.USER.HISTORY}>Xem tất cả</Link>
      </S.Header>

      <List
        loading={historyList.status === 'loading'}
        itemLayout="horizontal"
        dataSource={list}
        locale={{
          emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có lịch sử" />,
        }}
        renderItem={(item) => {
          const { id, story = {}, chapter = {} } = item
          const thumb =
            story?.thumbnail
              ? story.thumbnail.startsWith('http')
                ? story.thumbnail
                : `${END_POINT}${story.thumbnail.startsWith('/') ? '' : '/'}${story.thumbnail}`
              : undefined

          const storyHref = `/story/${item.story_id}`
          const readHref = `/story/${item.story_id}/chapter/${item.chapter_id}`

          return (
            <List.Item
              actions={[
                <Popconfirm
                  key="del"
                  title="Xoá khỏi lịch sử"
                  description="Bạn chắc chắn muốn xoá mục này?"
                  okText="Xoá"
                  cancelText="Huỷ"
                  onConfirm={() => handleDelete(id)}
                >
                  <Button danger size="small">Xoá</Button>
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar shape="square" size={48} src={thumb} />}
                title={<Link to={storyHref}>{story?.name}</Link>}
                description={<Link to={readHref}>Đọc tiếp Chapter {chapter?.chapter_number ?? '-'}</Link>}
              />
            </List.Item>
          )
        }}
      />
    </S.Wrapper>
  )
}

export default ReadingHistory
