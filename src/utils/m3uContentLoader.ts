/**
 * M3U Content Loader - Carrega filmes e séries do lista.m3u
 * Substitui completamente filmes.json e series.json
 */

import { parseM3U, M3UEntry } from './m3uParser';

export interface M3UContent {
  id: number;
  title: string;
  name?: string;
  poster_path?: string;
  backdrop_path?: string;
  overview?: string;
  vote_average?: number;
  release_date?: string;
  genre_ids?: number[];
  streamUrl: string;
  category: string;
  type: 'movie' | 'tv';
  logo?: string;
  original_title?: string;
}

interface CachedM3UData {
  filmes: M3UContent[];
  series: M3UContent[];
  canais: M3UEntry[];
  timestamp: number;
}

let m3uCache: CachedM3UData | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

/**
 * Detecta se um item é filme ou série baseado no nome e categoria
 */
function detectType(entry: M3UEntry): 'movie' | 'tv' | 'canal' {
  const nome = entry.nome.toLowerCase();
  const categoria = (entry.categoria || entry.group_title || '').toLowerCase();
  
  // Palavras-chave para canais
  const canalKeywords = ['tv', 'canal', 'channel', 'ao vivo', 'live', 'news', 'sport', 'esporte'];
  if (canalKeywords.some(k => categoria.includes(k) || nome.includes(k))) {
    return 'canal';
  }
  
  // Palavras-chave para séries
  const serieKeywords = ['serie', 'series', 'temporada', 'season', 's0', 's1', 's2', 's3', 'episodio', 'episode', 'ep'];
  if (serieKeywords.some(k => categoria.includes(k) || nome.includes(k))) {
    return 'tv';
  }
  
  // Palavras-chave para filmes
  const filmeKeywords = ['filme', 'movie', 'cinema'];
  if (filmeKeywords.some(k => categoria.includes(k))) {
    return 'movie';
  }
  
  // Padrão: se tem ano no nome, provavelmente é filme
  if (/\b(19|20)\d{2}\b/.test(nome)) {
    return 'movie';
  }
  
  // Se não identificou, tentar pela URL
  if (entry.url && (entry.url.includes('/movie/') || entry.url.includes('/filme/'))) {
    return 'movie';
  }
  
  if (entry.url && (entry.url.includes('/serie/') || entry.url.includes('/tv/'))) {
    return 'tv';
  }
  
  // Padrão: assumir filme
  return 'movie';
}

/**
 * Extrai o nome limpo do título (remove ano, qualidade, etc)
 */
function cleanTitle(title: string): string {
  return title
    .replace(/\b(19|20)\d{2}\b/g, '') // Remove ano
    .replace(/\b(1080p|720p|480p|360p|HD|FHD|4K|UHD|BluRay|WEB-DL|WEBRip)\b/gi, '') // Remove qualidade
    .replace(/\b(Dublado|Legendado|Dual|Audio)\b/gi, '') // Remove info de áudio
    .replace(/\[.*?\]/g, '') // Remove colchetes
    .replace(/\(.*?\)/g, '') // Remove parênteses
    .replace(/\s+/g, ' ') // Remove espaços extras
    .trim();
}

/**
 * Converte entrada M3U para formato de conteúdo
 */
function entryToContent(entry: M3UEntry, index: number, type: 'movie' | 'tv'): M3UContent {
  const cleanedTitle = cleanTitle(entry.nome);
  
  return {
    id: index + 1000, // IDs começam em 1000 para não conflitar com TMDB
    title: cleanedTitle,
    name: type === 'tv' ? cleanedTitle : undefined,
    original_title: entry.nome,
    poster_path: entry.logo || undefined,
    backdrop_path: undefined,
    overview: `Stream: ${cleanedTitle}`,
    vote_average: 0,
    release_date: undefined,
    genre_ids: [],
    streamUrl: entry.url,
    category: entry.categoria || entry.group_title || 'outros',
    type: type,
    logo: entry.logo,
  };
}

/**
 * Carrega e processa o arquivo lista.m3u
 */
