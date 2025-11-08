/**
 * Painel de Importação de Dados
 * 
 * Interface visual para importar dados dos arquivos JSON para o Supabase
 * Pode ser acessado via /admin ou adicionado ao AdminDashboard
 */

import { useState } from 'react';
import { importarFilmes, importarSeries, importarCanais, importarTodosDados } from '../utils/importData';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';

interface ImportResult {
  sucesso: boolean;
  total: number;
  importados: number;
  erros: string[];
}

export function DataImportPanel() {
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState<{
    filmes?: ImportResult;
    series?: ImportResult;
    canais?: ImportResult;
  } | null>(null);

  const handleImportAll = async () => {
    setImporting(true);
    setResults(null);
    
    try {
      const data = await importarTodosDados();
      setResults(data);
    } catch (error) {
      console.error('Erro na importação:', error);
      alert('Erro ao importar dados. Verifique o console.');
    } finally {
      setImporting(false);
    }
  };

  const handleImportFilmes = async () => {
    setImporting(true);
    try {
      const result = await importarFilmes();
      setResults({ filmes: result });
    } catch (error) {
      console.error('Erro ao importar filmes:', error);
      alert('Erro ao importar filmes. Verifique o console.');
    } finally {
      setImporting(false);
    }
  };

  const handleImportSeries = async () => {
    setImporting(true);
    try {
      const result = await importarSeries();
      setResults({ series: result });
    } catch (error) {
      console.error('Erro ao importar séries:', error);
      alert('Erro ao importar séries. Verifique o console.');
    } finally {
      setImporting(false);
    }
  };

  const handleImportCanais = async () => {
    setImporting(true);
    try {
      const result = await importarCanais();
      setResults({ canais: result });
    } catch (error) {
      console.error('Erro ao importar canais:', error);
      alert('Erro ao importar canais. Verifique o console.');
    } finally {
      setImporting(false);
    }
  };

  const renderResult = (tipo: string, result?: ImportResult) => {
    if (!result) return null;

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm">{tipo}</h4>
          {result.sucesso ? (
            <Badge variant="default" className="bg-green-500">Sucesso</Badge>
          ) : (
            <Badge variant="destructive">Falhou</Badge>
          )}
        </div>
        
        <div className="text-sm text-gray-400 space-y-1">
          <div>Total no JSON: {result.total}</div>
          <div>Importados: {result.importados}</div>
          {result.erros.length > 0 && (
            <div className="text-red-400">
              Erros: {result.erros.join(', ')}
            </div>
          )}
        </div>

        {result.total > 0 && (
          <Progress 
            value={(result.importados / result.total) * 100} 
            className="h-2"
          />
        )}
      </div>
    );
  };

  return (
    <Card className="p-6 bg-gray-900 border-gray-800">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl mb-2">Importação de Dados</h2>
          <p className="text-gray-400 text-sm">
            Importe dados dos arquivos JSON (filmes.json, series.json, canais.json) para o Supabase.
            <br />
            Duplicatas serão automaticamente ignoradas.
          </p>
        </div>

        {/* Botões de importação */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={handleImportAll}
            disabled={importing}
            className="bg-red-600 hover:bg-red-700"
          >
            {importing ? 'Importando...' : '🚀 Importar Tudo'}
          </Button>

          <Button
            onClick={handleImportFilmes}
            disabled={importing}
            variant="outline"
          >
            📽️ Importar Filmes
          </Button>

          <Button
            onClick={handleImportSeries}
            disabled={importing}
            variant="outline"
          >
            📺 Importar Séries
          </Button>

          <Button
            onClick={handleImportCanais}
            disabled={importing}
            variant="outline"
          >
            📡 Importar Canais
          </Button>
        </div>

        {/* Progresso */}
        {importing && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
              <span className="text-sm text-gray-400">Importando dados...</span>
            </div>
            <Progress value={undefined} className="h-2" />
          </div>
        )}

        {/* Resultados */}
        {results && (
          <div className="space-y-4 p-4 bg-gray-800 rounded-lg">
            <h3 className="text-lg">Resultados da Importação</h3>
            
            {renderResult('📽️ Filmes', results.filmes)}
            {renderResult('📺 Séries', results.series)}
            {renderResult('📡 Canais', results.canais)}

            {results.filmes && results.series && results.canais && (
              <div className="pt-4 border-t border-gray-700">
                <div className="text-sm">
                  <strong>Total importado:</strong>{' '}
                  {results.filmes.importados + results.series.importados + results.canais.importados}{' '}
                  registros
                </div>
              </div>
            )}
          </div>
        )}

        {/* Instruções */}
        <div className="p-4 bg-gray-800 rounded-lg text-sm text-gray-400">
          <h4 className="text-white mb-2">📋 Instruções:</h4>
          <ol className="list-decimal list-inside space-y-1">
            <li>Certifique-se de que as tabelas foram criadas no Supabase (execute create_tables.sql)</li>
            <li>Os arquivos JSON devem estar em /public/data/</li>
            <li>Clique em "Importar Tudo" para importar filmes, séries e canais</li>
            <li>Ou use os botões individuais para importar apenas um tipo</li>
            <li>Duplicatas serão automaticamente ignoradas</li>
          </ol>
        </div>

        {/* Console logs */}
        <div className="text-xs text-gray-500">
          💡 Verifique o console do navegador (F12) para logs detalhados
        </div>
      </div>
    </Card>
  );
}
