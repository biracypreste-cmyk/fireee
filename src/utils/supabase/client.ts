import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

// URL do projeto Supabase
const supabaseUrl = `https://${projectId}.supabase.co`;

// Criar cliente Supabase singleton
export const supabase = createClient(supabaseUrl, publicAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'X-Client-Info': 'redflix-web',
    },
  },
});

// Types para as tabelas
export interface Filme {
  id?: string;
  nome: string;
  logo: string;
  categoria: string;
  url: string;
  created_at?: string;
}

export interface Serie {
  id?: string;
  nome: string;
  logo: string;
  categoria: string;
  url: string;
  created_at?: string;
}

export interface Canal {
  id?: string;
  nome: string;
  logo: string;
  categoria: string;
  url: string;
  created_at?: string;
}

// Database helper functions
export const db = {
  // Filmes
  filmes: {
    getAll: async (): Promise<Filme[]> => {
      const { data, error } = await supabase
        .from('filmes')
        .select('*')
        .order('nome', { ascending: true });
      
      if (error) {
        console.error('Erro ao buscar filmes:', error);
        throw error;
      }
      
      return data || [];
    },
    
    getByCategoria: async (categoria: string): Promise<Filme[]> => {
      const { data, error } = await supabase
        .from('filmes')
        .select('*')
        .eq('categoria', categoria)
        .order('nome', { ascending: true });
      
      if (error) {
        console.error('Erro ao buscar filmes por categoria:', error);
        throw error;
      }
      
      return data || [];
    },
    
    insert: async (filmes: Omit<Filme, 'id' | 'created_at'>[]): Promise<Filme[]> => {
      const { data, error } = await supabase
        .from('filmes')
        .insert(filmes)
        .select();
      
      if (error) {
        console.error('Erro ao inserir filmes:', error);
        throw error;
      }
      
      return data || [];
    },
  },
  
  // Séries
  series: {
    getAll: async (): Promise<Serie[]> => {
      const { data, error } = await supabase
        .from('series')
        .select('*')
        .order('nome', { ascending: true });
      
      if (error) {
        console.error('Erro ao buscar séries:', error);
        throw error;
      }
      
      return data || [];
    },
    
    getByCategoria: async (categoria: string): Promise<Serie[]> => {
      const { data, error } = await supabase
        .from('series')
        .select('*')
        .eq('categoria', categoria)
        .order('nome', { ascending: true });
      
      if (error) {
        console.error('Erro ao buscar séries por categoria:', error);
        throw error;
      }
      
      return data || [];
    },
    
    insert: async (series: Omit<Serie, 'id' | 'created_at'>[]): Promise<Serie[]> => {
      const { data, error } = await supabase
        .from('series')
        .insert(series)
        .select();
      
      if (error) {
        console.error('Erro ao inserir séries:', error);
        throw error;
      }
      
      return data || [];
    },
  },
  
  // Canais
  canais: {
    getAll: async (): Promise<Canal[]> => {
      const { data, error } = await supabase
        .from('canais')
        .select('*')
        .order('nome', { ascending: true });
      
      if (error) {
        console.error('Erro ao buscar canais:', error);
        throw error;
      }
      
      return data || [];
    },
    
    getByCategoria: async (categoria: string): Promise<Canal[]> => {
      const { data, error } = await supabase
        .from('canais')
        .select('*')
        .eq('categoria', categoria)
        .order('nome', { ascending: true });
      
      if (error) {
        console.error('Erro ao buscar canais por categoria:', error);
        throw error;
      }
      
      return data || [];
    },
    
    insert: async (canais: Omit<Canal, 'id' | 'created_at'>[]): Promise<Canal[]> => {
      const { data, error } = await supabase
        .from('canais')
        .insert(canais)
        .select();
      
      if (error) {
        console.error('Erro ao inserir canais:', error);
        throw error;
      }
      
      return data || [];
    },
  },
};

export default supabase;
