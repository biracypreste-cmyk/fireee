# 🧪 Teste Rápido - MovieDetails v8.0

**Tempo:** 5 minutos  
**Objetivo:** Validar biografia + temporadas + URL real  

---

## 🎯 TESTE 1: Biografia (2 min)

### Passo 1: Abrir qualquer filme

```
1. Acesse RedFlix
2. Clique em qualquer filme
3. MovieDetails abre
```

### Verificar:

```
✅ Seção "Sinopse" aparece
✅ Texto da biografia visível
✅ Data de lançamento aparece
✅ Duração aparece
```

**Exemplo esperado:**
```
┌─────────────────────────────────────┐
│ SINOPSE                             │
├─────────────────────────────────────┤
│ Um professor de química...          │
│                                     │
│ Data de lançamento: 20/01/2008     │
│ Duração: 47 minutos                │
└─────────────────────────────────────┘
```

---

## 🎯 TESTE 2: Temporadas e Episódios (2 min)

### Passo 1: Abrir série conhecida

```
1. Busque "Breaking Bad" ou "Stranger Things"
2. Clique na série
3. Role até "Temporadas e Episódios"
```

### Verificar:

```
✅ Tabs de temporadas aparecem
✅ Temporada 1 selecionada por padrão
✅ Episódios listados com thumb
✅ Nome, número e duração visíveis
```

**Console esperado:**
```
📺 Temporadas válidas encontradas: 5
📺 Buscando episódios da Temporada 1 via API TMDB...
✅ Temporada 1 carregada: { episodeCount: 7 }
✅ currentSeason atualizado com 7 episódios
```

---

### Passo 2: Mudar de temporada

```
1. Clique em "Temporada 2"
2. Aguarde carregar
```

### Verificar:

```
✅ Episódios da Temporada 2 carregam
✅ Tab "Temporada 2" fica destacada
✅ Thumbs atualizam
```

**Console esperado:**
```
📺 Buscando temporada 2 da série 1396...
✅ Temporada 2 carregada: { episodeCount: 13 }
```

---

## 🎯 TESTE 3: URL Real do Supabase (1 min)

### Passo 1: Verificar URL

```
1. Abra Console do navegador (F12)
2. Clique em qualquer filme/série
3. Veja os logs
```

### Console esperado (se sincronizado):

```
🔍 Buscando URL real no Supabase para: Breaking Bad
📊 Resultados do Supabase: 1
✅ URL real encontrada: http://cdn.example.com/series/breaking-bad.m3u8
```

---

### Console esperado (se não sincronizado):

```
🔍 Buscando URL real no Supabase para: Breaking Bad
📊 Resultados do Supabase: 0
⚠️ Nenhum resultado no Supabase, tentando fallback...
✅ URL local encontrada: http://localhost/.../breaking-bad.m3u8
```

---

### Passo 2: Clicar em "Assistir"

```
1. Clique no botão "Assistir"
2. Player abre
```

### Verificar:

```
✅ UniversalPlayer abre
✅ Console mostra "Abrindo player universal..."
✅ URL aparece nos logs
```

**Console esperado:**
```
🎬 Abrindo player universal...
📡 Stream URL: http://cdn.example.com/series/breaking-bad.m3u8
```

---

## ❌ PROBLEMAS COMUNS

### Problema 1: Biografia não aparece

**Verificar Console:**
```javascript
// Se aparecer:
⚠️ Invalid movie ID
// Solução: Filme/série sem ID válido

// Se aparecer:
❌ Error fetching movie details: 404
// Solução: Conteúdo não existe no TMDB
```

---

### Problema 2: Temporadas vazias

**Verificar Console:**
```javascript
// Se aparecer:
📺 Temporadas válidas encontradas: 0
// Solução: Série sem dados de temporadas no TMDB

// Se aparecer:
❌ Erro ao buscar temporada 1: Not found
// Solução: Temporada não existe ou foi removida
```

**Teste com séries conhecidas:**
```
Breaking Bad: 1396
Stranger Things: 66732
The Last of Us: 100088
```

---

### Problema 3: URL real não encontrada

**Verificar Console:**
```javascript
// Se aparecer:
📊 Resultados do Supabase: 0
⚠️ Nenhum resultado no Supabase
```

**Solução:**

```sql
-- 1. Verificar no Supabase:
SELECT COUNT(*) FROM conteudo;

-- Se retornar 0:
-- Execute a sincronização M3U+TMDB

-- 2. Buscar manualmente:
SELECT nome, tipo, url FROM conteudo 
WHERE nome ILIKE '%Breaking Bad%';

-- Se não encontrar:
-- Adicione manualmente ou re-sincronize
```

---

## ✅ RESULTADO ESPERADO

```
┌──────────────────────────────────────┐
│  Filme/Série: Breaking Bad           │
├──────────────────────────────────────┤
│  ✅ Biografia aparece                │
│  ✅ 5 temporadas listadas            │
│  ✅ Episódios carregam               │
│  ✅ URL real do Supabase             │
│  ✅ Player abre e reproduz           │
└──────────────────────────────────────┘
```

---

## 🔧 DEBUG RÁPIDO

### Ver tudo no console:

```javascript
// Cole no console (F12):
console.log('=== MOVIEDETAILS DEBUG ===');

// 1. Verificar estado atual
const details = document.querySelector('[data-details]');
console.log('Details element:', details);

// 2. Verificar se há temporadas
const seasonTabs = document.querySelectorAll('[class*="Temporada"]');
console.log('Season tabs:', seasonTabs.length);

// 3. Verificar episódios
const episodes = document.querySelectorAll('[class*="episode"]');
console.log('Episodes:', episodes.length);
```

---

## 📊 CHECKLIST FINAL

- [ ] Biografia aparece
- [ ] Data/duração aparecem
- [ ] Temporadas carregam (se série)
- [ ] Episódios listados
- [ ] Ao clicar temporada, episódios mudam
- [ ] Console mostra logs detalhados
- [ ] URL real encontrada (Supabase ou local)
- [ ] Botão "Assistir" abre player
- [ ] Player reproduz stream

---

**Se TODOS os itens ✅ → Tudo funcionando!**  
**Se algum ❌ → Ver `/FIX_MOVIEDETAILS_COMPLETO_V8.md`**  

🎬 **Teste em 5 minutos!** 🚀
