/**
 * Sistema de Proxy de Imagens para RedFlix
 * 
 * Gerencia cache de imagens do TMDB usando Supabase Storage
 * para evitar requisições repetidas à API externa
 */

import { projectId, publicAnonKey } from './supabase/info';

interface ImageProxyResponse {
  url: string;
  cached: boolean;
  expires?: string;
}

interface ImageProxyCache {
  [key: string]: {
    url: string;
    expiresAt: number;
  };
}

// Cache em memória para evitar requisições repetidas durante a sessão
const memoryCache: ImageProxyCache = {};

/**
 * Obtém URL da imagem através do sistema de proxy com cache
 * 
 * @param originalUrl URL original da imagem do TMDB
 * @returns URL da imagem em cache ou proxied
 */
export async function getProxiedImageUrl(originalUrl: string): Promise<string> {
  // Se não for uma URL do TMDB, retornar a URL original
  if (!originalUrl || !originalUrl.includes('image.tmdb.org')) {
    return originalUrl;
  }

  // Verificar cache em memória primeiro
  const cached = memoryCache[originalUrl];
  if (cached && cached.expiresAt > Date.now()) {
    return cached.url;
  }

  try {
    // Fazer requisição ao endpoint de proxy
    const proxyUrl = `https://${projectId}.supabase.co/functions/v1/make-server-2363f5d6/image-proxy?url=${encodeURIComponent(originalUrl)}`;
    
    const response = await fetch(proxyUrl, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`
      }
    });

    if (!response.ok) {
      console.warn(`⚠️ Image proxy failed for ${originalUrl}, using original URL`);
      return originalUrl;
    }

    const data: ImageProxyResponse = await response.json();

    // Guardar no cache em memória (válido por 6 dias para ser seguro)
    memoryCache[originalUrl] = {
      url: data.url,
      expiresAt: Date.now() + (6 * 24 * 60 * 60 * 1000) // 6 dias
    };

    return data.url;
  } catch (error) {
    console.error(`❌ Error proxying image:`, error);
    // Em caso de erro, retornar URL original como fallback
    return originalUrl;
  }
}

/**
 * Pré-carrega múltiplas imagens em cache
 * 
 * @param urls Array de URLs para pré-carregar
 */
export async function preloadImages(urls: string[]): Promise<void> {
  const tmdbUrls = urls.filter(url => url && url.includes('image.tmdb.org'));
  
  if (tmdbUrls.length === 0) return;

  console.log(`📦 Pre-loading ${tmdbUrls.length} images to cache...`);

  // Fazer requisições em paralelo (máximo 10 por vez)
  const batchSize = 10;
  for (let i = 0; i < tmdbUrls.length; i += batchSize) {
    const batch = tmdbUrls.slice(i, i + batchSize);
    await Promise.all(
      batch.map(url => getProxiedImageUrl(url).catch(() => url))
    );
  }

  console.log(`✅ Pre-loading complete`);
}

/**
 * Limpa cache em memória
 */
export function clearMemoryCache(): void {
  Object.keys(memoryCache).forEach(key => delete memoryCache[key]);
  console.log('🗑️ Memory cache cleared');
}

/**
 * Limpa cache expirado no servidor
 */
export async function clearExpiredServerCache(): Promise<void> {
  try {
    const url = `https://${projectId}.supabase.co/functions/v1/make-server-2363f5d6/clear-image-cache`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Server cache cleared: ${data.deletedCount} entries removed`);
    }
  } catch (error) {
    console.error('❌ Error clearing server cache:', error);
  }
}

/**
 * Obtém estatísticas do cache de imagens
 */
export async function getImageCacheStats(): Promise<any> {
  try {
    const url = `https://${projectId}.supabase.co/functions/v1/make-server-2363f5d6/image-cache-stats`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`
      }
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('❌ Error getting cache stats:', error);
  }
  
  return null;
}

/**
 * Hook React para usar o proxy de imagens
 */
export function useImageProxy() {
  return {
    getProxiedUrl: getProxiedImageUrl,
    preloadImages,
    clearMemoryCache,
    clearServerCache: clearExpiredServerCache,
    getStats: getImageCacheStats
  };
}
