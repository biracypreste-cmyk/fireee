import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

type IPTVPlayerProps = {
  url?: string;
  streamUrl?: string; // Compatibilidade com código antigo
  poster?: string;
  autoPlay?: boolean;
  title?: string;
  onClose?: () => void;
};

/**
 * 🎬 IPTVPlayer - Compatível com .TS, .M3U8, .MP4 e outros formatos de mídia.
 * Detecta automaticamente o tipo de vídeo e usa o player adequado.
 */
export default function IPTVPlayer({ 
  url, 
  streamUrl, 
  poster, 
  autoPlay = true, 
  title,
  onClose 
}: IPTVPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Suporta tanto 'url' quanto 'streamUrl' para compatibilidade
  const videoUrl = url || streamUrl || '';

  useEffect(() => {
    if (!videoUrl || !videoRef.current) return;

    const isHLS = videoUrl.endsWith('.m3u8') || videoUrl.endsWith('.ts') || videoUrl.includes('.m3u8');
    const video = videoRef.current;

    console.log('🎬 Carregando stream:', videoUrl);
    console.log('📡 É HLS?', isHLS);

    if (isHLS && Hls.isSupported()) {
      console.log('✅ Usando HLS.js para reprodução');
      
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
        maxBufferLength: 30,
        maxMaxBufferLength: 600,
        maxBufferSize: 60 * 1000 * 1000, // 60 MB
      });
      
      hls.loadSource(videoUrl);
      hls.attachMedia(video);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('✅ HLS manifest parsed');
        if (autoPlay) {
          video.play().catch(err => {
            console.warn('⚠️ Autoplay bloqueado:', err);
          });
        }
      });
      
      hls.on(Hls.Events.ERROR, (event, data) => {
        console.warn('⚠️ HLS.js error:', data);
        
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.log('🔄 Tentando recuperar de erro de rede...');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log('🔄 Tentando recuperar de erro de mídia...');
              hls.recoverMediaError();
              break;
            default:
              console.error('❌ Erro fatal HLS:', data);
              break;
          }
        }
      });
      
      return () => {
        console.log('🧹 Destruindo HLS.js');
        hls.destroy();
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari/iOS suporte nativo HLS
      console.log('✅ Usando HLS nativo (Safari/iOS)');
      video.src = videoUrl;
      
      if (autoPlay) {
        video.play().catch(err => {
          console.warn('⚠️ Autoplay bloqueado:', err);
        });
      }
    } else {
      // Fallback para MP4 e outros formatos
      console.log('✅ Usando player HTML5 nativo');
      video.src = videoUrl;
      
      if (autoPlay) {
        video.play().catch(err => {
          console.warn('⚠️ Autoplay bloqueado:', err);
        });
      }
    }
  }, [videoUrl, autoPlay]);

  return (
    <div className="relative flex justify-center items-center w-full h-full bg-black overflow-hidden">
      <video
        ref={videoRef}
        controls
        playsInline
        poster={poster}
        className="w-full h-full max-h-[85vh] object-contain"
        onError={(e) => {
          console.error('❌ Erro ao carregar stream:', videoUrl);
          console.error('Detalhes do erro:', e);
        }}
        onLoadedMetadata={() => {
          console.log('✅ Metadados carregados');
        }}
        onCanPlay={() => {
          console.log('✅ Vídeo pronto para reprodução');
        }}
      />
      
      {/* Título do vídeo */}
      {title && (
        <div className="absolute top-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg text-sm md:text-base font-semibold backdrop-blur-sm">
          📺 {title}
        </div>
      )}
      
      {/* Botão de fechar */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-black/70 text-white px-4 py-2 rounded-full hover:bg-[#E50914] transition-colors backdrop-blur-sm font-semibold"
        >
          ✕ Fechar
        </button>
      )}
    </div>
  );
}
