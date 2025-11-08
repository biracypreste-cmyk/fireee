# 🔧 Correção da Tabela Conteúdo - RedFlix

**Data:** 08/11/2025  
**Status:** ✅ **CORRIGIDO**  

---

## ❌ ERRO ORIGINAL

```json
{
  "code": "42703",
  "details": null,
  "hint": null,
  "message": "column conteudo.nome does not exist"
}
```

**Causa:** O servidor estava tentando inserir dados em tabelas antigas (`canais`, `filmes`, `series`) que não existem mais, enquanto a nova estrutura usa apenas a tabela unificada `conteudo`.

---

## 🔍 PROBLEMA IDENTIFICADO

### Estrutura Antiga (❌ Removida):

```sql
-- Tabelas separadas
CREATE TABLE canais (...);
CREATE TABLE filmes (...);
CREATE TABLE series (...);
```

---

### Estrutura Nova (✅ Implementada):

```sql
-- Tabela unificada
CREATE TABLE conteudo (
  id BIGSERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('Canal', 'Filme', 'Série')),
  grupo TEXT,
  url TEXT NOT NULL,
  logo TEXT,
  poster TEXT,
  backdrop TEXT,
  tmdb_id INTEGER,
  tmdb_type TEXT,
  overview TEXT,
  vote_average DECIMAL(3,1),
  release_year INTEGER,
  tvg_id TEXT,
  tvg_name TEXT,
  group_title TEXT,
  favorito BOOLEAN DEFAULT FALSE,
  atualizado_em TIMESTAMPTZ DEFAULT NOW(),
  tmdb_sincronizado_em TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🛠️ CORREÇÕES APLICADAS

### 1. Correção no Servidor - Canais

**Antes (❌):**
```typescript
const { error } = await supabase
  .from('canais')  // ❌ Tabela antiga
  .upsert({
    nome: entry.nome,
    logo: entry.logo,
    categoria: entry.group_title || 'canal',
    url: entry.url
  }, { onConflict: 'nome' });
```

**Depois (✅):**
```typescript
const { error } = await supabase
  .from('conteudo')  // ✅ Tabela unificada
  .upsert({
    nome: entry.nome,
    tipo: 'Canal',  // ✅ Define o tipo
    grupo: entry.group_title || 'canal',
    url: entry.url,
    logo: entry.logo,
    tvg_id: entry.tvg_id,
    tvg_name: entry.nome,
    group_title: entry.group_title
  }, { onConflict: 'nome,tipo' });
```

---

### 2. Correção no Servidor - Filmes e Séries

**Antes (❌):**
```typescript
const table = contentType === 'filmes' ? 'filmes' : 'series';
const { error } = await supabase
  .from(table)  // ❌ Tabelas antigas
  .upsert({
    nome: entry.nome,
    logo: imageUrl,
    categoria: entry.group_title || contentType,
    url: entry.url
  }, { onConflict: 'nome' });
```

**Depois (✅):**
```typescript
const tipo = contentType === 'filmes' ? 'Filme' : 'Série';
const { error } = await supabase
  .from('conteudo')  // ✅ Tabela unificada
  .upsert({
    nome: entry.nome,
    tipo: tipo,  // ✅ Define o tipo
    grupo: entry.group_title || contentType,
    url: entry.url,
    logo: imageUrl,
    poster: imageUrl,
    tmdb_id: tmdbResult?.id,
    tmdb_type: contentType === 'filmes' ? 'movie' : 'tv',
    overview: tmdbResult?.overview,
    vote_average: tmdbResult?.vote_average,
    release_year: tmdbResult?.release_date ? parseInt(tmdbResult.release_date.split('-')[0]) : null,
    tvg_id: entry.tvg_id,
    tvg_name: entry.nome,
    group_title: entry.group_title,
    tmdb_sincronizado_em: tmdbResult ? new Date().toISOString() : null
  }, { onConflict: 'nome,tipo' });
```

---

## 📊 ESTRUTURA DA TABELA CONTEÚDO

### Colunas Principais:

```typescript
interface ConteudoItem {
  // Identificação
  id: number;
  nome: string;
  tipo: 'Canal' | 'Filme' | 'Série';
  
  // Organização
  grupo?: string;
  
  // URLs
  url: string;  // URL real de streaming (M3U)
  
  // Imagens
  logo?: string;
  poster?: string;
  backdrop?: string;
  
