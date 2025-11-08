import { useEffect, useState } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function LoadingDiagnostic() {
  const [diagnostics, setDiagnostics] = useState<any>(null);

  useEffect(() => {
    async function runDiagnostics() {
      const results: any = {
        timestamp: new Date().toISOString(),
        tests: []
      };

      // Test 1: Check server health
      try {
        const healthUrl = `https://${projectId}.supabase.co/functions/v1/make-server-2363f5d6/health`;
        const healthRes = await fetch(healthUrl, {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        });
        results.tests.push({
          name: 'Server Health',
          status: healthRes.ok ? 'OK' : 'FAILED',
          details: `Status: ${healthRes.status}`
        });
      } catch (error) {
        results.tests.push({
          name: 'Server Health',
          status: 'ERROR',
          details: String(error)
        });
      }

      // Test 2: Check content list
      try {
        const contentUrl = `https://${projectId}.supabase.co/functions/v1/make-server-2363f5d6/content-list`;
        const contentRes = await fetch(contentUrl, {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        });
        const contentData = await contentRes.json();
        results.tests.push({
          name: 'Content List (filmes.txt)',
          status: contentRes.ok ? 'OK' : 'FAILED',
          details: `${contentData.items?.length || 0} items loaded`
        });
      } catch (error) {
        results.tests.push({
          name: 'Content List',
          status: 'ERROR',
          details: String(error)
        });
      }

      // Test 3: Check TMDB search
      try {
        const searchUrl = `https://${projectId}.supabase.co/functions/v1/make-server-2363f5d6/tmdb/search/tv?query=Breaking%20Bad`;
        const searchRes = await fetch(searchUrl, {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        });
        const searchData = await searchRes.json();
        results.tests.push({
          name: 'TMDB Search',
          status: searchRes.ok ? 'OK' : 'FAILED',
          details: `${searchData.results?.length || 0} results for "Breaking Bad"`
        });
      } catch (error) {
        results.tests.push({
          name: 'TMDB Search',
          status: 'ERROR',
          details: String(error)
        });
      }

      setDiagnostics(results);
    }

    runDiagnostics();
  }, []);

  if (!diagnostics) {
    return (
      <div className="fixed bottom-4 right-4 bg-black/90 border border-white/20 rounded-lg p-4 max-w-md z-50">
        <p className="text-white text-sm">🔍 Executando diagnósticos...</p>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 border border-white/20 rounded-lg p-4 max-w-md z-50 max-h-96 overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-bold text-sm">Diagnóstico do Sistema</h3>
        <span className="text-white/50 text-xs">{new Date(diagnostics.timestamp).toLocaleTimeString()}</span>
      </div>
      
      {diagnostics.tests.map((test: any, index: number) => (
        <div key={index} className="mb-3 pb-3 border-b border-white/10 last:border-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-white text-sm">{test.name}</span>
            <span className={`text-xs font-bold ${
              test.status === 'OK' ? 'text-green-500' : 
              test.status === 'FAILED' ? 'text-yellow-500' : 
              'text-red-500'
            }`}>
              {test.status}
            </span>
          </div>
          <p className="text-white/70 text-xs">{test.details}</p>
        </div>
      ))}
    </div>
  );
}
