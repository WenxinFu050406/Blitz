import { useState, useEffect } from 'react';
import { ArrowLeft, Heart, MessageCircle, Send, Flag, MoreVertical } from 'lucide-react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { currentUser } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import * as communityApi from '../utils/communityApi';

interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  likes: number;
  timestamp: string;
  isLiked?: boolean;
}

interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: string;
  isLiked?: boolean;
}

interface PostDetailProps {
  post: Post;
  onBack: () => void;
  onLikePost: (postId: string) => void;
  onCommentLike: (commentId: string) => void;
}

export function PostDetail({ post, onBack, onLikePost, onCommentLike }: PostDetailProps) {
  const { currentUser: authUser, accessToken } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [reportingComment, setReportingComment] = useState<string | null>(null);
  const [isLoadingComments, setIsLoadingComments] = useState(true);

  // Load comments from API
  useEffect(() => {
    if (accessToken && post.id) {
      loadComments();
    }
  }, [accessToken, post.id]);

  const loadComments = async () => {
    if (!accessToken) return;
    
    setIsLoadingComments(true);
    const fetchedComments = await communityApi.getComments(accessToken, post.id);
    setComments(fetchedComments);
    setIsLoadingComments(false);
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !accessToken) return;

    const comment = await communityApi.addComment(accessToken, post.id, newComment);
    
    if (comment) {
      setComments([...comments, comment]);
      setNewComment('');
    }
  };

  const handleCommentLike = async (commentId: string) => {
    if (!accessToken) return;

    // Optimistic update
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          isLiked: !comment.isLiked,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
        };
      }
      return comment;
    }));

    // API call
    const result = await communityApi.toggleCommentLike(accessToken, commentId);
    
    // If API call fails, revert the optimistic update
    if (!result) {
      setComments(comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes + 1 : comment.likes - 1,
          };
        }
        return comment;
      }));
    }
  };

  const handleReport = (commentId: string) => {
    setReportingComment(commentId);
    setTimeout(() => {
      setReportingComment(null);
      // Show success message (simplified)
      alert('Comment reported. Thank you for helping keep our community safe.');
    }, 500);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-slate-100 bg-white sticky top-0 z-10">
        <button
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-base">Post</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {/* Post */}
        <div className="border-b border-slate-100 bg-white">
          {/* User Info */}
          <div className="p-4 flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-slate-300 to-slate-400 rounded-full flex items-center justify-center text-lg">
              {post.userAvatar}
            </div>
            <div className="flex-1">
              <p className="text-sm">{post.userName}</p>
              <p className="text-xs text-slate-400">{post.timestamp}</p>
            </div>
            <button className="text-slate-300 hover:text-slate-500">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-4 pb-3">
            <p className="text-sm leading-relaxed">{post.content}</p>
          </div>

          {/* Image */}
          {post.image && (
            <ImageWithFallback
              src={post.image}
              alt="Post"
              className="w-full h-80 object-cover"
            />
          )}

          {/* Stats */}
          <div className="px-4 py-3 flex items-center gap-4 text-xs text-slate-500">
            <span>{post.likes} likes</span>
            <span>{comments.length} comments</span>
          </div>

          {/* Actions */}
          <div className="px-4 pb-3 flex items-center gap-5 border-t border-slate-50 pt-3">
            <button
              onClick={() => onLikePost(post.id)}
              className={`flex items-center gap-2 transition-colors ${
                post.isLiked ? 'text-red-500' : 'text-slate-500 hover:text-red-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm">Like</span>
            </button>
            <button className="flex items-center gap-2 text-slate-500 hover:text-cyan-500 transition-colors">
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm">Comment</span>
            </button>
            <button className="ml-auto text-slate-400 hover:text-cyan-500 transition-colors">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <div className="p-4 space-y-4">
          <h3 className="text-sm">Comments ({comments.length})</h3>

          {isLoadingComments ? (
            <p className="text-sm text-slate-500">Loading comments...</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                {/* Avatar */}
                <div className="w-9 h-9 bg-gradient-to-br from-slate-300 to-slate-400 rounded-full flex items-center justify-center text-base flex-shrink-0">
                  {comment.userAvatar}
                </div>

                {/* Comment Content */}
                <div className="flex-1">
                  <div className="bg-slate-50 rounded-2xl px-4 py-3">
                    <p className="text-sm">{comment.userName}</p>
                    <p className="text-sm text-slate-700 mt-1">{comment.content}</p>
                  </div>

                  {/* Comment Actions */}
                  <div className="flex items-center gap-4 mt-2 px-2">
                    <button
                      onClick={() => handleCommentLike(comment.id)}
                      className={`flex items-center gap-1 text-xs transition-colors ${
                        comment.isLiked ? 'text-red-500' : 'text-slate-500 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${comment.isLiked ? 'fill-current' : ''}`} />
                      <span>{comment.likes > 0 ? comment.likes : 'Like'}</span>
                    </button>
                    <button className="text-xs text-slate-500 hover:text-cyan-500">
                      Reply
                    </button>
                    <button
                      onClick={() => handleReport(comment.id)}
                      className={`flex items-center gap-1 text-xs transition-colors ${
                        reportingComment === comment.id
                          ? 'text-orange-500'
                          : 'text-slate-400 hover:text-orange-500'
                      }`}
                    >
                      <Flag className="w-3.5 h-3.5" />
                      <span>{reportingComment === comment.id ? 'Reporting...' : 'Report'}</span>
                    </button>
                    <span className="text-xs text-slate-400 ml-auto">{comment.timestamp}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Comment Input */}
      <div className="border-t border-slate-100 p-4 bg-white sticky bottom-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full flex items-center justify-center text-base flex-shrink-0">
            {currentUser.avatar}
          </div>
          <Input
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddComment();
              }
            }}
            className="flex-1"
          />
          <button
            onClick={handleAddComment}
            disabled={!newComment.trim()}
            className="p-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg hover:from-cyan-600 hover:to-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}