import { useState, useEffect } from 'react';
import { Movie, getImageUrl, getTitle } from '../utils/tmdb';
import { OptimizedImage } from './OptimizedImage';
import { getCachedDetails, extractGenres, extractAgeRating, extractLogoFromDetails } from '../utils/tmdbCache';

// Icons inline to avoid lucide-react dependency
const Plus = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const ThumbsUp = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
  </svg>
);

const ChevronDown = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const Clock = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const Play = ({ className = "", fill = "none" }: { className?: string; fill?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

const Volume2 = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
  </svg>
);

interface MovieCardProps {
  movie: Movie;
  onClick?: () => void;
  onAddToList?: () => void;
  onLike?: () => void;
  onWatchLater?: () => void;
  isInList?: boolean;
  isLiked?: boolean;
  isInWatchLater?: boolean;
}

export function MovieCard({ movie, onClick, onAddToList, onLike, onWatchLater, isInList = false, isLiked = false, isInWatchLater = false }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [logoPath, setLogoPath] = useState<string | null>(null);
  const [genres, setGenres] = useState<string[]>([]);
  const [ageRating, setAgeRating] = useState<string>('');
  const [episodes, setEpisodes] = useState<number>(0);
  
  // Verificar se movie existe e tem dados válidos
  if (!movie || !movie.id) {
    return null;
  }
  
  // Determinar se é filme ou série e quantas temporadas (se aplicável)
  const mediaType = movie.media_type || (movie.first_air_date && !movie.release_date ? 'tv' : 'movie');
  const title = getTitle(movie);
  const subtitle = (movie as any).name && (movie as any).number_of_seasons 
    ? `${(movie as any).number_of_seasons} temporada${(movie as any).number_of_seasons > 1 ? 's' : ''}`
    : movie.release_date 
      ? new Date(movie.release_date).getFullYear().toString()
      : movie.first_air_date
        ? new Date(movie.first_air_date).getFullYear().toString()
        : 'Ano desconhecido';

  // Buscar logo, gêneros, classificação e episódios COM CACHE
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // Buscar detalhes com cache (uma única requisição)
        const details = await getCachedDetails(mediaType, movie.id);
        
        if (!details) return;
        
        // Extrair logo
        const logo = extractLogoFromDetails(details);
        if (logo) {
          setLogoPath(logo);
        }
        
        // Extrair gêneros
        const movieGenres = extractGenres(details);
        if (movieGenres.length > 0) {
          setGenres(movieGenres);
        }
        
        // Extrair classificação etária
        const rating = extractAgeRating(details, mediaType);
        setAgeRating(rating);
        
        // Contar episódios para séries
        if (mediaType === 'tv' && details.number_of_episodes) {
          setEpisodes(details.number_of_episodes);
        }
      } catch (error) {
        // Silenciar erro para não poluir console
      }
    };

    if (isHovered && !logoPath) {
      fetchDetails();
    }
  }, [isHovered, movie.id, mediaType, logoPath]);

  return (
    <div
      className="relative group cursor-pointer touch-manipulation"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* CARD NORMAL - Imagem Horizontal (Backdrop) - Responsivo mantendo proporção */}
      <div className="relative rounded-md overflow-hidden shadow-lg transition-all duration-300">
        <div 
          className="relative w-full aspect-[16/9] bg-[#141414] overflow-hidden"
          onClick={onClick}
        >
          <OptimizedImage
            src={getImageUrl(movie.backdrop_path || movie.poster_path, 'w780')}
            alt={title}
            className="w-full h-full object-cover"
            priority={false}
            blur={true}
            quality={75}
            width={500}
            height={281}
            useProxy={false}
          />
          
          {/* Logo do Filme/Série - Card Pequeno */}
          {logoPath && (
            <div className="absolute top-1 md:top-2 left-1 md:left-2 max-w-[40%]">
              <img
                src={getImageUrl(logoPath, 'w300')}
                alt={`${title} logo`}
                className="w-full h-auto max-h-6 md:max-h-12 object-contain drop-shadow-lg"
              />
            </div>
          )}
        </div>
      </div>

      {/* EXPANDED HOVER CARD - Estilo Netflix - 30% MAIOR */}
      {isHovered && (
        <div 
          className="absolute top-0 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in zoom-in duration-300"
          style={{ 
            transformOrigin: 'center top',
            width: '390px' // 300px + 30% = 390px
          }}
        >
          <div className="bg-[#181818] rounded-lg overflow-hidden shadow-2xl border-2 border-gray-700">
            {/* Imagem Grande - Horizontal */}
            <div className="relative aspect-[16/9] overflow-hidden">
              <OptimizedImage
                src={getImageUrl(movie.backdrop_path || movie.poster_path, 'w780')}
                alt={title}
                className="w-full h-full object-cover"
                priority={true}
                blur={true}
                quality={85}
                width={780}
                height={439}
                useProxy={false}
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent pointer-events-none" />
              
              {/* Volume Icon - Top Right */}
              <div className="absolute top-4 right-4 z-10">
                <button className="w-9 h-9 rounded-full border-2 border-white/60 hover:border-white bg-transparent/40 backdrop-blur-sm flex items-center justify-center transition-colors">
                  <Volume2 className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Content Info */}
            <div className="p-5">
              {/* Logo do Filme/Série ou Título */}
              {logoPath ? (
                <div className="flex items-center justify-start mb-4">
                  <img
                    src={getImageUrl(logoPath, 'w500')}
                    alt={`${title} logo`}
                    className="max-w-[60%] h-auto max-h-16 object-contain"
                  />
                </div>
              ) : (
                <h3 className="text-white text-xl font-bold mb-4 line-clamp-2">
                  {title}
                </h3>
              )}
              
              {/* Action Buttons */}
              <div className="flex items-center gap-2 mb-4">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onClick?.();
                  }}
                  className="bg-white hover:bg-gray-200 text-black px-6 py-2 rounded-full flex items-center gap-2 transition-colors font-bold"
                >
                  <Play className="w-5 h-5" fill="currentColor" />
                  <span>Assistir</span>
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToList?.();
                  }}
                  className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${
                    isInList 
                      ? 'border-white bg-white hover:bg-gray-200' 
                      : 'border-gray-400 hover:border-white bg-[#2a2a2a] hover:bg-[#3a3a3a]'
                  }`}
                  title={isInList ? 'Remover da Minha Lista' : 'Adicionar à Minha Lista'}
                >
                  {isInList ? (
                    <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  ) : (
                    <Plus className="w-5 h-5 text-white" />
                  )}
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onLike?.();
                  }}
                  className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${
                    isLiked
                      ? 'border-[#E50914] bg-[#E50914] hover:bg-[#f40612]'
                      : 'border-gray-400 hover:border-white bg-[#2a2a2a] hover:bg-[#3a3a3a]'
                  }`}
                  title={isLiked ? 'Remover Gostei' : 'Gostei'}
                >
                  <ThumbsUp className={`w-5 h-5 ${isLiked ? 'text-white' : 'text-white'}`} />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onWatchLater?.();
                  }}
                  className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${
                    isInWatchLater
                      ? 'border-blue-500 bg-blue-500 hover:bg-blue-600'
                      : 'border-gray-400 hover:border-white bg-[#2a2a2a] hover:bg-[#3a3a3a]'
                  }`}
                  title={isInWatchLater ? 'Remover de Assistir Mais Tarde' : 'Assistir Mais Tarde'}
                >
                  <Clock className={`w-5 h-5 text-white`} />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onClick?.();
                  }}
                  className="w-9 h-9 rounded-full border-2 border-gray-400 hover:border-white bg-[#2a2a2a] hover:bg-[#3a3a3a] flex items-center justify-center transition-colors ml-auto"
                >
                  <ChevronDown className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Match, Age Rating and Info */}
              <div className="flex items-center gap-2 mb-3 text-sm flex-wrap">
                <span className="text-green-500 font-bold">
                  {Math.round(movie.vote_average * 10)}% Match
                </span>
                {ageRating && (
                  <span className="px-2 py-0.5 border-2 border-gray-400 text-white text-xs font-bold">
                    {ageRating}
                  </span>
                )}
                <span className="text-gray-400 text-sm">
                  {subtitle}
                </span>
                <span className="px-1.5 border border-gray-500 text-gray-400 text-xs">HD</span>
              </div>

              {/* Genres */}
              {genres.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-white mb-3">
                  {genres.map((genre, idx) => (
                    <span key={genre}>
                      {genre}
                      {idx < genres.length - 1 && <span className="mx-1.5 text-gray-500">•</span>}
                    </span>
                  ))}
                </div>
              )}

              {/* Description/Overview */}
              {movie.overview && (
                <p className="text-gray-400 text-sm mb-3 line-clamp-3">
                  {movie.overview}
                </p>
              )}

              {/* Episodes info for TV shows */}
              {mediaType === 'tv' && episodes > 0 && (
                <p className="text-gray-400 text-xs mb-2">
                  {episodes} episódio{episodes > 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
