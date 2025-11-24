import { useState, useEffect } from 'react';

interface UserAvatarProps {
  src?: string;
  alt?: string;
  className?: string;
  fallback?: string;
}

export function UserAvatar({ src, alt, className, fallback }: UserAvatarProps) {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [src]);

  const isUrl = src && (src.startsWith('http') || src.startsWith('/') || src.startsWith('data:'));

  if (isUrl && !error) {
    return (
      <img 
        src={src} 
        alt={alt || 'Avatar'} 
        className={`w-full h-full object-cover ${className || ''}`}
        onError={() => setError(true)}
      />
    );
  }

  // Fallback content: if src is not a URL (e.g. emoji), use src. Otherwise use fallback prop or default emoji.
  const content = (!isUrl && src) ? src : (fallback || '👤');
  
  return (
    <div className={`w-full h-full flex items-center justify-center ${className || ''}`} style={{ backgroundColor: 'transparent' }}>
       {content}
    </div>
  );
}
