/**
 * Painel de Diagnóstico do Sistema de Cache de Imagens
 * 
 * Mostra estatísticas em tempo real e permite gerenciar o cache
 */

import { useState, useEffect } from 'react';
import { getImageCacheStats, clearExpiredServerCache, clearMemoryCache } from '../utils/imageProxy';

interface CacheStats {
  cache: {
    totalEntries: number;
    activeEntries: number;
    expiredEntries: number;
  };
  storage: {
    filesCount: number;
    totalSize: number;
  } | null;
}

export function ImageCacheDiagnostic() {
  const [stats, setStats] = useState<CacheStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await getImageCacheStats();
      setStats(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error loading cache stats:', error);
    }
    setLoading(false);
  };

  const handleClearExpired = async () => {
    if (!confirm('Limpar entradas expiradas do cache?')) return;
    
    setLoading(true);
    try {
      await clearExpiredServerCache();
      alert('Cache expirado limpo com sucesso!');
      await loadStats();
    } catch (error) {
      alert('Erro ao limpar cache: ' + error);
    }
    setLoading(false);
  };

  const handleClearMemory = () => {
    clearMemoryCache();
    alert('Cache em memória limpo!');
  };

  useEffect(() => {
    if (isOpen) {
      loadStats();
    }
  }, [isOpen]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-[9999] bg-[#E50914] text-white px-4 py-2 rounded-lg shadow-lg hover:bg-[#f40612] transition-all"
        title="Abrir diagnóstico de cache de imagens"
      >
        🖼️ Cache
      </button>
    );
  }

  const storageSizeMB = stats?.storage?.totalSize 
    ? (stats.storage.totalSize / 1024 / 1024).toFixed(2)
    : '0';

  const hitRate = stats?.cache
    ? ((stats.cache.activeEntries / stats.cache.totalEntries) * 100).toFixed(1)
    : '0';

  return (
    <div className="fixed bottom-4 right-4 z-[9999] bg-black/95 backdrop-blur-lg text-white rounded-lg shadow-2xl border border-white/10 w-96 max-h-[600px] overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🖼️</span>
          <h3 className="font-bold">Cache de Imagens</h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white/60 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Stats */}
      <div className="p-4 space-y-4">
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <p className="mt-2 text-white/60">Carregando...</p>
          </div>
        )}

        {!loading && stats && (
          <>
            {/* KV Cache Stats */}
            <div className="bg-white/5 rounded-lg p-3 space-y-2">
              <h4 className="font-semibold text-sm text-white/80">📊 KV Store Cache</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-white/60">Total de Entradas</p>
                  <p className="text-xl font-bold">{stats.cache.totalEntries}</p>
                </div>
                <div>
                  <p className="text-white/60">Entradas Ativas</p>
                  <p className="text-xl font-bold text-green-400">{stats.cache.activeEntries}</p>
                </div>
                <div>
                  <p className="text-white/60">Expiradas</p>
                  <p className="text-xl font-bold text-yellow-400">{stats.cache.expiredEntries}</p>
                </div>
                <div>
                  <p className="text-white/60">Hit Rate</p>
                  <p className="text-xl font-bold text-blue-400">{hitRate}%</p>
                </div>
              </div>
            </div>

            {/* Storage Stats */}
            {stats.storage && (
              <div className="bg-white/5 rounded-lg p-3 space-y-2">
                <h4 className="font-semibold text-sm text-white/80">💾 Supabase Storage</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-white/60">Arquivos</p>
                    <p className="text-xl font-bold">{stats.storage.filesCount}</p>
                  </div>
                  <div>
                    <p className="text-white/60">Tamanho Total</p>
                    <p className="text-xl font-bold text-purple-400">{storageSizeMB} MB</p>
                  </div>
                </div>
              </div>
            )}

            {/* Performance Insights */}
            <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg p-3 border border-green-500/20">
              <h4 className="font-semibold text-sm text-white/80 mb-2">⚡ Performance</h4>
              <div className="space-y-1 text-xs text-white/70">
                <p>✅ {stats.cache.activeEntries} imagens em cache</p>
                <p>✅ Zero requisições para TMDB em cache hits</p>
                <p>✅ Economia estimada: ~{(stats.cache.activeEntries * 150 / 1024).toFixed(1)} MB</p>
              </div>
            </div>

            {/* Last Update */}
            {lastUpdate && (
              <p className="text-xs text-white/40 text-center">
                Atualizado: {lastUpdate.toLocaleTimeString()}
              </p>
            )}
          </>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <button
          onClick={loadStats}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white py-2 px-4 rounded transition-colors text-sm"
        >
          🔄 Atualizar Estatísticas
        </button>
        
        <button
          onClick={handleClearMemory}
          disabled={loading}
          className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-600/50 text-white py-2 px-4 rounded transition-colors text-sm"
        >
          🗑️ Limpar Cache em Memória
        </button>
        
        <button
          onClick={handleClearExpired}
          disabled={loading || !stats || stats.cache.expiredEntries === 0}
          className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 text-white py-2 px-4 rounded transition-colors text-sm"
        >
          🧹 Limpar Entradas Expiradas ({stats?.cache.expiredEntries || 0})
        </button>
      </div>

      {/* Info */}
      <div className="p-4 bg-white/5 text-xs text-white/50 space-y-1">
        <p>💡 O cache é atualizado automaticamente</p>
        <p>💡 Signed URLs são válidas por 7 dias</p>
        <p>💡 Imagens ficam permanentemente no Storage</p>
      </div>
    </div>
  );
}
