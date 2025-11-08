import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { fetchAllHeroData, saveHeroDataToKV, loadHeroDataFromKV, generateLocalCode, HeroData } from '../utils/fetchHeroData';

export function HeroDataMigration() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [heroData, setHeroData] = useState<HeroData[] | null>(null);
  const [localCode, setLocalCode] = useState<string>('');

  const handleFetchData = async () => {
    setLoading(true);
    setStatus('🚀 Iniciando busca dos dados via TMDB API...');
    
    try {
      const data = await fetchAllHeroData();
      setHeroData(data);
      setStatus(`✅ Dados de ${data.length} séries obtidos com sucesso!`);
      
      // Gerar código local
      const code = generateLocalCode(data);
      setLocalCode(code);
      
    } catch (error) {
      setStatus(`❌ Erro ao buscar dados: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToKV = async () => {
    if (!heroData) {
      setStatus('❌ Busque os dados primeiro!');
      return;
    }
    
    setLoading(true);
    setStatus('💾 Salvando no banco de dados...');
    
    try {
      const success = await saveHeroDataToKV(heroData);
      if (success) {
        setStatus('✅ Dados salvos com sucesso no banco!');
      } else {
        setStatus('❌ Erro ao salvar no banco');
      }
    } catch (error) {
      setStatus(`❌ Erro: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadFromKV = async () => {
    setLoading(true);
    setStatus('📡 Carregando do banco de dados...');
    
    try {
      const data = await loadHeroDataFromKV();
      if (data) {
        setHeroData(data);
        setStatus(`✅ ${data.length} séries carregadas do banco!`);
        
        // Gerar código local
        const code = generateLocalCode(data);
        setLocalCode(code);
      } else {
        setStatus('❌ Nenhum dado encontrado no banco');
      }
    } catch (error) {
      setStatus(`❌ Erro: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(localCode);
    setStatus('📋 Código copiado! Cole em /utils/heroContent.ts');
  };

  const handleDownloadCode = () => {
    const blob = new Blob([localCode], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'heroContent.ts';
    a.click();
    URL.revokeObjectURL(url);
    setStatus('📥 Arquivo heroContent.ts baixado!');
  };

  return (
    <div className="p-6 space-y-6">
      <Card className="p-6 bg-zinc-900 border-zinc-800">
        <h2 className="text-2xl font-bold text-white mb-4">
          🎬 Migração de Dados dos Banners Hero
        </h2>
        
        <p className="text-zinc-400 mb-6">
          Este painel busca dados das séries <strong>Wednesday</strong>, <strong>The Witcher</strong> e <strong>Black Lightning</strong> 
          via API do TMDB e salva no banco de dados.
        </p>

        {/* Status */}
        {status && (
          <div className="mb-6 p-4 bg-zinc-800 rounded-lg">
            <p className="text-white font-mono text-sm whitespace-pre-wrap">
              {status}
            </p>
          </div>
        )}

        {/* Botões de Ação */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Button
            onClick={handleFetchData}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? '⏳ Buscando...' : '📡 1. Buscar Dados via TMDB'}
          </Button>
          
          <Button
            onClick={handleSaveToKV}
            disabled={loading || !heroData}
            className="bg-green-600 hover:bg-green-700"
          >
            {loading ? '⏳ Salvando...' : '💾 2. Salvar no Banco'}
          </Button>
          
          <Button
            onClick={handleLoadFromKV}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? '⏳ Carregando...' : '📥 3. Carregar do Banco'}
          </Button>
        </div>

        {/* Preview dos Dados */}
        {heroData && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">
              📊 Dados Carregados ({heroData.length} séries)
            </h3>
            
            <div className="grid gap-4">
              {heroData.map((serie) => (
                <Card key={serie.id} className="p-4 bg-zinc-800 border-zinc-700">
                  <div className="flex items-start gap-4">
                    {/* Backdrop Preview */}
                    {serie.backdrop_path && (
                      <img
                        src={serie.backdrop_path}
                        alt={serie.name}
                        className="w-32 h-18 object-cover rounded"
                      />
                    )}
                    
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-white mb-1">
                        {serie.name}
                      </h4>
                      
                      <div className="space-y-1 text-sm text-zinc-400">
                        <p>
                          <strong>Gêneros:</strong> {serie.genres.join(', ') || 'N/A'}
                        </p>
                        <p>
                          <strong>Logo:</strong> {serie.logo_path ? '✅ Disponível' : '❌ Não disponível'}
                        </p>
                        <p>
                          <strong>Trailer:</strong> {serie.trailer_key ? `✅ ${serie.trailer_key}` : '❌ Não disponível'}
                        </p>
                        <p className="line-clamp-2">
                          <strong>Sinopse:</strong> {serie.overview}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Código Gerado */}
        {localCode && (
          <div className="mt-6 space-y-3">
            <h3 className="text-xl font-semibold text-white">
              📝 Código para /utils/heroContent.ts
            </h3>
            
            <div className="flex gap-2">
              <Button
                onClick={handleCopyCode}
                variant="outline"
                className="border-zinc-700 hover:bg-zinc-800"
              >
                📋 Copiar Código
              </Button>
              
              <Button
                onClick={handleDownloadCode}
                variant="outline"
                className="border-zinc-700 hover:bg-zinc-800"
              >
                📥 Baixar Arquivo
              </Button>
            </div>
            
            <pre className="bg-black p-4 rounded-lg overflow-x-auto text-xs text-green-400 max-h-96">
              <code>{localCode}</code>
            </pre>
          </div>
        )}
      </Card>

      {/* Instruções */}
      <Card className="p-6 bg-zinc-900 border-zinc-800">
        <h3 className="text-lg font-bold text-white mb-3">
          📚 Como Usar
        </h3>
        
        <ol className="list-decimal list-inside space-y-2 text-zinc-400">
          <li>Clique em <strong>"Buscar Dados via TMDB"</strong> para baixar dados das 3 séries</li>
          <li>Clique em <strong>"Salvar no Banco"</strong> para armazenar no Supabase KV Store</li>
          <li>OU clique em <strong>"Copiar Código"</strong> e cole em <code>/utils/heroContent.ts</code></li>
          <li>Os dados incluem: nome, backdrop, logo, sinopse, gêneros e trailer</li>
          <li>Todas as URLs de imagens são do CDN oficial do TMDB</li>
        </ol>
        
        <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-600 rounded-lg">
          <p className="text-yellow-400 text-sm">
            <strong>⚠️ Importante:</strong> Se escolher salvar no banco, atualize o HeroSlider para carregar de lá. 
            Se preferir local, substitua o conteúdo de /utils/heroContent.ts com o código gerado.
          </p>
        </div>
      </Card>
    </div>
  );
}