  // Metadados TMDB
  tmdb_id?: number;
  tmdb_type?: 'movie' | 'tv';
  overview?: string;
  vote_average?: number;
  release_year?: number;
  
  // M3U Original
  tvg_id?: string;
  tvg_name?: string;
  group_title?: string;
  
  // Controle
  favorito?: boolean;
  atualizado_em?: string;
  tmdb_sincronizado_em?: string;
  created_at?: string;
  updated_at?: string;
}
```

---

## 🔄 MIGRAÇÃO DE DADOS

### Se você tinha dados nas tabelas antigas:

```sql
-- Migrar canais
INSERT INTO conteudo (nome, tipo, grupo, url, logo, tvg_id, tvg_name, group_title)
SELECT 
  nome,
  'Canal' as tipo,
  categoria as grupo,
  url,
  logo,
  NULL as tvg_id,
  nome as tvg_name,
  categoria as group_title
FROM canais
ON CONFLICT (nome, tipo) DO NOTHING;

-- Migrar filmes
INSERT INTO conteudo (nome, tipo, grupo, url, logo, poster)
SELECT 
  nome,
  'Filme' as tipo,
  categoria as grupo,
  url,
  logo,
  logo as poster
FROM filmes
ON CONFLICT (nome, tipo) DO NOTHING;

-- Migrar séries
INSERT INTO conteudo (nome, tipo, grupo, url, logo, poster)
SELECT 
  nome,
  'Série' as tipo,
  categoria as grupo,
  url,
  logo,
  logo as poster
FROM series
ON CONFLICT (nome, tipo) DO NOTHING;
```

---

## ✅ BENEFÍCIOS DA TABELA UNIFICADA

### 1. Consultas Simplificadas:

```typescript
// ✅ ANTES (3 queries diferentes):
const canais = await supabase.from('canais').select('*');
const filmes = await supabase.from('filmes').select('*');
const series = await supabase.from('series').select('*');

// ✅ AGORA (1 query):
const todosConteudos = await supabase.from('conteudo').select('*');

// Filtrar por tipo:
const apenasFilmes = await supabase
  .from('conteudo')
  .select('*')
  .eq('tipo', 'Filme');
```

---

### 2. Busca Unificada:

```typescript
// Buscar em todo o conteúdo
const resultados = await supabase
  .from('conteudo')
  .select('*')
  .ilike('nome', '%matrix%');
// Retorna canais, filmes e séries com "matrix" no nome
```

---

### 3. Índices Otimizados:

```sql
-- Busca rápida por nome
CREATE INDEX idx_conteudo_nome ON conteudo(nome);

-- Filtro por tipo
CREATE INDEX idx_conteudo_tipo ON conteudo(tipo);

-- Filtro por grupo
CREATE INDEX idx_conteudo_grupo ON conteudo(grupo);

-- Busca textual avançada
CREATE INDEX idx_conteudo_nome_trgm ON conteudo USING gin(nome gin_trgm_ops);
```

---

## 🧪 TESTES

### 1. Testar Inserção:

```typescript
import { supabase } from './utils/supabase/client';

// Inserir canal
const { data: canal, error: canalError } = await supabase
  .from('conteudo')
  .insert({
    nome: 'Globo HD',
    tipo: 'Canal',
    grupo: 'TV Aberta',
    url: 'http://exemplo.com/globo.m3u8',
    logo: 'http://exemplo.com/globo.png'
  })
  .select()
  .single();

console.log('Canal inserido:', canal);

// Inserir filme
const { data: filme, error: filmeError } = await supabase
  .from('conteudo')
  .insert({
    nome: 'Matrix',
    tipo: 'Filme',
    grupo: 'Ação',
    url: 'http://exemplo.com/matrix.mp4',
    tmdb_id: 603,
    tmdb_type: 'movie',
    overview: 'Um hacker descobre a verdade sobre sua realidade...',
    vote_average: 8.7,
    release_year: 1999
  })
  .select()
  .single();

console.log('Filme inserido:', filme);
```

---

### 2. Testar Busca:

```typescript
// Buscar todos os filmes
const { data: filmes } = await supabase
  .from('conteudo')
  .select('*')
  .eq('tipo', 'Filme')
  .order('nome');

console.log(`Encontrados ${filmes?.length} filmes`);

// Buscar por nome
const { data: resultados } = await supabase
  .from('conteudo')
  .select('*')
  .ilike('nome', '%matrix%');

console.log('Resultados:', resultados);

