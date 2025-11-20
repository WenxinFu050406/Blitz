import { useState } from 'react';
import { ArrowLeft, Image as ImageIcon, MapPin, Smile, X } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { currentUser } from '../data/mockData';

interface CreatePostProps {
  onBack: () => void;
  onCreatePost: (content: string, image?: string) => void;
}

export function CreatePost({ onBack, onCreatePost }: CreatePostProps) {
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);

  const handlePost = async () => {
    if (!content.trim()) return;

    setIsPosting(true);
    // Simulate posting delay
    setTimeout(() => {
      onCreatePost(content, selectedImage || undefined);
      setIsPosting(false);
    }, 500);
  };

  const handleImageSelect = () => {
    // Simulate image selection with a placeholder
    const placeholderImages = [
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600',
      'https://images.unsplash.com/photo-1613370625437-f2956da172ef?w=600',
      'https://images.unsplash.com/photo-1636512957897-f3c28ba56e9f?w=600',
      'https://images.unsplash.com/photo-1659290542421-dc71df5e7803?w=600',
    ];
    const randomImage = placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
    setSelectedImage(randomImage);
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-white">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-base">Create Post</h2>
        </div>
        <Button
          onClick={handlePost}
          disabled={!content.trim() || isPosting}
          className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white h-9 px-4"
        >
          {isPosting ? 'Posting...' : 'Post'}
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {/* User Info */}
        <div className="p-4 flex items-center gap-3 border-b border-slate-50">
          <div className="w-11 h-11 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full flex items-center justify-center text-lg">
            {currentUser.avatar}
          </div>
          <div>
            <p className="text-sm">{currentUser.name}</p>
            <p className="text-xs text-slate-500">{currentUser.location}</p>
          </div>
        </div>

        {/* Text Input */}
        <div className="p-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your riding story, tips, or adventures..."
            className="w-full min-h-[200px] text-sm resize-none focus:outline-none placeholder:text-slate-400"
            autoFocus
          />
        </div>

        {/* Image Preview */}
        {selectedImage && (
          <div className="px-4 pb-4">
            <div className="relative rounded-xl overflow-hidden">
              <img
                src={selectedImage}
                alt="Selected"
                className="w-full h-64 object-cover"
              />
              <button
                onClick={removeImage}
                className="absolute top-3 right-3 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Post Tips */}
        <div className="px-4 pb-4">
          <Card className="p-4 bg-cyan-50 border-cyan-200">
            <p className="text-xs text-cyan-800 mb-2">💡 Posting Tips:</p>
            <ul className="text-xs text-cyan-700 space-y-1.5 ml-4">
              <li>• Share your best riding moments and routes</li>
              <li>• Use photos to make your post more engaging</li>
              <li>• Include location tags to help others discover new trails</li>
              <li>• Be respectful and supportive of fellow riders</li>
            </ul>
          </Card>
        </div>
      </div>

      {/* Bottom Toolbar */}
      <div className="border-t border-slate-100 p-4 bg-white">
        <div className="flex items-center gap-4">
          <button
            onClick={handleImageSelect}
            disabled={selectedImage !== null}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ImageIcon className="w-5 h-5 text-cyan-600" />
            <span className="text-sm text-slate-700">Photo</span>
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors opacity-50 cursor-not-allowed"
            disabled
          >
            <MapPin className="w-5 h-5 text-cyan-600" />
            <span className="text-sm text-slate-700">Location</span>
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors opacity-50 cursor-not-allowed"
            disabled
          >
            <Smile className="w-5 h-5 text-cyan-600" />
            <span className="text-sm text-slate-700">Emoji</span>
          </button>
        </div>
      </div>
    </div>
  );
}
