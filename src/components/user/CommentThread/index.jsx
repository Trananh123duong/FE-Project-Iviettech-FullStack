import {
  DeleteOutlined,
  LikeFilled,
  LikeOutlined,
  LoginOutlined,
  MessageOutlined,
  SendOutlined,
} from '@ant-design/icons'
import { END_POINT } from '@services/api'
import { fmtDT } from '@utils/date'
import { Alert, Avatar, Button, Empty, Input, Popconfirm, Skeleton, Tooltip, Typography } from 'antd'
import { useMemo, useState } from 'react'
import * as S from './styles'

const { Text } = Typography
const { TextArea } = Input

/**
 * CommentThread – UI hiển thị & thao tác bình luận (gốc + reply)
 *
 * Props:
 * - isLoggedIn         : boolean
 * - currentUser        : object | null
 * - comments           : array các comment (mỗi comment có thể có story_comments là replies)
 * - meta               : { page, totalPages, total, limit } | {}
 * - status             : 'idle' | 'loading' | 'succeeded' | 'failed'
 * - error              : string | null
 * - onCreate(body)     : () => Promise   // tạo bình luận gốc
 * - onReply(root, body): (rootComment) => Promise
 * - onToggleLike(id, nextLiked) : (commentId, boolean) => Promise
 * - onDelete(id)       : (commentId) => Promise
 * - onLoadMore()       : () => Promise   // tải trang kế tiếp (khi còn)
 * - title?             : string          // tiêu đề khối, mặc định: 'Bình luận'
 * - placeholder?       : string          // placeholder ô nhập
 */
