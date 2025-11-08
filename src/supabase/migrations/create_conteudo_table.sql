-- ========================================
-- REDFLIX IPTV - TABELA UNIFICADA DE CONTEÚDO
-- ========================================
-- Tabela unificada que consolida filmes, séries e canais
-- com metadados do TMDB e URLs reais de streaming
-- ========================================

-- Criar tabela conteudo (unificada)
CREATE TABLE IF NOT EXISTS conteudo (
  id BIGSERIAL PRIMARY KEY,
  
  -- Informações básicas
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('Canal', 'Filme', 'Série')),
  grupo TEXT,
  
  -- URLs e Streaming
  url TEXT NOT NULL,  -- 🔗 URL REAL do streaming (M3U)
  
  -- Imagens TMDB (armazenadas/cached)
  logo TEXT,          -- Logo oficial do TMDB
  poster TEXT,        -- Poster/thumbnail do TMDB
  backdrop TEXT,      -- Background/backdrop do TMDB
  
  -- Metadados TMDB
  tmdb_id INTEGER,    -- ID do conteúdo no TMDB
  tmdb_type TEXT,     -- 'movie' ou 'tv'
  overview TEXT,      -- Sinopse/descrição
  vote_average DECIMAL(3,1),  -- Nota média
  release_year INTEGER,       -- Ano de lançamento
  
  -- Informações M3U originais
  tvg_id TEXT,
  tvg_name TEXT,
  group_title TEXT,
  
  -- Controle e sincronização
  favorito BOOLEAN DEFAULT FALSE,
  atualizado_em TIMESTAMPTZ DEFAULT NOW(),
  tmdb_sincronizado_em TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- ÍNDICES PARA PERFORMANCE
-- ========================================
CREATE INDEX IF NOT EXISTS idx_conteudo_nome ON conteudo(nome);
CREATE INDEX IF NOT EXISTS idx_conteudo_tipo ON conteudo(tipo);
CREATE INDEX IF NOT EXISTS idx_conteudo_grupo ON conteudo(grupo);
CREATE INDEX IF NOT EXISTS idx_conteudo_tmdb_id ON conteudo(tmdb_id);
CREATE INDEX IF NOT EXISTS idx_conteudo_favorito ON conteudo(favorito) WHERE favorito = TRUE;
CREATE INDEX IF NOT EXISTS idx_conteudo_atualizado ON conteudo(atualizado_em DESC);

-- Índice para busca textual
CREATE INDEX IF NOT EXISTS idx_conteudo_nome_trgm ON conteudo USING gin(nome gin_trgm_ops);

-- ========================================
-- TRIGGERS
-- ========================================
-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_conteudo_updated_at
  BEFORE UPDATE ON conteudo
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- ROW LEVEL SECURITY (RLS)
-- ========================================
ALTER TABLE conteudo ENABLE ROW LEVEL SECURITY;

-- Políticas: permitir leitura pública
CREATE POLICY "Permitir leitura pública de conteúdo"
  ON conteudo FOR SELECT
  USING (true);

-- Políticas: permitir inserção e atualização (para sync)
CREATE POLICY "Permitir inserção de conteúdo"
  ON conteudo FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Permitir atualização de conteúdo"
  ON conteudo FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Permitir deleção de conteúdo"
  ON conteudo FOR DELETE
  USING (true);

-- ========================================
-- CONSTRAINTS
-- ========================================
-- Evitar duplicatas por nome e tipo
CREATE UNIQUE INDEX IF NOT EXISTS unique_conteudo_nome_tipo ON conteudo(nome, tipo);

-- ========================================
-- VIEWS ÚTEIS
-- ========================================

-- View: Conteúdo com imagens TMDB
CREATE OR REPLACE VIEW conteudo_com_imagens AS
SELECT 
  id,
  nome,
  tipo,
  grupo,
  url,
  COALESCE(poster, logo) as imagem_principal,
  backdrop,
  overview,
  vote_average,
  release_year,
  favorito,
  tmdb_sincronizado_em IS NOT NULL as tem_tmdb
