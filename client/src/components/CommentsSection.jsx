import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function CommentsSection({ articleId, comments, setComments, showToast }) {
  const { token, user } = useAuth()
  const [commentText, setCommentText] = useState('')
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyText, setReplyText] = useState('')

  const handleComment = async () => {
    if (!token) { if (showToast) showToast('Login to comment'); return }
    if (!commentText.trim()) return

    if (!articleId) {
      setComments(prev => [...prev, { _id: Date.now(), userName: user?.name || 'You', text: commentText, replies: [], createdAt: new Date() }])
      setCommentText('')
      if (showToast) showToast('Comment added!')
      return
    }

    try {
      const res = await fetch(`/api/engage/${articleId}/comment`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: commentText })
      })
      const d = await res.json()
      setComments(d.comments || [])
      setCommentText('')
      if (showToast) showToast('Comment added!')
    } catch (err) { }
  }

  const handleReply = async (commentId) => {
    if (!token) { if (showToast) showToast('Login to reply'); return }
    if (!replyText.trim()) return

    if (!articleId) {
      setComments(prev => prev.map(c =>
        (c._id === commentId || c._id?.toString() === commentId)
          ? { ...c, replies: [...(c.replies || []), { userName: user?.name || 'You', text: replyText, createdAt: new Date() }] }
          : c
      ))
      setReplyText('')
      setReplyingTo(null)
      if (showToast) showToast('Reply added!')
      return
    }

    try {
      const res = await fetch(`/api/engage/${articleId}/comment/${commentId}/reply`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: replyText })
      })
      const d = await res.json()
      setComments(d.comments || [])
      setReplyText('')
      setReplyingTo(null)
      if (showToast) showToast('Reply added!')
    } catch (err) { }
  }

  return (
    <div className="comments-section">
      <h3 className="comments-title">
        <i className="fas fa-comments" /> Comments ({comments.length})
      </h3>

      <div className="comment-input-row">
        <input
          className="comment-input"
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleComment()}
        />
        <button className="comment-send-btn" onClick={handleComment}>
          <i className="fas fa-paper-plane" />
        </button>
      </div>

      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="no-comments">No comments yet. Be the first!</p>
        ) : (
          comments.map((c) => (
            <div key={c._id || Math.random()} className="comment-thread">
              <div className="comment-item">
                <div className="comment-avatar">{c.userName?.charAt(0) || 'U'}</div>
                <div className="comment-body">
                  <span className="comment-author">{c.userName || 'User'}</span>
                  <p className="comment-text">{c.text}</p>
                  <div className="comment-footer">
                    <span className="comment-time">
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Just now'}
                    </span>
                    <button
                      className="comment-reply-btn"
                      onClick={() => { setReplyingTo(replyingTo === c._id ? null : c._id); setReplyText('') }}
                    >
                      <i className="fas fa-reply" /> Reply
                    </button>
                  </div>
                </div>
              </div>

              {c.replies && c.replies.length > 0 && (
                <div className="replies-list">
                  {c.replies.map((r, ri) => (
                    <div key={r._id || ri} className="comment-item reply-item">
                      <div className="comment-avatar reply-avatar">{r.userName?.charAt(0) || 'U'}</div>
                      <div className="comment-body">
                        <span className="comment-author">{r.userName || 'User'}</span>
                        <p className="comment-text">{r.text}</p>
                        <span className="comment-time">
                          {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Just now'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {replyingTo === c._id && (
                <div className="reply-input-row">
                  <input
                    className="comment-input reply-input-field"
                    placeholder={`Reply to ${c.userName}...`}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleReply(c._id)}
                    autoFocus
                  />
                  <button className="comment-send-btn" onClick={() => handleReply(c._id)}>
                    <i className="fas fa-paper-plane" />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
