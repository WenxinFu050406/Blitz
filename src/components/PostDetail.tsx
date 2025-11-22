import { useState, useEffect } from 'react';
import { ArrowLeft, Heart, MessageCircle, Send, Flag, MoreVertical, Trash2 } from 'lucide-react';
import { Input } from './ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ImageWithFallback } from './figma/ImageWithFallback';
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
  onPostDeleted: () => void;
}

export function PostDetail({ post, onBack, onLikePost, onCommentLike, onPostDeleted }: PostDetailProps) {
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

  const handleDeletePost = async () => {
    // Use setTimeout to ensure the dropdown closes or doesn't interfere with the confirm dialog
    setTimeout(async () => {
      if (!accessToken || !window.confirm('Are you sure you want to delete this post?')) return;
      
      const success = await communityApi.deletePost(accessToken, post.id);
      if (success) {
        onPostDeleted();
      } else {
        alert('Failed to delete post. Please try again.');
      }
    }, 100);
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!accessToken || !confirm('Are you sure you want to delete this comment?')) return;
    
    const success = await communityApi.deleteComment(accessToken, post.id, commentId);
    if (success) {
      setComments(comments.filter(c => c.id !== commentId));
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
    <div className="flex flex-col h-full bg-background text-foreground">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border bg-card sticky top-0 z-10">
        <button
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h2 className="text-base text-foreground">Post</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-background">
        {/* Post */}
        <div className="border-b border-border bg-card">
          {/* User Info */}
          <div className="p-4 flex items-center gap-3">
            <div className="w-11 h-11 bg-secondary rounded-full flex items-center justify-center text-lg border border-border overflow-hidden">
              {post.userAvatar?.startsWith('http') || post.userAvatar?.startsWith('/') ? (
                <img src={post.userAvatar} alt={post.userName} className="w-full h-full object-cover" />
              ) : (
                post.userAvatar
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{post.userName}</p>
              <p className="text-xs text-muted-foreground">{post.timestamp}</p>
            </div>
            {authUser?.id === post.userId ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-muted-foreground hover:text-foreground p-1">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    className="text-red-500 focus:text-red-500 cursor-pointer"
                    onSelect={(e) => {
                      e.preventDefault();
                      handleDeletePost();
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Post
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button className="text-muted-foreground hover:text-foreground">
                <MoreVertical className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Content */}
          <div className="px-4 pb-3">
            <p className="text-sm leading-relaxed text-foreground">{post.content}</p>
          </div>

          {/* Image */}
          {post.image && (
            <ImageWithFallback
              src={post.image}
              alt="Post"
              className="w-full h-80 object-cover bg-muted"
            />
          )}

          {/* Stats */}
          <div className="px-4 py-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span>{post.likes} likes</span>
            <span>{comments.length} comments</span>
          </div>

          {/* Actions */}
          <div className="px-4 pb-3 flex items-center gap-5 border-t border-border pt-3">
            <button
              onClick={() => onLikePost(post.id)}
              className={`flex items-center gap-2 transition-colors ${
                post.isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm">Like</span>
            </button>
            <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm">Comment</span>
            </button>
            <button className="ml-auto text-muted-foreground hover:text-primary transition-colors">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <div className="p-4 space-y-6 bg-background pb-20">
          <h3 className="text-sm text-foreground font-medium">Comments ({comments.length})</h3>

          {isLoadingComments ? (
            <p className="text-sm text-muted-foreground">Loading comments...</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 items-start">
                {/* Avatar */}
                <div className="w-9 h-9 bg-secondary rounded-full flex items-center justify-center text-base flex-shrink-0 border border-border overflow-hidden mt-1">
                  {comment.userAvatar?.startsWith('http') || comment.userAvatar?.startsWith('/') ? (
                    <img src={comment.userAvatar} alt={comment.userName} className="w-full h-full object-cover" />
                  ) : (
                    comment.userAvatar
                  )}
                </div>

                {/* Comment Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between mb-1">
                    <p className="text-sm font-medium text-foreground truncate mr-2">{comment.userName}</p>
                    <span className="text-xs text-muted-foreground flex-shrink-0">{comment.timestamp}</span>
                  </div>
                  
                  <div className="bg-secondary/30 rounded-2xl rounded-tl-none px-4 py-2 border border-border inline-block max-w-full">
                    <p className="text-sm text-foreground break-words">{comment.content}</p>
                  </div>

                  {/* Comment Actions */}
                  <div className="flex items-center gap-4 mt-1 px-1">
                    <button
                      onClick={() => handleCommentLike(comment.id)}
                      className={`flex items-center gap-1 text-xs transition-colors ${
                        comment.isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${comment.isLiked ? 'fill-current' : ''}`} />
                      <span>{comment.likes > 0 ? comment.likes : 'Like'}</span>
                    </button>
                    <button className="text-xs text-muted-foreground hover:text-primary transition-colors">
                      Reply
                    </button>
                    {authUser?.id === comment.userId && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-xs text-muted-foreground hover:text-red-500 transition-colors"
                      >
                        Delete
                      </button>
                    )}
                    <button
                      onClick={() => handleReport(comment.id)}
                      className={`flex items-center gap-1 text-xs transition-colors ${
                        reportingComment === comment.id
                          ? 'text-orange-500'
                          : 'text-muted-foreground hover:text-orange-500'
                      }`}
                    >
                      <Flag className="w-3.5 h-3.5" />
                      <span>{reportingComment === comment.id ? 'Reporting...' : 'Report'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Comment Input */}
      <div className="border-t border-border p-4 bg-card sticky bottom-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-secondary rounded-full flex items-center justify-center text-base flex-shrink-0 border border-border overflow-hidden">
            {authUser?.avatar?.startsWith('http') || authUser?.avatar?.startsWith('/') ? (
              <img src={authUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              authUser?.avatar || '👤'
            )}
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
            className="flex-1 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
          />
          <button
            onClick={handleAddComment}
            disabled={!newComment.trim()}
            className="p-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}