// src/pages/achievements/NutritionDetail.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ChevronLeft,
  Utensils,
  Calendar,
  User,
  Clock,
  Repeat,
  Flame,
  Beef,
  Wheat,
  Droplet,
  Edit3,
  Award,
  Heart,
  MessageCircle,
  Send,
  Trash2,
  Pencil,
  X
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import GlassCard from '../../components/GlassCard';
import { axiosInstance } from '../../lib/axios';
import { useAuth } from '../../contexts/AuthContext';

const AchievementNutritionDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth(); // Get current user
  const [nutrition, setNutrition] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Like states
  const [likes, setLikes] = useState({ total: 0, userLiked: false, users: [] });
  const [showLikesModal, setShowLikesModal] = useState(false);
  
  // Comment states
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentPage, setCommentPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const commentInputRef = useRef(null);
  const commentsContainerRef = useRef(null);

  useEffect(() => {
    fetchNutritionDetail();
  }, [id]);

  useEffect(() => {
    if (nutrition) {
      fetchLikes();
      fetchComments(1);
    }
  }, [nutrition]);

  const fetchNutritionDetail = async () => {
    try {
      const response = await axiosInstance.get(`/user-daily-routine/nutrition/${id}`);
      setNutrition(response.data);
    } catch (error) {
      console.error('Error fetching nutrition:', error);
      toast.error('Failed to load nutrition details');
      navigate('/achievements');
    } finally {
      setLoading(false);
    }
  };

  // ============ LIKES ============
  const fetchLikes = async () => {
    try {
      const response = await axiosInstance.get(`/likes/`, {
        params: { targetId: id, targetType: 'Nutrition' }
      });
      setLikes(response.data);
    } catch (error) {
      console.error('Error fetching likes:', error);
    }
  };

  const handleToggleLike = async () => {
    try {
      const response = await axiosInstance.post('/likes/', {
        targetId: id,
        targetType: 'Nutrition'
      });
      
      setLikes(prev => ({
        total: response.data.liked ? prev.total + 1 : prev.total - 1,
        userLiked: response.data.liked,
        users: prev.users
      }));
      
      // Refresh likes to get updated users list
      fetchLikes();
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to process like');
    }
  };

  // ============ COMMENTS ============
  const fetchComments = async (page = 1) => {
    setLoadingComments(true);
    try {
      const response = await axiosInstance.get(`/comments/`, {
        params: { targetId: id, targetType: 'Nutrition', page, limit: 5 }
      });
      
      if (page === 1) {
        setComments(response.data);
      } else {
        setComments(prev => [...prev, ...response.data]);
      }
      
      // If we got fewer than 5 comments, there are no more
      setHasMoreComments(response.data.length >= 5);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoadingComments(false);
    }
  }

  const loadMoreComments = () => {
    if (hasMoreComments && !loadingComments) {
      const nextPage = commentPage + 1;
      setCommentPage(nextPage);
      fetchComments(nextPage);
    }
  };

  const handleCreateComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() && !replyText.trim()) return;

    try {
      const response = await axiosInstance.post('/comments/', {
        targetId: id,
        targetType: 'Nutrition',
        text: replyTo ? replyText : newComment,
        parentComment: replyTo?._id || null
      });

      // Add user info to response
      const newCommentWithUser = {
        ...response.data,
        userId: {
          _id: user._id,
          userName: user.userName,
          avatar: user.avatar
        },
        replies: [],
        likeCount: 0,
        userLiked: false
      };

      if (replyTo) {
        // Add reply to nested structure
        setComments(prev => prev.map(comment => 
          comment._id === replyTo._id 
            ? { 
                ...comment, 
                replies: [...(comment.replies || []), newCommentWithUser]
              }
            : comment
        ));
        setReplyTo(null);
        setReplyText('');
        toast.success('Reply added');
      } else {
        // Add new top-level comment
        setComments(prev => [newCommentWithUser, ...prev]);
        setNewComment('');
        toast.success('Comment added');
      }
    } catch (error) {
      console.error('Error creating comment:', error);
      toast.error('Failed to add comment');
    }
  };

  const handleUpdateComment = async (commentId) => {
    if (!editText.trim()) return;

    try {
      const response = await axiosInstance.put(`/comments/${commentId}`, {
        text: editText
      });

      // Update in state
      const updateCommentInTree = (commentsList) => {
        return commentsList.map(c => {
          if (c._id === commentId) {
            return { ...c, text: response.data.text };
          }
          if (c.replies) {
            return { ...c, replies: updateCommentInTree(c.replies) };
          }
          return c;
        });
      };

      setComments(updateCommentInTree(comments));
      setEditingComment(null);
      setEditText('');
      toast.success('Comment updated');
    } catch (error) {
      console.error('Error updating comment:', error);
      toast.error('Failed to update comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      await axiosInstance.delete(`/comments/${commentId}`);

      // Remove from state
      const removeCommentFromTree = (commentsList) => {
        return commentsList.filter(c => {
          if (c._id === commentId) return false;
          if (c.replies) {
            c.replies = removeCommentFromTree(c.replies);
          }
          return true;
        });
      };

      setComments(removeCommentFromTree(comments));
      toast.success('Comment deleted');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  const handleToggleCommentLike = async (commentId) => {
    try {
      const response = await axiosInstance.post('/likes/', {
        targetId: commentId,
        targetType: 'Comment'
      });

      // Update like count in state
      const updateCommentLike = (commentsList) => {
        return commentsList.map(c => {
          if (c._id === commentId) {
            return {
              ...c,
              likeCount: response.data.liked ? c.likeCount + 1 : c.likeCount - 1,
              userLiked: response.data.liked
            };
          }
          if (c.replies) {
            return { ...c, replies: updateCommentLike(c.replies) };
          }
          return c;
        });
      };

      setComments(updateCommentLike(comments));
    } catch (error) {
      console.error('Error toggling comment like:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed':
        return 'var(--theme-success)';
      case 'Pending':
        return 'var(--theme-warning)';
      case 'Missed':
        return 'var(--theme-error)';
      default:
        return 'var(--theme-textMuted)';
    }
  };

  const getMealIcon = (mealType) => {
    switch(mealType) {
      case 'Breakfast':
        return '🍳';
      case 'Lunch':
        return '🥗';
      case 'Dinner':
        return '🍽️';
      case 'Snack':
        return '🍎';
      default:
        return '🍴';
    }
  };

  // Check if current user is the owner
  const isOwner = nutrition?.userId?._id === user?._id;

  // Likes Modal Component
  const LikesModal = () => {
    if (!showLikesModal) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }}>
        <GlassCard className="w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold" style={{ color: 'var(--theme-text)' }}>
              Likes ({likes.total})
            </h3>
            <button
              onClick={() => setShowLikesModal(false)}
              className="p-2 rounded-lg hover:bg-white/5"
            >
              <X size={20} style={{ color: 'var(--theme-textSecondary)' }} />
            </button>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {likes.users.map((likedUser) => (
              <div key={likedUser._id} className="flex items-center space-x-3 p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold">
                  {likedUser.avatar ? (
                    <img src={likedUser.avatar} alt={likedUser.userName} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    likedUser.userName?.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <p className="font-medium" style={{ color: 'var(--theme-text)' }}>{likedUser.userName}</p>
                  {likedUser._id === user?._id && (
                    <p className="text-xs" style={{ color: 'var(--theme-primary)' }}>You</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    );
  };

  // Comment Component
  const CommentItem = ({ comment, isReply = false }) => {
    const isCommentOwner = comment.userId?._id === user?._id;
    const [showReplies, setShowReplies] = useState(true);

    return (
      <div className={`${isReply ? 'ml-8 mt-3' : 'mb-4'}`}>
        <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)' }}>
          {/* Comment Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                {comment.userId?.avatar ? (
                  <img src={comment.userId.avatar} alt={comment.userId.userName} className="w-full h-full rounded-full object-cover" />
                ) : (
                  comment.userId?.userName?.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <p className="font-medium text-sm" style={{ color: 'var(--theme-text)' }}>
                  {comment.userId?.userName}
                  {comment.userId?._id === user?._id && (
                    <span className="ml-2 text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--theme-success)' }}>
                      You
                    </span>
                  )}
                </p>
                <p className="text-xs" style={{ color: 'var(--theme-textMuted)' }}>
                  {formatDate(comment.createdAt)}
                </p>
              </div>
            </div>

            {/* Comment Actions */}
            {isCommentOwner && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setEditingComment(comment._id);
                    setEditText(comment.text);
                  }}
                  className="p-1.5 rounded-lg hover:bg-white/5"
                >
                  <Pencil size={14} style={{ color: 'var(--theme-textSecondary)' }} />
                </button>
                <button
                  onClick={() => handleDeleteComment(comment._id)}
                  className="p-1.5 rounded-lg hover:bg-white/5"
                >
                  <Trash2 size={14} style={{ color: 'var(--theme-error)' }} />
                </button>
              </div>
            )}
          </div>

          {/* Comment Text or Edit Form */}
          {editingComment === comment._id ? (
            <div className="mt-2">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full p-3 rounded-lg focus:outline-none focus:ring-2"
                style={{ 
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--theme-border)',
                  color: 'var(--theme-text)'
                }}
                rows="2"
              />
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  onClick={() => {
                    setEditingComment(null);
                    setEditText('');
                  }}
                  className="px-3 py-1.5 rounded-lg text-sm"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateComment(comment._id)}
                  className="px-3 py-1.5 rounded-lg text-sm"
                  style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--theme-success)' }}
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-2 text-sm" style={{ color: 'var(--theme-textSecondary)' }}>
              {comment.text}
            </p>
          )}

          {/* Comment Footer */}
          <div className="flex items-center space-x-4 mt-3">
            <button
              onClick={() => handleToggleCommentLike(comment._id)}
              className="flex items-center space-x-1 text-sm"
              style={{ color: comment.userLiked ? 'var(--theme-error)' : 'var(--theme-textSecondary)' }}
            >
              <Heart size={14} fill={comment.userLiked ? 'var(--theme-error)' : 'none'} />
              <span>{comment.likeCount || 0}</span>
            </button>
            
            {!isReply && (
              <button
                onClick={() => {
                  setReplyTo(comment);
                  commentInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  setTimeout(() => {
                    const input = commentInputRef.current?.querySelector('input');
                    if (input) input.focus();
                  }, 300);
                }}
                className="text-sm"
                style={{ color: 'var(--theme-textSecondary)' }}
              >
                Reply
              </button>
            )}

            {comment.replies?.length > 0 && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="text-sm"
                style={{ color: 'var(--theme-primary)' }}
              >
                {showReplies ? 'Hide' : 'Show'} {comment.replies.length} replies
              </button>
            )}
          </div>

          {/* Replies */}
          {showReplies && comment.replies?.length > 0 && (
            <div className="mt-3 space-y-3">
              {comment.replies.map((reply) => (
                <CommentItem key={reply._id} comment={reply} isReply={true} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--theme-bg)' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!nutrition) return null;

  return (
    <div className="min-h-screen p-4 md:p-6" style={{ background: 'var(--theme-bg)' }}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl hover:bg-white/5 transition-colors"
              style={{ color: 'var(--theme-textSecondary)' }}
            >
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold gradient-text">Nutrition Achievement</h1>
          </div>
          {isOwner && (
            <div className="px-3 py-1.5 rounded-full text-sm" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--theme-success)' }}>
              Your Meal
            </div>
          )}
        </div>

        {/* Main Card */}
        <GlassCard className="p-6 mb-4">
          {/* User Info */}
          <div className="flex items-center justify-between mb-6 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div 
              className={`flex items-center space-x-3 ${nutrition.userId?._id === user?._id ? 'cursor-pointer' : ''}`}
              onClick={() => navigate(nutrition.userId?._id === user?._id ? '/profile' : `/user/${nutrition.userId?._id}`)}
            >
              <div className="p-3 rounded-full" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                <User size={24} style={{ color: 'var(--theme-success)' }} />
              </div>
              <div>
                <p className="text-sm" style={{ color: 'var(--theme-textMuted)' }}>Created by</p>
                <p className="text-lg font-semibold" style={{ color: 'var(--theme-text)' }}>
                  {nutrition.userId?.userName || 'Anonymous User'}
                  {nutrition.userId?._id === user?._id && (
                    <span className="ml-2 text-sm px-2 py-0.5 rounded-full" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--theme-success)' }}>
                      You
                    </span>
                  )}
                </p>
              </div>
            </div>
            {nutrition.userId?._id !== user?._id && (
              <button
                onClick={() => navigate(`/user/${nutrition.userId?._id}`)}
                className="px-4 py-2 rounded-xl text-sm font-medium"
                style={{ background: 'var(--theme-success)', color: 'white' }}
              >
                View Profile
              </button>
            )}
          </div>

          {/* Title and Meal Type */}
          <div className="mb-6 text-center">
            <div className="text-6xl mb-2">{getMealIcon(nutrition.mealType)}</div>
            <span className="inline-block px-4 py-1 rounded-full text-sm font-medium mb-3" style={{ background: 'rgba(255,255,255,0.05)' }}>
              {nutrition.mealType}
            </span>
            <h2 className="text-3xl font-bold" style={{ color: 'var(--theme-text)' }}>
              {nutrition.foodItem}
            </h2>
            {nutrition.quantity > 0 && (
              <p className="text-lg mt-2" style={{ color: 'var(--theme-textSecondary)' }}>
                Quantity: {nutrition.quantity}
              </p>
            )}
          </div>

          {/* Nutrition Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <Flame size={24} className="mx-auto mb-2" style={{ color: 'var(--theme-warning)' }} />
              <p className="text-2xl font-bold" style={{ color: 'var(--theme-text)' }}>{nutrition.calories}</p>
              <p className="text-sm" style={{ color: 'var(--theme-textMuted)' }}>Calories</p>
            </div>
            
            <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <Beef size={24} className="mx-auto mb-2" style={{ color: 'var(--theme-primary)' }} />
              <p className="text-2xl font-bold" style={{ color: 'var(--theme-text)' }}>{nutrition.protein}g</p>
              <p className="text-sm" style={{ color: 'var(--theme-textMuted)' }}>Protein</p>
            </div>
            
            <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <Wheat size={24} className="mx-auto mb-2" style={{ color: 'var(--theme-success)' }} />
              <p className="text-2xl font-bold" style={{ color: 'var(--theme-text)' }}>{nutrition.carbs}g</p>
              <p className="text-sm" style={{ color: 'var(--theme-textMuted)' }}>Carbs</p>
            </div>
            
            <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <Droplet size={24} className="mx-auto mb-2" style={{ color: 'var(--theme-error)' }} />
              <p className="text-2xl font-bold" style={{ color: 'var(--theme-text)' }}>{nutrition.fats}g</p>
              <p className="text-sm" style={{ color: 'var(--theme-textMuted)' }}>Fats</p>
            </div>
          </div>

          {/* Macros Progress */}
          <div className="mb-6 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <p className="text-sm mb-3" style={{ color: 'var(--theme-textMuted)' }}>Macronutrients Distribution</p>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span style={{ color: 'var(--theme-textSecondary)' }}>Protein</span>
                  <span style={{ color: 'var(--theme-text)' }}>{nutrition.protein}g</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <div 
                    className="h-full rounded-full" 
                    style={{ 
                      width: `${(nutrition.protein / (nutrition.protein + nutrition.carbs + nutrition.fats) * 100) || 0}%`,
                      background: 'var(--theme-primary)'
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span style={{ color: 'var(--theme-textSecondary)' }}>Carbs</span>
                  <span style={{ color: 'var(--theme-text)' }}>{nutrition.carbs}g</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <div 
                    className="h-full rounded-full" 
                    style={{ 
                      width: `${(nutrition.carbs / (nutrition.protein + nutrition.carbs + nutrition.fats) * 100) || 0}%`,
                      background: 'var(--theme-success)'
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span style={{ color: 'var(--theme-textSecondary)' }}>Fats</span>
                  <span style={{ color: 'var(--theme-text)' }}>{nutrition.fats}g</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <div 
                    className="h-full rounded-full" 
                    style={{ 
                      width: `${(nutrition.fats / (nutrition.protein + nutrition.carbs + nutrition.fats) * 100) || 0}%`,
                      background: 'var(--theme-error)'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Status and Schedule */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <p className="text-sm mb-2" style={{ color: 'var(--theme-textMuted)' }}>Status</p>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getStatusColor(nutrition.status) }} />
                <span className="text-lg font-medium" style={{ color: 'var(--theme-text)' }}>{nutrition.status}</span>
              </div>
            </div>

            {nutrition.alertTime && (
              <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <p className="text-sm mb-2" style={{ color: 'var(--theme-textMuted)' }}>Schedule</p>
                <div className="flex items-center space-x-2">
                  <Clock size={18} style={{ color: 'var(--theme-warning)' }} />
                  <span className="text-lg font-medium" style={{ color: 'var(--theme-text)' }}>
                    {new Date(nutrition.alertTime).toLocaleTimeString()}
                  </span>
                  {nutrition.alertRecurring !== 'once' && (
                    <>
                      <Repeat size={16} style={{ color: 'var(--theme-textMuted)' }} />
                      <span className="text-sm" style={{ color: 'var(--theme-textMuted)' }}>
                        {nutrition.alertRecurring}
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Date Info */}
          <div className="mt-6 pt-4 flex items-center justify-between" style={{ borderTop: '1px solid var(--theme-border)' }}>
            <div className="flex items-center space-x-2">
              <Calendar size={16} style={{ color: 'var(--theme-textMuted)' }} />
              <span className="text-sm" style={{ color: 'var(--theme-textMuted)' }}>
                Created: {formatDate(nutrition.createdAt)}
              </span>
            </div>
            {nutrition.updatedAt !== nutrition.createdAt && (
              <div className="flex items-center space-x-2">
                <Edit3 size={16} style={{ color: 'var(--theme-textMuted)' }} />
                <span className="text-sm" style={{ color: 'var(--theme-textMuted)' }}>
                  Updated: {formatDate(nutrition.updatedAt)}
                </span>
              </div>
            )}
          </div>

          {/* Share Badge */}
          <div className="mt-4 flex justify-center">
            <div className="flex items-center space-x-2 px-4 py-2 rounded-full" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
              <Award size={16} style={{ color: 'var(--theme-success)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--theme-success)' }}>
                Public Achievement
              </span>
            </div>
          </div>
        </GlassCard>

        {/* Likes & Comments Section */}
        <GlassCard className="p-6">
          {/* Like Button and Count */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleToggleLike}
              className="flex items-center space-x-3 px-4 py-2 rounded-xl transition-all hover:scale-105"
              style={{ 
                background: likes.userLiked ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255,255,255,0.03)',
                border: '1px solid var(--theme-border)'
              }}
            >
              <Heart 
                size={24} 
                style={{ 
                  color: likes.userLiked ? 'var(--theme-error)' : 'var(--theme-textSecondary)',
                  fill: likes.userLiked ? 'var(--theme-error)' : 'none'
                }} 
              />
              <span className="text-lg font-medium" style={{ color: 'var(--theme-text)' }}>
                {likes.total} {likes.total === 1 ? 'Like' : 'Likes'}
              </span>
            </button>
            
            {likes.total > 0 && (
              <button
                onClick={() => setShowLikesModal(true)}
                className="text-sm hover:underline"
                style={{ color: 'var(--theme-primary)' }}
              >
                View all
              </button>
            )}
          </div>

          {/* Comment Form */}
          <form onSubmit={handleCreateComment} className="mb-6" ref={commentInputRef}>
            <div className="flex space-x-3">
              <input
                type="text"
                value={replyTo ? replyText : newComment}
                onChange={(e) => replyTo ? setReplyText(e.target.value) : setNewComment(e.target.value)}
                placeholder={replyTo ? `Reply to ${replyTo.userId?.userName}...` : "Write a comment..."}
                className="flex-1 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 transition-all"
                style={{ 
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--theme-border)',
                  color: 'var(--theme-text)'
                }}
              />
              <button
                type="submit"
                disabled={replyTo ? !replyText.trim() : !newComment.trim()}
                className="p-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: 'var(--theme-success)'
                }}
              >
                <Send size={20} />
              </button>
            </div>
            {replyTo && (
              <div className="flex items-center justify-between mt-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <span className="text-sm" style={{ color: 'var(--theme-textSecondary)' }}>
                  Replying to <span style={{ color: 'var(--theme-success)' }}>@{replyTo.userId?.userName}</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setReplyTo(null);
                    setReplyText('');
                  }}
                  className="text-sm hover:underline"
                  style={{ color: 'var(--theme-error)' }}
                >
                  Cancel
                </button>
              </div>
            )}
          </form>

          {/* Comments List */}
          <div className="space-y-4" ref={commentsContainerRef} style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {loadingComments ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500 mx-auto"></div>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle size={40} className="mx-auto mb-3" style={{ color: 'var(--theme-textMuted)' }} />
                <p style={{ color: 'var(--theme-textMuted)' }}>No comments yet. Be the first to comment!</p>
              </div>
            ) : (
              <>
                {comments.map((comment) => (
                  <CommentItem key={comment._id} comment={comment} />
                ))}
                {hasMoreComments && (
                  <button
                    onClick={loadMoreComments}
                    className="w-full py-2 text-sm rounded-lg transition-colors"
                    style={{ color: 'var(--theme-primary)' }}
                  >
                    Load more comments...
                  </button>
                )}
              </>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Likes Modal */}
      <LikesModal />
    </div>
  );
};

export default AchievementNutritionDetail;