export async function loadM3UContent(forceRefresh = false): Promise<CachedM3UData> {
  // Verificar cache
  if (!forceRefresh && m3uCache && Date.now() - m3uCache.timestamp < CACHE_DURATION) {
    console.log('📦 Usando cache M3U');
    return m3uCache;
  }
  
  console.log('🎬 Carregando lista.m3u...');
  
  try {
    // Tentar carregar do public/data/lista.m3u
    const response = await fetch('/data/lista.m3u');
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const content = await response.text();
    
    if (!content || content.trim().length === 0) {
      throw new Error('Arquivo M3U vazio');
    }
    
    console.log(`✅ lista.m3u carregado:`, content.length, 'bytes');
    
    // Parse do M3U
    const entries = parseM3U(content);
    console.log('📋 Total de entradas:', entries.length);
    
    // Separar por tipo
    const filmes: M3UContent[] = [];
    const series: M3UContent[] = [];
    const canais: M3UEntry[] = [];
    
    entries.forEach((entry, index) => {
      const type = detectType(entry);
      
      if (type === 'movie') {
        filmes.push(entryToContent(entry, filmes.length, 'movie'));
      } else if (type === 'tv') {
        series.push(entryToContent(entry, series.length, 'tv'));
      } else {
        canais.push(entry);
      }
    });
    
    console.log(`🎬 Filmes encontrados: ${filmes.length}`);
    console.log(`📺 Séries encontradas: ${series.length}`);
    console.log(`📡 Canais encontrados: ${canais.length}`);
    
    // Criar cache
    m3uCache = {
      filmes,
      series,
      canais,
      timestamp: Date.now(),
    };
    
    return m3uCache;
  } catch (error) {
    console.log('📦 M3U file not available, using embedded content');
    
    // Retornar cache antigo se existir
    if (m3uCache) {
      console.log('✅ Using cached M3U data');
      return m3uCache;
    }
    
    // Retornar dados vazios se não há cache - o sistema usará o fallback
    console.log('✅ Switching to embedded fallback (100+ items)');
    return {
      filmes: [],
      series: [],
      canais: [],
      timestamp: Date.now(),
    };
  }
}

/**
 * Carrega apenas filmes do M3U
 */
export async function loadM3UFilmes(): Promise<M3UContent[]> {
  const data = await loadM3UContent();
  return data.filmes;
}

/**
 * Carrega apenas séries do M3U
 */
export async function loadM3USeries(): Promise<M3UContent[]> {
  const data = await loadM3UContent();
  return data.series;
}

/**
 * Carrega apenas canais do M3U
 */
export async function loadM3UCanais(): Promise<M3UEntry[]> {
  const data = await loadM3UContent();
  return data.canais;
}

/**
 * Busca conteúdo por título
 */
export async function searchM3UContent(query: string): Promise<M3UContent[]> {
  const data = await loadM3UContent();
  const searchTerm = query.toLowerCase();
  
  const allContent = [...data.filmes, ...data.series];
  
  return allContent.filter(item => 
    item.title.toLowerCase().includes(searchTerm) ||
    item.original_title?.toLowerCase().includes(searchTerm) ||
    item.category.toLowerCase().includes(searchTerm)
  );
}

/**
 * Obtém conteúdo por categoria
 */
export async function getM3UByCategory(category: string, type?: 'movie' | 'tv'): Promise<M3UContent[]> {
  const data = await loadM3UContent();
  const categoryLower = category.toLowerCase();
  
  let content = type === 'movie' ? data.filmes : 
                type === 'tv' ? data.series : 
                [...data.filmes, ...data.series];
  
  if (category === 'all' || category === 'todos') {
    return content;
  }
  
  return content.filter(item => 
    item.category.toLowerCase().includes(categoryLower)
  );
}

/**
 * Obtém todas as categorias únicas
 */
export async function getM3UCategories(): Promise<string[]> {
  const data = await loadM3UContent();
  const allContent = [...data.filmes, ...data.series];
  
  const categories = new Set<string>();
  allContent.forEach(item => {
    if (item.category && item.category !== 'outros') {
      categories.add(item.category);
    }
  });
  
  return Array.from(categories).sort();
}

/**
 * Limpa o cache (útil para forçar reload)
 */
export function clearM3UCache(): void {
  m3uCache = null;
  console.log('🗑️ Cache M3U limpo');
}

/**
 * Verifica se o arquivo M3U existe
 */
export async function checkM3UExists(): Promise<boolean> {
  try {
    const response = await fetch('/data/lista.m3u', { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Obtém estatísticas do M3U
 */
export async function getM3UStats(): Promise<{
  totalFilmes: number;
  totalSeries: number;
  totalCanais: number;
  categories: string[];
  lastUpdate: Date;
}> {
  const data = await loadM3UContent();
  const categories = await getM3UCategories();
  
  return {
    totalFilmes: data.filmes.length,
    totalSeries: data.series.length,
    totalCanais: data.canais.length,
    categories,
    lastUpdate: new Date(data.timestamp),
  };
}
