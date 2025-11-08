import { useState, useRef, useEffect } from 'react';
import { Movie } from '../utils/tmdb';
import { MovieCard } from './MovieCard';

// Icons inline to avoid lucide-react dependency
const ChevronLeft = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const ChevronRight = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

interface HorizontalCarouselProps {
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

export function HorizontalCarousel({ 
  title, 
  content, 
  onMovieClick, 
  maxItems, 
  showViewAll = true, 
  onAddToList, 
  onLike, 
  onWatchLater, 
  myList = [], 
  likedList = [], 
  watchLaterList = [] 
}: HorizontalCarouselProps) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isHoveringCarousel, setIsHoveringCarousel] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (!content || content.length === 0) return null;

  const displayContent = maxItems ? content.slice(0, maxItems) : content;

  // Scroll suave para esquerda/direita
  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const scrollAmount = container.clientWidth * 0.8;
    const newScrollLeft = direction === 'left' 
      ? container.scrollLeft - scrollAmount 
      : container.scrollLeft + scrollAmount;
    
    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  // Atualizar visibilidade das setas baseado na posição do scroll
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (!container) return;
      
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    };

    // Check initial state
    handleScroll();
    
    // Add scroll listener
    container.addEventListener('scroll', handleScroll, { passive: true });
    
    // Cleanup
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [displayContent]);

  return (
    <div 
      className="mb-8 md:mb-12 group/carousel relative"
      onMouseEnter={() => setIsHoveringCarousel(true)}
      onMouseLeave={() => setIsHoveringCarousel(false)}
    >
      {/* Row Title */}
      <div className="flex items-center justify-between mb-3 md:mb-4 px-4 md:px-12">
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

      {/* Carousel Container */}
      <div className="relative">
        {/* Left Arrow */}
        {showLeftArrow && isHoveringCarousel && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-0 z-40 w-12 md:w-16 bg-gradient-to-r from-black/90 via-black/60 to-transparent hidden md:flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300"
            aria-label="Scroll left"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/80 hover:bg-black flex items-center justify-center transition-all hover:scale-110">
              <ChevronLeft size={28} className="text-white" />
            </div>
          </button>
        )}

        {/* Right Arrow */}
        {showRightArrow && isHoveringCarousel && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-0 z-40 w-12 md:w-16 bg-gradient-to-l from-black/90 via-black/60 to-transparent hidden md:flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300"
            aria-label="Scroll right"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/80 hover:bg-black flex items-center justify-center transition-all hover:scale-110">
              <ChevronRight size={28} className="text-white" />
            </div>
          </button>
        )}

        {/* Scrollable Content */}
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto overflow-y-visible gap-2 md:gap-3 px-4 md:px-12 pb-4 md:pb-8 carousel-container"
        >
          {displayContent.map((item) => {
            if (!item || !item.id) return null;
            
            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="flex-shrink-0 w-[180px] sm:w-[200px] md:w-[244px] touch-manipulation relative transition-all duration-300"
                style={{ 
                  filter: hoveredId !== null && hoveredId !== item.id ? 'blur(2px)' : 'blur(0px)',
                  opacity: hoveredId !== null && hoveredId !== item.id ? 0.5 : 1,
                  zIndex: hoveredId === item.id ? 100 : 1
                }}
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
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .carousel-container {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .carousel-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
