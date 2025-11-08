import { useState, useEffect } from 'react';
import { Movie, getDetails, getImages, getSeason, getCredits, getImageUrl, getTitle, getVideos } from '../utils/tmdb';
import { OptimizedImage } from './OptimizedImage';
import { UniversalPlayer } from './UniversalPlayer';
import { getContentUrl, isValidStreamUrl } from '../utils/contentUrls';
import { buscarPorNome, ConteudoItem } from '../utils/m3uTmdbSync';
import svgPaths from '../imports/svg-ynd0965yz';

// Icons inline to avoid lucide-react dependency
const Play = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

const Info = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

const Heart = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const ArrowLeft = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const X = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

interface Episode {
  id: number;
  name: string;
  overview: string;
  still_path: string | null;
  episode_number: number;
  runtime: number;
  air_date: string;
}

interface Season {
  id: number;
  name: string;
  overview: string;
  episode_count: number;
  season_number: number;
  episodes: Episode[];
}

interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export function MovieDetails({ movie, onClose, onActorClick }: { movie: Movie; onClose: () => void; onActorClick?: (actorId: number, actorName: string) => void }) {
  const [details, setDetails] = useState<any>(null);
  const [logo, setLogo] = useState<string | null>(null);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [currentSeason, setCurrentSeason] = useState<Season | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [showUniversalPlayer, setShowUniversalPlayer] = useState(false);

  const mediaType = movie.first_air_date ? 'tv' : 'movie';

  useEffect(() => {
    async function fetchDetails() {
      try {
        setLoading(true);
        
        console.log('🎬 MovieDetails - Abrindo detalhes:', {
          id: movie.id,
          title: movie.title || movie.name,
          mediaType: mediaType,
          hasFirstAirDate: !!movie.first_air_date
        });
        
        // Validar ID antes de buscar
        if (!movie.id || movie.id <= 0) {
          console.warn('⚠️ Invalid movie ID, skipping fetch');
          setLoading(false);
          return;
        }
        
        // Fetch full details com append_to_response (traz tudo de uma vez)
        const detailsData = await getDetails(mediaType, movie.id);
        setDetails(detailsData);
        
        // 🔗 BUSCAR URL REAL DO SUPABASE (nova integração)
        const title = getTitle(movie);
        console.log('🔍 Buscando URL real no Supabase para:', title);
        
        try {
          const resultados = await buscarPorNome(title);
          console.log('📊 Resultados do Supabase:', resultados.length);
          
          if (resultados.length > 0) {
            // Filtrar pelo tipo correto
            const tipoCorreto = mediaType === 'tv' ? 'Série' : 'Filme';
            const itemCorreto = resultados.find(r => r.tipo === tipoCorreto) || resultados[0];
            
            if (itemCorreto && itemCorreto.url) {
              console.log('✅ URL real encontrada:', itemCorreto.url);
              setStreamUrl(itemCorreto.url);
            } else {
              console.log('⚠️ Item encontrado mas sem URL');
            }
          } else {
            console.log('⚠️ Nenhum resultado no Supabase, tentando fallback...');
            // Fallback: Buscar nos JSONs locais
            const urlLocal = await getContentUrl(title, mediaType);
            if (urlLocal && isValidStreamUrl(urlLocal)) {
              console.log('✅ URL local encontrada:', urlLocal);
              setStreamUrl(urlLocal);
            }
          }
        } catch (supabaseError) {
          console.error('❌ Erro ao buscar no Supabase:', supabaseError);
          // Fallback: Buscar nos JSONs locais
          const urlLocal = await getContentUrl(title, mediaType);
          if (urlLocal && isValidStreamUrl(urlLocal)) {
            console.log('✅ Usando URL local de fallback:', urlLocal);
            setStreamUrl(urlLocal);
          }
        }
        
        // Extrair logo das imagens (já vem no append_to_response)
        if (detailsData.images?.logos) {
          const logoImage = detailsData.images.logos.find((l: any) => l.iso_639_1 === 'pt') || 
                           detailsData.images.logos.find((l: any) => l.iso_639_1 === 'en') || 
                           detailsData.images.logos[0];
          if (logoImage) {
            setLogo(logoImage.file_path);
          }
        }
        
        // Extrair elenco (já vem no append_to_response)
        if (detailsData.credits?.cast) {
          setCast(detailsData.credits.cast.slice(0, 20));
        }
        
        // Extrair trailer (já vem no append_to_response)
        if (detailsData.videos?.results) {
          const trailer = detailsData.videos.results.find((v: any) => 
            v.type === 'Trailer' && v.site === 'YouTube'
          ) || detailsData.videos.results[0];
          if (trailer) {
            setTrailerKey(trailer.key);
          }
        }
        
        // Se for série, processar temporadas
        if (mediaType === 'tv' && detailsData.seasons) {
          const validSeasons = detailsData.seasons.filter((s: any) => s.season_number > 0);
          console.log('📺 Temporadas válidas encontradas:', validSeasons.length);
          setSeasons(validSeasons);
          
          // Buscar episódios da primeira temporada
          if (validSeasons.length > 0) {
            try {
              console.log('📺 Buscando episódios da Temporada 1 via API TMDB...');
              const seasonData = await getSeason(movie.id, 1);
              console.log('✅ Temporada 1 carregada:', {
                name: seasonData.name,
                hasEpisodes: !!seasonData?.episodes,
                episodeCount: seasonData?.episodes?.length || 0
              });
              
              if (seasonData && seasonData.episodes && seasonData.episodes.length > 0) {
                setCurrentSeason(seasonData);
                console.log('✅ currentSeason atualizado com', seasonData.episodes.length, 'episódios');
              } else {
                console.warn('⚠️ Temporada 1 sem episódios');
              }
            } catch (error) {
              console.error('❌ Erro ao buscar temporada 1:', error);
              console.error('Stack:', error instanceof Error ? error.stack : 'N/A');
            }
          }
        }
        
        setLoading(false);
      } catch (error) {
        // Silenciar 404s (conteúdo não encontrado é esperado)
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (!errorMessage.includes('Not found')) {
          console.error('❌ Error fetching movie details:', error);
        }
        // Mesmo com erro, continuar sem travar a UI
        setLoading(false);
      }
    }
    
    fetchDetails();
  }, [movie.id, mediaType]);

  useEffect(() => {
    async function fetchSeasonEpisodes() {
      if (mediaType === 'tv' && selectedSeason > 0) {
        try {
          console.log(`📺 Buscando temporada ${selectedSeason} da série ${movie.id}...`);
          const seasonData = await getSeason(movie.id, selectedSeason);
          console.log(`✅ Temporada ${selectedSeason} carregada:`, {
            hasEpisodes: !!seasonData.episodes,
            episodeCount: seasonData.episodes?.length || 0,
            seasonName: seasonData.name
          });
          setCurrentSeason(seasonData);
        } catch (error) {
          console.error(`❌ Error fetching season ${selectedSeason}:`, error);
        }
      }
    }
    
    fetchSeasonEpisodes();
  }, [selectedSeason, movie.id, mediaType]);

  if (loading || !details) {
    return (
      <div className="fixed inset-0 bg-[#151515] z-50 flex items-center justify-center">
        <p className="text-white text-xl">Carregando...</p>
      </div>
    );
  }

  const backdropUrl = movie.backdrop_path ? getImageUrl(movie.backdrop_path, 'original') : null;

  const handlePlayClick = () => {
    // Abrir Universal Player com stream URL ou trailer
    setShowUniversalPlayer(true);
    console.log('🎬 Abrindo player universal...');
    console.log('📡 Stream URL:', streamUrl);
    console.log('🎥 Trailer Key:', trailerKey);
  };

  const handleEpisodePlay = (episodeId: number) => {
    // Open video player for specific episode
    setPlayingVideo(`episode-${episodeId}`);
  };

  return (
    <div className="fixed inset-0 bg-[#151515] z-50 overflow-y-auto">
      {/* Universal Player */}
      {showUniversalPlayer && (
        <UniversalPlayer
          movie={movie}
          streamUrl={streamUrl}
          trailerUrl={trailerKey}
          onClose={() => setShowUniversalPlayer(false)}
        />
      )}
      
      {/* Video Player Modal (antigo - para episódios) */}
      {playingVideo && !showUniversalPlayer && (
        <div className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center p-4">
          <div className="relative w-full max-w-6xl aspect-video">
            <button
              onClick={() => setPlayingVideo(null)}
              className="absolute -top-12 right-0 text-white hover:text-red-600 transition-colors flex items-center gap-2"
            >
              <X size={32} />
              <span className="font-['Inter:Medium',sans-serif]">Fechar</span>
            </button>
            {playingVideo.startsWith('episode-') ? (
              // Episode player
              <div className="w-full h-full bg-[#000] rounded flex items-center justify-center">
                <div className="text-center">
                  <Play size={64} className="text-white/50 mx-auto mb-4" />
                  <p className="text-white font-['Inter:Medium',sans-serif] text-xl mb-2">
                    Player de Episódio
                  </p>
                  <p className="text-white/70 font-['Inter:Regular',sans-serif] text-sm max-w-md">
                    Conecte este ID ao seu serviço de streaming para assistir ao episódio completo.
                  </p>
                  <p className="text-red-600 font-['Inter:Bold',sans-serif] mt-4 text-lg">
                    ID: {playingVideo}
                  </p>
                </div>
              </div>
            ) : (
              // Trailer player (YouTube)
              <iframe
                className="w-full h-full rounded"
                src={`https://www.youtube.com/embed/${playingVideo}?autoplay=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </div>
      )}
      {/* Header with backdrop */}
      <div className="relative h-[500px]">
        {backdropUrl && (
          <div className="absolute inset-0 overflow-hidden">
            <OptimizedImage
              src={backdropUrl}
              alt={getTitle(movie)}
              priority={true}
              width={1920}
              height={1080}
              quality={90}
              useProxy={true}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#151515] via-[rgba(21,21,21,0.7)] to-transparent" />
        
        {/* Back button */}
        <button
          onClick={onClose}
          className="absolute top-6 left-6 z-10 flex items-center gap-2 text-white hover:text-red-600 transition-colors"
        >
          <ArrowLeft size={24} />
          <span className="font-['Inter:Medium',sans-serif] text-[16px]">Voltar</span>
        </button>
        
        {/* Title and info */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          {logo ? (
            <div className="mb-4">
              <img 
                src={getImageUrl(logo, 'w500')} 
                alt={getTitle(movie)}
                className="max-w-[400px] max-h-[120px] object-contain"
              />
            </div>
          ) : (
            <h1 className="font-['Inter:Extra_Bold',sans-serif] text-[48px] text-white mb-4">
              {getTitle(movie)}
            </h1>
          )}
          
          <div className="flex items-center gap-4 mb-4">
            {details.vote_average && (
              <div className="flex items-center gap-2">
                <div className="bg-red-600 rounded px-2 py-1">
                  <span className="text-white font-['Inter:Bold',sans-serif]">
                    {details.vote_average.toFixed(1)}
                  </span>
                </div>
              </div>
            )}
            {mediaType === 'tv' && details.number_of_seasons && (
              <span className="text-white font-['Inter:Medium',sans-serif]">
                {details.number_of_seasons} {details.number_of_seasons === 1 ? 'temporada' : 'temporadas'}
              </span>
            )}
            {details.genres && details.genres.length > 0 && (
              <span className="text-[#bebebe] font-['Inter:Medium',sans-serif]">
                {details.genres.map((g: any) => g.name).join(', ')}
              </span>
            )}
          </div>
          
          <p className="text-[#bebebe] font-['Inter:Medium',sans-serif] text-[16px] max-w-[800px] mb-6">
            {movie.overview}
          </p>
          
          <div className="flex gap-4">
            <button 
              onClick={handlePlayClick}
              className="bg-red-600 hover:bg-red-700 transition-colors rounded-[4px] px-6 py-3 flex items-center gap-2"
            >
              <Play size={20} fill="white" color="white" />
              <span className="text-white font-['Inter:Semi_Bold',sans-serif] text-[16px]">Assistir</span>
            </button>
            <button className="bg-[#333333] hover:bg-[#404040] transition-colors rounded-[4px] px-6 py-3 flex items-center gap-2">
              <Info size={20} color="white" />
              <span className="text-white font-['Inter:Semi_Bold',sans-serif] text-[16px]">Mais Info</span>
            </button>
            <button className="bg-[#333333] hover:bg-[#404040] transition-colors rounded-[4px] px-4 py-3">
              <Heart size={20} color="white" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Content area */}
      <div className="px-8 py-8">
        {/* Biografia/Overview */}
        {details.overview && (
          <div className="mb-8">
            <h2 className="font-['Inter:Bold',sans-serif] text-[24px] text-white mb-4">Sinopse</h2>
            <p className="text-[#bebebe] font-['Inter:Medium',sans-serif] text-[16px] leading-relaxed max-w-4xl">
              {details.overview}
            </p>
            
            {/* Informações adicionais */}
            <div className="mt-4 flex flex-wrap gap-4 text-[14px]">
              {details.release_date && (
                <div>
                  <span className="text-[#888888]">Data de lançamento: </span>
                  <span className="text-white">{new Date(details.release_date).toLocaleDateString('pt-BR')}</span>
                </div>
              )}
              {details.first_air_date && (
                <div>
                  <span className="text-[#888888]">Primeira exibição: </span>
                  <span className="text-white">{new Date(details.first_air_date).toLocaleDateString('pt-BR')}</span>
                </div>
              )}
              {details.runtime && (
                <div>
                  <span className="text-[#888888]">Duração: </span>
                  <span className="text-white">{details.runtime} minutos</span>
                </div>
              )}
              {details.episode_run_time && details.episode_run_time.length > 0 && (
                <div>
                  <span className="text-[#888888]">Duração do episódio: </span>
                  <span className="text-white">{details.episode_run_time[0]} minutos</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Cast */}
        {cast.length > 0 && (
          <div className="mb-8">
            <h2 className="font-['Inter:Bold',sans-serif] text-[24px] text-white mb-6">Elenco Principal</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {cast.map((actor) => (
                <div 
                  key={actor.id} 
                  className="flex-shrink-0 flex flex-col items-center gap-2 w-[120px] group cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={() => {
                    console.log('🎭 Clicou no ator:', actor.name, 'ID:', actor.id);
                    onActorClick?.(actor.id, actor.name);
                  }}
                >
                  <div className="relative w-[100px] h-[100px] rounded-full overflow-hidden border-2 border-white/10 group-hover:border-red-600 group-hover:shadow-lg group-hover:shadow-red-600/50 transition-all duration-300">
                    {actor.profile_path ? (
                      <OptimizedImage
                        src={getImageUrl(actor.profile_path, 'w300')}
                        alt={actor.name}
                        width={100}
                        height={100}
                        quality={85}
                        useProxy={true}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#333333] flex items-center justify-center">
                        <svg 
                          className="w-12 h-12 text-white/30" 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-white font-['Inter:Medium',sans-serif] text-[14px] truncate w-full">
                      {actor.name}
                    </p>
                    <p className="text-[#bebebe] font-['Inter:Regular',sans-serif] text-[12px] truncate w-full">
                      {actor.character}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Seasons & Episodes for TV shows */}
        {mediaType === 'tv' && (
          <div>
            {seasons.length > 0 ? (
              <>
                <h2 className="font-['Inter:Bold',sans-serif] text-[24px] text-white mb-6">
                  Temporadas e Episódios
                </h2>
            
            {/* Season tabs */}
            <div className="flex gap-4 mb-6 border-b border-[#333333] overflow-x-auto pb-2">
              {seasons.map((season) => (
                <button
                  key={season.id}
                  onClick={() => setSelectedSeason(season.season_number)}
                  className={`pb-3 px-4 font-['Inter:Medium',sans-serif] text-[16px] transition-colors whitespace-nowrap ${
                    selectedSeason === season.season_number
                      ? 'text-white border-b-2 border-red-600'
                      : 'text-[#bebebe] hover:text-white'
                  }`}
                >
                  Temporada {season.season_number}
                </button>
              ))}
            </div>
            
            {/* Episodes list */}
            {currentSeason && currentSeason.episodes && currentSeason.episodes.length > 0 ? (
              <div className="space-y-4">
                {currentSeason.episodes.map((episode) => (
                  <div 
                    key={episode.id}
                    className="bg-[#252525] rounded-lg p-4 hover:bg-[#2a2a2a] transition-colors group"
                  >
                    <div className="flex gap-4">
                      {episode.still_path && (
                        <div className="relative w-[200px] h-[112px] flex-shrink-0 rounded overflow-hidden">
                          <OptimizedImage
                            src={getImageUrl(episode.still_path, 'w300')}
                            alt={episode.name}
                            width={200}
                            height={112}
                            quality={80}
                            useProxy={true}
                            className="w-full h-full object-cover"
                          />
                          {/* Play button overlay */}
                          <button
                            onClick={() => handleEpisodePlay(episode.id)}
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                          >
                            <div className="bg-red-600 rounded-full p-3 hover:bg-red-700 transition-colors">
                              <Play size={24} fill="white" color="white" />
                            </div>
                          </button>
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <h3 className="font-['Inter:Semi_Bold',sans-serif] text-[18px] text-white">
                              {episode.episode_number}. {episode.name}
                            </h3>
                            <button
                              onClick={() => handleEpisodePlay(episode.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 hover:bg-red-700 rounded-full p-2"
                            >
                              <Play size={16} fill="white" color="white" />
                            </button>
                          </div>
                          {episode.runtime && (
                            <span className="text-[#bebebe] font-['Inter:Medium',sans-serif] text-[14px] whitespace-nowrap">
                              {episode.runtime} min
                            </span>
                          )}
                        </div>
                        <p className="text-[#bebebe] font-['Inter:Medium',sans-serif] text-[14px] line-clamp-2">
                          {episode.overview || 'Sem descrição disponível'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#252525] rounded-lg p-8 text-center">
                <p className="text-[#bebebe] font-['Inter:Medium',sans-serif] text-[16px] mb-2">
                  Carregando episódios da Temporada {selectedSeason}...
                </p>
                <p className="text-[#666666] font-['Inter:Regular',sans-serif] text-[14px]">
                  Aguarde um momento
                </p>
              </div>
            )}
              </>
            ) : (
              <div className="bg-[#252525] rounded-lg p-8 text-center">
                <p className="text-[#bebebe] font-['Inter:Medium',sans-serif] text-[16px] mb-2">
                  📺 Esta série não possui informações de temporadas disponíveis
                </p>
                <p className="text-[#666666] font-['Inter:Regular',sans-serif] text-[14px]">
                  Tipo de mídia: {mediaType} | Temporadas carregadas: {seasons.length}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
