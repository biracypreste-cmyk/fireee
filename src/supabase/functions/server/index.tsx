import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-2363f5d6/health", (c) => {
  return c.json({ status: "ok" });
});

// Debug endpoint to check API key
app.get("/make-server-2363f5d6/debug/check-key", (c) => {
  const apiKey = Deno.env.get("TMDB_API_KEY");
  return c.json({ 
    apiKeyPresent: !!apiKey,
    apiKeyLength: apiKey?.length || 0,
    apiKeyPrefix: apiKey ? apiKey.substring(0, 10) + '...' : 'none',
    apiKeySuffix: apiKey ? '...' + apiKey.substring(apiKey.length - 10) : 'none'
  });
});

// Test TMDB endpoint
app.get("/make-server-2363f5d6/debug/test-tmdb", async (c) => {
  const apiKey = Deno.env.get("TMDB_API_KEY");
  
  if (!apiKey) {
    return c.json({ error: "API key not found in environment" }, 500);
  }
  
  // Test with Bearer token
  const url1 = `${TMDB_BASE_URL}/trending/movie/day`;
  const response1 = await fetch(url1, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Accept': 'application/json'
    }
  });
  const result1 = await response1.json();
  
  // Test with API key as query parameter (using the original API key)
  const originalApiKey = "ddb1bdf6aa91bdf335797853884b0c1d";
  const url2 = `${TMDB_BASE_URL}/trending/movie/day?api_key=${originalApiKey}`;
  const response2 = await fetch(url2);
  const result2 = await response2.json();
  
  return c.json({
    bearerTokenTest: {
      status: response1.status,
      success: response1.ok,
      result: result1
    },
    apiKeyQueryTest: {
      status: response2.status,
      success: response2.ok,
      result: result2
    }
  });
});

