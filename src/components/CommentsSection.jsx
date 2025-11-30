import { useState } from 'react';
import { useComments } from '../hooks/useComments';
import { FaTrash, FaPencil, FaCheck, FaXmark } from 'react-icons/fa6';

export default function CommentsSection({ movieId, user }) {
  const { comments, loading, error, addComment, updateComment, deleteComment } = useComments(movieId);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [submitError, setSubmitError] = useState(null);

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      setSubmitError('Comment cannot be empty');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const success = await addComment(newComment, user?.id);
    setIsSubmitting(false);

    if (success) {
      setNewComment('');
    } else {
      setSubmitError('Failed to post comment');
    }
  };

  const handleEditStart = (comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditContent('');
  };

  const handleEditSave = async (commentId) => {
    setIsSubmitting(true);
    const success = await updateComment(commentId, editContent);
    setIsSubmitting(false);

    if (success) {
      setEditingId(null);
      setEditContent('');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (confirm('Are you sure you want to delete this comment?')) {
      setIsSubmitting(true);
      await deleteComment(commentId);
      setIsSubmitting(false);
    }
  };

  const getDisplayName = (comment) => {
    return comment.auth_users?.raw_user_meta_data?.full_name 
        || comment.auth_users?.email?.split('@')[0] 
        || 'Anonymous User';
    };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isCommentAuthor = (comment) => user?.id === comment.user_id;

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">Comments</h2>
      <div className="bg-gray-800 rounded-lg p-4 sm:p-6">
        <div className="mb-8">
          <textarea
            placeholder={user ? "Share your thoughts about this movie..." : "You must log in to comment."}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full bg-gray-700 text-white rounded p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50"
            rows="4"
            disabled={!user || isSubmitting}
            maxLength={500}
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">
              {newComment.length}/500 characters
            </span>
            <button
              onClick={handleAddComment}
              className={`px-4 py-2 rounded font-semibold text-white transition ${
                !user || isSubmitting || !newComment.trim()
                  ? 'bg-blue-400 cursor-not-allowed opacity-50'
                  : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
              }`}
              disabled={!user || isSubmitting || !newComment.trim()}
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
          {submitError && <p className="mt-2 text-red-400 text-sm">{submitError}</p>}
          {!user && (
            <p className="mt-2 text-blue-300 text-sm">
              <a href="/signin" className="underline hover:text-blue-200">
                Sign in
              </a>
              {' '}to comment on movies.
            </p>
          )}
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {loading && !comments.length && (
            <p className="text-gray-400 text-center py-4">Loading comments...</p>
          )}

          {error && (
            <p className="text-red-400 text-sm text-center py-4">
              Error loading comments: {error}
            </p>
          )}

          {!loading && comments.length === 0 && (
            <p className="text-gray-400 text-center py-4">
              No comments yet. Be the first to comment!
            </p>
          )}

          {comments.map((comment) => (
            <div key={comment.id} className="bg-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-white">{getDisplayName(comment)}</p>
                  <p className="text-xs text-gray-400">
                    {formatDate(comment.created_at)}
                    {comment.updated_at !== comment.created_at && ' (edited)'}
                  </p>
                </div>

                {isCommentAuthor(comment) && (
                  <div className="flex gap-2">
                    {editingId !== comment.id ? (
                      <>
                        <button
                          onClick={() => handleEditStart(comment)}
                          className="text-blue-400 hover:text-blue-300 transition"
                          title="Edit comment"
                        >
                          <FaPencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-red-400 hover:text-red-300 transition"
                          disabled={isSubmitting}
                          title="Delete comment"
                        >
                          <FaTrash size={16} />
                        </button>
                      </>
                    ) : null}
                  </div>
                )}
              </div>

              {editingId === comment.id ? (
                <div className="space-y-2">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full bg-gray-600 text-white rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    rows="3"
                    maxLength={500}
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => handleEditSave(comment.id)}
                      className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm text-white transition"
                      disabled={isSubmitting}
                    >
                      <FaCheck size={14} /> Save
                    </button>
                    <button
                      onClick={handleEditCancel}
                      className="flex items-center gap-1 px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm text-white transition"
                      disabled={isSubmitting}
                    >
                      <FaXmark size={14} /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-100 leading-relaxed whitespace-pre-wrap break-words">
                  {comment.content}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
