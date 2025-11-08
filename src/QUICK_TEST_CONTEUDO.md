# 🧪 Teste Rápido - Tabela Conteúdo

**Tempo:** 2 minutos  

---

## ✅ ERRO CORRIGIDO

```diff
- .from('canais')  ❌
- .from('filmes')  ❌  
- .from('series')  ❌

+ .from('conteudo') ✅
```

---

## 🚀 TESTE AGORA

### 1. Abra o Console do Navegador

```javascript
// Importar Supabase
import { supabase } from './utils/supabase/client';

// Testar query
const { data, error } = await supabase
  .from('conteudo')
  .select('*')
  .limit(10);

console.log('Dados:', data);
console.log('Erro:', error);
```

**Esperado:**
```
✅ data: Array com conteúdos
✅ error: null
```

---

### 2. Testar Inserção

```javascript
const { data, error } = await supabase
  .from('conteudo')
  .insert({
    nome: 'Teste Canal',
    tipo: 'Canal',
    url: 'http://teste.com/canal.m3u8',
    grupo: 'teste'
  })
  .select()
  .single();

console.log('Inserido:', data);
```

**Esperado:**
```
✅ Inserido: { id: ..., nome: "Teste Canal", tipo: "Canal", ... }
```

---

### 3. Testar Busca por Tipo

```javascript
// Buscar filmes
const { data: filmes } = await supabase
  .from('conteudo')
  .select('*')
  .eq('tipo', 'Filme');

console.log(`Filmes: ${filmes?.length}`);

// Buscar séries
const { data: series } = await supabase
  .from('conteudo')
  .select('*')
  .eq('tipo', 'Série');

console.log(`Séries: ${series?.length}`);

// Buscar canais
const { data: canais } = await supabase
  .from('conteudo')
  .select('*')
  .eq('tipo', 'Canal');

console.log(`Canais: ${canais?.length}`);
```

---

### 4. Testar Busca por Nome

```javascript
const { data } = await supabase
  .from('conteudo')
  .select('*')
  .ilike('nome', '%globo%');

console.log('Resultados:', data);
```

---

## 📊 VERIFICAR NO SUPABASE

1. Acesse: https://supabase.com/dashboard
2. Vá em **Database** → **Tables**
3. Procure a tabela **`conteudo`**
4. Clique para ver os dados

**Esperado:**
```
✅ Tabela existe
✅ Tem colunas: id, nome, tipo, grupo, url, logo, poster...
✅ Pode ter dados (se sincronizou)
```

---

## 🔄 SINCRONIZAR DADOS

### Via API (POST):

```bash
POST https://glnmajvrxdwfyedsuaxx.supabase.co/functions/v1/make-server-2363f5d6/sync-m3u-with-tmdb
```

Ou via código:

```javascript
import { projectId, publicAnonKey } from './utils/supabase/info';

const response = await fetch(
  `https://${projectId}.supabase.co/functions/v1/make-server-2363f5d6/sync-m3u-with-tmdb`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`
    }
  }
);

const result = await response.json();
console.log('Sincronização:', result);
```

**Esperado:**
```json
{
  "total": 500,
  "filmes": { "processed": 200, "withTMDB": 180, "uploaded": 150 },
  "series": { "processed": 150, "withTMDB": 130, "uploaded": 100 },
  "canais": { "processed": 150, "uploaded": 150 }
}
```

---

## ✅ CHECKLIST

- [ ] Query em `conteudo` funciona
- [ ] Inserção funciona
- [ ] Busca por tipo funciona
- [ ] Busca por nome funciona
- [ ] Tabela visível no Supabase Dashboard
- [ ] Sincronização M3U funciona

---

## 🐛 SE DER ERRO

### Erro: "relation conteudo does not exist"

**Solução:** Executar migration:

```sql
-- Copie e execute no Supabase SQL Editor
-- Conteúdo do arquivo: /supabase/migrations/create_conteudo_table.sql
```

---

### Erro: "duplicate key value"

**Normal!** Significa que o item já existe.

Use `onConflict`:

```javascript
const { data } = await supabase
  .from('conteudo')
  .upsert({
    nome: 'Teste',
    tipo: 'Canal',
    url: 'http://teste.com'
  }, { onConflict: 'nome,tipo' })
  .select();
```

---

### Erro: "column does not exist"

**Verifique** se você está usando os nomes corretos:

```typescript
// ✅ CORRETO:
{
  nome: '...',
  tipo: 'Canal' | 'Filme' | 'Série',
  grupo: '...',
  url: '...',
  logo: '...',
  poster: '...'
}

// ❌ ERRADO:
{
  name: '...',  // ❌ deve ser 'nome'
  type: '...',  // ❌ deve ser 'tipo'
  category: '...'  // ❌ deve ser 'grupo'
}
```

---

## 🎯 RESULTADO ESPERADO

```
┌───────────────────────────────────┐
│  ✅ Tabela conteudo funcionando   │
├───────────────────────────────────┤
│  ✅ Query: SELECT * funciona      │
│  ✅ Insert: INSERT funciona       │
│  ✅ Busca: WHERE tipo = funciona  │
│  ✅ Sync: M3U + TMDB funciona     │
└───────────────────────────────────┘
```

**🚀 Teste concluído com sucesso!**
