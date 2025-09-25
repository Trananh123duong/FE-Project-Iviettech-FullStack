import {
  DeleteOutlined,
  LikeFilled,
  LikeOutlined,
  LoginOutlined,
  MessageOutlined,
  SendOutlined,
} from '@ant-design/icons'
import { fmtDT } from '@utils/date'
import {
  Alert,
  Avatar,
  Button,
  Empty,
  Input,
  Popconfirm,
  Skeleton,
  Tooltip,
  Typography,
  message,
} from 'antd'
import { useCallback, useMemo, useState } from 'react'
import { Wrap } from './styles'

const { Text } = Typography
const { TextArea } = Input

/**
 * CommentThread
 * UI hiển thị danh sách bình luận + soạn thảo bình luận/reply.
 * - Không biết logic API; chỉ nhận data & callback từ parent (StoryDetail/ChapterDetail).
 *
 * Props:
 *  - comments: Array các bình luận (bao gồm replies tại c.story_comments hoặc c.replies)
 *  - meta: { page, totalPages, total, limit }
 *  - status: 'idle' | 'loading' | 'succeeded' | 'failed'
 *  - error: string | null
 *  - isLoggedIn: boolean
 *  - currentUser: thông tin user hiện tại (để check quyền xoá)
 *  - onPostComment(body)
 *  - onPostReply(rootComment, body)
 *  - onToggleLike(commentId)
 *  - onDeleteComment(commentId)
 *  - onLoadMore()
 *  - posting: boolean (đang gửi bình luận mới)
 */
