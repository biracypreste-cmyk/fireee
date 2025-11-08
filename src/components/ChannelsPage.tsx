import { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { VideoPlayer } from './VideoPlayer';
import { ChannelsDebugPanel } from './ChannelsDebugPanel';
import { loadChannelsFromServer, Channel } from '../utils/channelsParser';
import redflixLogo from 'figma:asset/0fd04bd0f4dd3d36db506b272ad022b23cf78263.png';

// Icons inline to avoid lucide-react dependency
const X = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const Search = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const Heart = ({ size = 24, fill = "none" }: { size?: number; fill?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const Play = ({ size = 24, fill = "none" }: { size?: number; fill?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

const Star = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

interface ChannelsPageProps {
  onClose?: () => void;
}

export function ChannelsPage({ onClose }: ChannelsPageProps) {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('TODO');
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const categories = [
    'TODO',
    'LISTA DE FAVORITOS',
    '4K',
    'ESPORTE',
    'FILMES & SÉRIES',
    'ABERTOS',
    'INFANTIL',
    'VARIEDADES',
    'CULTURA',
    'NOTÍCIAS'
  ];

  // Carregar canais
  useEffect(() => {
    async function loadChannels() {
      try {
        setLoading(true);
        console.log('📺 ========================================');
        console.log('📺 INICIANDO CARREGAMENTO DE CANAIS REAIS');
        console.log('📺 ========================================');
        console.log('📁 Fonte: Banco de Dados Local');
        
        const loadedChannels = await loadChannelsFromServer();
        setChannels(loadedChannels);
        
        console.log('✅ CANAIS CARREGADOS COM SUCESSO!');
        
        // Debug: Verificar logos
        const canaisComLogo = loadedChannels.filter(c => c.logo && c.logo.trim() !== '').length;
        const canaisSemLogo = loadedChannels.length - canaisComLogo;
        console.log(`🖼️ Logos: ${canaisComLogo} com logo, ${canaisSemLogo} sem logo`);
        console.log(`📊 Total: ${loadedChannels.length} canais`);
        console.log('📺 ========================================');
        
        // Mostrar exemplo dos primeiros 3 canais com URLs REAIS
        if (loadedChannels.length > 0) {
          console.log('\n📺 EXEMPLO DE CANAIS COM URLs REAIS:\n');
          loadedChannels.slice(0, 3).forEach((channel, index) => {
            console.log(`${index + 1}. ${channel.name}`);
            console.log(`   🖼️ Logo: ${channel.logo}`);
            console.log(`   📡 Stream: ${channel.url}`);
            console.log(`   📂 Categoria: ${channel.category}`);
            console.log('');
          });
        }
      } catch (error) {
        console.error('❌ Erro ao carregar canais:', error);
      } finally {
        setLoading(false);
      }
    }
    loadChannels();
  }, []);

  // Filtrar canais
  const filteredChannels = channels.filter(channel => {
    // Filtro de categoria
    if (activeCategory === 'TODO') {
      // Mostrar todos
    } else if (activeCategory === 'LISTA DE FAVORITOS') {
      if (!favorites.includes(channel.id)) return false;
    } else if (activeCategory === '4K') {
      if (channel.quality !== '4K') return false;
    } else if (channel.category !== activeCategory) {
      return false;
    }

    // Filtro de busca
    if (searchTerm && !channel.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    return true;
  });

  const toggleFavorite = (id: number) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 bg-black flex overflow-hidden pt-16">
      {/* Left Sidebar - Menu de Categorias */}
      <div className="w-[260px] bg-gradient-to-b from-[#0a0a0a] to-black border-r border-white/10 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-2">
            <ImageWithFallback
              src="https://chemorena.com/redfliz.png"
              alt="RedFlix"
              className="h-12 w-auto object-contain"
              priority={true}
            />
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
                title="Voltar"
              >
                <X size={20} />
              </button>
            )}
          </div>
          <p className="text-white/50 font-['Montserrat:Semi_Bold',sans-serif] text-[10px] uppercase tracking-[2px]">
            Canais ao Vivo
          </p>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-white/10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input
              type="text"
              placeholder="Buscar canal..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 text-white pl-10 pr-4 py-2 rounded-lg border border-white/10 focus:border-[#E50914] focus:outline-none font-['Montserrat:Medium',sans-serif] text-[14px] placeholder:text-white/40"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
          {categories.map((category) => {
            const isActive = activeCategory === category;
            const count = category === 'TODO' 
              ? channels.length 
              : category === 'LISTA DE FAVORITOS'
              ? favorites.length
              : category === '4K'
              ? channels.filter(c => c.quality === '4K').length
              : channels.filter(c => c.category === category).length;

            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-[#E50914] text-white shadow-lg shadow-[#E50914]/30'
                    : 'bg-transparent text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-['Montserrat:${isActive ? 'Bold' : 'Semi_Bold'}',sans-serif] text-[14px] uppercase tracking-wide`}>
                    {category}
                  </span>
                  <span className={`font-['Montserrat:Semi_Bold',sans-serif] text-[12px] ${
                    isActive ? 'text-white' : 'text-white/40'
                  }`}>
                    {count}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="p-4 border-t border-white/10">
          <div className="bg-white/5 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-white font-['Montserrat:Semi_Bold',sans-serif] text-[12px]">
                ONLINE
              </span>
            </div>
            <p className="text-white/60 font-['Montserrat:Regular',sans-serif] text-[11px]">
              {channels.length} canais disponíveis
            </p>
          </div>
        </div>
      </div>

      {/* Main Content - Lista de Canais */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-black via-[#1a1a1a] to-black border-b border-white/10 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-white font-['Montserrat:Bold',sans-serif] text-[32px] mb-1">
                {activeCategory}
              </h1>
              <p className="text-white/60 font-['Montserrat:Medium',sans-serif] text-[14px]">
                {filteredChannels.length} {filteredChannels.length === 1 ? 'canal encontrado' : 'canais encontrados'}
              </p>
            </div>

            {/* Quality Badge */}
            <div className="flex items-center gap-3">
              <div className="bg-[#E50914]/20 border border-[#E50914] px-4 py-2 rounded-lg">
                <span className="text-[#E50914] font-['Montserrat:Bold',sans-serif] text-[14px]">
                  4K ULTRA HD
                </span>
              </div>
              <div className="bg-white/5 border border-white/20 px-4 py-2 rounded-lg">
                <span className="text-white font-['Montserrat:Semi_Bold',sans-serif] text-[14px]">
                  AO VIVO
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Channels List */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-[#E50914] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-white font-['Montserrat:Semi_Bold',sans-serif] text-[16px]">
                  Carregando canais...
                </p>
              </div>
            </div>
          ) : filteredChannels.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-white/60 font-['Montserrat:Medium',sans-serif] text-[18px]">
                  Nenhum canal encontrado
                </p>
                <p className="text-white/40 font-['Montserrat:Regular',sans-serif] text-[14px] mt-2">
                  Tente ajustar os filtros ou a busca
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 max-w-5xl">
              <>
                {filteredChannels.map((channel, index) => (
                  <div
                    key={channel.id}
                    onClick={() => setSelectedChannel(channel)}
                    className="group relative bg-gradient-to-r from-[#1a1a1a] to-[#0a0a0a] hover:from-[#E50914]/20 hover:to-[#E50914]/5 border border-white/10 hover:border-[#E50914]/50 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#E50914]/20 hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4 cursor-pointer"
                    style={{ animationDelay: `${index * 20}ms` }}
                  >
                    {/* Left Border Accent */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-[#E50914] transition-all duration-300 rounded-l-xl" />

                    <div className="flex items-center gap-5 p-5 pl-6">
                      {/* Channel Number */}
                      <div className="flex-shrink-0 w-12 text-center">
                        <span className="text-white/40 group-hover:text-[#E50914] font-['Montserrat:Bold',sans-serif] text-[18px] transition-colors">
                          {String(index + 1).padStart(3, '0')}
                        </span>
                      </div>

                      {/* Channel Logo */}
                      <div className="flex-shrink-0" onClick={(e) => {
                        e.stopPropagation();
                        setSelectedChannel(channel);
                      }}>
                        <div className="w-[60px] h-[60px] bg-gradient-to-br from-white/10 to-white/5 rounded-xl overflow-hidden border border-white/20 group-hover:border-[#E50914]/70 transition-all shadow-lg hover:scale-105 hover:shadow-xl cursor-pointer">
                          {channel.logo && channel.logo.trim() !== '' ? (
                            <ImageWithFallback
                              src={channel.logo}
                              alt={channel.name}
                              className="w-full h-full object-contain p-2"
                              priority={false}
                              blur={false}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#E50914]/20 to-[#E50914]/10 text-white font-['Montserrat:Bold',sans-serif] text-[12px] p-2 text-center leading-tight">
                              {channel.name.split(' ').map(w => w[0]).join('').substring(0, 3).toUpperCase()}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Channel Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-['Montserrat:Bold',sans-serif] text-[18px] truncate group-hover:text-[#E50914] transition-colors">
                          {channel.name}
                        </h3>
                        <p className="text-white/50 font-['Montserrat:Medium',sans-serif] text-[13px] mt-1">
                          {channel.category}
                        </p>
                      </div>

                      {/* Quality Tag */}
                      {channel.quality === '4K' && (
                        <div className="flex-shrink-0">
                          <div className="bg-[#E50914]/20 border border-[#E50914] px-3 py-1 rounded">
                            <span className="text-[#E50914] font-['Montserrat:Bold',sans-serif] text-[12px]">
                              4K
                            </span>
                          </div>
                        </div>
                      )}
                      {channel.quality === 'HD' && (
                        <div className="flex-shrink-0">
                          <div className="bg-blue-500/20 border border-blue-500 px-3 py-1 rounded">
                            <span className="text-blue-400 font-['Montserrat:Bold',sans-serif] text-[12px]">
                              HD
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex-shrink-0 flex items-center gap-2">
                        {/* Favorite Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(channel.id);
                          }}
                          className={`p-2 rounded-lg transition-all ${
                            favorites.includes(channel.id)
                              ? 'bg-[#E50914] text-white'
                              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <Heart
                            size={18}
                            fill={favorites.includes(channel.id) ? 'currentColor' : 'none'}
                          />
                        </button>

                        {/* Play Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedChannel(channel);
                          }}
                          className="flex items-center gap-2 bg-[#E50914] hover:bg-[#c41a23] text-white px-4 py-2 rounded-lg transition-all shadow-lg shadow-[#E50914]/30 group-hover:scale-105"
                        >
                          <Play size={18} fill="white" />
                          <span className="font-['Montserrat:Bold',sans-serif] text-[14px]">
                            Assistir
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Programs Preview */}
                    {channel.programs.length > 0 && (
                      <div className="px-6 pb-4 pt-2 border-t border-white/5">
                        <div className="flex items-center gap-2 text-white/40 font-['Montserrat:Regular',sans-serif] text-[12px]">
                          <Star size={14} className="text-[#E50914]" />
                          <span className="truncate">{channel.programs.slice(0, 3).join(' • ')}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </>
            </div>
          )}
        </div>
      </div>

      {/* Video Player Modal */}
      <>
        {selectedChannel && (
          <div className="animate-in fade-in duration-300">
            <VideoPlayer
              channel={selectedChannel}
              onClose={() => setSelectedChannel(null)}
            />
          </div>
        )}
      </>

      {/* Debug Panel - Mostra que os dados são REAIS */}
      <ChannelsDebugPanel channels={channels} />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E50914;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #c41a23;
        }
      `}</style>
    </div>
  );
}
