# 🎬 RedFlix IPTV - URLs Reais + TMDB + Cache Supabase

**Versão:** v8.0  
**Data:** 08 de Novembro de 2025  
**Status:** ✅ **SISTEMA COMPLETO IMPLEMENTADO**  

---

## 📋 ÍNDICE

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Instalação](#instalação)
4. [Sincronização](#sincronização)
5. [Uso nos Componentes](#uso-nos-componentes)
6. [Player de Vídeo](#player-de-vídeo)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 VISÃO GERAL

### O que foi implementado:

✅ **Tabela Unificada `conteudo`** no Supabase  
✅ **Sistema de Sincronização M3U → Supabase**  
✅ **Enriquecimento automático com TMDB**  
✅ **Cache de imagens no banco de dados**  
✅ **Player com URLs reais de streaming**  
✅ **Dashboard de sincronização**  
✅ **Imagens 244×137 px fixas**  

---

## 🏗️ ARQUITETURA

```
┌─────────────────────────────────────────────────────────┐
│                    FLUXO COMPLETO                       │
└─────────────────────────────────────────────────────────┘

    📡 Playlist M3U Remota
    http://api.cdnapp.fun:80/playlist/new_app/Q24Wb98eYc/m3u_plus
           │
           ↓
    🔄 Parser M3U
    (extractNome, URL, grupo)
           │
           ↓
    🎬 TMDB API
    (buscar poster, backdrop, sinopse)
           │
           ↓
    💾 Supabase - Tabela `conteudo`
    (salvar tudo: URL real + imagens cached)
           │
           ↓
    🖥️ RedFlix App
    (buscar do Supabase e renderizar)
           │
           ↓
    ▶️ Universal Player
    (reproduzir URL real com HLS.js)
```

---

## 📦 ARQUIVOS CRIADOS

### 1️⃣ **Migration SQL**

**Arquivo:** `/supabase/migrations/create_conteudo_table.sql`

**O que faz:**
- Cria tabela `conteudo` unificada
- Campos: `nome`, `tipo`, `grupo`, `url`, `logo`, `poster`, `backdrop`, `tmdb_id`
- Índices para performance
- Views úteis (estatísticas, sem TMDB, por grupo)
- Funções auxiliares (busca, favoritos)

**Execute no Supabase:**
```sql
-- Copie e cole no Supabase Dashboard → SQL Editor
-- Ou faça upload do arquivo
```

---

### 2️⃣ **Sistema de Sincronização**

**Arquivo:** `/utils/m3uTmdbSync.ts`

**Funções principais:**

```typescript
// Sincronizar M3U + TMDB → Supabase
await sincronizarM3UComTMDB(
  batchSize: 50,      // Itens por lote
  incluirTMDB: true   // Buscar metadados TMDB
);

// Buscar conteúdo do Supabase
const filmes = await buscarPorTipo('Filme');
const series = await buscarPorTipo('Série');
const canais = await buscarPorTipo('Canal');

// Buscar por nome
const resultados = await buscarPorNome('Breaking Bad');

// Estatísticas
const stats = await buscarEstatisticas();
```

**Fluxo interno:**
1. Baixa playlist M3U remota
2. Faz parse (nome, URL, categoria)
3. Detecta tipo (Canal / Filme / Série)
4. Para Filmes/Séries: busca no TMDB
5. Extrai poster, backdrop, sinopse, nota
6. Salva ou atualiza no Supabase
7. Retorna estatísticas

---

### 3️⃣ **Dashboard de Sincronização**

**Arquivo:** `/components/SyncDashboard.tsx`

**Interface visual para:**
- Ver estatísticas do banco
- Configurar sincronização
- Iniciar sync com um clique
- Monitorar progresso
- Ver resultados

**Acesso:**
```tsx
import { SyncDashboard } from './components/SyncDashboard';

// Em alguma rota admin:
<SyncDashboard />
```

---

## 🚀 INSTALAÇÃO

### Passo 1: Criar Tabela no Supabase

1. Acesse Supabase Dashboard
2. Vá em **SQL Editor**
3. Abra o arquivo `/supabase/migrations/create_conteudo_table.sql`
4. Copie todo o conteúdo
5. Cole no editor
6. Clique em **Run**

✅ **Resultado esperado:**
```
Success. No rows returned
```

Verifique se a tabela foi criada:
```sql
SELECT COUNT(*) FROM conteudo;
-- Deve retornar 0 (vazia)
```

---

### Passo 2: Primeira Sincronização

**Opção A: Via Dashboard (Recomendado)**

1. Adicione rota no seu router:

```tsx
// App.tsx ou router
import { SyncDashboard } from './components/SyncDashboard';

<Route path="/admin/sync" element={<SyncDashboard />} />
```

2. Acesse: `http://localhost:5173/admin/sync`

3. Configure:
   - ✅ Buscar metadados no TMDB: **Ativado**
   - Tamanho do lote: **50** (recomendado)

4. Clique em **🚀 Iniciar Sincronização M3U + TMDB**

5. Aguarde conclusão (pode levar alguns minutos)

---

**Opção B: Via Console (Desenvolvedor)**

```typescript
import { sincronizarM3UComTMDB } from './utils/m3uTmdbSync';

// Executar no console do navegador
(async () => {
  const stats = await sincronizarM3UComTMDB(50, true);
  console.log('Sincronização completa:', stats);
})();
```

---

## 📊 SINCRONIZAÇÃO

### Como funciona:

**1. Buscar Playlist M3U:**
```
📡 URL: http://api.cdnapp.fun:80/playlist/new_app/Q24Wb98eYc/m3u_plus
```

**2. Parse do M3U:**
```typescript
#EXTINF:-1 tvg-id="globo" tvg-logo="https://..." group-title="TV Aberta",Globo HD
http://cdnserver.example/live/globo.m3u8
```

Extrai:
- Nome: "Globo HD"
- URL: "http://cdnserver.example/live/globo.m3u8"
- Grupo: "TV Aberta"
- Tipo: "Canal"

**3. Enriquecimento TMDB (só para Filmes/Séries):**

```typescript
// Filme
const tmdbData = await fetch(
  `https://api.themoviedb.org/3/search/movie?query=Breaking Bad`
);

// Resultado:
{
  id: 1396,
  poster_path: "/ztkUQFLlC19CCMYHW9o1zWhJRNU.jpg",
  backdrop_path: "/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg",
  overview: "Um professor de química...",
  vote_average: 8.9,
  release_date: "2008-01-20"
}
```

**4. Salvar no Supabase:**

```sql
INSERT INTO conteudo (
  nome, tipo, grupo, url,
  logo, poster, backdrop,
  tmdb_id, tmdb_type, overview, vote_average, release_year,
  atualizado_em, tmdb_sincronizado_em
) VALUES (
  'Breaking Bad',
  'Série',
  'Séries Aclamadas',
  'http://cdn.../breaking-bad.m3u8',
  NULL,
  'https://image.tmdb.org/t/p/w500/ztkUQFLlC19CCMYHW9o1zWhJRNU.jpg',
  'https://image.tmdb.org/t/p/original/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg',
  1396,
  'tv',
  'Um professor de química...',
  8.9,
  2008,
  NOW(),
  NOW()
);
```

---

### Estatísticas Esperadas:

Após sincronização completa:

```
✅ Sincronização concluída!
═══════════════════════════════════════════
   Total de itens: 8.421
   Novos: 8.421
   Atualizados: 0
   Com TMDB: 6.237 (74%)
   Erros: 0
   Tempo: 342 segundos
═══════════════════════════════════════════
```

**Distribuição esperada:**
- **Canais:** ~500 (sem TMDB)
- **Filmes:** ~4.000 (95% com TMDB)
- **Séries:** ~3.900 (80% com TMDB)

---

## 🖥️ USO NOS COMPONENTES

### Exemplo 1: Página de Filmes

```tsx
import { useEffect, useState } from 'react';
import { buscarPorTipo, ConteudoItem } from '../utils/m3uTmdbSync';

export function FilmesPage() {
  const [filmes, setFilmes] = useState<ConteudoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarFilmes() {
      try {
        const data = await buscarPorTipo('Filme');
        setFilmes(data);
      } catch (error) {
        console.error('Erro ao carregar filmes:', error);
      } finally {
        setLoading(false);
      }
    }

    carregarFilmes();
  }, []);

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="grid grid-cols-6 gap-4">
      {filmes.map(filme => (
        <div 
          key={filme.id}
          className="cursor-pointer hover:scale-105 transition-transform"
          onClick={() => handlePlayFilme(filme)}
        >
          <img
            src={filme.poster || filme.logo || '/assets/sem_logo.png'}
            alt={filme.nome}
            width={244}
            height={137}
            className="rounded-lg object-cover"
          />
          <h3 className="text-white mt-2 text-sm truncate">
            {filme.nome}
          </h3>
          {filme.vote_average && (
            <div className="text-yellow-400 text-xs">
              ⭐ {filme.vote_average.toFixed(1)}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  function handlePlayFilme(filme: ConteudoItem) {
    // Abrir player com URL real
    console.log('🎬 Reproduzir:', filme.nome);
    console.log('📡 URL:', filme.url);
    // Chamar UniversalPlayer ou IPTVPlayer
  }
}
```

---

### Exemplo 2: Busca

```tsx
import { buscarPorNome } from '../utils/m3uTmdbSync';

export function SearchBox() {
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState([]);

  async function handleSearch() {
    if (query.length < 3) return;
    
    const data = await buscarPorNome(query);
    setResultados(data);
  }

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyUp={handleSearch}
        placeholder="Buscar filmes, séries, canais..."
        className="w-full bg-gray-800 text-white px-4 py-2 rounded"
      />
      
      {resultados.map(item => (
        <div key={item.id} className="flex gap-4 p-2 hover:bg-gray-700">
          <img
            src={item.poster || '/assets/sem_logo.png'}
            alt={item.nome}
            className="w-20 h-12 object-cover rounded"
          />
          <div>
            <h4 className="text-white">{item.nome}</h4>
            <p className="text-gray-400 text-sm">{item.tipo} • {item.grupo}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

### Exemplo 3: Estatísticas

```tsx
import { buscarEstatisticas } from '../utils/m3uTmdbSync';

export function StatsPanel() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    buscarEstatisticas().then(setStats);
  }, []);

  if (!stats) return null;

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="bg-gray-800 p-4 rounded">
        <div className="text-gray-400">Total</div>
        <div className="text-3xl font-bold text-white">
          {stats.total.toLocaleString()}
        </div>
      </div>
      
      <div className="bg-blue-900/20 p-4 rounded">
        <div className="text-gray-400">Canais</div>
        <div className="text-3xl font-bold text-blue-400">
          {stats.canais.toLocaleString()}
        </div>
      </div>
      
      <div className="bg-green-900/20 p-4 rounded">
        <div className="text-gray-400">Filmes</div>
        <div className="text-3xl font-bold text-green-400">
          {stats.filmes.toLocaleString()}
        </div>
      </div>
      
      <div className="bg-purple-900/20 p-4 rounded">
        <div className="text-gray-400">Séries</div>
        <div className="text-3xl font-bold text-purple-400">
          {stats.series.toLocaleString()}
        </div>
      </div>
    </div>
  );
}
```

---

## ▶️ PLAYER DE VÍDEO

### Integração com UniversalPlayer

```tsx
import { useState } from 'react';
import { UniversalPlayer } from './components/UniversalPlayer';
import { ConteudoItem } from './utils/m3uTmdbSync';

function App() {
  const [selectedItem, setSelectedItem] = useState<ConteudoItem | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);

  function handlePlay(item: ConteudoItem) {
    console.log('🎬 Reproduzir:', item.nome);
    console.log('📡 URL Real:', item.url);
    
    setSelectedItem(item);
    setShowPlayer(true);
  }

  return (
    <div>
      {/* Grid de conteúdo */}
      {/* ... */}

      {/* Player Modal */}
      {showPlayer && selectedItem && (
        <UniversalPlayer
          movie={{
            id: selectedItem.tmdb_id || 0,
            title: selectedItem.nome,
            name: selectedItem.nome,
            poster_path: selectedItem.poster || '',
            backdrop_path: selectedItem.backdrop || '',
            overview: selectedItem.overview || '',
            vote_average: selectedItem.vote_average || 0,
          }}
          streamUrl={selectedItem.url}  // ⚠️ URL REAL do Supabase
          onClose={() => setShowPlayer(false)}
        />
      )}
    </div>
  );
}
```

---

### Player HLS.js para M3U8

Se a URL for `.m3u8` (HLS), o player deve usar HLS.js:

```tsx
import Hls from 'hls.js';

function HLSPlayer({ url }: { url: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current || !url) return;

    const video = videoRef.current;

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
      });

      hls.loadSource(url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('✅ HLS manifest loaded');
        video.play().catch(err => console.error('Play error:', err));
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('❌ HLS Error:', data);
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              break;
          }
        }
      });

      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari nativo
      video.src = url;
      video.play();
    }
  }, [url]);

  return (
    <video
      ref={videoRef}
      controls
      className="w-full h-full"
      playsInline
    />
  );
}
```

---

## 🎨 IMAGENS 244×137 PX

### Padrão visual obrigatório:

```tsx
<img
  src={item.poster || item.logo || '/assets/sem_logo.png'}
  alt={item.nome}
  width={244}
  height={137}
  className="
    object-cover
    rounded-lg
    shadow-lg
    transition-transform
    duration-200
    hover:scale-105
    hover:shadow-red-500/50
  "
/>
```

**CSS adicional:**

```css
.movie-card img {
  width: 244px;
  height: 137px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.movie-card:hover img {
  transform: scale(1.05);
  box-shadow: 0 4px 10px rgba(229, 9, 20, 0.8);
}
```

---

## 🔧 TROUBLESHOOTING

### Problema 1: Tabela não existe

**Erro:**
```
relation "conteudo" does not exist
```

**Solução:**
1. Execute o SQL da migration novamente
2. Verifique se está no projeto correto do Supabase
3. Verifique se o SQL executou sem erros

---

### Problema 2: Sincronização lenta

**Causa:** TMDB rate limiting

**Solução:**
```typescript
// Reduzir batch size
await sincronizarM3UComTMDB(25, true); // Era 50

// Ou desabilitar TMDB temporariamente
await sincronizarM3UComTMDB(100, false);
```

---

### Problema 3: Imagens não carregam

**Verificar:**

```sql
-- Ver quantos itens têm poster
SELECT 
  tipo,
  COUNT(*) as total,
  COUNT(poster) as com_poster,
  ROUND(100.0 * COUNT(poster) / COUNT(*), 2) as percentual
FROM conteudo
GROUP BY tipo;
```

**Resultado esperado:**
```
tipo   | total | com_poster | percentual
-------|-------|------------|------------
Canal  |   500 |          0 |       0.00
Filme  |  4000 |       3800 |      95.00
Série  |  3900 |       3100 |      79.49
```

Se percentual baixo:
- Re-executar sincronização com `incluirTMDB: true`
- Verificar se TMDB_API_KEY é válida

---

### Problema 4: Player não reproduz

**Checklist:**

```typescript
// 1. Verificar se URL existe
console.log('URL:', item.url);
// Deve mostrar algo como: http://cdnserver.../live/canal.m3u8

// 2. Testar URL diretamente no VLC
// Copiar URL e abrir no VLC Media Player

// 3. Verificar logs do HLS.js
hls.on(Hls.Events.ERROR, (event, data) => {
  console.error('HLS Error:', data);
});
```

**Erros comuns:**
- URL expirada (renovar sincronização)
- CORS bloqueado (configurar servidor)
- Formato não suportado (verificar se é M3U8)

---

## 📚 QUERIES SQL ÚTEIS

### Ver todo o conteúdo:

```sql
SELECT * FROM conteudo
ORDER BY nome
LIMIT 100;
```

---

### Contar por tipo:

```sql
SELECT tipo, COUNT(*) as total
FROM conteudo
GROUP BY tipo;
```

---

### Buscar sem TMDB:

```sql
SELECT nome, tipo, grupo
FROM conteudo
WHERE tmdb_id IS NULL
AND tipo != 'Canal'
LIMIT 50;
```

---

### Buscar favoritos:

```sql
SELECT nome, tipo, poster
FROM conteudo
WHERE favorito = TRUE;
```

---

### Últimos sincronizados:

```sql
SELECT nome, tipo, tmdb_sincronizado_em
FROM conteudo
WHERE tmdb_sincronizado_em IS NOT NULL
ORDER BY tmdb_sincronizado_em DESC
LIMIT 20;
```

---

### Estatísticas completas:

```sql
SELECT * FROM sync_stats;
```

---

## ✅ CHECKLIST DE VALIDAÇÃO

- [ ] Tabela `conteudo` criada no Supabase
- [ ] Primeira sincronização executada
- [ ] Estatísticas mostram dados (> 1000 itens)
- [ ] Filmes têm poster (> 80%)
- [ ] Séries têm poster (> 70%)
- [ ] URLs de streaming são válidas
- [ ] Player reproduz vídeo real
- [ ] Imagens são 244×137 px
- [ ] Layout original mantido
- [ ] Nenhuma alteração visual

---

## 🚀 PRÓXIMOS PASSOS

### 1. Sincronização Automática

Adicionar cron job para sincronizar diariamente:

```typescript
// Executar todo dia às 3h da manhã
setInterval(async () => {
  const agora = new Date();
  if (agora.getHours() === 3) {
    console.log('🕒 Sincronização automática iniciada');
    await sincronizarM3UComTMDB(50, true);
  }
}, 60 * 60 * 1000); // Check a cada hora
```

---

### 2. Cache Offline

Salvar dados no IndexedDB para acesso offline:

```typescript
import localforage from 'localforage';

// Salvar
await localforage.setItem('filmes', filmes);

// Carregar
const cachedFilmes = await localforage.getItem('filmes');
```

---

### 3. Imagens Otimizadas

Baixar imagens e hospedar no próprio servidor:

```typescript
// Download de imagem
const imageBlob = await fetch(item.poster).then(r => r.blob());

// Upload para Supabase Storage
const { data } = await supabase.storage
  .from('posters')
  .upload(`${item.id}.jpg`, imageBlob);
```

---

## 📊 MÉTRICAS DE SUCESSO

✅ **Performance:**
- Sincronização completa: < 10 minutos
- Busca no banco: < 100ms
- Carregamento de imagens: < 500ms

✅ **Qualidade:**
- Filmes com TMDB: > 90%
- Séries com TMDB: > 75%
- URLs válidas: > 95%

✅ **UX:**
- Player inicia em: < 2 segundos
- Hover suave
- Imagens nítidas
- Zero alterações visuais

---

**Desenvolvido por:** Fabricio Cypreste  
**Versão:** v8.0  
**Data:** 08/11/2025  
**Status:** ✅ SISTEMA COMPLETO  

🎬 **RedFlix IPTV - URLs Reais + TMDB + Cache Supabase!** 🚀
