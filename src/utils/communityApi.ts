import { API_BASE } from './api';

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userLocation?: string;
  userLocation?: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: string;
  isLiked?: boolean;
}

export interface Comment {
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

export interface PublicUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
  location: string;
  totalDistance: number;
  bio: string;
  isFriend?: boolean;
}

// Get suggested users
export async function getSuggestedUsers(accessToken: string): Promise<PublicUser[]> {
  try {
    const response = await fetch(`${API_BASE}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      // Silent fail for optional endpoint
      return [];
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Response is not JSON:', contentType);
      return [];
    }

    const data = await response.json();
    return data.users || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

// Get all posts
export async function getPosts(accessToken: string): Promise<Post[]> {
  try {
    const response = await fetch(`${API_BASE}/posts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });

    // Check if response is ok before parsing
    if (!response.ok) {
      // If 404, it just means no posts exist yet - return empty array without error
      if (response.status === 404) {
        return [];
      }
      // Only log real errors (500s, etc) - 401s are handled by auth context
      if (response.status !== 404 && response.status !== 401) {
        console.error('Failed to fetch posts, status:', response.status);
      }
      return [];
    }

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Response is not JSON:', contentType);
      return [];
    }

    const data = await response.json();
    return data.posts || [];
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

// Create a new post
export async function createPost(
  accessToken: string,
  content: string,
  image?: string
): Promise<Post | null> {
  try {
    const response = await fetch(`${API_BASE}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({ content, image })
    });

    if (!response.ok) {
      if (response.status !== 401) {
        console.error('Failed to create post, status:', response.status);
      }
      return null;
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Response is not JSON:', contentType);
      return null;
    }

    const data = await response.json();
    return data.post;
  } catch (error) {
    console.error('Error creating post:', error);
    return null;
  }
}

// Like/Unlike a post
export async function togglePostLike(
  accessToken: string,
  postId: string
): Promise<{ isLiked: boolean; likesCount: number } | null> {
  try {
    const response = await fetch(`${API_BASE}/posts/${postId}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      if (response.status !== 401) {
        console.error('Failed to toggle like, status:', response.status);
      }
      return null;
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Response is not JSON:', contentType);
      return null;
    }

    const data = await response.json();
    return {
      isLiked: data.isLiked,
      likesCount: data.likesCount
    };
  } catch (error) {
    console.error('Error toggling post like:', error);
    return null;
  }
}

// Get comments for a post
export async function getComments(
  accessToken: string,
  postId: string
): Promise<Comment[]> {
  try {
    const response = await fetch(`${API_BASE}/posts/${postId}/comments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      if (response.status !== 401) {
        console.error('Failed to fetch comments, status:', response.status);
      }
      return [];
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Response is not JSON:', contentType);
      return [];
    }

    const data = await response.json();
    return data.comments || [];
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
}

// Add a comment
export async function addComment(
  accessToken: string,
  postId: string,
  content: string
): Promise<Comment | null> {
  try {
    const response = await fetch(`${API_BASE}/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({ content })
    });

    if (!response.ok) {
      if (response.status !== 401) {
        console.error('Failed to add comment, status:', response.status);
      }
      return null;
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Response is not JSON:', contentType);
      return null;
    }

    const data = await response.json();
    return data.comment;
  } catch (error) {
    console.error('Error adding comment:', error);
    return null;
  }
}

// Like/Unlike a comment
export async function toggleCommentLike(
  accessToken: string,
  commentId: string
): Promise<{ isLiked: boolean; likesCount: number } | null> {
  try {
    const response = await fetch(`${API_BASE}/comments/${commentId}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      if (response.status !== 401) {
        console.error('Failed to toggle comment like, status:', response.status);
      }
      return null;
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Response is not JSON:', contentType);
      return null;
    }

    const data = await response.json();
    return {
      isLiked: data.isLiked,
      likesCount: data.likesCount
    };
  } catch (error) {
    console.error('Error toggling comment like:', error);
    return null;
  }
}

// Delete a post
export async function deletePost(
  accessToken: string,
  postId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    return response.ok;
  } catch (error) {
    console.error('Error deleting post:', error);
    return false;
  }
}

// Delete a comment
export async function deleteComment(
  accessToken: string,
  postId: string,
  commentId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/posts/${postId}/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    return response.ok;
  } catch (error) {
    console.error('Error deleting comment:', error);
    return false;
  }
}

// Get user profile
export async function getUserProfile(
  accessToken: string,
  userId: string
): Promise<PublicUser | null> {
  try {
    const response = await fetch(`${API_BASE}/users/${userId}/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

// Follow a user
export async function followUser(
  accessToken: string,
  userId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/users/${userId}/follow`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });

    return response.ok;
  } catch (error) {
    console.error('Error following user:', error);
    return false;
  }
}

// Unfollow a user
export async function unfollowUser(
  accessToken: string,
  userId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/users/${userId}/follow`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });

    return response.ok;
  } catch (error) {
    console.error('Error unfollowing user:', error);
    return false;
  }
}

// Get followed users (friends)
export async function getFollowedUsers(
  accessToken: string
): Promise<PublicUser[]> {
  try {
    const response = await fetch(`${API_BASE}/user/following`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.users || [];
  } catch (error) {
    console.error('Error fetching followed users:', error);
    return [];
  }
}