import { useState } from 'react';

interface ChannelLogoProps {
  src: string;
  name: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export function ChannelLogo({ src, name, size = 'medium', className = '' }: ChannelLogoProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const sizeClasses = {
    small: 'w-[50px] h-[30px]',
    medium: 'w-[80px] h-[48px]',
    large: 'w-[120px] h-[72px]'
  };

  const iconSizes = {
    small: 16,
    medium: 24,
    large: 32
  };

  const fontSize = {
    small: 'text-[10px]',
    medium: 'text-[12px]',
    large: 'text-[14px]'
  };

  if (!src || src === 'https://logo.png' || imageError) {
    return (
      <div className={`${sizeClasses[size]} flex items-center justify-center bg-gradient-to-br from-red-600 to-red-800 rounded ${className}`}>
        <span className={`text-white font-['Inter:Bold',sans-serif] ${fontSize[size]} text-center px-2`}>
          {name.substring(0, 3).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} flex items-center justify-center bg-white/5 rounded overflow-hidden p-1 relative ${className}`}>
      {/* Loading skeleton */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-white/10 animate-pulse" />
      )}
      
      {/* Actual image */}
      <img
        src={src}
        alt={name}
        className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
        loading="lazy"
      />
    </div>
  );
}
