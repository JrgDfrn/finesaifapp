import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import { AlertCircle, ExternalLink } from 'lucide-react';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [configMissing, setConfigMissing] = useState(false);

  useEffect(() => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project')) {
      setConfigMissing(true);
      setLoading(false);
      return;
    }

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (configMissing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5] p-6">
        <div className="max-w-md w-full bg-white rounded-[32px] p-10 shadow-sm border border-black/5 text-center">
          <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-amber-500" />
          </div>
          <h2 className="text-2xl font-light tracking-tight text-gray-900 mb-4">Configuración Requerida</h2>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            Para que el sistema de usuarios funcione, necesitas conectar tu proyecto de <strong>Supabase</strong>.
          </p>
          
          <div className="space-y-3 text-left mb-8">
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Pasos a seguir:</p>
              <ol className="text-xs text-gray-600 space-y-2 list-decimal ml-4">
                <li>Ve a tu panel de Supabase.</li>
                <li>Copia la <strong>Project URL</strong> y la <strong>Anon Key</strong>.</li>
                <li>En AI Studio, abre el panel de <strong>Secrets</strong> (icono de llave).</li>
                <li>Añade <code className="bg-white px-1 rounded">VITE_SUPABASE_URL</code></li>
                <li>Añade <code className="bg-white px-1 rounded">VITE_SUPABASE_ANON_KEY</code></li>
              </ol>
            </div>
          </div>

          <a 
            href="https://supabase.com/dashboard" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 hover:underline"
          >
            Ir a Supabase <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
        <div className="w-8 h-8 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {!session ? <Auth /> : <Dashboard />}
    </div>
  );
}
