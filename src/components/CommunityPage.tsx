import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Send, UserPlus, Search, MapPin, TrendingUp, Plus, Trophy } from 'lucide-react';
import { friends, currentUser } from '../data/mockData';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { PostDetail } from './PostDetail';
import { CreatePost } from './CreatePost';
import { ChatPage } from './community/ChatPage';
import { Leaderboard } from './community/Leaderboard';
import { AddFriend } from './community/AddFriend';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../locales/translations';
import { useAuth } from '../context/AuthContext';
import * as communityApi from '../utils/communityApi';

type ViewMode = 'feed' | 'post-detail' | 'create-post' | 'chat' | 'leaderboard' | 'add-friend';

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

export function CommunityPage() {
  const { language } = useLanguage();
  const { currentUser: authUser, accessToken } = useAuth();
  const t = getTranslation(language).community;
  const [activeTab, setActiveTab] = useState('feed');
  const [viewMode, setViewMode] = useState<ViewMode>('feed');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedFriend, setSelectedFriend] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load posts from API
  useEffect(() => {
    if (accessToken) {
      loadPosts();
    }
  }, [accessToken]);

  const loadPosts = async () => {
    if (!accessToken) return;
    
    setIsLoading(true);
    const fetchedPosts = await communityApi.getPosts(accessToken);
    setPosts(fetchedPosts);
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

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setViewMode('post-detail');
  };

  const handleCreatePost = async (content: string, image?: string) => {
    if (!accessToken || !authUser) return;

    const newPost = await communityApi.createPost(accessToken, content, image);
    
    if (newPost) {
      // Add to local state
      setPosts([newPost, ...posts]);
      setViewMode('feed');
    }
  };

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
        onBack={() => setViewMode('feed')}
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
          <TabsTrigger value="feed" className="flex-1 text-sm data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">Feed</TabsTrigger>
          <TabsTrigger value="friends" className="flex-1 text-sm data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">Friends</TabsTrigger>
          <TabsTrigger value="discover" className="flex-1 text-sm data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">Discover</TabsTrigger>
        </TabsList>

        {/* Feed Tab */}
        <TabsContent value="feed" className="flex-1 overflow-auto m-0 data-[state=active]:flex data-[state=active]:flex-col bg-background">
          <div className="p-4 space-y-3">
            {/* Create Post Button */}
            <Card className="p-4 border border-border bg-card">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-secondary rounded-full flex items-center justify-center text-base">
                  {currentUser.avatar}
                </div>
                <button
                  onClick={() => setViewMode('create-post')}
                  className="flex-1 text-left px-4 py-2.5 bg-secondary rounded-full hover:bg-secondary/80 transition-colors text-sm text-muted-foreground"
                >
                  Share your riding story...
                </button>
              </div>
            </Card>

            {/* Posts */}
            {isLoading ? (
              <div className="text-center text-muted-foreground">Loading...</div>
            ) : posts.length === 0 ? (
              <Card className="p-8 text-center border border-border bg-card">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-base mb-2">{language === 'zh-CN' ? '还没有帖子' : 'No Posts Yet'}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {language === 'zh-CN' 
                    ? '成为第一个分享骑行故事的人！' 
                    : 'Be the first to share your riding story!'}
                </p>
                <button
                  onClick={() => setViewMode('create-post')}
                  className="px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                >
                  {language === 'zh-CN' ? '创建帖子' : 'Create Post'}
                </button>
              </Card>
            ) : (
              posts.map((post) => (
                <Card key={post.id} className="overflow-hidden border border-border bg-card">
                  {/* User Info */}
                  <div className="p-4 flex items-center gap-3">
                    <div className="w-9 h-9 bg-secondary rounded-full flex items-center justify-center text-base border border-border">
                      {post.userAvatar}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{post.userName}</p>
                      <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                    </div>
                    <button className="text-muted-foreground hover:text-foreground text-lg">•••</button>
                  </div>

                  {/* Content */}
                  <div className="px-4 pb-3">
                    <p className="text-sm">{post.content}</p>
                  </div>

                  {/* Image */}
                  {post.image && (
                    <div onClick={() => handlePostClick(post)} className="cursor-pointer">
                      <ImageWithFallback
                        src={post.image}
                        alt="Post"
                        className="w-full h-56 object-cover hover:opacity-95 transition-opacity bg-muted"
                      />
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
        </TabsContent>

        {/* Friends Tab */}
        <TabsContent value="friends" className="flex-1 overflow-auto m-0 bg-background">
          <div className="p-4 space-y-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search friends..." className="pl-9 bg-card border-border" />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-4 text-center border border-border bg-card">
                <p className="text-2xl text-primary">{currentUser.friendsCount}</p>
                <p className="text-xs text-muted-foreground mt-1">Friends</p>
              </Card>
              <Card className="p-4 text-center border border-border bg-card">
                <p className="text-2xl text-primary">12</p>
                <p className="text-xs text-muted-foreground mt-1">Requests</p>
              </Card>
            </div>

            {/* Friends List */}
            <h3 className="text-base pt-2 font-medium">Your Friends</h3>
            {friends.map((friend) => (
              <Card key={friend.id} className="p-4 hover:bg-secondary/50 transition-colors border border-border bg-card">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-xl border border-border">
                    {friend.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{friend.name}</p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                      <MapPin className="w-3 h-3" />
                      <span>{friend.location}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{friend.totalDistance} km</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{friend.posts} posts</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedFriend(friend);
                      setViewMode('chat');
                    }}
                    className="px-3 py-1.5 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors text-sm"
                  >
                    Message
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Discover Tab */}
        <TabsContent value="discover" className="flex-1 overflow-auto m-0 bg-background">
          <div className="p-4 space-y-3">
            <h3 className="text-base font-medium">Suggested Riders</h3>
            <p className="text-xs text-muted-foreground">Based on your location and riding habits</p>

            {/* Suggested Users */}
            <Card className="p-4 border border-border bg-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-xl">
                  👨‍🦰
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">James Rodriguez</p>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                    <MapPin className="w-3 h-3" />
                    <span>San Francisco, CA</span>
                  </div>
                  <Badge variant="outline" className="mt-1.5 text-xs h-5 border-border text-muted-foreground">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    1,450 km
                  </Badge>
                </div>
                <button 
                  onClick={() => {
                    setSelectedUser({
                      id: 'james',
                      name: 'James Rodriguez',
                      avatar: '👨‍🦰',
                      location: 'San Francisco, CA',
                      distance: 1450,
                      bio: 'Love exploring Bay Area trails on weekends 🚴‍♂️'
                    });
                    setViewMode('add-friend');
                  }}
                  className="px-3 py-1.5 bg-primary text-black rounded-lg hover:bg-primary/90 transition-all flex items-center gap-1.5 text-sm font-medium">
                  <UserPlus className="w-3.5 h-3.5" />
                  Add
                </button>
              </div>
              <p className="text-xs text-muted-foreground bg-secondary p-3 rounded-lg">
                "Love exploring Bay Area trails on weekends 🚴‍♂️"
              </p>
            </Card>

            <Card className="p-4 border border-border bg-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-xl">
                  👩‍🦱
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Lisa Wang</p>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                    <MapPin className="w-3 h-3" />
                    <span>Oakland, CA</span>
                  </div>
                  <Badge variant="outline" className="mt-1.5 text-xs h-5 border-border text-muted-foreground">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    2,130 km
                  </Badge>
                </div>
                <button 
                  onClick={() => {
                    setSelectedUser({
                      id: 'lisa',
                      name: 'Lisa Wang',
                      avatar: '👩‍🦱',
                      location: 'Oakland, CA',
                      distance: 2130,
                      bio: 'Daily commuter | Climate activist 🌱'
                    });
                    setViewMode('add-friend');
                  }}
                  className="px-3 py-1.5 bg-primary text-black rounded-lg hover:bg-primary/90 transition-all flex items-center gap-1.5 text-sm font-medium">
                  <UserPlus className="w-3.5 h-3.5" />
                  Add
                </button>
              </div>
              <p className="text-xs text-muted-foreground bg-secondary p-3 rounded-lg">
                "Daily commuter | Climate activist 🌱"
              </p>
            </Card>

            {/* Groups */}
            <h3 className="text-base pt-3 font-medium">Riding Groups</h3>
            <Card className="p-4 hover:bg-secondary/50 transition-colors border border-border bg-card">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center text-xl text-primary">
                  🚴
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Bay Area Riders</p>
                  <p className="text-xs text-muted-foreground mt-0.5">234 members • 5 rides/week</p>
                </div>
                <button className="px-3 py-1.5 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors text-sm">
                  Join
                </button>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}