import { useState, useEffect } from 'react';
import { Movie } from '../utils/tmdb';
import { MovieCard } from './MovieCard';
import { motion } from '../utils/motion-stub';
import { preloadFirstVisible } from '../utils/fastImagePreloader';

// Icon inline to avoid lucide-react dependency
const ChevronRight = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

interface ContentRowProps {
  title: string;
  content: Movie[];
  onMovieClick: (movie: Movie) => void;
  maxItems?: number;
  showViewAll?: boolean;
  onAddToList?: (movie: Movie) => void;
  onLike?: (movie: Movie) => void;
  onWatchLater?: (movie: Movie) => void;
  myList?: number[];
  likedList?: number[];
  watchLaterList?: number[];
}

export function ContentRow({ title, content, onMovieClick, maxItems, showViewAll = true, onAddToList, onLike, onWatchLater, myList = [], likedList = [], watchLaterList = [] }: ContentRowProps) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  if (content.length === 0) return null;

  const displayContent = maxItems ? content.slice(0, maxItems) : content;

  // Preload das primeiras 6 imagens assim que o componente montar
  useEffect(() => {
    if (displayContent.length > 0) {
      // Pequeno delay para não bloquear renderização inicial
      const timer = setTimeout(() => {
        preloadFirstVisible(displayContent, 6);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [displayContent]);

  return (
    <div className="mb-8 md:mb-12">
      {/* Row Title */}
      <div className="flex items-center justify-between mb-3 md:mb-4 px-4 md:px-2">
        <h2 className="text-white font-['Inter:Bold',sans-serif] text-lg md:text-xl lg:text-[24px]">
          {title}
        </h2>
        {showViewAll && maxItems && content.length > maxItems && (
          <button className="text-red-600 hover:text-red-500 transition-colors flex items-center gap-1 group">
            <span className="font-['Inter:Medium',sans-serif] text-xs md:text-[14px]">Ver tudo ({content.length})</span>
            <ChevronRight size={16} className="md:w-[18px] md:h-[18px] group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>

      {/* Content Grid with Blur Effect on Siblings */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 md:gap-4 lg:gap-6 px-4 md:px-2">
        {displayContent.map((item) => (
          <motion.div
            key={item.id}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
            animate={{
              filter: hoveredId !== null && hoveredId !== item.id ? 'blur(2px)' : 'blur(0px)',
              opacity: hoveredId !== null && hoveredId !== item.id ? 0.5 : 1,
            }}
            transition={{ duration: 0.3 }}
            className="touch-manipulation relative"
            style={{ zIndex: hoveredId === item.id ? 100 : 1 }}
          >
            <MovieCard
              movie={item}
              onClick={() => onMovieClick(item)}
              onAddToList={() => onAddToList?.(item)}
              onLike={() => onLike?.(item)}
              onWatchLater={() => onWatchLater?.(item)}
              isInList={myList.includes(item.id)}
              isLiked={likedList.includes(item.id)}
              isInWatchLater={watchLaterList.includes(item.id)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