export default function CommentThread({
  comments = [],
  meta = {},
  status = 'idle',
  error = null,

  isLoggedIn = false,
  currentUser = null,

  onPostComment,
  onPostReply,
  onToggleLike,
  onDeleteComment,
  onLoadMore,

  posting = false,
}) {
  /* ===== State soạn thảo ===== */
  const [newText, setNewText] = useState('')
  const [replyOpen, setReplyOpen] = useState({})   // { [commentId]: boolean }
  const [replyText, setReplyText] = useState({})   // { [commentId]: string }
  const [replyBusy, setReplyBusy] = useState({})   // { [commentId]: boolean }

  /* ===== Tính toán phân trang ===== */
  const page       = Number(meta?.page || 1)
  const totalPages = Number(meta?.totalPages || 1)
  const hasMore    = page < totalPages

  /* ===== Helpers ===== */
  const safeReplies = (c) => c?.story_comments || c?.replies || []

  const canDelete = useCallback(
    (cmt) => {
      const userId = currentUser?.id
      return !!userId && (userId === cmt?.user_id || !!currentUser?.role)
    },
    [currentUser]
  )

  const toggleReply = (cid) => setReplyOpen((m) => ({ ...m, [cid]: !m[cid] }))
  const changeReplyText = (cid, val) => setReplyText((m) => ({ ...m, [cid]: val }))

  /* ===== Handlers ===== */
  const submitComment = async () => {
    if (!isLoggedIn) return message.info('Bạn cần đăng nhập để bình luận.')
    const body = String(newText || '').trim()
    if (!body) return
    try {
      await onPostComment?.(body)
      setNewText('')
    } catch (e) {
      message.error(e?.message || 'Không thể đăng bình luận')
    }
  }

  const submitReply = async (root) => {
    if (!isLoggedIn) return message.info('Bạn cần đăng nhập để trả lời.')
    const body = String(replyText[root.id] || '').trim()
    if (!body) return
    try {
      setReplyBusy((m) => ({ ...m, [root.id]: true }))
      await onPostReply?.(root, body)
      setReplyText((m) => ({ ...m, [root.id]: '' }))
      setReplyOpen((m) => ({ ...m, [root.id]: false }))
    } catch (e) {
      message.error(e?.message || 'Không thể gửi trả lời')
    } finally {
      setReplyBusy((m) => ({ ...m, [root.id]: false }))
    }
  }

  const like = (id) => onToggleLike?.(id)
  const del  = (id) => onDeleteComment?.(id)
  const loadMore = () => onLoadMore?.()

  const showEmpty = useMemo(() => {
    if (status === 'loading' && (comments?.length ?? 0) === 0) return false
    if (error) return true
    return (comments?.length ?? 0) === 0
  }, [status, comments, error])

  /* ===== Render ===== */
  return (
    <Wrap>
      {/* Header + tổng số bình luận */}
      <div className="header">
        <Text strong>Bình luận</Text>
        {meta?.total != null && <span className="count">({meta.total} bình luận)</span>}
      </div>

      {/* Nhắc đăng nhập */}
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
      <div className="form">
        <TextArea
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder={isLoggedIn ? 'Nhập bình luận của bạn...' : 'Đăng nhập để bình luận'}
          autoSize={{ minRows: 3, maxRows: 6 }}
          disabled={!isLoggedIn || posting}
          maxLength={2000}
        />
        <div className="actions">
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={submitComment}
            loading={posting}
            disabled={!isLoggedIn || !newText.trim()}
          >
            Gửi
          </Button>
        </div>
      </div>

      {/* Danh sách bình luận */}
      {status === 'loading' && (comments?.length ?? 0) === 0 ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : showEmpty ? (
        <Empty description={error ? 'Không tải được bình luận' : 'Chưa có bình luận'} />
      ) : (
        <>
          {(comments || []).map((c) => (
            <div key={c.id} className="item">
              <div className="top">
                <Avatar size={36} src={c.user?.avatar} alt={c.user?.username} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="meta">
                    <span className="author">{c.user?.username || 'Ẩn danh'}</span>
                    <span className="dot">•</span>
                    <Tooltip title={fmtDT(c.created_at || c.createdAt)}>
                      <span className="time">{fmtDT(c.created_at || c.createdAt)}</span>
                    </Tooltip>
                  </div>

                  <div className="body">{c.body}</div>

                  <div className="actions">
                    <Button
                      type="text"
                      icon={c.is_liked ? <LikeFilled /> : <LikeOutlined />}
                      onClick={() => like?.(c.id)}
                      disabled={!isLoggedIn}
                    >
                      {c.likes_count ?? 0}
                    </Button>

                    <Button
                      type="text"
                      icon={<MessageOutlined />}
                      onClick={() => toggleReply(c.id)}
                      disabled={!isLoggedIn}
                    >
                      Trả lời
                    </Button>

                    {canDelete(c) && (
                      <Popconfirm
                        title="Xoá bình luận này?"
                        okText="Xoá"
                        cancelText="Huỷ"
                        onConfirm={() => del?.(c.id)}
                      >
                        <Button type="text" danger icon={<DeleteOutlined />}>
                          Xoá
                        </Button>
                      </Popconfirm>
                    )}
                  </div>

                  {/* Form trả lời */}
                  {replyOpen[c.id] && (
                    <div className="reply-form">
                      <TextArea
                        value={replyText[c.id] || ''}
                        onChange={(e) => changeReplyText(c.id, e.target.value)}
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
                          onClick={() => submitReply(c)}
                        >
                          Gửi trả lời
                        </Button>
                        <Button size="small" onClick={() => toggleReply(c.id)}>Huỷ</Button>
                      </div>
                    </div>
                  )}

                  {/* Replies (accepts both story_comments | replies) */}
                  {!!safeReplies(c).length && (
                    <div className="replies">
                      {safeReplies(c).map((r) => (
                        <div key={r.id} className="reply">
                          <Avatar size={28} src={r.user?.avatar} alt={r.user?.username} />
                          <div style={{ flex: 1 }}>
                            <div className="meta">
                              <span className="author">{r.user?.username || 'Ẩn danh'}</span>
                              <span className="dot">•</span>
                              <Tooltip title={fmtDT(r.created_at || r.createdAt)}>
                                <span className="time">{fmtDT(r.created_at || r.createdAt)}</span>
                              </Tooltip>
                            </div>
                            <div className="body">{r.body}</div>
                            <div className="actions">
                              <Button
                                type="text"
                                icon={r.is_liked ? <LikeFilled /> : <LikeOutlined />}
                                onClick={() => like?.(r.id)}
                                disabled={!isLoggedIn}
                              >
                                {r.likes_count ?? 0}
                              </Button>

                              {(currentUser?.id &&
                                (currentUser.id === r.user_id || currentUser?.role)) && (
                                <Popconfirm
                                  title="Xoá bình luận này?"
                                  okText="Xoá"
                                  cancelText="Huỷ"
                                  onConfirm={() => del?.(r.id)}
                                >
                                  <Button type="text" danger icon={<DeleteOutlined />}>
                                    Xoá
                                  </Button>
                                </Popconfirm>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {hasMore && (
            <div className="load-more">
              <Button onClick={loadMore} loading={status === 'loading'}>
                Tải thêm bình luận
              </Button>
            </div>
          )}
        </>
      )}
    </Wrap>
  )
}
