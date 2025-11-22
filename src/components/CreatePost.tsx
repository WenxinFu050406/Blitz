import { useState, useRef } from 'react';
import { ArrowLeft, Image as ImageIcon, MapPin, Smile, X } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useAuth } from '../context/AuthContext';

interface CreatePostProps {
  onBack: () => void;
  onCreatePost: (content: string, image?: string) => void;
}

export function CreatePost({ onBack, onCreatePost }: CreatePostProps) {
  const { currentUser } = useAuth();
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col h-full bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#333] bg-black">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#1a1a1a] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h2 className="text-base text-white">Create Post</h2>
        </div>
        <Button
          onClick={handlePost}
          disabled={!content.trim() || isPosting}
          className="bg-[#00ff88] hover:bg-[#00cc66] text-black h-9 px-4 disabled:bg-gray-600 disabled:text-gray-400"
        >
          {isPosting ? 'Posting...' : 'Post'}
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-black">
        {/* User Info */}
        <div className="p-4 flex items-center gap-3 border-b border-[#333]">
          <div className="w-11 h-11 bg-[#1a1a1a] border border-[#00ff88] rounded-full flex items-center justify-center text-lg overflow-hidden">
            {currentUser?.avatar?.startsWith('http') || currentUser?.avatar?.startsWith('/') ? (
              <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              currentUser?.avatar || '👤'
            )}
          </div>
          <div>
            <p className="text-sm text-white">{currentUser?.name}</p>
            <p className="text-xs text-gray-400">{currentUser?.location}</p>
          </div>
        </div>

        {/* Text Input */}
        <div className="p-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your riding story, tips, or adventures..."
            className="w-full min-h-[200px] text-sm resize-none focus:outline-none bg-black text-white placeholder:text-gray-500"
            autoFocus
          />
        </div>

        {/* Image Preview */}
        {selectedImage && (
          <div className="px-4 pb-4">
            <div className="relative rounded-xl overflow-hidden border border-[#333]">
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
          <Card className="p-4 bg-[#1a1a1a] border border-[#00ff88]">
            <p className="text-xs text-[#00ff88] mb-2">💡 Posting Tips:</p>
            <ul className="text-xs text-gray-300 space-y-1.5 ml-4">
              <li>• Share your best riding moments and routes</li>
              <li>• Use photos to make your post more engaging</li>
              <li>• Include location tags to help others discover new trails</li>
              <li>• Be respectful and supportive of fellow riders</li>
            </ul>
          </Card>
        </div>
      </div>

      {/* Bottom Toolbar */}
      <div className="border-t border-[#333] p-4 bg-black">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
        <div className="flex items-center gap-4">
          <button
            onClick={handleImageSelect}
            disabled={selectedImage !== null}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#1a1a1a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ImageIcon className="w-5 h-5 text-[#00ff88]" />
            <span className="text-sm text-gray-300">Photo</span>
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#1a1a1a] transition-colors opacity-50 cursor-not-allowed"
            disabled
          >
            <MapPin className="w-5 h-5 text-[#00ff88]" />
            <span className="text-sm text-gray-300">Location</span>
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#1a1a1a] transition-colors opacity-50 cursor-not-allowed"
            disabled
          >
            <Smile className="w-5 h-5 text-[#00ff88]" />
            <span className="text-sm text-gray-300">Emoji</span>
          </button>
        </div>
      </div>
    </div>
  );
}
