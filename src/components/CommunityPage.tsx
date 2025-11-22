import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Send, UserPlus, Search, MapPin, TrendingUp, Plus, Trophy, Trash2, MoreHorizontal, ChevronRight, Check, X, LogIn } from 'lucide-react';
import { friends, currentUser } from '../data/mockData';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ImageWithFallback } from './figma/ImageWithFallback';
import { PostDetail } from './PostDetail';
import { CreatePost } from './CreatePost';
import { ChatPage } from './community/ChatPage';
import { Leaderboard } from './community/Leaderboard';
import { AddFriend } from './community/AddFriend';
import { UserProfile } from './community/UserProfile';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../locales/translations';
import { useAuth } from '../context/AuthContext';
import * as communityApi from '../utils/communityApi';

type ViewMode = 'feed' | 'post-detail' | 'create-post' | 'chat' | 'leaderboard' | 'add-friend' | 'user-profile';

interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userLocation?: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: string;
  isLiked?: boolean;
}

// Generate extra mock friends to match the count
const generateMockFriends = (count: number, existingFriends: typeof friends) => {
  if (existingFriends.length >= count) return existingFriends;
  
  const extraCount = count - existingFriends.length;
  const newFriends = [...existingFriends];
  
  const names = ["Emma", "Oliver", "Ava", "Liam", "Sophia", "Noah", "Isabella", "Mason", "Mia", "Lucas", "Charlotte", "Ethan", "Amelia", "Aiden", "Harper", "Elijah"];
  const locations = ["San Francisco, CA", "New York, NY", "Austin, TX", "Seattle, WA", "Chicago, IL", "Denver, CO"];
  
  for (let i = 0; i < extraCount; i++) {
    newFriends.push({
      id: `mock-friend-${i}`,
      name: names[i % names.length] + " " + String.fromCharCode(65 + i % 26) + ".",
      avatar: ["🚴", "🚵", "🏃", "🧗", "🏊"][i % 5],
      location: locations[i % locations.length],
      totalDistance: Math.floor(Math.random() * 2000) + 100,
      posts: Math.floor(Math.random() * 50),
      isOnline: Math.random() > 0.7
    });
  }
  
  return newFriends;
};

const ALL_FRIENDS = generateMockFriends(currentUser.friendsCount || 42, friends);

const FALLBACK_USERS: communityApi.PublicUser[] = [
  {
    id: 'james',
    name: 'James Rodriguez',
    username: 'james_r',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    location: 'San Francisco, CA',
    totalDistance: 1450,
    bio: 'Love exploring Bay Area trails on weekends 🚴‍♂️'
  },
  {
    id: 'lisa',
    name: 'Lisa Wang',
    username: 'lisa_w',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    location: 'Oakland, CA',
    totalDistance: 2130,
    bio: 'Daily commuter | Climate activist 🌱'
  },
  {
    id: 'alex',
    name: 'Alex Chen',
    username: 'alexc',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    location: 'San Jose, CA',
    totalDistance: 890,
    bio: 'Mountain biking enthusiast 🏔️'
  },
  {
    id: 'sarah',
    name: 'Sarah Miller',
    username: 'sarahm',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    location: 'Palo Alto, CA',
    totalDistance: 3200,
    bio: 'Training for the next triathlon 🏊‍♀️🚴‍♀️🏃‍♀️'
  },
  {
    id: 'mike',
    name: 'Mike Ross',
    username: 'miker',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    location: 'San Mateo, CA',
    totalDistance: 1200,
    bio: 'Urban explorer'
  }
];