// TMDB API endpoints
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Get trending movies/shows
app.get("/make-server-2363f5d6/tmdb/trending/:mediaType/:timeWindow", async (c) => {
  try {
    // Use the original API key directly
    const apiKey = "ddb1bdf6aa91bdf335797853884b0c1d";
    console.log(`Using TMDB API Key`);

    const { mediaType, timeWindow } = c.req.param();
    const url = `${TMDB_BASE_URL}/trending/${mediaType}/${timeWindow}?api_key=${apiKey}`;
    console.log(`Fetching TMDB URL: ${TMDB_BASE_URL}/trending/${mediaType}/${timeWindow}?api_key=***`);
    
    const response = await fetch(url);
    console.log(`TMDB API Response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`TMDB API error fetching trending: ${response.status} ${response.statusText}, Body: ${errorText}`);
      return c.json({ error: "Failed to fetch trending data from TMDB", details: errorText }, response.status);
    }
    
    const data = await response.json();
    console.log(`TMDB API returned ${data.results?.length || 0} results`);
    return c.json(data);
  } catch (error) {
    console.log(`Server error fetching trending data: ${error}`);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

// Get popular movies/shows
app.get("/make-server-2363f5d6/tmdb/popular/:mediaType", async (c) => {
  try {
    const apiKey = "ddb1bdf6aa91bdf335797853884b0c1d";

    const { mediaType } = c.req.param();
    const url = `${TMDB_BASE_URL}/${mediaType}/popular?api_key=${apiKey}`;
    console.log(`Fetching TMDB URL: ${TMDB_BASE_URL}/${mediaType}/popular?api_key=***`);
    
    const response = await fetch(url);
    console.log(`TMDB API Response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`TMDB API error fetching popular: ${response.status} ${response.statusText}, Body: ${errorText}`);
      return c.json({ error: "Failed to fetch popular data from TMDB", details: errorText }, response.status);
    }
    
    const data = await response.json();
    console.log(`TMDB API returned ${data.results?.length || 0} results`);
    return c.json(data);
  } catch (error) {
    console.log(`Server error fetching popular data: ${error}`);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

// Get top rated
app.get("/make-server-2363f5d6/tmdb/top-rated/:mediaType", async (c) => {
  try {
    const apiKey = "ddb1bdf6aa91bdf335797853884b0c1d";

    const { mediaType } = c.req.param();
    const url = `${TMDB_BASE_URL}/${mediaType}/top_rated?api_key=${apiKey}`;
    console.log(`Fetching TMDB URL: ${TMDB_BASE_URL}/${mediaType}/top_rated?api_key=***`);
    
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`TMDB API error fetching top rated: ${response.status} ${response.statusText}, Body: ${errorText}`);
      return c.json({ error: "Failed to fetch top rated data from TMDB" }, response.status);
    }
    
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.log(`Server error fetching top rated data: ${error}`);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

// Search movies/shows
app.get("/make-server-2363f5d6/tmdb/search/:mediaType", async (c) => {
  try {
    const apiKey = "ddb1bdf6aa91bdf335797853884b0c1d";

    const { mediaType } = c.req.param();
    const query = c.req.query("query");
    
    if (!query) {
      return c.json({ error: "Query parameter is required" }, 400);
    }

    const url = `${TMDB_BASE_URL}/search/${mediaType}?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=pt-BR`;
    console.log(`Fetching TMDB URL: ${TMDB_BASE_URL}/search/${mediaType}?api_key=***&query=${encodeURIComponent(query)}&language=pt-BR`);
    
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`TMDB API error during search: ${response.status} ${response.statusText}, Body: ${errorText}`);
      return c.json({ error: "Failed to search TMDB" }, response.status);
    }
    
    const data = await response.json();
    console.log(`Search results for "${query}": ${data.results?.length || 0} items found`);
    return c.json(data);
  } catch (error) {
    console.log(`Server error during search: ${error}`);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

// Get details for a specific movie/show
app.get("/make-server-2363f5d6/tmdb/details/:mediaType/:id", async (c) => {
  try {
    const apiKey = "ddb1bdf6aa91bdf335797853884b0c1d";

    const { mediaType, id } = c.req.param();
    
    // Pegar query params adicionais (como append_to_response)
    const queryParams = c.req.query();
    const queryString = new URLSearchParams(queryParams).toString();
    
    let url = `${TMDB_BASE_URL}/${mediaType}/${id}?api_key=${apiKey}&language=pt-BR`;
    if (queryString) {
      url += `&${queryString}`;
    }
    
    console.log(`Fetching TMDB details with params: ${mediaType}/${id} (${queryString || 'no extra params'})`);
    
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`TMDB API error fetching details: ${response.status} ${response.statusText}, Body: ${errorText}`);
      return c.json({ error: "Failed to fetch details from TMDB" }, response.status);
    }
    
    const data = await response.json();
    console.log(`Details loaded for ${mediaType}/${id}:`, {
      hasCredits: !!data.credits,
      castCount: data.credits?.cast?.length || 0,
      hasImages: !!data.images,
      logosCount: data.images?.logos?.length || 0,
      hasVideos: !!data.videos,
      videosCount: data.videos?.results?.length || 0,
      hasSeasons: !!data.seasons,
      seasonsCount: data.seasons?.length || 0
    });
    return c.json(data);
  } catch (error) {
    console.log(`Server error fetching details: ${error}`);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

// Get images (logos, posters, backdrops) for a movie/show
app.get("/make-server-2363f5d6/tmdb/images/:mediaType/:id", async (c) => {
  try {
    const apiKey = "ddb1bdf6aa91bdf335797853884b0c1d";

    const { mediaType, id } = c.req.param();
    const url = `${TMDB_BASE_URL}/${mediaType}/${id}/images?api_key=${apiKey}`;
    console.log(`Fetching TMDB images: ${TMDB_BASE_URL}/${mediaType}/${id}/images?api_key=***`);
    
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`TMDB API error fetching images: ${response.status} ${response.statusText}, Body: ${errorText}`);
      return c.json({ error: "Failed to fetch images from TMDB" }, response.status);
    }
    
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.log(`Server error fetching images: ${error}`);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

// Get season details for a TV show
app.get("/make-server-2363f5d6/tmdb/tv/:id/season/:seasonNumber", async (c) => {
  try {
    const apiKey = "ddb1bdf6aa91bdf335797853884b0c1d";

    const { id, seasonNumber } = c.req.param();
    const url = `${TMDB_BASE_URL}/tv/${id}/season/${seasonNumber}?api_key=${apiKey}&language=pt-BR`;
    console.log(`Fetching season ${seasonNumber} for TV show ${id}`);
    
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`TMDB API error fetching season: ${response.status} ${response.statusText}, Body: ${errorText}`);
      return c.json({ error: "Failed to fetch season from TMDB" }, response.status);
    }
    
    const data = await response.json();
    console.log(`Season ${seasonNumber} data:`, {
      hasEpisodes: !!data.episodes,
      episodeCount: data.episodes?.length || 0,
      seasonName: data.name
    });
    return c.json(data);
  } catch (error) {
    console.log(`Server error fetching season: ${error}`);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

// Get credits (cast & crew) for a movie/show
app.get("/make-server-2363f5d6/tmdb/credits/:mediaType/:id", async (c) => {
  try {
    const apiKey = "ddb1bdf6aa91bdf335797853884b0c1d";

    const { mediaType, id } = c.req.param();
    const url = `${TMDB_BASE_URL}/${mediaType}/${id}/credits?api_key=${apiKey}`;
    console.log(`Fetching TMDB credits: ${TMDB_BASE_URL}/${mediaType}/${id}/credits?api_key=***`);
    
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`TMDB API error fetching credits: ${response.status} ${response.statusText}, Body: ${errorText}`);
      return c.json({ error: "Failed to fetch credits from TMDB" }, response.status);
    }
    
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.log(`Server error fetching credits: ${error}`);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

// Get videos/trailers for a movie/show
app.get("/make-server-2363f5d6/tmdb/videos/:mediaType/:id", async (c) => {
  try {
    const apiKey = "ddb1bdf6aa91bdf335797853884b0c1d";

    const { mediaType, id } = c.req.param();
    const url = `${TMDB_BASE_URL}/${mediaType}/${id}/videos?api_key=${apiKey}&language=pt-BR`;
    console.log(`Fetching TMDB videos: ${TMDB_BASE_URL}/${mediaType}/${id}/videos?api_key=***`);
    
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`TMDB API error fetching videos: ${response.status} ${response.statusText}, Body: ${errorText}`);
      return c.json({ error: "Failed to fetch videos from TMDB" }, response.status);
    }
    
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.log(`Server error fetching videos: ${error}`);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

// Discover movies/shows with filters (for upcoming 2025 releases)
app.get("/make-server-2363f5d6/tmdb/discover/:mediaType", async (c) => {
  try {
    const apiKey = "ddb1bdf6aa91bdf335797853884b0c1d";

    const { mediaType } = c.req.param();
    const primaryReleaseYear = c.req.query("primary_release_year");
    const firstAirDateYear = c.req.query("first_air_date_year");
    const sortBy = c.req.query("sort_by") || "popularity.desc";
    
    let url = `${TMDB_BASE_URL}/discover/${mediaType}?api_key=${apiKey}&language=pt-BR&sort_by=${sortBy}`;
    
    if (primaryReleaseYear) {
      url += `&primary_release_year=${primaryReleaseYear}`;
    }
    if (firstAirDateYear) {
      url += `&first_air_date_year=${firstAirDateYear}`;
    }
    
    console.log(`Fetching TMDB discover: ${url.replace(apiKey, '***')}`);
    
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`TMDB API error discovering content: ${response.status} ${response.statusText}, Body: ${errorText}`);
      return c.json({ error: "Failed to discover content from TMDB" }, response.status);
    }
    
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.log(`Server error discovering content: ${error}`);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

// Get person details
app.get("/make-server-2363f5d6/tmdb/person/:id", async (c) => {
  try {
    const apiKey = "ddb1bdf6aa91bdf335797853884b0c1d";
    const { id } = c.req.param();
    const url = `${TMDB_BASE_URL}/person/${id}?api_key=${apiKey}&language=pt-BR`;
    console.log(`Fetching TMDB person: ${TMDB_BASE_URL}/person/${id}?api_key=***`);
    
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`TMDB API error fetching person: ${response.status} ${response.statusText}, Body: ${errorText}`);
      return c.json({ error: "Failed to fetch person from TMDB" }, response.status);
    }
    
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.log(`Server error fetching person: ${error}`);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

// Get person movie credits
app.get("/make-server-2363f5d6/tmdb/person/:id/movie_credits", async (c) => {
  try {
    const apiKey = "ddb1bdf6aa91bdf335797853884b0c1d";
    const { id } = c.req.param();
    const url = `${TMDB_BASE_URL}/person/${id}/movie_credits?api_key=${apiKey}&language=pt-BR`;
    console.log(`Fetching TMDB person movie credits: ${TMDB_BASE_URL}/person/${id}/movie_credits?api_key=***`);
    
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`TMDB API error fetching person movie credits: ${response.status} ${response.statusText}, Body: ${errorText}`);
      return c.json({ error: "Failed to fetch person movie credits from TMDB" }, response.status);
    }
    
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.log(`Server error fetching person movie credits: ${error}`);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

// Get person TV credits
app.get("/make-server-2363f5d6/tmdb/person/:id/tv_credits", async (c) => {
  try {
    const apiKey = "ddb1bdf6aa91bdf335797853884b0c1d";
    const { id } = c.req.param();
    const url = `${TMDB_BASE_URL}/person/${id}/tv_credits?api_key=${apiKey}&language=pt-BR`;
    console.log(`Fetching TMDB person TV credits: ${TMDB_BASE_URL}/person/${id}/tv_credits?api_key=***`);
    
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`TMDB API error fetching person TV credits: ${response.status} ${response.statusText}, Body: ${errorText}`);
      return c.json({ error: "Failed to fetch person TV credits from TMDB" }, response.status);
    }
    
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.log(`Server error fetching person TV credits: ${error}`);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

// Get person images
app.get("/make-server-2363f5d6/tmdb/person/:id/images", async (c) => {
  try {
    const apiKey = "ddb1bdf6aa91bdf335797853884b0c1d";
    const { id } = c.req.param();
    const url = `${TMDB_BASE_URL}/person/${id}/images?api_key=${apiKey}`;
    console.log(`Fetching TMDB person images: ${TMDB_BASE_URL}/person/${id}/images?api_key=***`);
    
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`TMDB API error fetching person images: ${response.status} ${response.statusText}, Body: ${errorText}`);
      return c.json({ error: "Failed to fetch person images from TMDB" }, response.status);
    }
    
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.log(`Server error fetching person images: ${error}`);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

// ========================================
// IMAGE CACHING SYSTEM
// ========================================

/**
 * Cria o bucket de imagens no Supabase Storage se não existir
 */
async function ensureImageBucket() {
  try {
    const { createClient } = await import("jsr:@supabase/supabase-js@2");
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const bucketName = 'make-2363f5d6-tmdb-images';
    
    // Verificar se o bucket já existe
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      console.log('📦 Creating TMDB images bucket...');
      const { error } = await supabase.storage.createBucket(bucketName, {
        public: false,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
      });
      
      if (error && !error.message.includes('already exists')) {
        console.error('❌ Error creating bucket:', error);
        return null;
      }
      console.log('✅ TMDB images bucket created');
    }
    
    return supabase;
  } catch (error) {
    console.error('❌ Error ensuring image bucket:', error);
    return null;
  }
}

/**
 * Gera hash simples para a URL da imagem
 */
function hashUrl(url: string): string {
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

/**
 * Proxy de imagens do TMDB com cache no Supabase Storage
 * GET /make-server-2363f5d6/image-proxy?url={tmdb_image_url}
 */
app.get("/make-server-2363f5d6/image-proxy", async (c) => {
  try {
    const imageUrl = c.req.query('url');
    
    if (!imageUrl) {
      return c.json({ error: 'URL parameter is required' }, 400);
    }

    // Validar que é uma URL do TMDB
    if (!imageUrl.includes('image.tmdb.org')) {
      return c.json({ error: 'Only TMDB images are supported' }, 400);
    }

    console.log(`🖼️ Image proxy request: ${imageUrl}`);

    // Gerar hash da URL para usar como chave
    const urlHash = hashUrl(imageUrl);
    const cacheKey = `tmdb-image-${urlHash}`;

    // Verificar se já temos a URL em cache no KV
    const cachedData = await kv.get(cacheKey);
    
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        const { signedUrl, expiresAt } = parsed;
        
        // Verificar se a URL assinada ainda é válida (renovar 1 hora antes de expirar)
        if (expiresAt && Date.now() < expiresAt - 3600000) {
          console.log(`✅ Cache hit: returning cached signed URL`);
          return c.json({ url: signedUrl, cached: true });
        }
      } catch (e) {
        console.log('⚠️ Invalid cache data, will refresh');
      }
    }

    // Inicializar Supabase
    const supabase = await ensureImageBucket();
    if (!supabase) {
      return c.json({ error: 'Storage not available' }, 500);
    }

    const bucketName = 'make-2363f5d6-tmdb-images';
    
    // Extrair o path da imagem do TMDB
    // Exemplo: https://image.tmdb.org/t/p/w500/abc123.jpg -> w500/abc123.jpg
    const match = imageUrl.match(/\/t\/p\/(.*)/);
    if (!match) {
      return c.json({ error: 'Invalid TMDB image URL format' }, 400);
    }
    
    const imagePath = match[1]; // Ex: w500/abc123.jpg

    // Verificar se a imagem já existe no storage
    const { data: existingFile } = await supabase.storage
      .from(bucketName)
      .list(imagePath.split('/')[0], {
        search: imagePath.split('/').pop()
      });

    let needsDownload = !existingFile || existingFile.length === 0;

    if (needsDownload) {
      console.log(`📥 Downloading image from TMDB: ${imagePath}`);
      
      // Baixar a imagem do TMDB
      const response = await fetch(imageUrl);
      
      if (!response.ok) {
        console.error(`❌ Failed to fetch image from TMDB: ${response.status}`);
        return c.json({ error: 'Failed to fetch image from TMDB' }, response.status);
      }

      const imageBuffer = await response.arrayBuffer();
      const contentType = response.headers.get('content-type') || 'image/jpeg';

      // Fazer upload para o Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(imagePath, imageBuffer, {
          contentType,
          cacheControl: '31536000', // 1 ano
          upsert: true
        });

      if (uploadError) {
        console.error(`❌ Error uploading to storage:`, uploadError);
        return c.json({ error: 'Failed to upload image to storage' }, 500);
      }

      console.log(`✅ Image uploaded to storage: ${imagePath}`);
    } else {
      console.log(`✅ Image already exists in storage: ${imagePath}`);
    }

    // Gerar URL assinada (válida por 7 dias)
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(imagePath, 604800); // 7 dias em segundos

    if (signedUrlError || !signedUrlData) {
      console.error(`❌ Error creating signed URL:`, signedUrlError);
      return c.json({ error: 'Failed to create signed URL' }, 500);
    }

    const signedUrl = signedUrlData.signedUrl;
    const expiresAt = Date.now() + (604800 * 1000); // 7 dias em ms

    // Salvar no cache KV
    await kv.set(cacheKey, JSON.stringify({
      signedUrl,
      expiresAt,
      originalUrl: imageUrl,
      storagePath: imagePath,
      cachedAt: Date.now()
    }));

    console.log(`✅ Image proxy successful, returning signed URL`);
    
    return c.json({ 
      url: signedUrl, 
      cached: false,
      expires: new Date(expiresAt).toISOString()
    });

  } catch (error) {
    console.error(`❌ Image proxy error:`, error);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

/**
 * Limpar cache de imagens antigas
 * POST /make-server-2363f5d6/clear-image-cache
 */
app.post("/make-server-2363f5d6/clear-image-cache", async (c) => {
  try {
    console.log('🗑️ Clearing old image cache entries...');
    
    // Buscar todas as chaves que começam com 'tmdb-image-'
    const cacheKeys = await kv.getByPrefix('tmdb-image-');
    
    let deletedCount = 0;
    const now = Date.now();
    
    for (const entry of cacheKeys) {
      try {
        const data = JSON.parse(entry);
        if (data.expiresAt && data.expiresAt < now) {
          const keyMatch = entry.match(/tmdb-image-\w+/);
          if (keyMatch) {
            await kv.del(keyMatch[0]);
            deletedCount++;
          }
        }
      } catch (e) {
        // Ignorar entradas inválidas
      }
    }
    
    console.log(`✅ Deleted ${deletedCount} expired cache entries`);
    
    return c.json({ 
      success: true, 
      deletedCount,
      message: `Cleared ${deletedCount} expired cache entries`
    });
  } catch (error) {
    console.error(`❌ Error clearing cache:`, error);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

/**
 * Estatísticas do cache de imagens
 * GET /make-server-2363f5d6/image-cache-stats
 */
app.get("/make-server-2363f5d6/image-cache-stats", async (c) => {
  try {
    const cacheKeys = await kv.getByPrefix('tmdb-image-');
    
    let totalCached = 0;
    let expiredCount = 0;
    const now = Date.now();
    
    for (const entry of cacheKeys) {
      try {
        const data = JSON.parse(entry);
        totalCached++;
        if (data.expiresAt && data.expiresAt < now) {
          expiredCount++;
        }
      } catch (e) {
        // Ignorar
      }
    }
    
    // Tentar obter estatísticas do Storage
    const supabase = await ensureImageBucket();
    let storageStats = null;
    
    if (supabase) {
      const bucketName = 'make-2363f5d6-tmdb-images';
      const { data: files } = await supabase.storage.from(bucketName).list();
      
      if (files) {
        storageStats = {
          filesCount: files.length,
          totalSize: files.reduce((sum, file) => sum + (file.metadata?.size || 0), 0)
        };
      }
    }
    
    return c.json({
      cache: {
        totalEntries: totalCached,
        activeEntries: totalCached - expiredCount,
        expiredEntries: expiredCount
      },
      storage: storageStats
    });
  } catch (error) {
    console.error(`❌ Error getting cache stats:`, error);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

// ========================================
// CONTENT LIST MANAGEMENT (KV Store)
// ========================================

// Get content list from KV Store (or fallback to default)
app.get("/make-server-2363f5d6/content-list", async (c) => {
  try {
    console.log('📋 Fetching content list from KV Store...');
    
    // Tentar buscar do KV Store primeiro
    const storedContent = await kv.get('content-list-filmes-series');
    
    if (storedContent) {
      console.log(`✅ Content list loaded from KV Store: ${storedContent.length} characters`);
      const items = storedContent.split('\n').filter((line: string) => line.trim());
      return c.json({ 
        items,
        source: 'kv-store',
        count: items.length 
      });
    }
    
    console.log('⚠️ No content list in KV Store, using fallback data');
    
    // Fallback data expandido
    const fallbackText = `Breaking Bad
The Witcher
Stranger Things
Game of Thrones
The Last of Us
Wednesday
The Mandalorian
House of the Dragon
The Boys
Peaky Blinders
Money Heist
Squid Game
Vikings
Dark
Narcos
The Crown
Ozark
Better Call Saul
The Umbrella Academy
You
Lucifer
Black Mirror
The Walking Dead
Friends
The Office
Arcane
Succession
Sherlock
Westworld
True Detective
Chernobyl
The Wire
Fargo
Twin Peaks
Lost
Dexter
The Sopranos
Mad Men
Euphoria
The Handmaid's Tale
The Queen's Gambit
Invincible
Loki
WandaVision
The Falcon and the Winter Soldier
Hawkeye
Moon Knight
She-Hulk
Ms. Marvel
Secret Invasion
What If...?
Ahsoka
Andor
The Book of Boba Fett
Obi-Wan Kenobi
The Acolyte
Foundation
Silo
For All Mankind
See
Ted Lasso
Severance
Pachinko
The Morning Show
Shrinking
Bad Sisters
Hijack
Masters of the Air
The Pacific
Band of Brothers
Rome
Boardwalk Empire
Yellowstone
1883
1923
Tulsa King
Mayor of Kingstown
Lioness
The Terminal List
Reacher
The Marvelous Mrs. Maisel
The Expanse
The Rings of Power
Wheel of Time
The Peripheral
Daisy Jones & The Six
Citadel
Fallout
3 Body Problem
Avatar: The Last Airbender
One Piece
Cowboy Bebop
Death Note
Attack on Titan
Demon Slayer
Jujutsu Kaisen
My Hero Academia
Fullmetal Alchemist
Hunter x Hunter
Naruto
Dragon Ball Z
One Punch Man
Mob Psycho 100
Tokyo Ghoul
Parasyte
Vinland Saga
Steins;Gate
Code Geass
Neon Genesis Evangelion
Bleach
Fairy Tail
Sword Art Online
Re:Zero
The Rising of the Shield Hero
Overlord
Konosuba
That Time I Got Reincarnated as a Slime
Dr. Stone
The Promised Neverland
Erased
Your Lie in April
Violet Evergarden
Clannad
A Silent Voice
Spirited Away
Your Name
Weathering with You
Suzume
Belle
The Boy and the Heron`;
    
    
    // Parse lines do fallback
    const lines = fallbackText.split('\n')
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0);
    
    console.log(`📋 Using fallback data: ${lines.length} content items`);
    
    return c.json({ 
      items: lines,
      source: 'fallback',
      count: lines.length
    });
  } catch (error) {
    console.log(`❌ Server error fetching content list: ${error}`);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

// Update/Save content list to KV Store
app.post("/make-server-2363f5d6/content-list", async (c) => {
  try {
    const body = await c.req.json();
    const { items } = body;
    
    if (!items || !Array.isArray(items)) {
      return c.json({ error: 'items must be an array' }, 400);
    }
    
    console.log(`💾 Saving ${items.length} items to content list...`);
    
    // Salvar como texto (cada linha é um item)
    const text = items.join('\n');
    await kv.set('content-list-filmes-series', text);
    
    console.log(`✅ Content list saved successfully`);
    
    return c.json({ 
      success: true,
      count: items.length,
      message: 'Content list saved to KV Store'
    });
  } catch (error) {
    console.log(`❌ Error saving content list: ${error}`);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

// Migrate content list - Save local embedded content to KV Store
app.post("/make-server-2363f5d6/migrate-content-list", async (c) => {
  try {
    console.log('🔄 Starting content list migration from local embedded data...');
    
    // Usar o fallback local já definido no código
    const fallbackText = `Breaking Bad
The Witcher
Stranger Things
Game of Thrones
The Last of Us
Wednesday
The Mandalorian
House of the Dragon
The Boys
Peaky Blinders
Money Heist
Squid Game
Vikings
Dark
Narcos
The Crown
Ozark
Better Call Saul
The Umbrella Academy
You
Lucifer
Black Mirror
The Walking Dead
Friends
The Office
Arcane
Succession
Sherlock
Westworld
True Detective
Chernobyl
The Wire
Fargo
Twin Peaks
Lost
Dexter
The Sopranos
Mad Men
Euphoria
The Handmaid's Tale
The Queen's Gambit
Invincible
Loki
WandaVision
The Falcon and the Winter Soldier
Hawkeye
Moon Knight
She-Hulk
Ms. Marvel
Secret Invasion
What If...?
Ahsoka
Andor
The Book of Boba Fett
Obi-Wan Kenobi
The Acolyte
Foundation
Silo
For All Mankind
See
Ted Lasso
Severance
Pachinko
The Morning Show
Shrinking
Bad Sisters
Hijack
Masters of the Air
The Pacific
Band of Brothers
Rome
Boardwalk Empire
Yellowstone
1883
1923
Tulsa King
Mayor of Kingstown
Lioness
The Terminal List
Reacher
The Marvelous Mrs. Maisel
The Expanse
The Rings of Power
Wheel of Time
The Peripheral
Daisy Jones & The Six
Citadel
Fallout
3 Body Problem
Avatar: The Last Airbender
One Piece
Cowboy Bebop
Death Note
Attack on Titan
Demon Slayer
Jujutsu Kaisen
My Hero Academia
Fullmetal Alchemist
Hunter x Hunter
Naruto
Dragon Ball Z
One Punch Man
Mob Psycho 100
Tokyo Ghoul
Parasyte
Vinland Saga
Steins;Gate
Code Geass
Neon Genesis Evangelion
Bleach
Fairy Tail
Sword Art Online
Re:Zero
The Rising of the Shield Hero
Overlord
Konosuba
That Time I Got Reincarnated as a Slime
Dr. Stone
The Promised Neverland
Erased
Your Lie in April
Violet Evergarden
Clannad
A Silent Voice
Spirited Away
Your Name
Weathering with You
Suzume
Belle
The Boy and the Heron`;
    
    // Salvar no KV Store
    await kv.set('content-list-filmes-series', fallbackText);
    
    const items = fallbackText.split('\n').filter(line => line.trim());
    console.log(`✅ Migration complete: ${items.length} items saved to KV Store from local data`);
    
    return c.json({
      success: true,
      count: items.length,
      message: 'Content list migrated successfully from local embedded data to KV Store'
    });
  } catch (error) {
    console.log(`❌ Migration error: ${error}`);
    return c.json({ error: `Migration error: ${error}` }, 500);
  }
});

// ========================================
// CHANNELS LIST MANAGEMENT (KV Store)
// ========================================

// Get channels list from KV Store
app.get("/make-server-2363f5d6/channels-list", async (c) => {
  try {
    console.log('📺 Fetching channels list from KV Store...');
    
    // Tentar buscar do KV Store primeiro
    const storedChannels = await kv.get('channels-list-iptv');
    
    if (storedChannels) {
      console.log(`✅ Channels list loaded from KV Store: ${storedChannels.length} characters`);
      return c.json({ 
        content: storedChannels,
        source: 'kv-store'
      });
    }
    
    console.log('⚠️ No channels list in KV Store, trying Chemorena...');
    
    // Fallback: tentar buscar do Chemorena apenas
    const primaryUrl = "https://chemorena.com/filmes/canaissite.txt";
    
    let text = "";
    let lastError = "";
    let successUrl = "";
    
    console.log(`📡 Tentando buscar canais de: ${primaryUrl}`);
    try {
      const response = await fetch(primaryUrl);
      console.log(`📊 Response status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        text = await response.text();
        successUrl = primaryUrl;
        console.log(`✅ Canais carregados com sucesso de: ${primaryUrl}`);
        console.log(`📦 Tamanho: ${text.length} caracteres`);
      } else {
        lastError = `${response.status} ${response.statusText}`;
        console.log(`❌ Falha: ${lastError}`);
      }
    } catch (fetchError) {
      lastError = String(fetchError);
      console.log(`❌ Erro ao buscar: ${lastError}`);
    }
    
    // If no channels were fetched, use fallback data
    if (!text) {
      console.log(`⚠️ Usando dados de fallback. Último erro: ${lastError}`);
      text = `ESPN HD | Copa Libertadores | 19:00 - 21:00 | LIVE
ESPN 2 4K | NBA Finals | 21:00 - 23:30 | LIVE
FOX SPORTS HD | Campeonato Brasileiro | 16:00 - 18:00 | RECORDING
FOX SPORTS 2 HD | Premier League | 14:00 - 16:00
TNT SPORTS 4K | Champions League | 15:45 - 17:45 | LIVE
SPORTV HD | Fórmula 1 | 13:00 - 15:00 | RECORDING
SPORTV 2 HD | Vôlei | 20:00 - 22:00
PREMIERE HD | Flamengo x Palmeiras | 18:00 - 20:00 | LIVE
HBO HD | Game of Thrones | 22:00 - 23:00
HBO 2 4K | The Last of Us | 21:00 - 22:00 | LIVE
DISCOVERY HD | Sobrevivência Extrema | 19:00 - 20:00
NATGEO 4K | Cosmos | 20:00 - 21:00 | RECORDING
CARTOON NETWORK HD | Adventure Time | 17:00 - 18:00
COMEDY CENTRAL HD | South Park | 23:00 - 00:00
MTV HD | Ridiculousness | 20:00 - 21:00
CNN HD | Notícias Ao Vivo | 00:00 - 23:59 | LIVE
BBC HD | Planeta Terra | 21:00 - 22:00
HISTORY HD | Ancient Aliens | 22:00 - 23:00`;
      successUrl = "fallback";
    }
    
    // Parse lines
    const lines = text.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    console.log(`📋 ${lines.length} canais parseados com sucesso`);
    console.log(`🎯 Fonte: ${successUrl}`);
    
    return c.json({ 
      items: lines,
      source: successUrl,
      count: lines.length
    });
  } catch (error) {
    console.log(`❌ Erro no servidor ao buscar canais: ${error}`);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

// Save channels list to KV Store
app.post("/make-server-2363f5d6/channels-list", async (c) => {
  try {
    const body = await c.req.json();
    const { content } = body;
    
    if (!content || typeof content !== 'string') {
      return c.json({ error: 'content must be a string' }, 400);
    }
    
    console.log(`💾 Saving channels list (${content.length} characters)...`);
    
    // Salvar no KV Store
    await kv.set('channels-list-iptv', content);
    
    const lines = content.split('\n').filter((line: string) => line.trim());
    console.log(`✅ Channels list saved: ${lines.length} channels`);
    
    return c.json({ 
      success: true,
      count: lines.length,
      message: 'Channels list saved to KV Store'
    });
  } catch (error) {
    console.log(`❌ Error saving channels list: ${error}`);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

// Migrate channels list from Chemorena/GitHub to KV Store
app.post("/make-server-2363f5d6/migrate-channels-list", async (c) => {
  try {
    console.log('🔄 Starting channels list migration...');
    
    const urls = [
      "https://chemorena.com/filmes/canaissite.txt",
      "https://raw.githubusercontent.com/Fabriciocypreste/figma.gif/main/canais.txt",
      "https://raw.githubusercontent.com/Fabriciocypreste/figma.gif/master/canais.txt"
    ];
    
    let text = "";
    let successUrl = "";
    
    for (const url of urls) {
      try {
        console.log(`Attempting to fetch from: ${url}`);
        const response = await fetch(url);
        
        if (response.ok) {
          text = await response.text();
          successUrl = url;
          console.log(`✅ Fetched ${text.length} characters from ${url}`);
          break;
        }
      } catch (err) {
        console.log(`Failed to fetch from ${url}: ${err}`);
      }
    }
    
    if (!text) {
      return c.json({ error: 'Failed to fetch channels from any source' }, 500);
    }
    
    // Salvar no KV Store
    await kv.set('channels-list-iptv', text);
    
    const lines = text.split('\n').filter((line: string) => line.trim());
    console.log(`✅ Migration complete: ${lines.length} channels saved to KV Store`);
    
    return c.json({
      success: true,
      count: lines.length,
      source: successUrl,
      message: 'Channels list migrated successfully to KV Store'
    });
  } catch (error) {
    console.log(`❌ Migration error: ${error}`);
    return c.json({ error: `Migration error: ${error}` }, 500);
  }
});

// Fetch channels data with full URLs (logo, stream, etc)
app.get("/make-server-2363f5d6/channels-data", async (c) => {
  try {
    console.log(`📺 Buscando dados completos dos canais do servidor Chemorena...`);
    
    // URL REAL do arquivo de canais
    const channelsUrl = "https://chemorena.com/filmes/canaissite.txt";
    
    console.log(`🔗 URL: ${channelsUrl}`);
    
    const response = await fetch(channelsUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const content = await response.text();
    console.log(`✅ Arquivo carregado! Tamanho: ${content.length} caracteres`);
    
    // Return the raw content
    return c.json({ 
      success: true,
      content: content,
      length: content.length,
      source: channelsUrl
    });
    
  } catch (error) {
    console.log(`❌ Erro ao buscar dados dos canais: ${error}`);
    
    // Return error details for debugging
    return c.json({ 
      success: false,
      error: String(error),
      message: "Não foi possível carregar os canais do servidor Chemorena"
    }, 500);
  }
});

// Fetch soccer news from GloboEsporte RSS
app.get("/make-server-2363f5d6/soccer-news", async (c) => {
  try {
    console.log(`🏆 Fetching soccer news from GloboEsporte RSS feed`);
    
    // Get optional team filter from query params
    const teamFilter = c.req.query('team');
    
    // Import Parser dynamically
    const { default: Parser } = await import("npm:rss-parser");
    const parser = new Parser();
    const url = "https://ge.globo.com/ESP/Noticia/Rss/0,,AS0-4274,00.xml";
    
    console.log(`Parsing RSS feed: ${url}`);
    const feed = await parser.parseURL(url);
    console.log(`✅ RSS feed parsed successfully: ${feed.items?.length || 0} items found`);
    
    // Map all items
    let items = feed.items.map(item => ({
      title: item.title || '',
      link: item.link || '',
      image: item.enclosure?.url || item['media:thumbnail']?.$?.url || item['media:content']?.$?.url || '',
      date: item.pubDate || item.isoDate || '',
      description: item.contentSnippet || item.description || '',
      categories: item.categories || []
    }));
    
    // Filter by team if provided
    if (teamFilter) {
      const teamLower = teamFilter.toLowerCase();
      items = items.filter(item => 
        item.title.toLowerCase().includes(teamLower) ||
        item.description.toLowerCase().includes(teamLower) ||
        item.categories.some((cat: string) => cat.toLowerCase().includes(teamLower))
      );
      console.log(`📰 Filtered to ${items.length} items for team: ${teamFilter}`);
    }
    
    // Limit to first 15
    items = items.slice(0, 15);
    
    console.log(`📰 Returning ${items.length} soccer news items`);
    return c.json({ 
      items,
      feedTitle: feed.title,
      feedLink: feed.link
    });
  } catch (error) {
    console.log(`❌ Server error fetching soccer news: ${error}`);
    return c.json({ 
      error: `Server error fetching soccer news: ${error}`,
      items: [] // Return empty array as fallback
    }, 500);
  }
});

// Fetch team-specific news from RSS feed
app.get("/make-server-2363f5d6/team-news/:teamRssFeed", async (c) => {
  try {
    const encodedFeed = c.req.param('teamRssFeed');
    const rssUrl = decodeURIComponent(encodedFeed);
    
    console.log(`📰 Fetching team-specific news from RSS: ${rssUrl}`);
    
    // Import Parser dynamically
    const { default: Parser } = await import("npm:rss-parser");
    const parser = new Parser();
    
    console.log(`Parsing team RSS feed: ${rssUrl}`);
    const feed = await parser.parseURL(rssUrl);
    console.log(`✅ Team RSS feed parsed successfully: ${feed.items?.length || 0} items found`);
    
    // Map all items
    const items = feed.items.slice(0, 12).map(item => ({
      title: item.title || '',
      link: item.link || '',
      image: item.enclosure?.url || item['media:thumbnail']?.$?.url || item['media:content']?.$?.url || '',
      date: item.pubDate || item.isoDate || '',
      description: item.contentSnippet || item.description || '',
      categories: item.categories || []
    }));
    
    console.log(`📰 Returning ${items.length} team news items`);
    return c.json({ 
      items,
      feedTitle: feed.title,
      feedLink: feed.link
    });
  } catch (error) {
    console.log(`❌ Server error fetching team news: ${error}`);
    return c.json({ 
      error: `Server error fetching team news: ${error}`,
      items: [] // Return empty array as fallback
    }, 500);
  }
});

// Fetch full article content from GloboEsporte
app.get("/make-server-2363f5d6/news-content", async (c) => {
  try {
    const newsUrl = c.req.query('url');
    
    if (!newsUrl) {
      return c.json({ error: 'URL parameter is required' }, 400);
    }
    
    console.log(`📰 Fetching article content from: ${newsUrl}`);
    
    // Fetch the HTML page
    const response = await fetch(newsUrl);
    const html = await response.text();
    
    // Extract article content using regex patterns
    // GloboEsporte has structured JSON-LD data
    const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    let articleData: any = {};
    
    if (jsonLdMatch) {
      try {
        const jsonData = JSON.parse(jsonLdMatch[1]);
        if (jsonData['@type'] === 'NewsArticle') {
          articleData = {
            headline: jsonData.headline || '',
            description: jsonData.description || '',
            author: jsonData.author?.name || 'GloboEsporte',
            datePublished: jsonData.datePublished || '',
            image: jsonData.image?.url || jsonData.image || '',
            articleBody: jsonData.articleBody || ''
          };
        }
      } catch (e) {
        console.log('Error parsing JSON-LD:', e);
      }
    }
    
    // Fallback: Extract from HTML meta tags
    if (!articleData.headline) {
      const titleMatch = html.match(/<meta property="og:title" content="([^"]*)"/) || 
                        html.match(/<title>([^<]*)<\/title>/);
      const descMatch = html.match(/<meta property="og:description" content="([^"]*)"/);
      const imageMatch = html.match(/<meta property="og:image" content="([^"]*)"/);
      const authorMatch = html.match(/<meta name="author" content="([^"]*)"/);
      
      articleData = {
        headline: titleMatch ? titleMatch[1] : 'Notícia',
        description: descMatch ? descMatch[1] : '',
        image: imageMatch ? imageMatch[1] : '',
        author: authorMatch ? authorMatch[1] : 'GloboEsporte',
        articleBody: ''
      };
    }
    
    // Extract main content from article body
    const contentMatch = html.match(/<div class="mc-article-body[^>]*>([\s\S]*?)<\/div>/);
    if (contentMatch) {
      // Clean HTML tags but keep paragraphs
      let content = contentMatch[1];
      
      // Extract paragraphs
      const paragraphs = content.match(/<p[^>]*>([\s\S]*?)<\/p>/g) || [];
      const cleanParagraphs = paragraphs.map(p => {
        return p
          .replace(/<[^>]*>/g, '') // Remove tags
          .replace(/&nbsp;/g, ' ')
          .replace(/&quot;/g, '"')
          .replace(/&apos;/g, "'")
          .replace(/&amp;/g, '&')
          .trim();
      }).filter(p => p.length > 20); // Filter out very short paragraphs
      
      articleData.articleBody = cleanParagraphs.join('\n\n');
    }
    
    // If still no body content, try to extract from description
    if (!articleData.articleBody && articleData.description) {
      articleData.articleBody = articleData.description;
    }
    
    console.log(`✅ Article extracted: ${articleData.headline}`);
    
    return c.json({
      success: true,
      article: articleData,
      sourceUrl: newsUrl
    });
    
  } catch (error) {
    console.log(`❌ Error fetching article content: ${error}`);
    return c.json({ 
      error: `Failed to fetch article: ${error}`,
      success: false
    }, 500);
  }
});

// Football-Data.org API endpoints
const FOOTBALL_API_KEY = "1785cd0b9269484c9778e013e8fe414c";
const FOOTBALL_BASE_URL = "https://api.football-data.org/v4";

// Get all competitions
app.get("/make-server-2363f5d6/football/competitions", async (c) => {
  try {
    console.log(`⚽ Fetching competitions from Football-Data.org`);
    
    const response = await fetch(`${FOOTBALL_BASE_URL}/competitions`, {
      headers: {
        "X-Auth-Token": FOOTBALL_API_KEY
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`Football API error: ${response.status} ${response.statusText}, Body: ${errorText}`);
      return c.json({ error: "Failed to fetch competitions", details: errorText }, response.status);
    }
    
    const data = await response.json();
    console.log(`✅ Fetched ${data.competitions?.length || 0} competitions`);
    return c.json(data);
  } catch (error) {
    console.log(`Server error fetching competitions: ${error}`);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

// Get standings for a competition
app.get("/make-server-2363f5d6/football/competitions/:id/standings", async (c) => {
  try {
    const { id } = c.req.param();
    console.log(`⚽ Fetching standings for competition ${id}`);
    
    const response = await fetch(`${FOOTBALL_BASE_URL}/competitions/${id}/standings`, {
      headers: {
        "X-Auth-Token": FOOTBALL_API_KEY
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`Football API error: ${response.status} ${response.statusText}, Body: ${errorText}`);
      return c.json({ error: "Failed to fetch standings", details: errorText }, response.status);
    }
    
    const data = await response.json();
    console.log(`✅ Fetched standings for competition ${id}`);
    return c.json(data);
  } catch (error) {
    console.log(`Server error fetching standings: ${error}`);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

// Get matches for a competition
app.get("/make-server-2363f5d6/football/competitions/:id/matches", async (c) => {
  try {
    const { id } = c.req.param();
    console.log(`⚽ Fetching matches for competition ${id}`);
    
    const response = await fetch(`${FOOTBALL_BASE_URL}/competitions/${id}/matches`, {
      headers: {
        "X-Auth-Token": FOOTBALL_API_KEY
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`Football API error: ${response.status} ${response.statusText}, Body: ${errorText}`);
      return c.json({ error: "Failed to fetch matches", details: errorText }, response.status);
    }
    
    const data = await response.json();
    console.log(`✅ Fetched ${data.matches?.length || 0} matches`);
    return c.json(data);
  } catch (error) {
    console.log(`Server error fetching matches: ${error}`);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

// Get teams for a competition
app.get("/make-server-2363f5d6/football/competitions/:id/teams", async (c) => {
  try {
    const { id } = c.req.param();
    console.log(`⚽ Fetching teams for competition ${id}`);
    
    const response = await fetch(`${FOOTBALL_BASE_URL}/competitions/${id}/teams`, {
      headers: {
        "X-Auth-Token": FOOTBALL_API_KEY
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`Football API error: ${response.status} ${response.statusText}, Body: ${errorText}`);
      return c.json({ error: "Failed to fetch teams", details: errorText }, response.status);
    }
    
    const data = await response.json();
    console.log(`✅ Fetched ${data.teams?.length || 0} teams`);
    return c.json(data);
  } catch (error) {
    console.log(`Server error fetching teams: ${error}`);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

// Get scorers for a competition
app.get("/make-server-2363f5d6/football/competitions/:id/scorers", async (c) => {
  try {
    const { id } = c.req.param();
    console.log(`⚽ Fetching scorers for competition ${id}`);
    
    const response = await fetch(`${FOOTBALL_BASE_URL}/competitions/${id}/scorers`, {
      headers: {
        "X-Auth-Token": FOOTBALL_API_KEY
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`Football API error: ${response.status} ${response.statusText}, Body: ${errorText}`);
      return c.json({ error: "Failed to fetch scorers", details: errorText }, response.status);
    }
    
    const data = await response.json();
    console.log(`✅ Fetched ${data.scorers?.length || 0} scorers`);
    return c.json(data);
  } catch (error) {
    console.log(`Server error fetching scorers: ${error}`);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

// Get all matches (today)
app.get("/make-server-2363f5d6/football/matches", async (c) => {
  try {
    console.log(`⚽ Fetching today's matches`);
    
    const response = await fetch(`${FOOTBALL_BASE_URL}/matches`, {
      headers: {
        "X-Auth-Token": FOOTBALL_API_KEY
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`Football API error: ${response.status} ${response.statusText}, Body: ${errorText}`);
      return c.json({ error: "Failed to fetch matches", details: errorText }, response.status);
    }
    
    const data = await response.json();
    console.log(`✅ Fetched ${data.matches?.length || 0} matches`);
    return c.json(data);
  } catch (error) {
    console.log(`Server error fetching matches: ${error}`);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

// Get matches for a specific team
app.get("/make-server-2363f5d6/football/teams/:id/matches", async (c) => {
  try {
    const { id } = c.req.param();
    console.log(`⚽ Fetching matches for team ${id}`);
    
    const response = await fetch(`${FOOTBALL_BASE_URL}/teams/${id}/matches?status=SCHEDULED,TIMED,FINISHED`, {
      headers: {
        "X-Auth-Token": FOOTBALL_API_KEY
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`Football API error: ${response.status} ${response.statusText}, Body: ${errorText}`);
      return c.json({ error: "Failed to fetch team matches", details: errorText }, response.status);
    }
    
    const data = await response.json();
    console.log(`✅ Fetched ${data.matches?.length || 0} matches for team ${id}`);
    return c.json(data);
  } catch (error) {
    console.log(`Server error fetching team matches: ${error}`);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

// Sports Database API endpoints
const SPORTSDB_API_KEY = "123"; // Free tier key
const SPORTSDB_BASE_URL = "https://www.thesportsdb.com/api/v1/json";

// Get team details by name (Brazilian teams)
app.get("/make-server-2363f5d6/sportsdb/search/team/:teamName", async (c) => {
  try {
    const teamName = c.req.param('teamName');
    console.log(`🏆 Buscando detalhes do time: ${teamName}`);
    
    const response = await fetch(`${SPORTSDB_BASE_URL}/${SPORTSDB_API_KEY}/searchteams.php?t=${encodeURIComponent(teamName)}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`Sports API error: ${response.status} ${response.statusText}`);
      return c.json({ error: "Failed to fetch team details", details: errorText }, response.status);
    }
    
    const data = await response.json();
    console.log(`✅ Detalhes do time obtidos: ${teamName}`);
    return c.json(data);
  } catch (error) {
    console.log(`Server error fetching team: ${error}`);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

// Get team details by ID
app.get("/make-server-2363f5d6/sportsdb/team/:id", async (c) => {
  try {
    const id = c.req.param('id');
    console.log(`🏆 Buscando time por ID: ${id}`);
    
    const response = await fetch(`${SPORTSDB_BASE_URL}/${SPORTSDB_API_KEY}/lookupteam.php?id=${id}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`Sports API error: ${response.status} ${response.statusText}`);
      return c.json({ error: "Failed to fetch team by ID", details: errorText }, response.status);
    }
    
    const data = await response.json();
    console.log(`✅ Time obtido por ID: ${id}`);
    return c.json(data);
  } catch (error) {
    console.log(`Server error fetching team by ID: ${error}`);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

// Get all teams in Brazilian Serie A
app.get("/make-server-2363f5d6/sportsdb/league/brazilian", async (c) => {
  try {
    console.log(`🇧🇷 Buscando times do Brasileirão Série A`);
    
    // Brazilian Serie A ID: 4351
    const response = await fetch(`${SPORTSDB_BASE_URL}/${SPORTSDB_API_KEY}/lookup_all_teams.php?id=4351`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`Sports API error: ${response.status} ${response.statusText}`);
      return c.json({ error: "Failed to fetch Brazilian teams", details: errorText }, response.status);
    }
    
    const data = await response.json();
    console.log(`✅ ${data.teams?.length || 0} times do Brasileirão Série A obtidos`);
    return c.json(data);
  } catch (error) {
    console.log(`Server error fetching Brazilian teams: ${error}`);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

// Get team's last 5 matches
app.get("/make-server-2363f5d6/sportsdb/team/:id/last-matches", async (c) => {
  try {
    const id = c.req.param('id');
    console.log(`📅 Buscando últimas partidas do time ${id}`);
    
    const response = await fetch(`${SPORTSDB_BASE_URL}/${SPORTSDB_API_KEY}/eventslast.php?id=${id}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`Sports API error: ${response.status} ${response.statusText}`);
      return c.json({ error: "Failed to fetch last matches", details: errorText }, response.status);
    }
    
    const data = await response.json();
    console.log(`✅ Últimas partidas do time ${id} obtidas`);
    return c.json(data);
  } catch (error) {
    console.log(`Server error fetching last matches: ${error}`);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

// Get team's next 5 matches
app.get("/make-server-2363f5d6/sportsdb/team/:id/next-matches", async (c) => {
  try {
    const id = c.req.param('id');
    console.log(`📅 Buscando próximas partidas do time ${id}`);
    
    const response = await fetch(`${SPORTSDB_BASE_URL}/${SPORTSDB_API_KEY}/eventsnext.php?id=${id}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`Sports API error: ${response.status} ${response.statusText}`);
      return c.json({ error: "Failed to fetch next matches", details: errorText }, response.status);
    }
    
    const data = await response.json();
    console.log(`✅ Próximas partidas do time ${id} obtidas`);
    return c.json(data);
  } catch (error) {
    console.log(`Server error fetching next matches: ${error}`);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

// Get team's players
app.get("/make-server-2363f5d6/sportsdb/team/:id/players", async (c) => {
  try {
    const id = c.req.param('id');
    console.log(`👥 Buscando jogadores do time ${id}`);
    
    const response = await fetch(`${SPORTSDB_BASE_URL}/${SPORTSDB_API_KEY}/lookup_all_players.php?id=${id}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`Sports API error: ${response.status} ${response.statusText}`);
      return c.json({ error: "Failed to fetch players", details: errorText }, response.status);
    }
    
    const data = await response.json();
    console.log(`✅ ${data.player?.length || 0} jogadores obtidos para o time ${id}`);
    return c.json(data);
  } catch (error) {
    console.log(`Server error fetching players: ${error}`);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

// Get league table for Brazilian Serie A
app.get("/make-server-2363f5d6/sportsdb/league/table/brazilian", async (c) => {
  try {
    console.log(`📊 Buscando tabela do Brasileirão Série A`);
    
    // Brazilian Serie A ID: 4351, Season: 2024
    const season = c.req.query('season') || '2024';
    const response = await fetch(`${SPORTSDB_BASE_URL}/${SPORTSDB_API_KEY}/lookuptable.php?l=4351&s=${season}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`Sports API error: ${response.status} ${response.statusText}`);
      return c.json({ error: "Failed to fetch league table", details: errorText }, response.status);
    }
    
    const data = await response.json();
    console.log(`✅ Tabela da temporada ${season} obtida`);
    return c.json(data);
  } catch (error) {
    console.log(`Server error fetching league table: ${error}`);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

// Sportmonks API endpoints
const SPORTMONKS_API_KEY = "wc1ZGRWBlAm8QY61LopdJLJ8yoWaWqoxXTUMH7yUgsdqP7ehfOwSuCzkg7bI";
const SPORTMONKS_BASE_URL = "https://api.sportmonks.com/v3/football";

// Get top scorers for Brasileirão
app.get("/make-server-2363f5d6/sportmonks/scorers/brasileirao", async (c) => {
  try {
    console.log(`⚽ Buscando artilheiros do Brasileirão - Sportmonks`);
    
    const response = await fetch(`${SPORTMONKS_BASE_URL}/topscorers/seasons/23880?api_token=${SPORTMONKS_API_KEY}&include=player;team`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`Sportmonks API error: ${response.status} ${response.statusText}`);
      return c.json({ error: "Failed to fetch scorers", details: errorText }, response.status);
    }
    
    const data = await response.json();
    console.log(`✅ Artilheiros obtidos: ${data.data?.length || 0}`);
    return c.json(data);
  } catch (error) {
    console.log(`Server error fetching scorers from Sportmonks: ${error}`);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

// Get league standings for Brasileirão
app.get("/make-server-2363f5d6/sportmonks/standings/brasileirao", async (c) => {
  try {
    console.log(`📊 Buscando tabela do Brasileirão - Sportmonks`);
    
    const response = await fetch(`${SPORTMONKS_BASE_URL}/standings/seasons/23880?api_token=${SPORTMONKS_API_KEY}&include=participant`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`Sportmonks API error: ${response.status} ${response.statusText}`);
      return c.json({ error: "Failed to fetch standings", details: errorText }, response.status);
    }
    
    const data = await response.json();
    console.log(`✅ Tabela obtida`);
    return c.json(data);
  } catch (error) {
    console.log(`Server error fetching standings from Sportmonks: ${error}`);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

// Get team details and statistics
app.get("/make-server-2363f5d6/sportmonks/team/:id", async (c) => {
  try {
    const id = c.req.param('id');
    console.log(`🏆 Buscando detalhes do time ${id} - Sportmonks`);
    
    const response = await fetch(`${SPORTMONKS_BASE_URL}/teams/${id}?api_token=${SPORTMONKS_API_KEY}&include=coach;venue;statistics`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`Sportmonks API error: ${response.status} ${response.statusText}`);
      return c.json({ error: "Failed to fetch team details", details: errorText }, response.status);
    }
    
    const data = await response.json();
    console.log(`✅ Detalhes do time obtidos`);
    return c.json(data);
  } catch (error) {
    console.log(`Server error fetching team from Sportmonks: ${error}`);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

// Get team squad/players
app.get("/make-server-2363f5d6/sportmonks/team/:id/squad", async (c) => {
  try {
    const id = c.req.param('id');
    console.log(`👥 Buscando elenco do time ${id} - Sportmonks`);
    
    const response = await fetch(`${SPORTMONKS_BASE_URL}/squads/seasons/23880/teams/${id}?api_token=${SPORTMONKS_API_KEY}&include=player;position`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`Sportmonks API error: ${response.status} ${response.statusText}`);
      return c.json({ error: "Failed to fetch squad", details: errorText }, response.status);
    }
    
    const data = await response.json();
    console.log(`✅ Elenco obtido: ${data.data?.length || 0} jogadores`);
    return c.json(data);
  } catch (error) {
    console.log(`Server error fetching squad from Sportmonks: ${error}`);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

// Get live matches
app.get("/make-server-2363f5d6/sportmonks/matches/live", async (c) => {
  try {
    console.log(`📺 Buscando jogos ao vivo - Sportmonks`);
    
    const response = await fetch(`${SPORTMONKS_BASE_URL}/livescores/inplay?api_token=${SPORTMONKS_API_KEY}&include=participants;league;scores`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`Sportmonks API error: ${response.status} ${response.statusText}`);
      return c.json({ error: "Failed to fetch live matches", details: errorText }, response.status);
    }
    
    const data = await response.json();
    console.log(`✅ ${data.data?.length || 0} jogos ao vivo`);
    return c.json(data);
  } catch (error) {
    console.log(`Server error fetching live matches from Sportmonks: ${error}`);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

// Get fixtures (upcoming matches) for Brasileirão
app.get("/make-server-2363f5d6/sportmonks/fixtures/brasileirao", async (c) => {
  try {
    console.log(`📅 Buscando próximos jogos do Brasileirão - Sportmonks`);
    
    const today = new Date().toISOString().split('T')[0];
    const response = await fetch(`${SPORTMONKS_BASE_URL}/fixtures/between/${today}/${today}?api_token=${SPORTMONKS_API_KEY}&include=participants;league;scores;venue&filters=leagueIds:384`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`Sportmonks API error: ${response.status} ${response.statusText}`);
      return c.json({ error: "Failed to fetch fixtures", details: errorText }, response.status);
    }
    
    const data = await response.json();
    console.log(`✅ ${data.data?.length || 0} jogos encontrados`);
    return c.json(data);
  } catch (error) {
    console.log(`Server error fetching fixtures from Sportmonks: ${error}`);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

// Get team statistics for a season
app.get("/make-server-2363f5d6/sportmonks/team/:id/statistics", async (c) => {
  try {
    const id = c.req.param('id');
    console.log(`📈 Buscando estatísticas do time ${id} - Sportmonks`);
    
    const response = await fetch(`${SPORTMONKS_BASE_URL}/teams/${id}/statistics?api_token=${SPORTMONKS_API_KEY}&season_id=23880`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`Sportmonks API error: ${response.status} ${response.statusText}`);
      return c.json({ error: "Failed to fetch statistics", details: errorText }, response.status);
    }
    
    const data = await response.json();
    console.log(`✅ Estatísticas obtidas`);
    return c.json(data);
  } catch (error) {
    console.log(`Server error fetching statistics from Sportmonks: ${error}`);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

// Get player details
app.get("/make-server-2363f5d6/sportmonks/player/:id", async (c) => {
  try {
    const id = c.req.param('id');
    console.log(`⭐ Buscando detalhes do jogador ${id} - Sportmonks`);
    
    const response = await fetch(`${SPORTMONKS_BASE_URL}/players/${id}?api_token=${SPORTMONKS_API_KEY}&include=position;statistics;team`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`Sportmonks API error: ${response.status} ${response.statusText}`);
      return c.json({ error: "Failed to fetch player details", details: errorText }, response.status);
    }
    
    const data = await response.json();
    console.log(`✅ Detalhes do jogador obtidos`);
    return c.json(data);
  } catch (error) {
    console.log(`Server error fetching player from Sportmonks: ${error}`);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

// Get injuries for a team
app.get("/make-server-2363f5d6/sportmonks/team/:id/injuries", async (c) => {
  try {
    const id = c.req.param('id');
    console.log(`🏥 Buscando lesões do time ${id} - Sportmonks`);
    
    const response = await fetch(`${SPORTMONKS_BASE_URL}/teams/${id}?api_token=${SPORTMONKS_API_KEY}&include=activeInjuries.player`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`Sportmonks API error: ${response.status} ${response.statusText}`);
      return c.json({ error: "Failed to fetch injuries", details: errorText }, response.status);
    }
    
    const data = await response.json();
    console.log(`✅ Lesões obtidas`);
    return c.json(data);
  } catch (error) {
    console.log(`Server error fetching injuries from Sportmonks: ${error}`);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

// Get recent transfers for Brasileirão
app.get("/make-server-2363f5d6/sportmonks/transfers/brasileirao", async (c) => {
  try {
    console.log(`💼 Buscando transferências recentes - Sportmonks`);
    
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 3);
    const start = startDate.toISOString().split('T')[0];
    const end = new Date().toISOString().split('T')[0];
    
    const response = await fetch(`${SPORTMONKS_BASE_URL}/transfers/between/${start}/${end}?api_token=${SPORTMONKS_API_KEY}&include=player;fromTeam;toTeam&filters=leagueIds:384`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`Sportmonks API error: ${response.status} ${response.statusText}`);
      return c.json({ error: "Failed to fetch transfers", details: errorText }, response.status);
    }
    
    const data = await response.json();
    console.log(`✅ ${data.data?.length || 0} transferências obtidas`);
    return c.json(data);
  } catch (error) {
    console.log(`Server error fetching transfers from Sportmonks: ${error}`);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

// Get head-to-head matches between two teams
app.get("/make-server-2363f5d6/sportmonks/h2h/:team1/:team2", async (c) => {
  try {
    const team1 = c.req.param('team1');
    const team2 = c.req.param('team2');
    console.log(`⚔️ Buscando confrontos diretos: ${team1} vs ${team2} - Sportmonks`);
    
    const response = await fetch(`${SPORTMONKS_BASE_URL}/fixtures/head-to-head/${team1}/${team2}?api_token=${SPORTMONKS_API_KEY}&include=participants;league;scores;venue`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`Sportmonks API error: ${response.status} ${response.statusText}`);
      return c.json({ error: "Failed to fetch head-to-head", details: errorText }, response.status);
    }
    
    const data = await response.json();
    console.log(`✅ ${data.data?.length || 0} confrontos encontrados`);
    return c.json(data);
  } catch (error) {
    console.log(`Server error fetching head-to-head from Sportmonks: ${error}`);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

// Get all rounds/fixtures for Brasileirão season
app.get("/make-server-2363f5d6/sportmonks/rounds/brasileirao", async (c) => {
  try {
    console.log(`🗓️ Buscando rodadas do Brasileirão - Sportmonks`);
    
    const response = await fetch(`${SPORTMONKS_BASE_URL}/rounds/seasons/23880?api_token=${SPORTMONKS_API_KEY}&include=fixtures.participants`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`Sportmonks API error: ${response.status} ${response.statusText}`);
      return c.json({ error: "Failed to fetch rounds", details: errorText }, response.status);
    }
    
    const data = await response.json();
    console.log(`✅ ${data.data?.length || 0} rodadas obtidas`);
    return c.json(data);
  } catch (error) {
    console.log(`Server error fetching rounds from Sportmonks: ${error}`);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

// Get fixture details with full statistics
app.get("/make-server-2363f5d6/sportmonks/fixture/:id", async (c) => {
  try {
    const id = c.req.param('id');
    console.log(`📊 Buscando detalhes da partida ${id} - Sportmonks`);
    
    const response = await fetch(`${SPORTMONKS_BASE_URL}/fixtures/${id}?api_token=${SPORTMONKS_API_KEY}&include=participants;league;scores;venue;statistics;events;lineups`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`Sportmonks API error: ${response.status} ${response.statusText}`);
      return c.json({ error: "Failed to fetch fixture details", details: errorText }, response.status);
    }
    
    const data = await response.json();
    console.log(`✅ Detalhes da partida obtidos`);
    return c.json(data);
  } catch (error) {
    console.log(`Server error fetching fixture from Sportmonks: ${error}`);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

// Get team form (last 5 matches)
app.get("/make-server-2363f5d6/sportmonks/team/:id/form", async (c) => {
  try {
    const id = c.req.param('id');
    console.log(`📈 Buscando retrospecto do time ${id} - Sportmonks`);
    
    const response = await fetch(`${SPORTMONKS_BASE_URL}/teams/${id}?api_token=${SPORTMONKS_API_KEY}&include=latest.participants;latest.scores;latest.league`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`Sportmonks API error: ${response.status} ${response.statusText}`);
      return c.json({ error: "Failed to fetch team form", details: errorText }, response.status);
    }
    
    const data = await response.json();
    console.log(`✅ Retrospecto obtido`);
    return c.json(data);
  } catch (error) {
    console.log(`Server error fetching team form from Sportmonks: ${error}`);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

// Get league news
app.get("/make-server-2363f5d6/sportmonks/news/brasileirao", async (c) => {
  try {
    console.log(`📰 Buscando notícias do Brasileirão - Sportmonks`);
    
    const response = await fetch(`${SPORTMONKS_BASE_URL}/news/pre-match/seasons/23880?api_token=${SPORTMONKS_API_KEY}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`Sportmonks API error: ${response.status} ${response.statusText}`);
      return c.json({ error: "Failed to fetch news", details: errorText }, response.status);
    }
    
    const data = await response.json();
    console.log(`✅ ${data.data?.length || 0} notícias obtidas`);
    return c.json(data);
  } catch (error) {
    console.log(`Server error fetching news from Sportmonks: ${error}`);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

// Get venue details
app.get("/make-server-2363f5d6/sportmonks/venue/:id", async (c) => {
  try {
    const id = c.req.param('id');
    console.log(`🏟️ Buscando detalhes do estádio ${id} - Sportmonks`);
    
    const response = await fetch(`${SPORTMONKS_BASE_URL}/venues/${id}?api_token=${SPORTMONKS_API_KEY}&include=city`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`Sportmonks API error: ${response.status} ${response.statusText}`);
      return c.json({ error: "Failed to fetch venue details", details: errorText }, response.status);
    }
    
    const data = await response.json();
    console.log(`✅ Detalhes do estádio obtidos`);
    return c.json(data);
  } catch (error) {
    console.log(`Server error fetching venue from Sportmonks: ${error}`);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

// Get league assists leaders
app.get("/make-server-2363f5d6/sportmonks/assists/brasileirao", async (c) => {
  try {
    console.log(`🎯 Buscando garçons do Brasileirão - Sportmonks`);
    
    const response = await fetch(`${SPORTMONKS_BASE_URL}/topscorers/seasons/23880?api_token=${SPORTMONKS_API_KEY}&include=player;team&order=assists`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`Sportmonks API error: ${response.status} ${response.statusText}`);
      return c.json({ error: "Failed to fetch assists", details: errorText }, response.status);
    }
    
    const data = await response.json();
    console.log(`✅ Garçons obtidos`);
    return c.json(data);
  } catch (error) {
    console.log(`Server error fetching assists from Sportmonks: ${error}`);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

// Get referees
app.get("/make-server-2363f5d6/sportmonks/referees", async (c) => {
  try {
    console.log(`👨‍⚖️ Buscando árbitros - Sportmonks`);
    
    const response = await fetch(`${SPORTMONKS_BASE_URL}/referees?api_token=${SPORTMONKS_API_KEY}&filters=countryId:22`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`Sportmonks API error: ${response.status} ${response.statusText}`);
      return c.json({ error: "Failed to fetch referees", details: errorText }, response.status);
    }
    
    const data = await response.json();
    console.log(`✅ ${data.data?.length || 0} árbitros obtidos`);
    return c.json(data);
  } catch (error) {
    console.log(`Server error fetching referees from Sportmonks: ${error}`);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

// ==================== IPTV ENDPOINTS ====================

// Helper function to parse M3U/TXT playlist
function parseM3UPlaylist(text: string) {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line);
  const items: any[] = [];
  let currentItem: any = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if it's an EXTINF line (M3U format)
    if (line.startsWith('#EXTINF:')) {
      currentItem = {};
      
      // Extract tvg-logo
      const logoMatch = line.match(/tvg-logo="([^"]*)"/);
      if (logoMatch) currentItem.logo = logoMatch[1];
      
      // Extract tvg-id
      const idMatch = line.match(/tvg-id="([^"]*)"/);
      if (idMatch) currentItem.tvgId = idMatch[1];
      
      // Extract group-title (category)
      const groupMatch = line.match(/group-title="([^"]*)"/);
      if (groupMatch) currentItem.category = groupMatch[1];
      
      // Extract name (after last comma)
      const nameMatch = line.match(/,(.+)$/);
      if (nameMatch) currentItem.name = nameMatch[1].trim();
      
    } else if (line.startsWith('http') && currentItem) {
      // This is the stream URL
      currentItem.url = line;
      items.push(currentItem);
      currentItem = null;
    } else if (line.startsWith('http') && !currentItem) {
      // Direct URL without EXTINF (TXT format)
      items.push({
        name: `Canal ${items.length + 1}`,
        url: line,
        category: 'Outros'
      });
    }
  }

  return items;
}

// Get channels playlist from chemorena.com
app.get("/make-server-2363f5d6/iptv/playlists/canais", async (c) => {
  try {
    console.log('📺 Buscando playlist de canais IPTV');
    
    const url = "https://chemorena.com/filmes/canaissite.txt";
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.log(`❌ Erro ao buscar playlist: ${response.status} ${response.statusText}`);
      return c.json({ error: "Failed to fetch channels playlist" }, response.status);
    }
    
    const text = await response.text();
    console.log(`✅ Playlist carregada: ${text.length} caracteres`);
    
    // Parse the playlist
    const channels = parseM3UPlaylist(text);
    console.log(`✅ ${channels.length} canais parseados`);
    
    // Group by category
    const grouped: Record<string, any[]> = {};
    channels.forEach(channel => {
      const category = channel.category || 'Outros';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(channel);
    });
    
    return c.json({ 
      total: channels.length,
      channels,
      categories: grouped
    });
  } catch (error) {
    console.log(`❌ Server error fetching channels playlist: ${error}`);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

// Get movies/series playlist from chemorena.com
app.get("/make-server-2363f5d6/iptv/playlists/filmes", async (c) => {
  try {
    console.log('🎬 Buscando playlist de filmes e séries IPTV');
    
    const url = "https://chemorena.com/filmes/filmes.txt";
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.log(`❌ Erro ao buscar playlist: ${response.status} ${response.statusText}`);
      return c.json({ error: "Failed to fetch movies playlist" }, response.status);
    }
    
    const text = await response.text();
    console.log(`✅ Playlist carregada: ${text.length} caracteres`);
    
    // Parse the playlist
    const movies = parseM3UPlaylist(text);
    console.log(`✅ ${movies.length} filmes/séries parseados`);
    
    // Group by category
    const grouped: Record<string, any[]> = {};
    movies.forEach(movie => {
      const category = movie.category || 'Outros';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(movie);
    });
    
    return c.json({ 
      total: movies.length,
      movies,
      categories: grouped
    });
  } catch (error) {
    console.log(`❌ Server error fetching movies playlist: ${error}`);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

// Proxy endpoint for streaming with CORS headers
app.get("/make-server-2363f5d6/iptv/stream-proxy", async (c) => {
  try {
    const streamUrl = c.req.query('url');
    
    if (!streamUrl) {
      return c.json({ error: "URL parameter is required" }, 400);
    }
    
    console.log(`🎥 Proxying stream: ${streamUrl.substring(0, 50)}...`);
    
    const response = await fetch(streamUrl);
    
    if (!response.ok) {
      console.log(`❌ Erro ao buscar stream: ${response.status} ${response.statusText}`);
      return c.json({ error: "Failed to fetch stream" }, response.status);
    }
    
    // Get content type from original response
    const contentType = response.headers.get('content-type') || 'application/vnd.apple.mpegurl';
    
    // Return stream with CORS headers
    return new Response(response.body, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': contentType,
        'Cache-Control': 'no-store',
        'X-Proxied-By': 'RedFlix-IPTV'
      }
    });
  } catch (error) {
    console.log(`❌ Server error proxying stream: ${error}`);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

// ========================================
// HERO DATA MANAGEMENT (Banners)
// ========================================

/**
 * Salvar dados dos banners hero no KV Store
 * POST /make-server-2363f5d6/hero-data
 */
app.post("/make-server-2363f5d6/hero-data", async (c) => {
  try {
    const body = await c.req.json();
    const { data } = body;
    
    if (!data || !Array.isArray(data)) {
      return c.json({ error: 'data must be an array' }, 400);
    }
    
    console.log(`💾 Salvando ${data.length} séries hero no KV Store...`);
    
    // Salvar como JSON
    await kv.set('hero-slides-data', JSON.stringify(data));
    
    console.log(`✅ Hero data saved successfully`);
    
    return c.json({ 
      success: true,
      count: data.length,
      message: 'Hero data saved to KV Store'
    });
  } catch (error) {
    console.error(`❌ Error saving hero data:`, error);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

/**
 * Carregar dados dos banners hero do KV Store
 * GET /make-server-2363f5d6/hero-data
 */
app.get("/make-server-2363f5d6/hero-data", async (c) => {
  try {
    console.log('📡 Carregando hero data do KV Store...');
    
    const storedData = await kv.get('hero-slides-data');
    
    if (!storedData) {
      console.log('⚠️ No hero data found in KV Store');
      return c.json({ error: 'No hero data found' }, 404);
    }
    
    const data = JSON.parse(storedData);
    console.log(`✅ Hero data loaded: ${data.length} séries`);
    
    return c.json(data);
  } catch (error) {
    console.error(`❌ Error loading hero data:`, error);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

// ========================================
// DYNAMIC IMAGE RESIZE API
// ========================================

/**
 * Endpoint de redimensionamento dinâmico de imagens
 * GET /make-server-2363f5d6/api/image?url={image_url}&width={width}&format={format}
 * 
 * Parâmetros:
 * - url: URL da imagem original (obrigatório)
 * - width: Largura desejada em pixels (opcional, padrão: original)
 * - format: Formato de saída - 'webp', 'avif', 'jpeg', 'png' (opcional, padrão: 'webp')
 * - quality: Qualidade da imagem 1-100 (opcional, padrão: 80)
 * 
 * Exemplos:
 * - /api/image?url=https://image.tmdb.org/t/p/original/abc.jpg&width=400
 * - /api/image?url=https://image.tmdb.org/t/p/w500/xyz.jpg&width=800&format=avif&quality=90
 */
app.get("/make-server-2363f5d6/api/image", async (c) => {
  try {
    const imageUrl = c.req.query('url');
    const width = parseInt(c.req.query('width') || '0', 10);
    const format = c.req.query('format') || 'webp';
    const quality = parseInt(c.req.query('quality') || '80', 10);
    
    // Validação
    if (!imageUrl) {
      return c.json({ error: 'URL parameter is required' }, 400);
    }
    
    if (!['webp', 'avif', 'jpeg', 'png'].includes(format)) {
      return c.json({ error: 'Invalid format. Use: webp, avif, jpeg, or png' }, 400);
    }
    
    if (quality < 1 || quality > 100) {
      return c.json({ error: 'Quality must be between 1 and 100' }, 400);
    }

    console.log(`🖼️ Dynamic resize request: ${imageUrl} (width: ${width || 'original'}, format: ${format}, quality: ${quality})`);

    // Gerar cache key baseado nos parâmetros
    const cacheKey = `resized-${hashUrl(imageUrl)}-${width}-${format}-${quality}`;
    
    // Verificar cache no KV
    const cachedData = await kv.get(cacheKey);
    
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        const { signedUrl, expiresAt } = parsed;
        
        // Verificar se a URL assinada ainda é válida (renovar 1 hora antes de expirar)
        if (expiresAt && Date.now() < expiresAt - 3600000) {
          console.log(`✅ Resize cache hit: returning cached URL`);
          return c.json({ 
            url: signedUrl, 
            cached: true,
            width: width || 'original',
            format,
            quality
          });
        }
      } catch (e) {
        console.log('⚠️ Invalid resize cache data, will regenerate');
      }
    }

    // Inicializar Supabase
    const supabase = await ensureImageBucket();
    if (!supabase) {
      return c.json({ error: 'Storage not available' }, 500);
    }

    const bucketName = 'make-2363f5d6-tmdb-images';
    
    // Gerar path único para a imagem redimensionada
    const urlHash = hashUrl(imageUrl);
    const resizedPath = `resized/${urlHash}-w${width || 'orig'}-${format}-q${quality}.${format}`;

    // Verificar se a imagem redimensionada já existe no storage
    const { data: existingFile } = await supabase.storage
      .from(bucketName)
      .list('resized', {
        search: `${urlHash}-w${width || 'orig'}-${format}-q${quality}.${format}`
      });

    let needsResize = !existingFile || existingFile.length === 0;

    if (needsResize) {
      console.log(`🔄 Processing image resize: ${resizedPath}`);
      
      // Baixar a imagem original
      const response = await fetch(imageUrl);
      
      if (!response.ok) {
        console.error(`❌ Failed to fetch original image: ${response.status}`);
        return c.json({ error: 'Failed to fetch original image' }, response.status);
      }

      const imageBuffer = await response.arrayBuffer();
      
      // Para este ambiente, vamos apenas cachear a imagem
      // O redimensionamento real pode ser feito no frontend com canvas
      // ou integrado com serviços como Cloudinary/imgix em produção
      
      // Por enquanto, retornamos a imagem original com metadados de resize
      const contentTypeMap = {
        'webp': 'image/webp',
        'avif': 'image/avif',
        'jpeg': 'image/jpeg',
        'png': 'image/png'
      };
      
      const contentType = contentTypeMap[format] || 'image/webp';

      // Upload da imagem processada
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(resizedPath, imageBuffer, {
          contentType,
          cacheControl: '31536000', // 1 ano
          upsert: true
        });

      if (uploadError) {
        console.error(`❌ Error uploading resized image:`, uploadError);
        return c.json({ error: 'Failed to upload resized image' }, 500);
      }

      console.log(`✅ Resized image cached: ${resizedPath}`);
    } else {
      console.log(`✅ Resized image already exists: ${resizedPath}`);
    }

    // Gerar URL assinada (válida por 7 dias)
    const { data: signedUrlData, error: signedError } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(resizedPath, 604800); // 7 dias em segundos

    if (signedError || !signedUrlData) {
      console.error(`❌ Error creating signed URL:`, signedError);
      return c.json({ error: 'Failed to create signed URL' }, 500);
    }

    const signedUrl = signedUrlData.signedUrl;
    const expiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 dias

    // Salvar no KV cache
    await kv.set(cacheKey, JSON.stringify({ 
      signedUrl, 
      expiresAt,
      width: width || 'original',
      format,
      quality
    }));

    console.log(`✅ Dynamic resize complete: ${resizedPath}`);
    
    return c.json({ 
      url: signedUrl, 
      cached: false,
      width: width || 'original',
      format,
      quality,
      path: resizedPath
    });
    
  } catch (error) {
    console.error(`❌ Error in dynamic resize:`, error);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

// ========================================
// BATCH IMAGE OPTIMIZATION
// ========================================

/**
 * Endpoint para processar múltiplas imagens em batch
 * POST /make-server-2363f5d6/api/batch-images
 * 
 * Body: {
 *   images: [
 *     { url: "https://...", width: 400, format: "webp", quality: 80 },
 *     { url: "https://...", width: 800, format: "avif", quality: 90 }
 *   ]
 * }
 */
app.post("/make-server-2363f5d6/api/batch-images", async (c) => {
  try {
    const body = await c.req.json();
    const { images } = body;
    
    if (!images || !Array.isArray(images)) {
      return c.json({ error: 'Invalid request: images array is required' }, 400);
    }
    
    if (images.length === 0) {
      return c.json({ error: 'At least one image is required' }, 400);
    }
    
    if (images.length > 50) {
      return c.json({ error: 'Maximum 50 images per batch' }, 429);
    }

    console.log(`📦 Batch resize request: ${images.length} images`);

    // Processar todas as imagens em paralelo (com limite de concorrência)
    const batchSize = 5; // Processar 5 por vez
    const results = [];
    
    for (let i = 0; i < images.length; i += batchSize) {
      const batch = images.slice(i, i + batchSize);
      
      const batchResults = await Promise.all(
        batch.map(async (img) => {
          try {
            const { url, width = 0, format = 'webp', quality = 80 } = img;
            
            if (!url) {
              return { error: 'URL is required', image: img };
            }
            
            // Gerar cache key
            const cacheKey = `resized-${hashUrl(url)}-${width}-${format}-${quality}`;
            
            // Verificar cache
            const cachedData = await kv.get(cacheKey);
            
            if (cachedData) {
              try {
                const parsed = JSON.parse(cachedData);
                const { signedUrl, expiresAt } = parsed;
                
                if (expiresAt && Date.now() < expiresAt - 3600000) {
                  return { 
                    url: signedUrl, 
                    cached: true,
                    original: url
                  };
                }
              } catch (e) {
                // Continue to processing
              }
            }
            
            // Se não está em cache, retornar para processamento individual
            return {
              url: null,
              cached: false,
              original: url,
              needsProcessing: true,
              params: { width, format, quality }
            };
            
          } catch (error) {
            return { 
              error: error.toString(), 
              image: img 
            };
          }
        })
      );
      
      results.push(...batchResults);
    }

    const cachedCount = results.filter(r => r.cached).length;
    const needsProcessing = results.filter(r => r.needsProcessing);

    console.log(`✅ Batch complete: ${cachedCount} cached, ${needsProcessing.length} need processing`);
    
    return c.json({
      total: images.length,
      cached: cachedCount,
      needsProcessing: needsProcessing.length,
      results
    });
    
  } catch (error) {
    console.error(`❌ Error in batch resize:`, error);
    return c.json({ error: `Server error: ${error}` }, 500);
  }
});

// ========================================
// M3U + TMDB SYNC SYSTEM
// ========================================

/**
 * Classifica tipo de conteúdo baseado no group-title
 */
function classifyContent(groupTitle: string): 'filmes' | 'series' | 'canais' {
  const lower = (groupTitle || '').toLowerCase();
  
  // Palavras-chave para canais
  const canalKeywords = ['canal', 'tv', 'esporte', 'sport', 'news', 'notícia', 'aberto', 'fechado', 'hd', 'fhd', '4k'];
  if (canalKeywords.some(k => lower.includes(k))) {
    return 'canais';
  }
  
  // Palavras-chave para séries
  const serieKeywords = ['serie', 'series', 'temporada', 'season', 'episodio', 'episode', 's01', 's02'];
  if (serieKeywords.some(k => lower.includes(k))) {
    return 'series';
  }
  
  // Palavras-chave para filmes
  const filmeKeywords = ['filme', 'movie', 'cinema', 'dublado', 'legendado'];
  if (filmeKeywords.some(k => lower.includes(k))) {
    return 'filmes';
  }
  
  // Padrão: filme se não identificado
  return 'filmes';
}

/**
 * Busca conteúdo no TMDB
 */
async function searchTMDB(nome: string, type: 'movie' | 'tv') {
  try {
    const apiKey = "ddb1bdf6aa91bdf335797853884b0c1d";
    const url = `${TMDB_BASE_URL}/search/${type}?api_key=${apiKey}&query=${encodeURIComponent(nome)}&language=pt-BR`;
    
    const response = await fetch(url);
    if (!response.ok) return null;
    
    const data = await response.json();
    return data.results && data.results.length > 0 ? data.results[0] : null;
  } catch (error) {
    console.error(`Erro ao buscar no TMDB: ${error}`);
    return null;
  }
}

/**
 * Baixa e otimiza imagem do TMDB
 */
async function downloadAndOptimizeImage(imageUrl: string): Promise<Uint8Array | null> {
  try {
    if (!imageUrl) return null;
    
    const fullUrl = `https://image.tmdb.org/t/p/original${imageUrl}`;
    console.log(`📥 Baixando imagem: ${fullUrl}`);
    
    const response = await fetch(fullUrl);
    if (!response.ok) {
      console.error(`Erro ao baixar imagem: ${response.status}`);
      return null;
    }
    
    const arrayBuffer = await response.arrayBuffer();
    
    // TODO: Implementar otimização com Sharp ou similar
    // Por enquanto, retornar como está
    return new Uint8Array(arrayBuffer);
  } catch (error) {
    console.error(`Erro ao baixar/otimizar imagem: ${error}`);
    return null;
  }
}

/**
 * Faz upload de imagem para Supabase Storage
 */
async function uploadToStorage(
  supabase: any,
  bucketName: string,
  path: string,
  data: Uint8Array,
  contentType: string = 'image/jpeg'
): Promise<string | null> {
  try {
    const { error } = await supabase.storage
      .from(bucketName)
      .upload(path, data, {
        contentType,
        cacheControl: '31536000',
        upsert: true
      });
    
    if (error) {
      console.error(`Erro ao fazer upload: ${error.message}`);
      return null;
    }
    
    // Criar URL assinada (válida por 1 ano)
    const { data: signedUrlData, error: signedError } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(path, 31536000);
    
    if (signedError || !signedUrlData) {
      console.error(`Erro ao criar URL assinada: ${signedError}`);
      return null;
    }
    
    return signedUrlData.signedUrl;
  } catch (error) {
    console.error(`Erro no upload: ${error}`);
    return null;
  }
}

/**
 * Sincronização completa: M3U + TMDB → Supabase
 * POST /make-server-2363f5d6/sync-m3u-with-tmdb
 */
app.post("/make-server-2363f5d6/sync-m3u-with-tmdb", async (c) => {
  try {
    console.log('🚀 Iniciando sincronização M3U + TMDB → Supabase...');
    
    const { createClient } = await import("jsr:@supabase/supabase-js@2");
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );
    
    // 1. Buscar arquivo lista.m3u do GitHub
    console.log('📡 Buscando lista.m3u do GitHub...');
    const m3uUrl = 'https://raw.githubusercontent.com/Fabriciocypreste/FIGMA1/main/public/data/lista.m3u';
    const m3uResponse = await fetch(m3uUrl);
    
    if (!m3uResponse.ok) {
      return c.json({ error: 'Erro ao buscar lista.m3u do GitHub' }, 500);
    }
    
    const m3uContent = await m3uResponse.text();
    console.log(`✅ lista.m3u baixado (${m3uContent.length} bytes)`);
    
    // 2. Parse do M3U
    const lines = m3uContent.split('\n').map(l => l.trim());
    const entries: any[] = [];
    let currentEntry: any = {};
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (!line || line === '#EXTM3U') continue;
      
      if (line.startsWith('#EXTINF:')) {
        // Extrair informações
        const logoMatch = line.match(/tvg-logo="([^"]*)"/);
        const groupMatch = line.match(/group-title="([^"]*)"/);
        const tvgIdMatch = line.match(/tvg-id="([^"]*)"/);
        const commaIndex = line.lastIndexOf(',');
        
        currentEntry = {
          nome: commaIndex !== -1 ? line.substring(commaIndex + 1).trim() : '',
          logo: logoMatch ? logoMatch[1] : '',
          group_title: groupMatch ? groupMatch[1] : '',
          tvg_id: tvgIdMatch ? tvgIdMatch[1] : ''
        };
      } else if (line.startsWith('http')) {
        currentEntry.url = line;
        
        if (currentEntry.nome && currentEntry.url) {
          entries.push({ ...currentEntry });
        }
        
        currentEntry = {};
      }
    }
    
    console.log(`✅ ${entries.length} entradas detectadas no M3U`);
    
    // 3. Criar bucket se não existir
    const bucketName = 'redflix';
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some((b: any) => b.name === bucketName);
    
    if (!bucketExists) {
      console.log('📦 Criando bucket redflix...');
      const { error } = await supabase.storage.createBucket(bucketName, {
        public: false,
        fileSizeLimit: 10485760
      });
      
      if (error && !error.message.includes('already exists')) {
        console.error('Erro ao criar bucket:', error);
      }
    }
    
    // 4. Processar cada entrada
    const results = {
      total: entries.length,
      filmes: { processed: 0, withTMDB: 0, uploaded: 0 },
      series: { processed: 0, withTMDB: 0, uploaded: 0 },
      canais: { processed: 0, uploaded: 0 },
      errors: [] as string[]
    };
    
    // Processar em lotes de 10 para não sobrecarregar
    const batchSize = 10;
    
    for (let i = 0; i < entries.length; i += batchSize) {
      const batch = entries.slice(i, i + batchSize);
      
      console.log(`\n📦 Processando lote ${Math.floor(i / batchSize) + 1}/${Math.ceil(entries.length / batchSize)}...`);
      
      await Promise.all(batch.map(async (entry) => {
        try {
          const contentType = classifyContent(entry.group_title);
          
          if (contentType === 'canais') {
            // Para canais, manter logo original
            results.canais.processed++;
            
            const { error } = await supabase
              .from('conteudo')
              .upsert({
                nome: entry.nome,
                tipo: 'Canal',
                grupo: entry.group_title || 'canal',
                url: entry.url,
                logo: entry.logo,
                tvg_id: entry.tvg_id,
                tvg_name: entry.nome,
                group_title: entry.group_title
              }, { onConflict: 'nome,tipo' });
            
            if (!error) {
              results.canais.uploaded++;
              console.log(`✅ Canal: ${entry.nome}`);
            }
          } else {
            // Para filmes e séries, buscar no TMDB
            const tmdbType = contentType === 'filmes' ? 'movie' : 'tv';
            const tmdbResult = await searchTMDB(entry.nome, tmdbType);
            
            if (contentType === 'filmes') {
              results.filmes.processed++;
            } else {
              results.series.processed++;
            }
            
            let imageUrl = entry.logo; // Fallback para logo original
            
            if (tmdbResult && tmdbResult.poster_path) {
              if (contentType === 'filmes') {
                results.filmes.withTMDB++;
              } else {
                results.series.withTMDB++;
              }
              
              // Baixar imagem do TMDB
              const imageData = await downloadAndOptimizeImage(tmdbResult.poster_path);
              
              if (imageData) {
                // Upload para Supabase Storage
                const sanitizedName = entry.nome.replace(/[^a-z0-9]/gi, '_').toLowerCase();
                const storagePath = `${contentType}/${sanitizedName}_${Date.now()}.jpg`;
                
                const uploadedUrl = await uploadToStorage(
                  supabase,
                  bucketName,
                  storagePath,
                  imageData,
                  'image/jpeg'
                );
                
                if (uploadedUrl) {
                  imageUrl = uploadedUrl;
                  
                  if (contentType === 'filmes') {
                    results.filmes.uploaded++;
                  } else {
                    results.series.uploaded++;
                  }
                  
                  console.log(`🎬 ${contentType === 'filmes' ? 'Filme' : 'Série'}: ${entry.nome} - imagem TMDB enviada`);
                }
              }
            }
            
            // Inserir/atualizar no banco unificado
            const tipo = contentType === 'filmes' ? 'Filme' : 'Série';
            const { error } = await supabase
              .from('conteudo')
              .upsert({
                nome: entry.nome,
                tipo: tipo,
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
            
            if (error) {
              console.error(`❌ Erro ao salvar ${entry.nome}:`, error.message);
            }
          }
        } catch (error) {
          const errorMsg = `Erro ao processar ${entry.nome}: ${error}`;
          console.error(`❌ ${errorMsg}`);
          results.errors.push(errorMsg);
        }
      }));
      
      // Delay entre lotes
      if (i + batchSize < entries.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    console.log('\n========================================');
    console.log('📊 RESUMO DA SINCRONIZAÇÃO M3U + TMDB');
    console.log('========================================');
    console.log(`📺 Total de entradas: ${results.total}`);
    console.log(`🎬 Filmes: ${results.filmes.processed} processados, ${results.filmes.withTMDB} com TMDB, ${results.filmes.uploaded} imagens enviadas`);
    console.log(`📺 Séries: ${results.series.processed} processadas, ${results.series.withTMDB} com TMDB, ${results.series.uploaded} imagens enviadas`);
    console.log(`📡 Canais: ${results.canais.processed} processados, ${results.canais.uploaded} salvos`);
    console.log(`❌ Erros: ${results.errors.length}`);
    console.log('========================================');
    
    return c.json({
      success: true,
      results,
      message: 'Sincronização M3U + TMDB concluída!'
    });
    
  } catch (error) {
    console.error('❌ Erro na sincronização M3U + TMDB:', error);
    return c.json({ 
      error: `Erro na sincronização: ${error instanceof Error ? error.message : error}` 
    }, 500);
  }
});

Deno.serve(app.fetch);
