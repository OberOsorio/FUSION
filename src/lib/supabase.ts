// Replacement file for supabase.ts to connect directly to the Express MongoDB backend
const env = (import.meta as any).env || {};

// URL del Software Electoral al que se redirige tras el registro/login
export const PANEL_ADMIN_URL = env.VITE_PANEL_ADMIN_URL || 'https://softwareelectoral.netlify.app/';
export const SUPABASE_URL = ''; // unused fallback
export const SUPABASE_ANON_KEY = ''; // unused fallback

// Keep a mock supabase object to avoid breaking imports elsewhere
export const supabase = {
  auth: {
    signUp: () => Promise.resolve({ data: { user: null }, error: new Error('Supabase is deactivated. Use MongoDB routes.') }),
    signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Supabase is deactivated. Use MongoDB routes.') }),
    signOut: () => Promise.resolve({ error: null })
  }
};

/**
 * Test MongoDB Database Connection (replaces Supabase Connection check)
 */
export async function testSupabaseConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }
    const data = await res.json();
    if (data.databaseConnected) {
      return { success: true, message: `Conexión exitosa a MongoDB Atlas (${data.service})` };
    }
    return { success: false, message: 'Base de datos MongoDB no conectada en el servidor (usando fallback de memoria).' };
  } catch (err: any) {
    console.error('Error connecting to backend database check:', err);
    return { success: false, message: err?.message || 'Error al conectar con la base de datos' };
  }
}

/**
 * Register a New Candidate/Client with instant Panel Admin access.
 * Replaced Supabase flow with a direct Express/MongoDB backend request.
 */
export async function registerNewClient(data: {
  fullName: string;
  email: string;
  password: string;
  campaignName: string;
  phone?: string;
  department?: string;
}): Promise<{ success: boolean; error?: string; panelUrl?: string }> {
  try {
    const res = await fetch('/api/auth/register-client', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return { success: false, error: errData.error || `Error del servidor ${res.status}` };
    }
    
    return {
      success: true,
      panelUrl: PANEL_ADMIN_URL,
    };
  } catch (err: any) {
    console.error('Error in registerNewClient:', err);
    return { success: false, error: err?.message || 'Error inesperado al registrar la cuenta.' };
  }
}

/**
 * Save a Demo Request or Lead Inquiry directly to MongoDB via backend
 */
export async function saveDemoLeadToSupabase(lead: {
  fullName: string;
  email: string;
  phone: string;
  campaignType: string;
  department: string;
  municipality?: string;
  notes?: string;
}) {
  try {
    const res = await fetch('/api/demo_leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: lead.fullName,
        email: lead.email,
        phone: lead.phone,
        campaignType: lead.campaignType,
        department: lead.department,
        municipality: lead.municipality || '',
        notes: lead.notes || '',
        createdAt: new Date().toISOString().split('T')[0]
      })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP error ${res.status}`);
    }

    const data = await res.json();
    return { success: true, data };
  } catch (err: any) {
    console.error('Error saving lead to MongoDB:', err);
    return { success: false, error: err?.message };
  }
}
