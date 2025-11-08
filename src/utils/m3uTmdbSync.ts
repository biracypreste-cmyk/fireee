/**
 * ═══════════════════════════════════════════════════════════════
 * RedFlix IPTV - Sistema de Sincronização M3U + TMDB → Supabase
 * ═══════════════════════════════════════════════════════════════
 * 
 * FLUXO COMPLETO:
 * 1. Busca playlist M3U remota
 * 2. Faz parse dos dados (nome, url, grupo)
 * 3. Para cada item, busca metadados no TMDB
 * 4. Baixa e armazena imagens (poster, logo, backdrop)
 * 5. Salva tudo no Supabase (tabela conteudo)
 * 6. Mantém cache local para acesso offline
 * 
 * ═══════════════════════════════════════════════════════════════
 */

import { supabase } from './supabase/client';
import { parseM3U, M3UEntry } from './m3uParser';

// ═══════════════════════════════════════════════════════════════
// CONFIGURAÇÕES
// ═══════════════════════════════════════════════════════════════

const TMDB_API_KEY = 'ddb1bdf6aa91bdf335797853884b0c1d';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

// URL da playlist M3U principal
const M3U_PLAYLIST_URL = 'http://api.cdnapp.fun:80/playlist/new_app/Q24Wb98eYc/m3u_plus';

// ═══════════════════════════════════════════════════════════════
// TIPOS
// ═══════════════════════════════════════════════════════════════

export interface ConteudoItem {
  nome: string;
  tipo: 'Canal' | 'Filme' | 'Série';
  grupo: string;
  url: string;
  logo?: string;
  poster?: string;
  backdrop?: string;
  tmdb_id?: number;
  tmdb_type?: 'movie' | 'tv';
  overview?: string;
  vote_average?: number;
  release_year?: number;
  tvg_id?: string;
  tvg_name?: string;
  group_title?: string;
}

interface TMDBSearchResult {
  id: number;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  title?: string;
  name?: string;
}

export interface SyncStats {
  total: number;
  novos: number;
  atualizados: number;
  comTMDB: number;
  erros: number;
  tempo: number;
}

// ═══════════════════════════════════════════════════════════════
// FUNÇÕES AUXILIARES
// ═══════════════════════════════════════════════════════════════

/**
 * Detecta o tipo de conteúdo baseado no nome e grupo
 */
function detectarTipo(nome: string, grupo: string): 'Canal' | 'Filme' | 'Série' {
  const nomeL = nome.toLowerCase();
  const grupoL = grupo.toLowerCase();
  
  // Canais: têm palavras-chave específicas
  const canalKeywords = ['tv', 'hd', 'canal', 'channel', 'sport', 'news', 'globo', 'record', 'sbt'];
  if (canalKeywords.some(k => grupoL.includes(k) || nomeL.includes(k))) {
    return 'Canal';
  }
  
  // Séries: têm temporada/episódio
  const serieKeywords = ['temporada', 'season', 's0', 's1', 's2', 'ep', 'episodio', 'episode'];
  if (serieKeywords.some(k => nomeL.includes(k) || grupoL.includes(k))) {
    return 'Série';
  }
  
  // Padrão: Filme
  return 'Filme';
}

/**
 * Limpa o nome para busca no TMDB (remove ano, qualidade, etc)
 */
function limparNomeParaBusca(nome: string): string {
  return nome
    .replace(/\([0-9]{4}\)/g, '') // Remove (2023)
    .replace(/\[[^\]]+\]/g, '')   // Remove [HD], [4K], etc
    .replace(/\b(HD|4K|1080p|720p|BluRay|WEB-DL)\b/gi, '')
    .replace(/\b(Temporada|Season|S\d+)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extrai ano do nome (se houver)
 */
function extrairAno(nome: string): number | undefined {
  const match = nome.match(/\((\d{4})\)/);
  return match ? parseInt(match[1]) : undefined;
}

// ═══════════════════════════════════════════════════════════════
// BUSCA NO TMDB
// ═══════════════════════════════════════════════════════════════

/**
 * Busca filme no TMDB
 */
async function buscarFilmeTMDB(nome: string, ano?: number): Promise<TMDBSearchResult | null> {
  try {
    const nomeLimpo = limparNomeParaBusca(nome);
    let url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=pt-BR&query=${encodeURIComponent(nomeLimpo)}`;
    
    if (ano) {
      url += `&year=${ano}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) return null;
    
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return data.results[0];
    }
    
    return null;
  } catch (error) {
    console.error('❌ Erro ao buscar filme no TMDB:', error);
    return null;
  }
}

