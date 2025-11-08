/**
 * GitHub Sync Panel - Painel de sincronização automática GitHub → Supabase
 * Lê conteúdo do repositório FIGMA1 e sincroniza com o banco RedFlix
 */

import React, { useState } from 'react';
import { syncAllFromFIGMA1, syncFile, SyncResult, SyncProgress } from '../utils/githubSync';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';

interface LogEntry {
  type: 'info' | 'success' | 'error' | 'warning';
  message: string;
  timestamp: Date;
}

export default function GitHubSyncPanel() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSyncingTMDB, setIsSyncingTMDB] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [results, setResults] = useState<SyncResult[]>([]);
  const [tmdbResults, setTmdbResults] = useState<any>(null);

  const addLog = (type: LogEntry['type'], message: string) => {
    setLogs(prev => [...prev, { type, message, timestamp: new Date() }]);
    console.log(`[${type.toUpperCase()}] ${message}`);
  };

  const handleSyncAll = async () => {
    setIsSyncing(true);
    setProgress(0);
    setLogs([]);
    setResults([]);
    
    addLog('info', '🚀 Iniciando sincronização completa do repositório FIGMA1...');
    addLog('info', '📡 Conectando ao GitHub...');
    
    try {
      const syncResults = await syncAllFromFIGMA1((progressInfo: SyncProgress) => {
        setCurrentStep(progressInfo.message);
        setProgress(progressInfo.progress);
        addLog('info', progressInfo.message);
      });
      
      setResults(syncResults);
      
      // Processar resultados
      const totalInserted = syncResults.reduce((sum, r) => sum + r.inserted, 0);
      const totalErrors = syncResults.reduce((sum, r) => sum + r.errors.length, 0);
      const successCount = syncResults.filter(r => r.success).length;
      
      addLog('success', '');
      addLog('success', '========================================');
      addLog('success', '📊 RESUMO DA SINCRONIZAÇÃO');
      addLog('success', '========================================');
      
      syncResults.forEach(result => {
        if (result.success && result.inserted > 0) {
          addLog('success', `✅ ${result.type}: ${result.inserted} registros sincronizados`);
        } else if (result.errors.length > 0) {
          addLog('error', `❌ ${result.type}: ${result.errors.join(', ')}`);
        }
      });
      
      addLog('success', '========================================');
      addLog('success', `✅ Total: ${totalInserted} registros sincronizados`);
      
      if (totalErrors > 0) {
        addLog('warning', `⚠️ ${totalErrors} erros encontrados`);
      }
      
      addLog('success', '🚀 Conteúdo atualizado em todas as páginas!');
      
      setProgress(100);
      
    } catch (error) {
      addLog('error', `❌ Erro na sincronização: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSyncSingle = async (type: 'filmes' | 'series' | 'canais') => {
    setIsSyncing(true);
    setProgress(0);
    
    const paths = {
      filmes: 'data/filmes.json',
      series: 'data/series.json',
      canais: 'data/canais.json',
    };
    
    addLog('info', `📡 Sincronizando ${type}...`);
    
    try {
      const result = await syncFile(
        'Fabriciocypreste',
        'FIGMA1',
        paths[type],
        type,
        (progressInfo: SyncProgress) => {
          setCurrentStep(progressInfo.message);
          setProgress(progressInfo.progress);
          addLog('info', progressInfo.message);
        }
      );
      
      setResults([result]);
      
      if (result.success) {
        addLog('success', `✅ ${result.inserted} ${type} sincronizados com sucesso!`);
      } else {
        addLog('error', `❌ Erro ao sincronizar ${type}: ${result.errors.join(', ')}`);
      }
      
    } catch (error) {
      addLog('error', `❌ Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSyncM3UWithTMDB = async () => {
    setIsSyncingTMDB(true);
    setProgress(0);
    setLogs([]);
    setTmdbResults(null);
    
    addLog('info', '🚀 Iniciando Sincronização Total: lista.m3u + TMDB → Supabase...');
    addLog('info', '📡 Esta operação pode levar alguns minutos...');
    
    try {
      // Chamar servidor
      const response = await fetch(
        'https://vlvbqunvxqokzbxbevdh.supabase.co/functions/v1/make-server-2363f5d6/sync-m3u-with-tmdb',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsdmJxdW52eHFva3pieGJldmRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk2NjI1NzMsImV4cCI6MjA1NTIzODU3M30.6N7i5EQqY_uOCy3hcFM0svL1QrjQx3ujRNmxW4gVZpw'
          }
        }
      );
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setTmdbResults(data.results);
      
      addLog('success', '');
      addLog('success', '========================================');
      addLog('success', '📊 RESUMO DA SINCRONIZAÇÃO M3U + TMDB');
      addLog('success', '========================================');
      addLog('info', `📺 Total de entradas: ${data.results.total}`);
      addLog('success', `🎬 Filmes: ${data.results.filmes.processed} processados, ${data.results.filmes.withTMDB} com TMDB, ${data.results.filmes.uploaded} imagens enviadas`);
      addLog('success', `📺 Séries: ${data.results.series.processed} processadas, ${data.results.series.withTMDB} com TMDB, ${data.results.series.uploaded} imagens enviadas`);
      addLog('success', `📡 Canais: ${data.results.canais.processed} processados, ${data.results.canais.uploaded} salvos`);
      
      if (data.results.errors.length > 0) {
        addLog('warning', `⚠️ ${data.results.errors.length} erros encontrados`);
        data.results.errors.slice(0, 5).forEach((err: string) => {
          addLog('error', err);
        });
      }
      
      addLog('success', '========================================');
      addLog('success', '🚀 Sincronização completa! Todas as imagens otimizadas enviadas para Supabase.');
      
      setProgress(100);
      
    } catch (error) {
      addLog('error', `❌ Erro na sincronização M3U + TMDB: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsSyncingTMDB(false);
    }
  };

  const getLogIcon = (type: LogEntry['type']) => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return '📝';
    }
  };

  const getLogColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      default: return 'text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">
          Sincronização GitHub → Supabase
        </h2>
        <p className="text-gray-400">
          Importa conteúdo do repositório FIGMA1 e sincroniza automaticamente com o banco de dados RedFlix
        </p>
      </div>

      {/* Info Card */}
      <Card className="bg-[#1a1a1a] border-gray-800 p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">📦 Repositório Fonte</h3>
            <div className="space-y-2 text-sm">
              <p className="text-gray-300">
                <span className="text-gray-500">Repositório:</span>{' '}
                <a 
                  href="https://github.com/Fabriciocypreste/FIGMA1" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#E50914] hover:underline"
                >
                  github.com/Fabriciocypreste/FIGMA1
                </a>
              </p>
              <p className="text-gray-300">
                <span className="text-gray-500">Arquivos:</span> data/filmes.json, data/series.json, data/canais.json, lista.m3u
              </p>
              <p className="text-gray-300">
                <span className="text-gray-500">Formato:</span> JSON e M3U (conversão automática)
              </p>
            </div>
          </div>

          <Alert className="bg-blue-950/30 border-blue-900">
            <AlertDescription className="text-blue-200">
              💡 O sistema faz upsert automático baseado no nome, evitando duplicatas.
              Arquivos M3U são convertidos para JSON automaticamente.
            </AlertDescription>
          </Alert>
        </div>
      </Card>

      {/* NOVA FUNCIONALIDADE: M3U + TMDB */}
      <Card className="bg-gradient-to-br from-[#E50914] to-[#b8070f] border-[#E50914] p-6">
        <div className="flex items-start gap-4">
          <div className="text-4xl">🎯</div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white mb-2">
              🔥 Sincronização Total M3U + TMDB → Supabase
            </h3>
            <p className="text-white/90 text-sm mb-4">
              <strong>NOVO:</strong> Lê TODO o arquivo lista.m3u, busca automaticamente as imagens oficiais do TMDB,
              otimiza em alta resolução e envia para o Supabase Storage, vinculando cada item ao seu link de vídeo real.
            </p>
            <div className="bg-black/20 rounded-lg p-4 mb-4 text-sm text-white/90 space-y-1">
              <div>✅ 100% das entradas do lista.m3u processadas</div>
              <div>✅ Imagens oficiais do TMDB em alta resolução</div>
              <div>✅ Upload automático para Supabase Storage</div>
              <div>✅ Classificação automática (filmes, séries, canais)</div>
              <div>✅ Links de vídeo reais vinculados ao banco</div>
            </div>
            <Button
              onClick={handleSyncM3UWithTMDB}
              disabled={isSyncingTMDB || isSyncing}
              className="w-full bg-white hover:bg-gray-100 text-[#E50914] font-bold text-lg py-6"
            >
              {isSyncingTMDB ? '⏳ Sincronizando lista.m3u + TMDB...' : '🚀 INICIAR SINCRONIZAÇÃO TOTAL'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-[#1a1a1a] border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">🚀 Sincronização Completa</h3>
          <p className="text-gray-400 text-sm mb-4">
            Sincroniza todos os arquivos (filmes, séries, canais e lista M3U)
          </p>
          <Button
            onClick={handleSyncAll}
            disabled={isSyncing || isSyncingTMDB}
            className="w-full bg-[#E50914] hover:bg-[#b8070f] text-white"
          >
            {isSyncing ? '⏳ Sincronizando...' : '🔄 Sincronizar Tudo'}
          </Button>
        </Card>

        <Card className="bg-[#1a1a1a] border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">🎯 Sincronização Individual</h3>
          <p className="text-gray-400 text-sm mb-4">
            Sincroniza apenas um tipo de conteúdo específico
          </p>
          <div className="space-y-2">
            <Button
              onClick={() => handleSyncSingle('filmes')}
              disabled={isSyncing || isSyncingTMDB}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white"
              size="sm"
            >
              🎬 Filmes
            </Button>
            <Button
              onClick={() => handleSyncSingle('series')}
              disabled={isSyncing || isSyncingTMDB}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white"
              size="sm"
            >
              📺 Séries
            </Button>
            <Button
              onClick={() => handleSyncSingle('canais')}
              disabled={isSyncing || isSyncingTMDB}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white"
              size="sm"
            >
              📡 Canais
            </Button>
          </div>
        </Card>
      </div>

      {/* Progress */}
      {(isSyncing || isSyncingTMDB) && (
        <Card className="bg-[#1a1a1a] border-gray-800 p-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-medium">
                  {isSyncingTMDB ? 'Sincronizando M3U + TMDB' : 'Progresso'}
                </span>
                <span className="text-gray-400 text-sm">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            {currentStep && (
              <p className="text-gray-300 text-sm">{currentStep}</p>
            )}
          </div>
        </Card>
      )}

      {/* TMDB Results Summary */}
      {tmdbResults && !isSyncingTMDB && (
        <Card className="bg-[#1a1a1a] border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">📊 Resultados M3U + TMDB</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-950/50 to-blue-900/30 p-4 rounded-lg">
              <div className="text-sm text-blue-300 mb-1">Total Processado</div>
              <div className="text-3xl font-bold text-white">{tmdbResults.total}</div>
              <div className="text-xs text-blue-200 mt-1">Entradas do M3U</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-950/50 to-green-900/30 p-4 rounded-lg">
              <div className="text-sm text-green-300 mb-1">Filmes</div>
              <div className="text-3xl font-bold text-white">{tmdbResults.filmes.processed}</div>
              <div className="text-xs text-green-200 mt-1">
                {tmdbResults.filmes.withTMDB} com TMDB • {tmdbResults.filmes.uploaded} imagens
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-950/50 to-purple-900/30 p-4 rounded-lg">
              <div className="text-sm text-purple-300 mb-1">Séries</div>
              <div className="text-3xl font-bold text-white">{tmdbResults.series.processed}</div>
              <div className="text-xs text-purple-200 mt-1">
                {tmdbResults.series.withTMDB} com TMDB • {tmdbResults.series.uploaded} imagens
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-950/50 to-orange-900/30 p-4 rounded-lg">
              <div className="text-sm text-orange-300 mb-1">Canais</div>
              <div className="text-3xl font-bold text-white">{tmdbResults.canais.processed}</div>
              <div className="text-xs text-orange-200 mt-1">
                {tmdbResults.canais.uploaded} salvos
              </div>
            </div>
          </div>
          
          {tmdbResults.errors && tmdbResults.errors.length > 0 && (
            <Alert className="mt-4 bg-red-950/30 border-red-900">
              <AlertDescription className="text-red-200">
                ⚠️ {tmdbResults.errors.length} erros encontrados durante o processamento.
              </AlertDescription>
            </Alert>
          )}
        </Card>
      )}

      {/* Results Summary */}
      {results.length > 0 && !isSyncing && (
        <Card className="bg-[#1a1a1a] border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">📊 Resultados</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  result.success ? 'bg-green-950/30' : 'bg-red-950/30'
                }`}
              >
                <div className="text-sm text-gray-400 mb-1 capitalize">{result.type}</div>
                <div className="text-2xl font-bold text-white mb-1">
                  {result.inserted}
                </div>
                <div className="text-xs text-gray-400">
                  {result.success ? 'Sincronizados' : 'Erro'}
                </div>
                {result.errors.length > 0 && (
                  <div className="text-xs text-red-400 mt-2">
                    {result.errors[0]}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Console Log */}
      <Card className="bg-[#1a1a1a] border-gray-800 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">📝 Console Log</h3>
          <Button
            onClick={() => setLogs([])}
            variant="outline"
            size="sm"
            className="text-xs"
            disabled={logs.length === 0}
          >
            Limpar
          </Button>
        </div>
        <div className="bg-black/50 rounded-lg p-4 max-h-96 overflow-y-auto font-mono text-sm">
          {logs.length === 0 ? (
            <p className="text-gray-500">Aguardando sincronização...</p>
          ) : (
            <div className="space-y-1">
              {logs.map((log, index) => (
                <div key={index} className={`${getLogColor(log.type)}`}>
                  <span className="text-gray-600">
                    {log.timestamp.toLocaleTimeString()}
                  </span>{' '}
                  {getLogIcon(log.type)} {log.message}
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Instructions */}
      <Card className="bg-[#1a1a1a] border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">📖 Como Usar</h3>
        <div className="space-y-3 text-sm text-gray-300">
          <div className="flex gap-3">
            <span className="text-[#E50914] font-bold">1.</span>
            <p>Clique em "Sincronizar Tudo" para importar todo o conteúdo do repositório FIGMA1</p>
          </div>
          <div className="flex gap-3">
            <span className="text-[#E50914] font-bold">2.</span>
            <p>Use a sincronização individual para atualizar apenas um tipo de conteúdo</p>
          </div>
          <div className="flex gap-3">
            <span className="text-[#E50914] font-bold">3.</span>
            <p>Acompanhe o progresso no console log em tempo real</p>
          </div>
          <div className="flex gap-3">
            <span className="text-[#E50914] font-bold">4.</span>
            <p>Após a sincronização, o conteúdo estará disponível nas páginas Filmes, Séries e Canais</p>
          </div>
          <div className="flex gap-3">
            <span className="text-[#E50914] font-bold">5.</span>
            <p>O sistema faz backup automático e não duplica registros existentes</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
