import { useState, useEffect } from 'react';
import { Movie, getImageUrl, getImages } from '../utils/tmdb';
import { OptimizedImage } from './OptimizedImage';
import svgPaths from '../imports/svg-ynd0965yz';

interface CategoryBannerProps {
  content: Movie | null;
  onPlayClick?: () => void;
  onInfoClick?: () => void;
}

// Componente de Tags de Gênero (igual ao HeroSlider)
function GenreTags({ genres }: { genres?: string[] }) {
  if (!genres || genres.length === 0) return null;
  
  return (
    <div className="content-stretch flex gap-2 items-center relative shrink-0">
      {genres.slice(0, 2).map((genre, index) => (
        <div key={genre} className="flex items-center gap-2">
          {index > 0 && (
            <div className="relative shrink-0 size-[4px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
                <circle cx="2" cy="2" fill="var(--fill-0, #FEFEFE)" r="2" />
              </svg>
            </div>
          )}
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-xs sm:text-sm md:text-[16px] text-nowrap text-white whitespace-pre">
            {genre}
          </p>
        </div>
      ))}
    </div>
  );
}

// Botão Assistir (igual ao HeroSlider)
function PlayButton({ onClick }: { onClick?: () => void }) {
  return (
    <div 
      onClick={onClick} 
      className="bg-red-600 box-border content-stretch flex flex-col gap-[10px] h-[32px] sm:h-[36px] items-center justify-center px-3 sm:px-[11px] py-[7px] relative rounded-[4px] shrink-0 w-[90px] sm:w-[103px] cursor-pointer hover:bg-red-700 transition-colors active:scale-95"
    >
      <div className="content-stretch flex gap-1 sm:gap-[6px] items-center justify-center relative shrink-0">
        <div className="relative shrink-0 size-[18px] sm:size-[24px]">
          <div className="absolute inset-[11.43%_20.39%_11.43%_20.4%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 19">
              <path d={svgPaths.p4f15700} fill="var(--fill-0, #FEFEFE)" />
            </svg>
          </div>
        </div>
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-sm sm:text-[16px] text-nowrap text-white whitespace-pre">
          Assistir
        </p>
      </div>
    </div>
  );
}

// Botão Mais Info (igual ao HeroSlider)
function InfoButton({ onClick }: { onClick?: () => void }) {
  return (
    <div 
      onClick={onClick} 
      className="bg-[#333333] box-border content-stretch flex flex-col gap-[10px] h-[32px] sm:h-[36px] items-start px-3 sm:px-[11px] py-[6px] relative rounded-[4px] shrink-0 w-[110px] sm:w-[126px] cursor-pointer hover:bg-[#404040] transition-colors active:scale-95"
    >
      <div className="content-stretch flex gap-1 sm:gap-[6px] items-center relative shrink-0">
        <div className="relative shrink-0 size-[18px] sm:size-[24px]">
          <div className="absolute inset-[8.333%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
              <path d={svgPaths.p2f213500} fill="var(--fill-0, #FEFEFE)" />
            </svg>
          </div>
        </div>
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-sm sm:text-[16px] text-nowrap text-white whitespace-pre">
          Mais Info
        </p>
      </div>
    </div>
  );
}

