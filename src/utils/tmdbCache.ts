/**
 * Sistema de Cache em Memória para TMDB
 * Evita requisições duplicadas e melhora performance
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// Cache TTL: 5 minutos
const CACHE_TTL = 5 * 60 * 1000;

// Caches em memória
const detailsCache = new Map<string, CacheEntry<any>>();
const logoCache = new Map<string, CacheEntry<string | null>>();

/**
 * Limpa entradas expiradas do cache
 */
function cleanExpiredEntries<T>(cache: Map<string, CacheEntry<T>>) {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (now - entry.timestamp > CACHE_TTL) {
      cache.delete(key);
    }
  }
}

/**
 * Busca detalhes de filme/série com cache
 */
export async function getCachedDetails(
  mediaType: 'movie' | 'tv',
  id: number
): Promise<any | null> {
  const cacheKey = `${mediaType}-${id}`;
  
  // Verificar cache
  const cached = detailsCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  // Buscar da API
  try {
    // Adicionar include_image_language para garantir que pegamos logos PT, EN e null
    const response = await fetch(
      `https://api.themoviedb.org/3/${mediaType}/${id}?api_key=ddb1bdf6aa91bdf335797853884b0c1d&language=pt-BR&append_to_response=content_ratings,release_dates,images&include_image_language=pt,en,null`,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    
    // Salvar no cache
    detailsCache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
    
    // Limpar cache periodicamente
    if (detailsCache.size > 100) {
      cleanExpiredEntries(detailsCache);
    }
    
    return data;
  } catch (error) {
    console.error(`❌ Erro ao buscar detalhes ${mediaType}/${id}:`, error);
    return null;
  }
}

/**
 * Busca logo de filme/série com cache
 */
export async function getCachedLogo(
  mediaType: 'movie' | 'tv',
  id: number
): Promise<string | null> {
  const cacheKey = `${mediaType}-${id}-logo`;
  
  // Verificar cache
  const cached = logoCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  // Buscar da API
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/${mediaType}/${id}/images?api_key=ddb1bdf6aa91bdf335797853884b0c1d&include_image_language=pt,en,null`
    );
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    const logos = data.logos || [];
    
    // Priorizar logos: PT > EN > Qualquer
    const ptLogo = logos.find((img: any) => img.iso_639_1 === 'pt');
    const enLogo = logos.find((img: any) => img.iso_639_1 === 'en');
    const anyLogo = logos[0];
    
    const selectedLogo = ptLogo || enLogo || anyLogo;
    const logoPath = selectedLogo ? selectedLogo.file_path : null;
    
    // Salvar no cache
    logoCache.set(cacheKey, {
      data: logoPath,
      timestamp: Date.now()
    });
    
    // Limpar cache periodicamente
    if (logoCache.size > 200) {
      cleanExpiredEntries(logoCache);
    }
    
    return logoPath;
  } catch (error) {
    console.error(`Erro ao buscar logo ${mediaType}/${id}:`, error);
    return null;
  }
}

/**
 * Extrai gêneros dos detalhes
 */
export function extractGenres(details: any): string[] {
  return details?.genres?.slice(0, 3).map((g: any) => g.name) || [];
}

/**
 * Extrai classificação etária dos detalhes
 */
export function extractAgeRating(details: any, mediaType: 'movie' | 'tv'): string {
  if (mediaType === 'tv' && details.content_ratings?.results) {
    const brRating = details.content_ratings.results.find((r: any) => r.iso_3166_1 === 'BR');
    const usRating = details.content_ratings.results.find((r: any) => r.iso_3166_1 === 'US');
    return brRating?.rating || usRating?.rating || 'L';
  } else if (mediaType === 'movie' && details.release_dates?.results) {
    const brRelease = details.release_dates.results.find((r: any) => r.iso_3166_1 === 'BR');
    const usRelease = details.release_dates.results.find((r: any) => r.iso_3166_1 === 'US');
    const certification = brRelease?.release_dates?.[0]?.certification || usRelease?.release_dates?.[0]?.certification;
    return certification || 'L';
  }
  return 'L';
}

/**
 * Extrai logo dos detalhes (quando append_to_response=images)
 */
export function extractLogoFromDetails(details: any): string | null {
  const logos = details?.images?.logos || [];
  
  const ptLogo = logos.find((img: any) => img.iso_639_1 === 'pt');
  const enLogo = logos.find((img: any) => img.iso_639_1 === 'en');
  const anyLogo = logos[0];
  
  const selectedLogo = ptLogo || enLogo || anyLogo;
  return selectedLogo ? selectedLogo.file_path : null;
}

/**
 * Limpa todo o cache (para debug)
 */
export function clearCache() {
  detailsCache.clear();
  logoCache.clear();
}

/**
 * Retorna estatísticas do cache (para debug)
 */
export function getCacheStats() {
  return {
    detailsSize: detailsCache.size,
    logoSize: logoCache.size,
    totalSize: detailsCache.size + logoCache.size
  };
}