FROM conteudo;

-- View: Estatísticas de sincronização
CREATE OR REPLACE VIEW sync_stats AS
SELECT
  tipo,
  COUNT(*) as total,
  COUNT(tmdb_id) as com_tmdb,
  COUNT(poster) as com_poster,
  COUNT(backdrop) as com_backdrop,
  ROUND(100.0 * COUNT(tmdb_id) / COUNT(*), 2) as percentual_tmdb
FROM conteudo
GROUP BY tipo;

-- View: Conteúdo sem TMDB (precisa sync)
CREATE OR REPLACE VIEW conteudo_sem_tmdb AS
SELECT 
  id,
  nome,
  tipo,
  grupo,
  url,
  atualizado_em
FROM conteudo
WHERE tmdb_id IS NULL
ORDER BY atualizado_em DESC;

-- View: Conteúdo por categoria
CREATE OR REPLACE VIEW conteudo_por_grupo AS
SELECT
  grupo,
  tipo,
  COUNT(*) as total,
  COUNT(tmdb_id) as com_tmdb
FROM conteudo
WHERE grupo IS NOT NULL
GROUP BY grupo, tipo
ORDER BY total DESC;

-- ========================================
-- FUNÇÕES AUXILIARES
-- ========================================

-- Função: Marcar como favorito
CREATE OR REPLACE FUNCTION marcar_favorito(conteudo_id BIGINT)
RETURNS VOID AS $$
BEGIN
  UPDATE conteudo SET favorito = TRUE WHERE id = conteudo_id;
END;
$$ LANGUAGE plpgsql;

-- Função: Remover de favoritos
CREATE OR REPLACE FUNCTION remover_favorito(conteudo_id BIGINT)
RETURNS VOID AS $$
BEGIN
  UPDATE conteudo SET favorito = FALSE WHERE id = conteudo_id;
END;
$$ LANGUAGE plpgsql;

-- Função: Buscar por nome (case-insensitive)
CREATE OR REPLACE FUNCTION buscar_conteudo(search_term TEXT)
RETURNS TABLE (
  id BIGINT,
  nome TEXT,
  tipo TEXT,
  grupo TEXT,
  url TEXT,
  poster TEXT,
  relevancia REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.nome,
    c.tipo,
    c.grupo,
    c.url,
    c.poster,
    SIMILARITY(c.nome, search_term) as relevancia
  FROM conteudo c
  WHERE c.nome ILIKE '%' || search_term || '%'
  ORDER BY relevancia DESC
  LIMIT 50;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- COMENTÁRIOS
-- ========================================
COMMENT ON TABLE conteudo IS 'Tabela unificada de filmes, séries e canais do RedFlix IPTV';
COMMENT ON COLUMN conteudo.id IS 'ID único do conteúdo (auto-incremento)';
COMMENT ON COLUMN conteudo.nome IS 'Nome do filme/série/canal';
COMMENT ON COLUMN conteudo.tipo IS 'Tipo: Canal, Filme ou Série';
COMMENT ON COLUMN conteudo.grupo IS 'Categoria/grupo do M3U';
COMMENT ON COLUMN conteudo.url IS '🔗 URL REAL de streaming (M3U)';
COMMENT ON COLUMN conteudo.logo IS 'Logo oficial do TMDB (cached)';
COMMENT ON COLUMN conteudo.poster IS 'Poster/thumbnail do TMDB (cached)';
COMMENT ON COLUMN conteudo.backdrop IS 'Background do TMDB (cached)';
COMMENT ON COLUMN conteudo.tmdb_id IS 'ID no The Movie Database';
COMMENT ON COLUMN conteudo.tmdb_sincronizado_em IS 'Data da última sincronização com TMDB';
COMMENT ON COLUMN conteudo.favorito IS 'Marcado como favorito pelo usuário';
COMMENT ON COLUMN conteudo.atualizado_em IS 'Data da última atualização do M3U';

-- ========================================
-- FIM DO SCRIPT
-- ========================================
