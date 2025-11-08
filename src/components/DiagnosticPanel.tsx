import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function DiagnosticPanel() {
  const [apiKeyStatus, setApiKeyStatus] = useState<any>(null);
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkApiKey() {
      try {
        // Check API key status
        const response1 = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-2363f5d6/debug/check-key`,
          {
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`
            }
          }
        );
        const data1 = await response1.json();
        setApiKeyStatus(data1);
        
        // Test TMDB API
        const response2 = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-2363f5d6/debug/test-tmdb`,
          {
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`
            }
          }
        );
        const data2 = await response2.json();
        setTestResults(data2);
        
        setLoading(false);
      } catch (error) {
        console.error('Error checking API key:', error);
        setApiKeyStatus({ error: String(error) });
        setLoading(false);
      }
    }
    
    checkApiKey();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-6 rounded-lg shadow-lg max-w-2xl z-50 max-h-[80vh] overflow-y-auto">
      <h3 className="font-bold mb-3 text-lg">🔍 TMDB API Diagnostic</h3>
      {loading ? (
        <p>Running diagnostics...</p>
      ) : (
        <div className="text-sm space-y-4">
          {/* API Key Status */}
          <div className="border-b border-gray-600 pb-3">
            <h4 className="font-semibold mb-2">Environment Variable Status</h4>
            <p>API Key Present: {apiKeyStatus?.apiKeyPresent ? '✅ Yes' : '❌ No'}</p>
            <p>API Key Length: {apiKeyStatus?.apiKeyLength || 0}</p>
            <p>API Key Prefix: {apiKeyStatus?.apiKeyPrefix || 'none'}</p>
            <p>API Key Suffix: {apiKeyStatus?.apiKeySuffix || 'none'}</p>
          </div>
          
          {/* Test Results */}
          {testResults && (
            <div className="border-b border-gray-600 pb-3">
              <h4 className="font-semibold mb-2">API Test Results</h4>
              
              <div className="mb-3">
                <p className="font-medium">Bearer Token Method:</p>
                <p className={testResults.bearerTokenTest?.success ? 'text-green-400' : 'text-red-400'}>
                  Status: {testResults.bearerTokenTest?.status} {testResults.bearerTokenTest?.success ? '✅' : '❌'}
                </p>
                {!testResults.bearerTokenTest?.success && (
                  <p className="text-xs text-gray-400 mt-1">
                    {JSON.stringify(testResults.bearerTokenTest?.result, null, 2)}
                  </p>
                )}
              </div>
              
              <div>
                <p className="font-medium">API Key Query Parameter Method:</p>
                <p className={testResults.apiKeyQueryTest?.success ? 'text-green-400' : 'text-red-400'}>
                  Status: {testResults.apiKeyQueryTest?.status} {testResults.apiKeyQueryTest?.success ? '✅' : '❌'}
                </p>
                {testResults.apiKeyQueryTest?.success && (
                  <p className="text-green-400 text-xs mt-1">✅ This method works! Switching to this...</p>
                )}
              </div>
            </div>
          )}
          
          {apiKeyStatus?.error && (
            <p className="text-red-400">Error: {apiKeyStatus.error}</p>
          )}
        </div>
      )}
    </div>
  );
}