export function CategoryBanner({ content, onPlayClick, onInfoClick }: CategoryBannerProps) {
  const [logoPath, setLogoPath] = useState<string | null>(null);
  const [loadingLogo, setLoadingLogo] = useState(true);

  useEffect(() => {
    if (!content) return;

    async function fetchLogo() {
      try {
        const mediaType = content.media_type === 'tv' ? 'tv' : 'movie';
        const images = await getImages(mediaType, content.id);
        const logo = images.logos?.find((l: any) => l.iso_639_1 === 'en' || l.iso_639_1 === 'pt') || images.logos?.[0];
        setLogoPath(logo?.file_path || null);
      } catch (error) {
        console.error('Error fetching logo:', error);
        setLogoPath(null);
      } finally {
        setLoadingLogo(false);
      }
    }

    fetchLogo();
  }, [content]);

  if (!content) return null;

  const title = content.title || content.name || '';
  const overview = content.overview || '';
  const backdropUrl = content.backdrop_path 
    ? getImageUrl(content.backdrop_path, 'original')
    : '';

  // Mapear genre_ids para nomes (simplificado)
  const genreMap: { [key: number]: string } = {
    28: 'Ação',
    12: 'Aventura',
    16: 'Animação',
    35: 'Comédia',
    80: 'Crime',
    99: 'Documentário',
    18: 'Drama',
    10751: 'Família',
    14: 'Fantasia',
    36: 'História',
    27: 'Terror',
    10402: 'Música',
    9648: 'Mistério',
    10749: 'Romance',
    878: 'Ficção científica',
    53: 'Thriller',
    10752: 'Guerra',
    37: 'Faroeste',
    10759: 'Action & Adventure',
    10762: 'Infantil',
    10763: 'News',
    10764: 'Reality',
    10765: 'Sci-Fi & Fantasy',
    10766: 'Soap',
    10767: 'Talk',
    10768: 'War & Politics'
  };

  const genres = content.genre_ids?.map(id => genreMap[id]).filter(Boolean) || [];

  return (
    <>
      {/* Hero Background Image - Full Width (MESMA ALTURA DA PÁGINA INICIAL) */}
      <div className="absolute top-0 left-0 w-full h-screen overflow-hidden z-[5]">
        {backdropUrl && (
          <div className="absolute top-0 left-0 w-full h-full transition-opacity duration-500">
            <OptimizedImage
              src={backdropUrl}
              alt={title}
              priority={true}
              width={1920}
              height={1080}
              quality={90}
              useProxy={true}
              className="w-full h-full object-cover"
              style={{ 
                objectPosition: 'center top'
              }}
            />
          </div>
        )}
      </div>
      
      {/* Hero Gradient Overlay - Escurece laterais (IGUAL AO HEROSLIDER) */}
      <div className="absolute bg-gradient-to-r from-[#141414] from-0% via-[rgba(20,20,20,0.5)] via-40% to-transparent to-70% h-screen top-0 left-0 w-full transition-all duration-300 z-[6]" />
      
      {/* Bottom Gradient - Transição suave (IGUAL AO HEROSLIDER) */}
      <div 
        className="absolute left-0 w-full h-48 bg-gradient-to-t from-[#141414] via-[#141414]/80 to-transparent transition-all duration-300 z-[7]"
        style={{ bottom: 0 }}
      />
      
      {/* Hero Content (IGUAL AO HEROSLIDER) */}
      <div className="absolute content-stretch flex flex-col gap-3 md:gap-6 items-start top-[25vh] sm:top-[30vh] md:top-[35vh] w-full max-w-[90%] sm:max-w-[500px] md:max-w-[600px] z-[8] px-4 md:px-12 left-0 transition-all duration-300">
        <div className="content-stretch flex flex-col gap-2 md:gap-[14px] items-start relative shrink-0 w-full">
          {/* Logo ou Título */}
          {loadingLogo ? (
            <div className="h-[50px] sm:h-[60px] md:h-[80px] w-[200px] sm:w-[250px] md:w-[300px] bg-white/10 rounded animate-pulse" />
          ) : logoPath ? (
            <div className="relative w-full max-w-[200px] sm:max-w-[250px] md:max-w-[300px] h-[50px] sm:h-[60px] md:h-[80px]">
              <img 
                src={getImageUrl(logoPath, 'w500')} 
                alt={title}
                className="w-full h-full object-contain object-left"
              />
            </div>
          ) : (
            <p className="font-['Inter:Extra_Bold',sans-serif] font-extrabold leading-tight not-italic relative shrink-0 text-2xl sm:text-3xl md:text-[40px] text-white uppercase">
              {title}
            </p>
          )}
          
          {/* Tags de Gênero */}
          <GenreTags genres={genres} />
          
          {/* Overview */}
          <div className="font-['Inter:Medium',sans-serif] font-medium leading-normal not-italic relative shrink-0 text-[#bebebe] text-xs sm:text-sm md:text-[14px] max-w-full">
            <p className="mb-0 line-clamp-3 md:line-clamp-4">{overview || 'Descrição não disponível.'}</p>
          </div>
        </div>
        
        {/* Botões */}
        <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
          <PlayButton onClick={onPlayClick} />
          <InfoButton onClick={onInfoClick} />
        </div>
      </div>
    </>
  );
}
