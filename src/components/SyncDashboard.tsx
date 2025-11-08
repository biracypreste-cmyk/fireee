/**
 * ═══════════════════════════════════════════════════════════════
 * RedFlix IPTV - Dashboard de Sincronização
 * ═══════════════════════════════════════════════════════════════
 * 
 * Painel de controle para sincronizar M3U + TMDB → Supabase
 * 
 * ═══════════════════════════════════════════════════════════════
 */

import { useState, useEffect } from 'react';
import { sincronizarM3UComTMDB, buscarEstatisticas, SyncStats } from '../utils/m3uTmdbSync';

export function SyncDashboard() {
  const [syncing, setSyncing] = useState(false);
  const [stats, setStats] = useState<SyncStats | null>(null);
  const [dbStats, setDbStats] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [incluirTMDB, setIncluirTMDB] = useState(true);
  const [batchSize, setBatchSize] = useState(50);

  // Carregar estatísticas do banco
  useEffect(() => {
    carregarEstatisticas();
  }, []);

  async function carregarEstatisticas() {
    try {
      const estatisticas = await buscarEstatisticas();
      setDbStats(estatisticas);
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err);
    }
  }

  async function iniciarSincronizacao() {
    setSyncing(true);
    setError(null);
    setStats(null);

    try {
      console.log('🚀 Iniciando sincronização via Dashboard...');
      const resultado = await sincronizarM3UComTMDB(batchSize, incluirTMDB);
      setStats(resultado);
      
      // Atualizar estatísticas do banco
      await carregarEstatisticas();
      
      console.log('✅ Sincronização concluída com sucesso!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('❌ Erro na sincronização:', err);
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            🎬 RedFlix IPTV - Sincronização
          </h1>
          <p className="text-gray-400">
            Sincronize playlists M3U com metadados do TMDB e salve no Supabase
          </p>
        </div>

        {/* Estatísticas do Banco */}
        {dbStats && (
          <div className="bg-gradient-to-r from-red-900/20 to-red-800/20 border border-red-500/30 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              📊 Estatísticas do Banco de Dados
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-black/40 p-4 rounded">
                <div className="text-gray-400 text-sm mb-1">Total</div>
                <div className="text-3xl font-bold">{dbStats.total.toLocaleString()}</div>
              </div>
              <div className="bg-black/40 p-4 rounded">
                <div className="text-gray-400 text-sm mb-1">Canais</div>
                <div className="text-3xl font-bold text-blue-400">{dbStats.canais.toLocaleString()}</div>
              </div>
              <div className="bg-black/40 p-4 rounded">
                <div className="text-gray-400 text-sm mb-1">Filmes</div>
                <div className="text-3xl font-bold text-green-400">{dbStats.filmes.toLocaleString()}</div>
              </div>
              <div className="bg-black/40 p-4 rounded">
                <div className="text-gray-400 text-sm mb-1">Séries</div>
                <div className="text-3xl font-bold text-purple-400">{dbStats.series.toLocaleString()}</div>
              </div>
              <div className="bg-black/40 p-4 rounded">
                <div className="text-gray-400 text-sm mb-1">Com TMDB</div>
                <div className="text-3xl font-bold text-yellow-400">
                  {dbStats.percentualTMDB}%
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {dbStats.comTMDB.toLocaleString()} itens
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Configurações */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">⚙️ Configurações</h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                id="incluirTMDB"
                checked={incluirTMDB}
                onChange={(e) => setIncluirTMDB(e.target.checked)}
                className="w-5 h-5 rounded border-gray-600 bg-gray-800 text-red-600 focus:ring-red-500"
                disabled={syncing}
              />
              <label htmlFor="incluirTMDB" className="flex-1">
                <div className="font-semibold">Buscar metadados no TMDB</div>
                <div className="text-sm text-gray-400">
                  Baixa capas, posters, sinopses e avaliações do The Movie Database
                </div>
              </label>
            </div>

            <div>
              <label className="block mb-2">
                <span className="font-semibold">Tamanho do lote (batch size)</span>
                <span className="text-sm text-gray-400 ml-2">
                  Quantidade de itens processados por vez
                </span>
              </label>
              <input
                type="number"
                min="10"
                max="200"
                step="10"
                value={batchSize}
                onChange={(e) => setBatchSize(parseInt(e.target.value))}
                className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white focus:border-red-500 focus:outline-none"
                disabled={syncing}
              />
              <div className="text-xs text-gray-500 mt-1">
                Recomendado: 50 (balance entre velocidade e carga nas APIs)
              </div>
            </div>
          </div>
        </div>

        {/* Botão de Sincronização */}
        <div className="mb-8">
          <button
            onClick={iniciarSincronizacao}
            disabled={syncing}
            className={`
              w-full py-4 px-6 rounded-lg font-bold text-lg
              transition-all duration-200
              ${syncing
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-red-500/50'
              }
            `}
          >
            {syncing ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Sincronizando... Aguarde
              </span>
            ) : (
              <span>🚀 Iniciar Sincronização M3U + TMDB</span>
            )}
          </button>
        </div>

        {/* Erro */}
        {error && (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-8">
            <div className="flex items-start gap-3">
              <span className="text-2xl">❌</span>
              <div className="flex-1">
                <h3 className="font-bold mb-1">Erro na Sincronização</h3>
                <p className="text-red-300">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Resultado da Sincronização */}
        {stats && (
          <div className="bg-gradient-to-br from-green-900/20 to-green-800/20 border border-green-500/30 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              ✅ Sincronização Concluída
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-black/40 p-4 rounded">
                <div className="text-gray-400 text-sm mb-1">Total Processado</div>
                <div className="text-3xl font-bold">{stats.total.toLocaleString()}</div>
              </div>
              <div className="bg-black/40 p-4 rounded">
                <div className="text-gray-400 text-sm mb-1">Novos</div>
                <div className="text-3xl font-bold text-green-400">{stats.novos.toLocaleString()}</div>
              </div>
              <div className="bg-black/40 p-4 rounded">
                <div className="text-gray-400 text-sm mb-1">Atualizados</div>
                <div className="text-3xl font-bold text-blue-400">{stats.atualizados.toLocaleString()}</div>
              </div>
              <div className="bg-black/40 p-4 rounded">
                <div className="text-gray-400 text-sm mb-1">Com TMDB</div>
                <div className="text-3xl font-bold text-yellow-400">{stats.comTMDB.toLocaleString()}</div>
              </div>
              <div className="bg-black/40 p-4 rounded">
                <div className="text-gray-400 text-sm mb-1">Erros</div>
                <div className="text-3xl font-bold text-red-400">{stats.erros.toLocaleString()}</div>
              </div>
              <div className="bg-black/40 p-4 rounded">
                <div className="text-gray-400 text-sm mb-1">Tempo</div>
                <div className="text-3xl font-bold">{stats.tempo}s</div>
              </div>
            </div>

            <div className="bg-black/60 p-4 rounded border border-green-500/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">💾</span>
                <h3 className="font-bold">Dados salvos no Supabase</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Todos os itens foram salvos na tabela <code className="bg-black/40 px-2 py-1 rounded">conteudo</code>.
                As imagens do TMDB foram vinculadas e estão prontas para uso.
              </p>
            </div>
          </div>
        )}

        {/* Instruções */}
        <div className="mt-8 bg-gray-900 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">📚 Como Funciona</h2>
          
          <div className="space-y-4 text-gray-300">
            <div className="flex items-start gap-3">
              <span className="text-2xl">1️⃣</span>
              <div>
                <h3 className="font-semibold text-white mb-1">Busca Playlist M3U</h3>
                <p className="text-sm">
                  Baixa a playlist remota de{' '}
                  <code className="bg-black px-2 py-0.5 rounded text-xs">
                    http://api.cdnapp.fun:80/playlist/new_app/Q24Wb98eYc/m3u_plus
                  </code>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">2️⃣</span>
              <div>
                <h3 className="font-semibold text-white mb-1">Parse dos Dados</h3>
                <p className="text-sm">
                  Extrai nome, URL de streaming, categoria, logos e metadados de cada item
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">3️⃣</span>
              <div>
                <h3 className="font-semibold text-white mb-1">Enriquecimento TMDB</h3>
                <p className="text-sm">
                  Para filmes e séries, busca no The Movie Database: capas, posters, sinopses, avaliações
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">4️⃣</span>
              <div>
                <h3 className="font-semibold text-white mb-1">Salva no Supabase</h3>
                <p className="text-sm">
                  Insere novos itens ou atualiza existentes na tabela <code className="bg-black px-2 py-0.5 rounded text-xs">conteudo</code>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">5️⃣</span>
              <div>
                <h3 className="font-semibold text-white mb-1">Pronto para Usar!</h3>
                <p className="text-sm">
                  Todos os componentes do RedFlix agora carregam dados do Supabase com URLs reais e imagens cached
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