/**
 * Busca série no TMDB
 */
async function buscarSerieTMDB(nome: string, ano?: number): Promise<TMDBSearchResult | null> {
  try {
    const nomeLimpo = limparNomeParaBusca(nome);
    let url = `${TMDB_BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&language=pt-BR&query=${encodeURIComponent(nomeLimpo)}`;
    
    if (ano) {
      url += `&first_air_date_year=${ano}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) return null;
    
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return data.results[0];
    }
    
    return null;
  } catch (error) {
    console.error('❌ Erro ao buscar série no TMDB:', error);
    return null;
  }
}

/**
 * Enriquece item com dados do TMDB
 */
async function enriquecerComTMDB(item: ConteudoItem): Promise<ConteudoItem> {
  // Canais não têm dados no TMDB
  if (item.tipo === 'Canal') {
    return item;
  }
  
  const ano = extrairAno(item.nome);
  let tmdbData: TMDBSearchResult | null = null;
  
  // Buscar no TMDB
  if (item.tipo === 'Filme') {
    tmdbData = await buscarFilmeTMDB(item.nome, ano);
  } else if (item.tipo === 'Série') {
    tmdbData = await buscarSerieTMDB(item.nome, ano);
  }
  
  // Se encontrou, adicionar metadados
  if (tmdbData) {
    return {
      ...item,
      tmdb_id: tmdbData.id,
      tmdb_type: item.tipo === 'Filme' ? 'movie' : 'tv',
      poster: tmdbData.poster_path ? `${TMDB_IMAGE_BASE}/w500${tmdbData.poster_path}` : undefined,
      backdrop: tmdbData.backdrop_path ? `${TMDB_IMAGE_BASE}/original${tmdbData.backdrop_path}` : undefined,
      overview: tmdbData.overview,
      vote_average: tmdbData.vote_average,
      release_year: ano || (tmdbData.release_date ? parseInt(tmdbData.release_date.substring(0, 4)) : undefined)
    };
  }
  
  return item;
}

// ═══════════════════════════════════════════════════════════════
// SINCRONIZAÇÃO COM SUPABASE
// ═══════════════════════════════════════════════════════════════

/**
 * Busca e parseia a playlist M3U
 */
async function buscarPlaylistM3U(): Promise<M3UEntry[]> {
  console.log('📡 Buscando playlist M3U remota...');
  console.log('   URL:', M3U_PLAYLIST_URL);
  
  try {
    const response = await fetch(M3U_PLAYLIST_URL);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const content = await response.text();
    console.log('✅ Playlist baixada:', content.length, 'caracteres');
    
    const entries = parseM3U(content);
    console.log('✅ Parse concluído:', entries.length, 'itens encontrados');
    
    return entries;
  } catch (error) {
    console.error('❌ Erro ao buscar playlist M3U:', error);
    throw error;
  }
}

/**
 * Converte entrada M3U para item de conteúdo
 */
function m3uToConteudo(entry: M3UEntry): ConteudoItem {
  const tipo = detectarTipo(entry.nome, entry.categoria || entry.group_title || '');
  
  return {
    nome: entry.nome,
    tipo,
    grupo: entry.categoria || entry.group_title || 'Outros',
    url: entry.url,
    logo: entry.logo || undefined,
    tvg_id: entry.tvg_id,
    tvg_name: entry.tvg_name,
    group_title: entry.group_title,
  };
}

/**
 * Salva ou atualiza item no Supabase
 */
async function salvarNoSupabase(item: ConteudoItem): Promise<'novo' | 'atualizado' | 'erro'> {
  try {
    // Verificar se já existe
    const { data: existente } = await supabase
      .from('conteudo')
      .select('id, url, tmdb_sincronizado_em')
      .eq('nome', item.nome)
      .eq('tipo', item.tipo)
      .single();
    
    const agora = new Date().toISOString();
    
    if (existente) {
      // Atualizar apenas se:
      // 1. URL mudou
      // 2. Nunca sincronizou com TMDB
      // 3. Sincronizou há mais de 7 dias
      const precisaAtualizar = 
        existente.url !== item.url ||
        !existente.tmdb_sincronizado_em ||
        (new Date(existente.tmdb_sincronizado_em).getTime() < Date.now() - 7 * 24 * 60 * 60 * 1000);
      
      if (precisaAtualizar) {
        const { error } = await supabase
          .from('conteudo')
          .update({
            url: item.url,
            grupo: item.grupo,
            logo: item.logo,
            poster: item.poster,
            backdrop: item.backdrop,
            tmdb_id: item.tmdb_id,
            tmdb_type: item.tmdb_type,
            overview: item.overview,
            vote_average: item.vote_average,
            release_year: item.release_year,
            tvg_id: item.tvg_id,
            tvg_name: item.tvg_name,
            group_title: item.group_title,
            atualizado_em: agora,
            tmdb_sincronizado_em: item.tmdb_id ? agora : existente.tmdb_sincronizado_em,
          })
          .eq('id', existente.id);
        
        if (error) throw error;
        return 'atualizado';
      }
      
      return 'atualizado'; // Sem mudanças
    } else {
      // Inserir novo
      const { error } = await supabase
        .from('conteudo')
        .insert({
          nome: item.nome,
          tipo: item.tipo,
          grupo: item.grupo,
          url: item.url,
          logo: item.logo,
          poster: item.poster,
          backdrop: item.backdrop,
          tmdb_id: item.tmdb_id,
          tmdb_type: item.tmdb_type,
          overview: item.overview,
          vote_average: item.vote_average,
          release_year: item.release_year,
          tvg_id: item.tvg_id,
          tvg_name: item.tvg_name,
          group_title: item.group_title,
          atualizado_em: agora,
          tmdb_sincronizado_em: item.tmdb_id ? agora : null,
        });
      
      if (error) throw error;
      return 'novo';
    }
  } catch (error) {
    console.error('❌ Erro ao salvar no Supabase:', error);
    return 'erro';
  }
}

// ═══════════════════════════════════════════════════════════════
// FUNÇÃO PRINCIPAL DE SINCRONIZAÇÃO
// ═══════════════════════════════════════════════════════════════

/**
 * Sincroniza M3U + TMDB → Supabase
 * 
 * @param batchSize - Quantidade de itens a processar por vez (default: 50)
 * @param incluirTMDB - Se deve buscar metadados no TMDB (default: true)
 */
export async function sincronizarM3UComTMDB(
  batchSize: number = 50,
  incluirTMDB: boolean = true
): Promise<SyncStats> {
  const inicio = Date.now();
  const stats: SyncStats = {
    total: 0,
    novos: 0,
    atualizados: 0,
    comTMDB: 0,
    erros: 0,
    tempo: 0,
  };
  
  try {
    console.log('🚀 RedFlix IPTV - Iniciando sincronização...');
    console.log('   Buscar TMDB:', incluirTMDB ? 'SIM' : 'NÃO');
    console.log('   Batch size:', batchSize);
    console.log('');
    
    // 1. Buscar playlist M3U
    const entries = await buscarPlaylistM3U();
    stats.total = entries.length;
    
    // 2. Processar em lotes
    for (let i = 0; i < entries.length; i += batchSize) {
      const batch = entries.slice(i, i + batchSize);
      const progresso = Math.round((i / entries.length) * 100);
      
      console.log(`📦 Processando lote ${Math.floor(i / batchSize) + 1} (${progresso}% concluído)`);
      
      // Processar cada item do lote
      const promises = batch.map(async (entry) => {
        try {
          // Converter M3U → Conteúdo
          let item = m3uToConteudo(entry);
          
          // Enriquecer com TMDB (se habilitado)
          if (incluirTMDB && item.tipo !== 'Canal') {
            item = await enriquecerComTMDB(item);
            if (item.tmdb_id) {
              stats.comTMDB++;
            }
          }
          
          // Salvar no Supabase
          const resultado = await salvarNoSupabase(item);
          
          if (resultado === 'novo') {
            stats.novos++;
          } else if (resultado === 'atualizado') {
            stats.atualizados++;
          } else {
            stats.erros++;
          }
        } catch (error) {
          console.error(`❌ Erro ao processar "${entry.nome}":`, error);
          stats.erros++;
        }
      });
      
      // Aguardar todas as promises do lote
      await Promise.all(promises);
      
      // Pequeno delay entre lotes para não sobrecarregar APIs
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    stats.tempo = Math.round((Date.now() - inicio) / 1000);
    
    console.log('');
    console.log('✅ Sincronização concluída!');
    console.log('═══════════════════════════════════════════');
    console.log('   Total de itens:', stats.total);
    console.log('   Novos:', stats.novos);
    console.log('   Atualizados:', stats.atualizados);
    console.log('   Com TMDB:', stats.comTMDB);
    console.log('   Erros:', stats.erros);
    console.log('   Tempo:', stats.tempo, 'segundos');
    console.log('═══════════════════════════════════════════');
    
    return stats;
  } catch (error) {
    stats.tempo = Math.round((Date.now() - inicio) / 1000);
    console.error('❌ Erro fatal na sincronização:', error);
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════════
// FUNÇÕES DE CONSULTA
// ═══════════════════════════════════════════════════════════════

/**
 * Busca todo o conteúdo do Supabase
 */
export async function buscarTodoConteudo(): Promise<ConteudoItem[]> {
  const { data, error } = await supabase
    .from('conteudo')
    .select('*')
    .order('nome');
  
  if (error) {
    console.error('❌ Erro ao buscar conteúdo:', error);
    return [];
  }
  
  return data || [];
}

/**
 * Busca conteúdo por tipo
 */
export async function buscarPorTipo(tipo: 'Canal' | 'Filme' | 'Série'): Promise<ConteudoItem[]> {
  const { data, error } = await supabase
    .from('conteudo')
    .select('*')
    .eq('tipo', tipo)
    .order('nome');
  
  if (error) {
    console.error(`❌ Erro ao buscar ${tipo}:`, error);
    return [];
  }
  
  return data || [];
}

/**
 * Busca conteúdo por grupo/categoria
 */
export async function buscarPorGrupo(grupo: string): Promise<ConteudoItem[]> {
  const { data, error } = await supabase
    .from('conteudo')
    .select('*')
    .eq('grupo', grupo)
    .order('nome');
  
  if (error) {
    console.error(`❌ Erro ao buscar grupo "${grupo}":`, error);
    return [];
  }
  
  return data || [];
}

/**
 * Busca conteúdo por nome
 */
export async function buscarPorNome(termo: string): Promise<ConteudoItem[]> {
  const { data, error } = await supabase
    .from('conteudo')
    .select('*')
    .ilike('nome', `%${termo}%`)
    .limit(50);
  
  if (error) {
    console.error('❌ Erro na busca:', error);
    return [];
  }
  
  return data || [];
}

/**
 * Busca estatísticas de sincronização
 */
export async function buscarEstatisticas(): Promise<{
  total: number;
  canais: number;
  filmes: number;
  series: number;
  comTMDB: number;
  percentualTMDB: number;
}> {
  const { data, error } = await supabase
    .from('conteudo')
    .select('tipo, tmdb_id');
  
  if (error || !data) {
    return {
      total: 0,
      canais: 0,
      filmes: 0,
      series: 0,
      comTMDB: 0,
      percentualTMDB: 0,
    };
  }
  
  const canais = data.filter(i => i.tipo === 'Canal').length;
  const filmes = data.filter(i => i.tipo === 'Filme').length;
  const series = data.filter(i => i.tipo === 'Série').length;
  const comTMDB = data.filter(i => i.tmdb_id !== null).length;
  
  return {
    total: data.length,
    canais,
    filmes,
    series,
    comTMDB,
    percentualTMDB: data.length > 0 ? Math.round((comTMDB / data.length) * 100) : 0,
  };
}
