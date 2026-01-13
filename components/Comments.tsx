import React, { useState } from 'react';

interface Comment {
  id: string;
  username: string;
  avatar?: string;
  text: string;
  timestamp: string;
  likes: number;
  replies?: Comment[];
}

interface CommentsProps {
  projectId: string;
  comments: Comment[];
  onAddComment: (text: string) => void;
}

export const Comments: React.FC<CommentsProps> = ({ projectId, comments, onAddComment }) => {
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment('');
      setReplyTo(null);
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="space-y-4">
      {/* Comment Input */}
      <form onSubmit={handleSubmit} className="bg-slate-800/50 rounded-xl p-4">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-slate-400">person</span>
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full bg-slate-800 text-white rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary resize-none text-sm"
              rows={2}
              maxLength={500}
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-slate-500">{newComment.length}/500</span>
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="px-4 py-2 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Post Comment
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-3">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-slate-800 rounded-xl p-4">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-slate-400">person</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm text-white">{comment.username}</span>
                  <span className="text-xs text-slate-500">{formatTimeAgo(comment.timestamp)}</span>
                </div>
                <p className="text-sm text-slate-300 mb-2">{comment.text}</p>
                <div className="flex items-center gap-4">
                  <button className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors">
                    <span className="material-symbols-outlined text-sm">favorite_border</span>
                    {comment.likes > 0 ? comment.likes : 'Like'}
                  </button>
                  <button
                    onClick={() => setReplyTo(comment.id)}
                    className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">reply</span>
                    Reply
                  </button>
                </div>
                
                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-3 space-y-2 pl-4 border-l-2 border-slate-700">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                          <span className="material-symbols-outlined text-slate-400 text-sm">person</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-xs text-white">{reply.username}</span>
                            <span className="text-xs text-slate-500">{formatTimeAgo(reply.timestamp)}</span>
                          </div>
                          <p className="text-xs text-slate-300">{reply.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <span className="material-symbols-outlined text-4xl mb-2 block">chat_bubble_outline</span>
            <p className="text-sm">No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  );
};