const CommentThread = ({
  isLoggedIn = false,
  currentUser,
  comments = [],
  meta = {},
  status = 'idle',
  error = null,
  onCreate,
  onReply,
  onToggleLike,
  onDelete,
  onLoadMore,
  title = 'Bình luận',
  placeholder = 'Nhập bình luận của bạn...',
}) => {
  // state cục bộ
  const [newText, setNewText] = useState('')
  const [posting, setPosting] = useState(false)
  const [replyOpen, setReplyOpen] = useState({})   // { [commentId]: bool }
  const [replyText, setReplyText] = useState({})   // { [commentId]: string }
  const [replyBusy, setReplyBusy] = useState({})   // { [commentId]: bool }

  const hasMore = useMemo(
    () => Number(meta?.page || 1) < Number(meta?.totalPages || 1),
    [meta?.page, meta?.totalPages]
  )

  const canDeleteBy = (ownerId) => {
    const me = currentUser?.id
    return !!me && (me === ownerId || currentUser?.role === 'admin')
  }

  const createComment = async () => {
    const body = String(newText || '').trim()
    if (!isLoggedIn) return
    if (!body) return
    if (!onCreate) return
    try {
      setPosting(true)
      await onCreate(body)
      setNewText('')
    } finally {
      setPosting(false)
    }
  }

  const postReply = async (rootCmt) => {
    const body = String(replyText[rootCmt.id] || '').trim()
    if (!isLoggedIn) return
    if (!body) return
    if (!onReply) return
    try {
      setReplyBusy((m) => ({ ...m, [rootCmt.id]: true }))
      await onReply(rootCmt, body)
      setReplyText((m) => ({ ...m, [rootCmt.id]: '' }))
      setReplyOpen((m) => ({ ...m, [rootCmt.id]: false }))
    } finally {
      setReplyBusy((m) => ({ ...m, [rootCmt.id]: false }))
    }
  }

  return (
    <S.Wrap>
      <S.Header>
        <Text strong>{title}</Text>
        {meta?.total != null && <span className="count">({meta.total} bình luận)</span>}
      </S.Header>

      {!isLoggedIn && (
        <Alert
          type="warning"
          showIcon
          icon={<LoginOutlined />}
          message="Bạn cần đăng nhập để bình luận và thích."
          style={{ marginBottom: 12 }}
        />
      )}

      {/* Form bình luận mới */}
      <S.Form>
        <TextArea
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder={isLoggedIn ? placeholder : 'Đăng nhập để bình luận'}
          autoSize={{ minRows: 3, maxRows: 6 }}
          disabled={!isLoggedIn || posting}
          maxLength={2000}
        />
        <div className="actions">
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={createComment}
            loading={posting}
            disabled={!isLoggedIn || !newText.trim()}
          >
            Gửi
          </Button>
        </div>
      </S.Form>

      {/* Danh sách bình luận */}
      {status === 'loading' && comments.length === 0 ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : error ? (
        <Empty description="Không tải được bình luận" />
      ) : comments.length === 0 ? (
        <Empty description="Chưa có bình luận nào — hãy là người đầu tiên!" />
      ) : (
        <S.List>
          {comments.map((c) => {
            const created = c.created_at || c.createdAt
            const canDelete = canDeleteBy(c.user_id)

            return (
              <S.Item key={c.id}>
                <div className="avatar">
                  <Avatar size={36} src={c.user?.avatar ? `${END_POINT}${c.user.avatar}` : undefined} alt={c.user?.username} />
                </div>
                <div className="content">
                  <div className="meta">
                    <span className="author">{c.user?.username || 'Ẩn danh'}</span>
                    <span className="dot">•</span>
                    <Tooltip title={fmtDT(created)}>
                      <span className="time">{fmtDT(created)}</span>
                    </Tooltip>
                  </div>

                  <div className="body">{c.body}</div>

                  <div className="actions">
                    <Button
                      type="text"
                      icon={c.is_liked ? <LikeFilled /> : <LikeOutlined />}
                      aria-label={c.is_liked ? 'Bỏ thích' : 'Thích'}
                      onClick={() => onToggleLike && onToggleLike(c.id, !c.is_liked)}
                      disabled={!isLoggedIn}
                    >
                      {c.likes_count ?? 0}
                    </Button>

                    <Button
                      type="text"
                      icon={<MessageOutlined />}
                      aria-label="Trả lời"
                      onClick={() => setReplyOpen((m) => ({ ...m, [c.id]: !m[c.id] }))}
                      disabled={!isLoggedIn}
                    >
                      Trả lời
                    </Button>

                    {canDelete && (
                      <Popconfirm
                        title="Xoá bình luận này?"
                        okText="Xoá"
                        cancelText="Huỷ"
                        onConfirm={() => onDelete && onDelete(c.id)}
                      >
                        <Button type="text" danger icon={<DeleteOutlined />} aria-label="Xoá">
                          Xoá
                        </Button>
                      </Popconfirm>
                    )}
                  </div>

                  {/* Form trả lời */}
                  {replyOpen[c.id] && (
                    <div style={{ marginTop: 8 }}>
                      <TextArea
                        value={replyText[c.id] || ''}
                        onChange={(e) => setReplyText((m) => ({ ...m, [c.id]: e.target.value }))}
                        autoSize={{ minRows: 2, maxRows: 6 }}
                        maxLength={2000}
                        placeholder="Nhập trả lời…"
                        disabled={!isLoggedIn || !!replyBusy[c.id]}
                      />
                      <div style={{ marginTop: 6, display: 'flex', gap: 8 }}>
                        <Button
                          type="primary"
                          size="small"
                          loading={!!replyBusy[c.id]}
                          disabled={!isLoggedIn}
                          onClick={() => postReply(c)}
                        >
                          Gửi trả lời
                        </Button>
                        <Button size="small" onClick={() => setReplyOpen((m) => ({ ...m, [c.id]: false }))}>
                          Huỷ
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Replies */}
                  {!!(c.story_comments || []).length && (
                    <div className="replies">
                      {c.story_comments.map((r) => {
                        const rCreated = r.created_at || r.createdAt
                        const canDeleteReply = canDeleteBy(r.user_id)

                        return (
                          <div key={r.id} className="reply">
                            <div className="avatar">
                              <Avatar size={28} src={r.user?.avatar ? `${END_POINT}${r.user.avatar}` : undefined} alt={r.user?.username} />
                            </div>
                            <div className="content">
                              <div className="meta">
                                <span className="author">{r.user?.username || 'Ẩn danh'}</span>
                                <span className="dot">•</span>
                                <Tooltip title={fmtDT(rCreated)}>
                                  <span className="time">{fmtDT(rCreated)}</span>
                                </Tooltip>
                              </div>

                              <div className="body">{r.body}</div>

                              <div className="actions">
                                <Button
                                  type="text"
                                  icon={r.is_liked ? <LikeFilled /> : <LikeOutlined />}
                                  onClick={() => onToggleLike && onToggleLike(r.id, !r.is_liked)}
                                  disabled={!isLoggedIn}
                                >
                                  {r.likes_count ?? 0}
                                </Button>

                                {canDeleteReply && (
                                  <Popconfirm
                                    title="Xoá bình luận này?"
                                    okText="Xoá"
                                    cancelText="Huỷ"
                                    onConfirm={() => onDelete && onDelete(r.id)}
                                  >
                                    <Button type="text" danger icon={<DeleteOutlined />}>
                                      Xoá
                                    </Button>
                                  </Popconfirm>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </S.Item>
            )
          })}

          {hasMore && (
            <div className="load-more">
              <Button onClick={onLoadMore} loading={status === 'loading'}>
                Tải thêm bình luận
              </Button>
            </div>
          )}
        </S.List>
      )}
    </S.Wrap>
  )
}

export default CommentThread
