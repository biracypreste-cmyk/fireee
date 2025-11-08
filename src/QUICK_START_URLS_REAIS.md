# ⚡ RedFlix IPTV - Quick Start (URLs Reais)

**Tempo estimado:** 10 minutos  
**Pré-requisitos:** Supabase configurado  

---

## 🎯 OBJETIVO

Configurar sistema completo de streaming com:
- 🔗 URLs reais do M3U
- 🖼️ Capas do TMDB
- 💾 Cache no Supabase
- ▶️ Player funcional

---

## 🚀 3 PASSOS SIMPLES

### **PASSO 1: Criar Tabela (2 min)**

1. Acesse Supabase Dashboard
2. Vá em **SQL Editor**
3. Copie e cole o conteúdo de `/supabase/migrations/create_conteudo_table.sql`
4. Clique em **Run**

✅ **Sucesso:** Mensagem "Success. No rows returned"

---

### **PASSO 2: Sincronizar (5 min)**

**Opção A - Via Dashboard (Mais fácil):**

1. Adicione rota no `App.tsx`:
   ```tsx
   import { SyncDashboard } from './components/SyncDashboard';
   
   <Route path="/admin/sync" element={<SyncDashboard />} />
   ```

2. Acesse: `http://localhost:5173/admin/sync`

3. Clique em **🚀 Iniciar Sincronização**

4. Aguarde (3-5 min)

---

**Opção B - Via Console (Mais rápido):**

```typescript
import { sincronizarM3UComTMDB } from './utils/m3uTmdbSync';

// Cole no console do navegador (F12)
(async () => {
  const stats = await sincronizarM3UComTMDB(50, true);
  console.log('✅ Concluído:', stats);
})();
```

---

### **PASSO 3: Usar nos Componentes (3 min)**

```tsx
import { useEffect, useState } from 'react';
import { buscarPorTipo } from '../utils/m3uTmdbSync';

function FilmesPage() {
  const [filmes, setFilmes] = useState([]);

  useEffect(() => {
    buscarPorTipo('Filme').then(setFilmes);
  }, []);

  return (
    <div className="grid grid-cols-6 gap-4">
      {filmes.map(filme => (
        <div key={filme.id} onClick={() => playVideo(filme.url)}>
          <img
            src={filme.poster || '/assets/sem_logo.png'}
            alt={filme.nome}
            width={244}
            height={137}
            className="rounded-lg object-cover hover:scale-105 transition"
          />
          <h3 className="text-white mt-2">{filme.nome}</h3>
        </div>
      ))}
    </div>
  );
}
```

---

## ✅ VALIDAÇÃO RÁPIDA

**Verificar se funcionou:**

```sql
-- No Supabase SQL Editor:
SELECT tipo, COUNT(*) FROM conteudo GROUP BY tipo;
```

**Resultado esperado:**
```
tipo   | count
-------|-------
Canal  |   500
Filme  |  4000
Série  |  3900
```

---

## 🎬 REPRODUZIR VÍDEO

```tsx
import { UniversalPlayer } from './components/UniversalPlayer';

// Ao clicar em um item:
function handlePlay(item) {
  setPlayerUrl(item.url);  // URL REAL do Supabase
  setShowPlayer(true);
}

// Renderizar:
{showPlayer && (
  <UniversalPlayer
    movie={{ title: item.nome }}
    streamUrl={playerUrl}  // 🔗 URL real M3U8
    onClose={() => setShowPlayer(false)}
  />
)}
```

---

## 🔧 TROUBLESHOOTING

**Problema:** Tabela não existe  
**Solução:** Execute o SQL da migration novamente

**Problema:** Sincronização muito lenta  
**Solução:** Use `sincronizarM3UComTMDB(100, false)` (sem TMDB)

**Problema:** Imagens não aparecem  
**Solução:** Verifique se `incluirTMDB: true` na sincronização

---

## 📚 FUNÇÕES DISPONÍVEIS

```typescript
// Buscar conteúdo
buscarPorTipo('Filme' | 'Série' | 'Canal')
buscarPorGrupo('Ação')
buscarPorNome('Breaking Bad')
buscarTodoConteudo()

// Estatísticas
buscarEstatisticas()

// Sincronização
sincronizarM3UComTMDB(batchSize, incluirTMDB)
```

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ Integrar com suas páginas
2. ✅ Adicionar favoritos
3. ✅ Implementar busca
4. ✅ Configurar player HLS
5. ✅ Cache offline

---

**Guia completo:** `/REDFLIX_IPTV_URLS_REAIS_GUIA_COMPLETO.md`  
**Dashboard:** `http://localhost:5173/admin/sync`  
**Supabase:** `https://supabase.com/dashboard/project/YOUR_PROJECT`  

🚀 **Pronto para usar!**
