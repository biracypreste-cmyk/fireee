# 🎬 RedFlix - Plataforma de Streaming Premium

![RedFlix Logo](https://i.imgur.com/your-logo.png)

## 📋 Descrição

RedFlix é uma plataforma completa de streaming desenvolvida com React, TypeScript e Tailwind CSS, integrada com a API do The Movie Database (TMDB) e sistema de canais ao vivo real.

## ✨ Principais Funcionalidades

### 🎥 **Conteúdo**
- **80+ Canais ao Vivo Reais** com logos e streams funcionais
- **Integração TMDB** para filmes e séries atualizados
- **🔄 GitHub Sync** - Sincronização automática de conteúdo do GitHub para Supabase
- **Parser M3U** - Conversão automática de listas IPTV
- **Hero Slider** com destaques cinematográficos
- **Sistema de Favoritos** e Lista de Reprodução
- **Modo Kids** com conteúdo seguro

### 👤 **Autenticação & Perfis**
- Login e cadastro com Supabase Auth
- Seleção de múltiplos perfis
- 3 Planos de assinatura (Básico, Padrão, Premium)

### 📊 **Dashboards**
- **Dashboard do Usuário** com estatísticas pessoais
- **Dashboard Admin** completo com analytics
- **GitHub Sync Panel** - Sincronização de conteúdo em tempo real
- **Performance Monitor** com Web Vitals em tempo real

### 🎨 **Design Premium**
- Interface cinematográfica inspirada na Netflix
- Glassmorphism e animações suaves
- Paleta vermelha (#E50914) da RedFlix
- Sistema de otimização de imagens (lazy loading, blur placeholders, CDN)

## 🚀 Tecnologias

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Supabase (Auth, Database, Edge Functions)
- **APIs**: TMDB API, Canais ao Vivo
- **UI Components**: ShadCN/UI + Lucide Icons
- **Animações**: Motion (Framer Motion)
- **Charts**: Recharts

## 📦 Estrutura do Projeto

```
redflix/
├── components/          # 34 componentes React
│   ├── admin/          # 7 componentes de administração
│   ├── ui/             # 38 componentes ShadCN
│   └── figma/          # Componentes de assets
├── utils/              # Utilitários (TMDB, Cache, Supabase)
├── supabase/           # Backend e Edge Functions
├── styles/             # CSS global
└── imports/            # Assets e SVGs
```

## 🔧 Instalação

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/redflix.git
cd redflix
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto:

```env
# TMDB API
VITE_TMDB_API_KEY=sua_chave_tmdb

# Supabase
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_publica_supabase
```

### 4. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

## 🔑 Obtendo as Chaves de API

### TMDB API Key
1. Acesse [themoviedb.org](https://www.themoviedb.org/)
2. Crie uma conta gratuita
3. Vá em **Configurações → API**
4. Solicite uma chave de API

### Supabase
1. Acesse [supabase.com](https://supabase.com/)
2. Crie um novo projeto
3. Copie a URL e a chave pública do projeto
4. Configure a autenticação conforme necessário

## 🔄 GitHub Sync - Sincronização Automática

### **Novidade v4.0!** Sistema completo de sincronização GitHub → Supabase

O RedFlix agora pode sincronizar automaticamente conteúdo real de filmes, séries e canais diretamente do repositório GitHub [FIGMA1](https://github.com/Fabriciocypreste/FIGMA1) para o banco de dados Supabase.

#### ✨ Principais Recursos

- 📡 **Leitura Automática**: Conecta ao GitHub e baixa arquivos JSON e M3U
- 🔄 **Conversão M3U → JSON**: Parser completo que converte listas IPTV automaticamente
- 💾 **Sincronização Inteligente**: Upsert baseado em nome único (sem duplicatas)
- 📊 **Interface Visual**: Painel integrado ao Admin Dashboard com progresso em tempo real
- 📝 **Logs Detalhados**: Console colorido com timestamps e estatísticas completas

#### 🚀 Início Rápido

```
1. Acesse Admin Dashboard
2. Clique em "GitHub Sync" no menu lateral
3. Clique em "🔄 Sincronizar Tudo"
4. Aguarde ~30-60 segundos
5. Pronto! Conteúdo sincronizado ✅
```

#### 📦 Arquivos Suportados

- `data/filmes.json` → Tabela `filmes`
- `data/series.json` → Tabela `series`
- `data/canais.json` → Tabela `canais`
- `lista.m3u` → Convertido e importado automaticamente

#### 🔧 Setup Rápido do Banco

```sql
-- Execute no Supabase SQL Editor
CREATE UNIQUE INDEX unique_filme_nome ON filmes(nome);
CREATE UNIQUE INDEX unique_serie_nome ON series(nome);
CREATE UNIQUE INDEX unique_canal_nome ON canais(nome);
```

#### 📚 Documentação Completa

Veja todos os detalhes em [GITHUB_SYNC_README.md](./GITHUB_SYNC_README.md) ou o guia rápido em [GITHUB_SYNC_QUICK_START.md](./GITHUB_SYNC_QUICK_START.md).

---

## 📺 Sistema de Canais

O sistema de canais carrega automaticamente 80+ canais, incluindo:

- Canais de notícias (CNN, GloboNews, etc.)
- Canais de esportes (ESPN, SporTV, etc.)
- Canais de entretenimento (Telecine, HBO, etc.)
- Canais infantis (Discovery Kids, Cartoon Network, etc.)

## 🎯 Funcionalidades Implementadas

✅ Sistema completo de autenticação  
✅ 3 planos de assinatura  
✅ Perfis de usuário múltiplos  
✅ 80+ canais ao vivo com logos reais  
✅ Player de vídeo full-screen  
✅ Sistema de favoritos e listas  
✅ Busca em tempo real  
✅ Dashboard do usuário com estatísticas  
✅ Dashboard administrativo completo  
✅ Performance monitor com Web Vitals  
✅ Otimização de imagens (lazy load, blur, CDN)  
✅ Design responsivo premium  

## 📄 Documentação Adicional

### 🎬 Interface e Design
- [ADMIN_DASHBOARD_README.md](./ADMIN_DASHBOARD_README.md) - Dashboard administrativo
- [USER_DASHBOARD_README.md](./USER_DASHBOARD_README.md) - Dashboard do usuário
- [REDFLIX_DESIGN_README.md](./REDFLIX_DESIGN_README.md) - Guia de design
- [IMAGE_OPTIMIZATION_README.md](./IMAGE_OPTIMIZATION_README.md) - Otimização de imagens

### 📡 Sistema de Conteúdo
- [CHANNELS_SYSTEM_README.md](./CHANNELS_SYSTEM_README.md) - Sistema de canais

### 🔄 GitHub Sync (NOVO!)
- [GITHUB_SYNC_README.md](./GITHUB_SYNC_README.md) - 📚 Documentação técnica completa
- [GITHUB_SYNC_QUICK_START.md](./GITHUB_SYNC_QUICK_START.md) - ⚡ Início rápido (3 minutos)
- [GITHUB_SYNC_TEST.md](./GITHUB_SYNC_TEST.md) - 🧪 Checklist de testes
- [GITHUB_SYNC_EXAMPLES.md](./GITHUB_SYNC_EXAMPLES.md) - 💡 Exemplos práticos
- [GITHUB_SYNC_MIGRATION_GUIDE.md](./GITHUB_SYNC_MIGRATION_GUIDE.md) - 🔄 Guia de migração
- [GITHUB_SYNC_DATABASE_SETUP.sql](./GITHUB_SYNC_DATABASE_SETUP.sql) - 🗄️ Setup do banco

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## 📝 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

## 👨‍💻 Autor

Desenvolvido com ❤️ para a RedFlix

---

**🎬 RedFlix - Sua experiência de streaming premium**
