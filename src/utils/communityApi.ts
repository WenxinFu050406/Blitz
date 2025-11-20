import { projectId } from './supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/server/make-server-8ab7634a`;

export interface Post {
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
      console.error('Failed to fetch posts, status:', response.status);
      console.error('This usually means no posts exist yet. Run the setup to create test users and sample posts.');
      console.error('Visit /setup.html or click "Open Setup Guide" on the login page.');
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
      console.error('Failed to create post, status:', response.status);
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
      console.error('Failed to toggle like, status:', response.status);
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
      console.error('Failed to fetch comments, status:', response.status);
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
      console.error('Failed to add comment, status:', response.status);
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
      console.error('Failed to toggle comment like, status:', response.status);
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