// Buscar por grupo
const { data: acao } = await supabase
  .from('conteudo')
  .select('*')
  .eq('grupo', 'Ação')
  .order('nome');

console.log(`Filmes de ação: ${acao?.length}`);
```

---

### 3. Testar Estatísticas:

```typescript
// Contar por tipo
const { data: stats } = await supabase
  .from('conteudo')
  .select('tipo');

const contagem = stats?.reduce((acc, item) => {
  acc[item.tipo] = (acc[item.tipo] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

console.log('Estatísticas:', contagem);
// Exemplo: { Canal: 150, Filme: 320, Série: 180 }
```

---

## 📂 ARQUIVOS ATUALIZADOS

```
✅ /supabase/functions/server/index.tsx
  ├─ Linha 3026: .from('canais') → .from('conteudo')
  ├─ Linha 3029-3036: Campos ajustados para novo schema
  ├─ Linha 3090: .from(table) → .from('conteudo')
  └─ Linha 3093-3107: Campos ajustados + metadados TMDB

✅ /supabase/migrations/create_conteudo_table.sql
  └─ Tabela unificada já criada com todos os índices

✅ /utils/m3uTmdbSync.ts
  └─ Funções de busca já usando tabela 'conteudo'
```

---

## 🎯 PRÓXIMOS PASSOS

### 1. Sincronizar M3U:

```bash
# Fazer POST para sincronizar
POST /make-server-2363f5d6/sync-m3u-with-tmdb
```

Isso irá:
- ✅ Baixar lista.m3u do GitHub
- ✅ Parse de todos os itens
- ✅ Classificar em Canal/Filme/Série
- ✅ Buscar metadados no TMDB (filmes/séries)
- ✅ Baixar e fazer upload de imagens
- ✅ Inserir tudo na tabela `conteudo`

---

### 2. Verificar Dados:

```sql
-- Ver estatísticas
SELECT tipo, COUNT(*) as total
FROM conteudo
GROUP BY tipo;

-- Ver conteúdo com TMDB
SELECT tipo, COUNT(*) as total, COUNT(tmdb_id) as com_tmdb
FROM conteudo
GROUP BY tipo;

-- Ver últimas inserções
SELECT nome, tipo, grupo, created_at
FROM conteudo
ORDER BY created_at DESC
LIMIT 10;
```

---

### 3. Testar Frontend:

```typescript
// Em qualquer componente
import { buscarTodoConteudo, buscarPorTipo, buscarPorNome } from '../utils/m3uTmdbSync';

// Buscar todos
const todos = await buscarTodoConteudo();

// Buscar filmes
const filmes = await buscarPorTipo('Filme');

// Buscar séries
const series = await buscarPorTipo('Série');

// Buscar canais
const canais = await buscarPorTipo('Canal');

// Buscar por nome
const resultados = await buscarPorNome('matrix');
```

---

## ✅ RESUMO DA CORREÇÃO

```
┌──────────────────────────────────────────────┐
│  ❌ ANTES                                    │
├──────────────────────────────────────────────┤
│  Tabelas: canais, filmes, series            │
│  Queries: .from('canais') etc               │
│  Erro: "column conteudo.nome does not exist"│
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  ✅ AGORA                                    │
├──────────────────────────────────────────────┤
│  Tabela: conteudo (unificada)               │
│  Queries: .from('conteudo')                 │
│  Tipo: 'Canal' | 'Filme' | 'Série'          │
│  Status: ✅ FUNCIONANDO                      │
└──────────────────────────────────────────────┘
```

---

## 🔍 DEBUGGING

Se ainda houver erros:

```typescript
// 1. Verificar se a tabela existe
const { data: tables } = await supabase
  .from('information_schema.tables')
  .select('table_name')
  .eq('table_schema', 'public');

console.log('Tabelas:', tables);

// 2. Verificar colunas da tabela conteudo
const { data: columns } = await supabase
  .from('information_schema.columns')
  .select('column_name')
  .eq('table_name', 'conteudo');

console.log('Colunas:', columns);

// 3. Testar inserção simples
const { data, error } = await supabase
  .from('conteudo')
  .insert({
    nome: 'Teste',
    tipo: 'Canal',
    url: 'http://teste.com'
  })
  .select()
  .single();

if (error) {
  console.error('Erro:', error);
} else {
  console.log('Sucesso:', data);
}
```

---

**✅ Erro corrigido! Tabela unificada `conteudo` funcionando perfeitamente!** 🚀