export function CommunityPage() {
  const { language } = useLanguage();
  const { currentUser: authUser, accessToken, logout } = useAuth();
  const t = getTranslation(language).community;
  const [activeTab, setActiveTab] = useState('feed');
  const [viewMode, setViewMode] = useState<ViewMode>('feed');
  
  const isGuest = authUser?.email === 'guest@besv.com';
  
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedFriend, setSelectedFriend] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [friendsTabMode, setFriendsTabMode] = useState<'list' | 'requests'>('list');
  const [posts, setPosts] = useState<Post[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<communityApi.PublicUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [displayFriends, setDisplayFriends] = useState<any[]>([]);
  const [friendRequests, setFriendRequests] = useState<any[]>([]); // New state for requests

  // Load posts and users from API
  useEffect(() => {
    if (accessToken) {
      loadData();
    }
  }, [accessToken]);

  // Load friends when tab changes
  useEffect(() => {
    if (activeTab === 'friends' && accessToken) {
      loadFriends();
    }
  }, [activeTab, accessToken]);

  const loadFriends = async () => {
    if (!accessToken) return;
    let friendsList = await communityApi.getFollowedUsers(accessToken);
    
    // Simulate random friends if empty (for demo purposes as requested)
    if (!friendsList || friendsList.length === 0) {
        // Generate a stable random count based on user ID if possible, or just random
        // For now just random between 5 and 15
        const count = Math.floor(Math.random() * 10) + 5;
        friendsList = generateMockFriends(count, []);
    }
    
    setDisplayFriends(friendsList);
    
    // Simulate friend requests
    const mockRequests = Array(Math.floor(Math.random() * 5) + 2).fill(null).map((_, i) => ({
        id: `req-${i}`,
        name: `Request User ${i+1}`,
        avatar: '👤',
        location: 'Unknown',
        timestamp: '2h ago'
    }));
    setFriendRequests(mockRequests);
  };

  const loadData = async () => {
    if (!accessToken) return;
    
    setIsLoading(true);
    const [fetchedPosts, fetchedUsers] = await Promise.all([
      communityApi.getPosts(accessToken),
      communityApi.getSuggestedUsers(accessToken)
    ]);
    
    setPosts(fetchedPosts);
    
    // Use fetched users or fallback to mock users if empty
    let usersToShow = fetchedUsers && fetchedUsers.length > 0 ? fetchedUsers : FALLBACK_USERS;
    
    // Randomly select 3 users to show
    usersToShow = [...usersToShow].sort(() => 0.5 - Math.random()).slice(0, 3);
    
    setSuggestedUsers(usersToShow);
    setIsLoading(false);
  };

  const handleLikePost = async (postId: string) => {
    if (!accessToken) return;

    // Optimistic update
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
        };
      }
      return post;
    }));

    // Update selected post if it's the one being liked
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost({
        ...selectedPost,
        isLiked: !selectedPost.isLiked,
        likes: selectedPost.isLiked ? selectedPost.likes - 1 : selectedPost.likes + 1,
      });
    }

    // API call
    const result = await communityApi.togglePostLike(accessToken, postId);
    
    // If API call fails, revert the optimistic update
    if (!result) {
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes + 1 : post.likes - 1,
          };
        }
        return post;
      }));
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!accessToken) return;
    
    try {
      const success = await communityApi.deletePost(accessToken, postId);
      if (success) {
        setPosts(posts.filter(p => p.id !== postId));
        if (selectedPost?.id === postId) {
          setSelectedPost(null);
          setViewMode('feed');
        }
      } else {
        alert('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error deleting post');
    }
  };

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setViewMode('post-detail');
  };

  const handleUserClick = async (e: React.MouseEvent, userId: string, userName: string, userAvatar: string) => {
    e.stopPropagation();
    if (!accessToken) return;

    // Show loading or partial data while fetching
    setSelectedUser({
        id: userId,
        name: userName,
        avatar: userAvatar,
        username: userName.toLowerCase().replace(/\s+/g, ''),
        bio: 'Loading...',
        location: '...',
        posts: 0,
        friendsCount: 0
    });
    setViewMode('user-profile');

    // Fetch real user profile
    const profile = await communityApi.getUserProfile(accessToken, userId);
    if (profile) {
        setSelectedUser(profile);
    }
  };

  const handleCreatePost = async (content: string, image?: string) => {
    if (!accessToken || !authUser || isSubmitting) return;

    // Check for duplicate content in recent posts
    const isDuplicate = posts.slice(0, 10).some(p => 
      p.userId === authUser.id && 
      p.content.trim() === content.trim() &&
      (p.image === image || (!p.image && !image))
    );

    if (isDuplicate) {
      const message = language === 'zh-CN' 
        ? '您最近发布过相同的内容，确定要再次发送吗？' 
        : 'You have posted the same content recently. Are you sure you want to send it again?';
        
      if (!window.confirm(message)) {
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const newPost = await communityApi.createPost(accessToken, content, image);
      
      if (newPost) {
        // Add to local state
        setPosts([newPost, ...posts]);
        setViewMode('feed');
      }
    } catch (error) {
      console.error('Failed to create post:', error);
      alert(language === 'zh-CN' ? '发布失败，请重试' : 'Failed to post, please try again');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFollowUser = async (userId: string) => {
      if (!accessToken) return;
      
      // Since UserProfile component manages local state optimistically, 
      // we just need to call the API here.
      // But we should check current status to know if we are following or unfollowing.
      // Actually, UserProfile handles the toggle logic, but it needs to know whether to call follow or unfollow.
      // But wait, UserProfile is dumb and just calls onFollow.
      
      // The issue is that UserProfile doesn't know if we are following or not initially properly unless we pass it.
      // We passed `isFriend` in the user object.
      
      // We can just support toggling here if we knew the state, but UserProfile handles the state toggle locally.
      // Let's assume UserProfile passes the ID and we need to determine what to do.
      // OR, better yet, UserProfile should probably just ask for a toggle callback.
      
      // However, the UserProfile component logic was:
      // const handleFollow = () => {
      //   setIsFollowing(!isFollowing);
      //   if (onFollow) onFollow(user.id);
      // };
      
      // So it just toggles. This means we need to sync with backend.
      // But `onFollow` only receives `userId`. It doesn't receive the new state.
      // This is a bit problematic if we don't know the previous state.
      
      // Let's check UserProfile again.
      // It initializes state from `user.isFriend`.
      // So if we passed the correct user object, `isFollowing` is correct.
      // When clicked, it toggles `isFollowing`.
      
      // So we need to check `selectedUser.isFriend` (or the updated local version of it).
      // But `selectedUser` is state in this component.
      
      // Let's just check if the user is already in our friends list or use the `isFriend` property.
      
      const isFollowing = selectedUser.isFriend;
      let success = false;
      
      if (isFollowing) {
          success = await communityApi.unfollowUser(accessToken, userId);
      } else {
          success = await communityApi.followUser(accessToken, userId);
      }
      
      if (success) {
          // Update local state
          setSelectedUser({
              ...selectedUser,
              isFriend: !isFollowing,
              friendsCount: isFollowing ? (selectedUser.friendsCount || 0) - 1 : (selectedUser.friendsCount || 0) + 1 // This is actually target's friends count (followers), but for now let's just toggle isFriend
          });
          
          // Reload friends list if we are in friends tab
          loadFriends();
      }
  }

  // Show post detail view
  if (viewMode === 'post-detail' && selectedPost) {
    return (
      <PostDetail
        post={selectedPost}
        onBack={() => setViewMode('feed')}
        onLikePost={handleLikePost}
        onCommentLike={(commentId) => {
          // Comment like logic handled in PostDetail component
        }}
        onPostDeleted={() => {
          setPosts(posts.filter(p => p.id !== selectedPost.id));
          setSelectedPost(null);
          setViewMode('feed');
        }}
      />
    );
  }

  // Show create post view
  if (viewMode === 'create-post') {
    return (
      <CreatePost
        onBack={() => setViewMode('feed')}
        onCreatePost={handleCreatePost}
      />
    );
  }

  // Show chat view
  if (viewMode === 'chat' && selectedFriend) {
    return (
      <ChatPage
        friend={selectedFriend}
        onBack={() => {
          setViewMode('feed');
          setActiveTab('friends'); // Go back to friends tab
        }}
      />
    );
  }

  // Show leaderboard view
  if (viewMode === 'leaderboard') {
    return <Leaderboard onBack={() => setViewMode('feed')} />;
  }

  // Show add friend view
  if (viewMode === 'add-friend' && selectedUser) {
    return <AddFriend user={selectedUser} onBack={() => setViewMode('feed')} />;
  }

  // Show user profile view
  if (viewMode === 'user-profile' && selectedUser) {
    return (
      <UserProfile 
        user={selectedUser} 
        onBack={() => setViewMode('feed')} 
        onFollow={handleFollowUser}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      {/* Header */}
      <div className="p-5 bg-card border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-primary">{t.title}</h1>
            <p className="text-xs text-muted-foreground mt-1">{t.subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('leaderboard')}
              className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center hover:bg-secondary/80 transition-colors text-primary"
            >
              <Trophy className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('create-post')}
              className="w-10 h-10 bg-primary text-black rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="w-full rounded-none border-b border-border bg-card flex-shrink-0">
          <TabsTrigger value="feed" className="flex-1 text-sm data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">{t.feed}</TabsTrigger>
          <TabsTrigger value="friends" className="flex-1 text-sm data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">{t.friends}</TabsTrigger>
          <TabsTrigger value="discover" className="flex-1 text-sm data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">{t.discover}</TabsTrigger>
        </TabsList>

        {/* Feed Tab */}
        <TabsContent value="feed" className="flex-1 overflow-auto m-0 data-[state=active]:flex data-[state=active]:flex-col bg-background">
          {isGuest ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="w-20 h-20 bg-secondary/50 rounded-full flex items-center justify-center mb-6">
                <MessageCircle className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-xl font-bold mb-2">
                {language === 'zh-CN' ? '加入社区' : 'Join the Community'}
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xs">
                {language === 'zh-CN' 
                  ? '登录后即可查看社区动态，分享您的骑行故事' 
                  : 'Login to view community posts and share your riding stories'}
              </p>
              <Button 
                onClick={logout} 
                className="w-full max-w-xs bg-primary text-black hover:bg-primary/90 font-bold h-12"
              >
                <LogIn className="w-4 h-4 mr-2" />
                {language === 'zh-CN' ? '登录 / 注册' : 'Login / Register'}
              </Button>
            </div>
          ) : (
            <div className="p-4 space-y-3">
            {/* Create Post Button */}
            <Card className="p-4 border border-border bg-card">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-secondary rounded-full flex items-center justify-center text-base overflow-hidden">
                  {currentUser?.avatar?.startsWith('http') || currentUser?.avatar?.startsWith('/') ? (
                    <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    currentUser?.avatar || '👤'
                  )}
                </div>
                <button
                  onClick={() => setViewMode('create-post')}
                  className="flex-1 text-left px-4 py-2.5 bg-secondary rounded-full hover:bg-secondary/80 transition-colors text-sm text-muted-foreground"
                >
                  {t.shareStory}
                </button>
              </div>
            </Card>

            {/* Posts */}
            {isLoading ? (
              <div className="text-center text-muted-foreground">{t.loading}</div>
            ) : posts.length === 0 ? (
              <Card className="p-8 text-center border border-border bg-card">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-base mb-2">{t.noPostsYet}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t.beTheFirst}
                </p>
                <button
                  onClick={() => setViewMode('create-post')}
                  className="px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                >
                  {t.createPost}
                </button>
              </Card>
            ) : (
              posts.map((post) => (
                <Card key={post.id} className="overflow-hidden border border-border bg-card">
                  {/* User Info */}
                  <div className="p-4 flex items-center gap-3">
                    <div 
                      className="w-9 h-9 bg-secondary rounded-full flex items-center justify-center text-base border border-border overflow-hidden cursor-pointer"
                      onClick={(e) => handleUserClick(e, post.userId, post.userName, post.userAvatar)}
                    >
                      {post.userAvatar?.startsWith('http') || post.userAvatar?.startsWith('/') ? (
                        <img src={post.userAvatar} alt={post.userName} className="w-full h-full object-cover" />
                      ) : (
                        post.userAvatar
                      )}
                    </div>
                    <div className="flex-1">
                      <p 
                        className="text-sm font-medium cursor-pointer hover:text-primary transition-colors"
                        onClick={(e) => handleUserClick(e, post.userId, post.userName, post.userAvatar)}
                      >
                        {post.userName}
                      </p>
                      <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                    </div>
                    {post.userId === authUser?.id ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="text-muted-foreground hover:text-foreground p-1">
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            className="text-red-500 focus:text-red-500 cursor-pointer"
                            onSelect={(e) => {
                                e.preventDefault(); // Prevent closing immediately if we want to show confirm
                                if (window.confirm('Delete this post?')) {
                                  handleDeletePost(post.id);
                                }
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            {t.delete}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <button className="text-muted-foreground hover:text-foreground text-lg">•••</button>
                    )}
                  </div>

                  {/* Content */}
                  <div className="px-4 pb-3">
                    <p className="text-sm">{post.content}</p>
                  </div>

                  {/* Image */}
                  {post.image && (
                    <div onClick={() => handlePostClick(post)} className="cursor-pointer relative">
                      <ImageWithFallback
                        src={post.image}
                        alt="Post"
                        className="w-full h-56 object-cover hover:opacity-95 transition-opacity bg-muted"
                      />
                      
                      {/* Location Badge Overlay */}
                      {post.userLocation && (
                        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-primary" />
                          <span className="text-xs text-white font-medium">{post.userLocation}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Location Badge (if no image) */}
                  {!post.image && post.userLocation && (
                    <div className="px-4 pb-3 flex justify-end">
                      <div className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md">
                        <MapPin className="w-3 h-3" />
                        <span>{post.userLocation}</span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="p-4 flex items-center gap-5 border-t border-border">
                    <button
                      onClick={() => handleLikePost(post.id)}
                      className={`flex items-center gap-1.5 transition-colors ${
                        post.isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                      <span className="text-sm">{post.likes}</span>
                    </button>
                    <button
                      onClick={() => handlePostClick(post)}
                      className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">{post.comments}</span>
                    </button>
                    <button className="ml-auto text-muted-foreground hover:text-primary transition-colors">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              ))
            )}
          </div>
          )}
        </TabsContent>

        {/* Friends Tab */}
        <TabsContent value="friends" className="flex-1 overflow-auto m-0 bg-background">
          {isGuest ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="w-20 h-20 bg-secondary/50 rounded-full flex items-center justify-center mb-6">
                <UserPlus className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-xl font-bold mb-2">
                {language === 'zh-CN' ? '结识骑友' : 'Connect with Riders'}
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xs">
                {language === 'zh-CN' 
                  ? '登录后即可关注好友，查看好友动态' 
                  : 'Login to follow friends and see their activities'}
              </p>
              <Button 
                onClick={logout} 
                className="w-full max-w-xs bg-primary text-black hover:bg-primary/90 font-bold h-12"
              >
                <LogIn className="w-4 h-4 mr-2" />
                {language === 'zh-CN' ? '登录 / 注册' : 'Login / Register'}
              </Button>
            </div>
          ) : (
            <div className="p-4 space-y-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder={t.searchFriends} className="pl-9 bg-card border-border" />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <Card 
                className={`p-4 text-center border bg-card cursor-pointer transition-colors ${friendsTabMode === 'list' ? 'border-primary bg-secondary/20' : 'border-border hover:bg-secondary/10'}`}
                onClick={() => setFriendsTabMode('list')}
              >
                <p className="text-2xl text-primary">{displayFriends.length}</p>
                <p className="text-xs text-muted-foreground mt-1">{t.friendsCount}</p>
              </Card>
              <Card 
                className={`p-4 text-center border bg-card cursor-pointer transition-colors ${friendsTabMode === 'requests' ? 'border-primary bg-secondary/20' : 'border-border hover:bg-secondary/10'}`}
                onClick={() => setFriendsTabMode('requests')}
              >
                <p className="text-2xl text-primary">{friendRequests.length}</p>
                <p className="text-xs text-muted-foreground mt-1">{t.requests}</p>
              </Card>
            </div>

            {/* Friends List or Requests */}
            {friendsTabMode === 'list' ? (
                <>
                    <h3 className="text-base pt-2 font-medium">{t.yourFriends}</h3>
                    {displayFriends.length === 0 ? (
                        <div className="text-center text-muted-foreground py-8">
                            {t.noFriendsYet}
                        </div>
                    ) : (
                        displayFriends.map((friend) => (
                        <Card key={friend.id} className="p-4 hover:bg-secondary/50 transition-colors border border-border bg-card">
                            <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-xl border border-border overflow-hidden">
                                {friend.avatar?.startsWith('http') || friend.avatar?.startsWith('/') ? (
                                    <img src={friend.avatar} alt={friend.name} className="w-full h-full object-cover" />
                                ) : (
                                    friend.avatar || '👤'
                                )}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">{friend.name}</p>
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                                <MapPin className="w-3 h-3" />
                                <span>{friend.location || 'Unknown'}</span>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-muted-foreground">{friend.totalDistance || 0} km</span>
                                <span className="text-xs text-muted-foreground">•</span>
                                <span className="text-xs text-muted-foreground">{friend.posts || 0} posts</span>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                setSelectedFriend(friend);
                                setViewMode('chat');
                                }}
                                className="px-3 py-1.5 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors text-sm"
                            >
                                {t.message}
                            </button>
                            </div>
                        </Card>
                        ))
                    )}
                </>
            ) : (
                <>
                    <h3 className="text-base pt-2 font-medium">{t.requests}</h3>
                    {friendRequests.length === 0 ? (
                         <div className="text-center text-muted-foreground py-8">
                            {language === 'zh-CN' ? '暂无好友请求' : 'No friend requests'}
                        </div>
                    ) : (
                        friendRequests.map((req) => (
                            <Card key={req.id} className="p-4 hover:bg-secondary/50 transition-colors border border-border bg-card">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-xl border border-border overflow-hidden">
                                         {req.avatar}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{req.name}</p>
                                        <p className="text-xs text-muted-foreground">{req.timestamp}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="p-2 bg-primary text-black rounded-full">
                                            <Check className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 bg-secondary text-muted-foreground rounded-full">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </>
            )}
          </div>
          )}
        </TabsContent>

        {/* Discover Tab */}
        <TabsContent value="discover" className="flex-1 overflow-auto m-0 bg-background">
          <div className="p-4 space-y-3">
            <h3 className="text-base font-medium">{t.suggestedRiders}</h3>
            <p className="text-xs text-muted-foreground">{t.basedOnLocation}</p>

            {/* Suggested Users */}
            {isLoading ? (
              <div className="text-center text-muted-foreground text-sm py-4">{t.loadingSuggestions}</div>
            ) : suggestedUsers.length > 0 ? (
              suggestedUsers.map((user) => (
                <Card key={user.id} className="p-4 border border-border bg-card mb-3 last:mb-0">
                  <div className="flex items-center gap-3 mb-3">
                    <div 
                      className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-xl overflow-hidden cursor-pointer"
                      onClick={(e) => handleUserClick(e, user.id, user.name, user.avatar)}
                    >
                      {user.avatar?.startsWith('http') || user.avatar?.startsWith('/') ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        user.avatar || '👤'
                      )}
                    </div>
                    <div className="flex-1">
                      <p 
                        className="text-sm font-medium cursor-pointer hover:text-primary transition-colors"
                        onClick={(e) => handleUserClick(e, user.id, user.name, user.avatar)}
                      >
                        {user.name}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                        <MapPin className="w-3 h-3" />
                        <span>{user.location}</span>
                      </div>
                      <Badge variant="outline" className="mt-1.5 text-xs h-5 border-border text-muted-foreground">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {user.totalDistance || 0} km
                      </Badge>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedUser(user);
                        setViewMode('add-friend');
                      }}
                      className="px-3 py-1.5 bg-primary text-black rounded-lg hover:bg-primary/90 transition-all flex items-center gap-1.5 text-sm font-medium">
                      <UserPlus className="w-3.5 h-3.5" />
                      {t.add}
                    </button>
                  </div>
                  {user.bio && (
                    <p className="text-xs text-muted-foreground bg-secondary p-3 rounded-lg">
                      "{user.bio}"
                    </p>
                  )}
                </Card>
              ))
            ) : (
              <div className="text-center text-muted-foreground text-sm py-4">
                {t.noSuggestions}
              </div>
            )}

            {/* Groups */}
            <h3 className="text-base pt-3 font-medium">{t.ridingGroups}</h3>
            <Card className="p-4 hover:bg-secondary/50 transition-colors border border-border bg-card">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center text-xl text-primary">
                  🚴
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Bay Area Riders</p>
                  <p className="text-xs text-muted-foreground mt-0.5">234 {t.members} • 5 {t.ridesPerWeek}</p>
                </div>
                <button className="px-3 py-1.5 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors text-sm">
                  {t.join}
                </button>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}