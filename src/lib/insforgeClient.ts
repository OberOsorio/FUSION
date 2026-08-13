/// <reference types="vite/client" />
// Mock client that redirects database and RPC calls to the local or remote Express server API
const API_URL = (import.meta as any).env?.VITE_API_URL || '';

// Helper to get local users from all storage keys and normalize schema
function getNormalizedLocalUsers(): any[] {
  const usersMap = new Map<string, any>();

  const keys = ['campaign_users_list', 'cg_users', 'campaign_users'];
  for (const key of keys) {
    const raw = localStorage.getItem(key);
    if (!raw) continue;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        parsed.forEach(item => {
          if (!item || (!item.email && !item.id)) return;
          const email = (item.email || '').trim().toLowerCase();
          const id = item.id || `u-${email}`;
          
          const fullName = item.name || `${item.first_name || item.firstName || ''} ${item.last_name || item.lastName || ''}`.trim() || email.split('@')[0];
          const firstName = item.first_name || item.firstName || (fullName ? fullName.split(' ')[0] : email.split('@')[0]);
          const lastName = item.last_name || item.lastName || (fullName && fullName.includes(' ') ? fullName.split(' ').slice(1).join(' ') : '');
          
          const roleId = item.role_id || item.roleId || item.role || 'admin';
          const roleName = item.role_name || item.roleName || (roleId === 'admin' ? 'Gestión Administrativa' : roleId === 'estrategico' ? 'Gestión Estratégica' : 'Gestión Territorial');
          
          const normalized = {
            id,
            email,
            first_name: firstName,
            last_name: lastName,
            name: fullName,
            role_id: roleId,
            role_name: roleName,
            client_id: item.client_id || item.clientId || 'client-101',
            client_name: item.client_name || item.clientName || 'Campaña Principal',
            status: item.status || 'Activo',
            created_at: item.created_at || item.createdAt || new Date().toISOString(),
            password: item.password || item.passwordHash
          };
          
          usersMap.set(email || id, normalized);
        });
      }
    } catch (e) {}
  }

  return Array.from(usersMap.values());
}

// Save a list of records to local storage keys for users
function syncLocalUsersRecords(records: any[]) {
  if (!Array.isArray(records) || records.length === 0) return;
  const current = getNormalizedLocalUsers();
  const map = new Map<string, any>();
  current.forEach(u => map.set(u.email || u.id, u));
  
  records.forEach(r => {
    if (!r) return;
    const email = (r.email || '').trim().toLowerCase();
    const id = r.id || `u-${email}`;
    const fullName = r.name || `${r.first_name || r.firstName || ''} ${r.last_name || r.lastName || ''}`.trim() || email.split('@')[0];
    const firstName = r.first_name || r.firstName || (fullName ? fullName.split(' ')[0] : email.split('@')[0]);
    const lastName = r.last_name || r.lastName || (fullName && fullName.includes(' ') ? fullName.split(' ').slice(1).join(' ') : '');
    const roleId = r.role_id || r.roleId || r.role || 'admin';
    const roleName = r.role_name || r.roleName || (roleId === 'admin' ? 'Gestión Administrativa' : roleId === 'estrategico' ? 'Gestión Estratégica' : 'Gestión Territorial');

    const norm = {
      id,
      email,
      first_name: firstName,
      last_name: lastName,
      name: fullName,
      role_id: roleId,
      role_name: roleName,
      client_id: r.client_id || r.clientId || 'client-101',
      client_name: r.client_name || r.clientName || 'Campaña Principal',
      status: r.status || 'Activo',
      created_at: r.created_at || r.createdAt || new Date().toISOString(),
      password: r.password || r.passwordHash
    };
    map.set(email || id, norm);
  });

  const allUsers = Array.from(map.values());
  localStorage.setItem('cg_users', JSON.stringify(allUsers));
  localStorage.setItem('campaign_users_list', JSON.stringify(allUsers.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role_id,
    status: u.status
  }))));
}

export const insforge = {
  database: {
    from(table: string) {
      // Map 'users_list' table name to users API endpoint
      const endpoint = table === 'users_list' ? 'users' : table;
      
      return {
        select(fields: string = '*') {
          let filters: Array<{ field: string; value: any }> = [];
          let isSingle = false;
          let limitVal: number | null = null;

          const execute = async () => {
            let data: any[] = [];

            try {
              let url = `${API_URL}/api/${endpoint}`;
              const idFilter = filters.find(f => f.field === 'id');
              if (idFilter) {
                url = `${API_URL}/api/${endpoint}/${idFilter.value}`;
              }

              const res = await fetch(url);
              if (res.ok) {
                const apiData = await res.json();
                if (Array.isArray(apiData)) {
                  data = apiData;
                } else if (apiData) {
                  data = [apiData];
                }
              }
            } catch (error) {
              console.warn(`Fetch error for ${table}, using local storage fallback:`, error);
            }

            // If table is users/users_list, merge local storage records
            if (table === 'users_list' || table === 'users' || endpoint === 'users') {
              const localUsers = getNormalizedLocalUsers();
              const existingEmails = new Set(data.map(u => (u.email || '').trim().toLowerCase()));
              localUsers.forEach(lu => {
                if (!existingEmails.has(lu.email)) {
                  data.push(lu);
                }
              });
            } else if (data.length === 0) {
              const saved = localStorage.getItem(`cg_${endpoint}`);
              if (saved) {
                try { data = JSON.parse(saved); } catch (e) { data = []; }
              }
            }

            // Apply filtering in memory to ensure perfect behavior
            if (Array.isArray(data)) {
              filters.forEach(f => {
                if (f.field === 'email') {
                  const searchEmail = String(f.value).trim().toLowerCase();
                  data = data.filter((item: any) => 
                    item.email && String(item.email).trim().toLowerCase() === searchEmail
                  );
                } else {
                  data = data.filter((item: any) => String(item[f.field]) === String(f.value));
                }
              });
              
              if (isSingle) {
                const singleObj = data[0] || null;
                return { data: singleObj, error: null };
              } else if (limitVal !== null) {
                data = data.slice(0, limitVal);
              }
            }

            return { data, error: null };
          };

          // Return chainable thenable object
          return {
            eq(field: string, value: any) {
              filters.push({ field, value });
              return this;
            },
            limit(limitNum: number) {
              limitVal = limitNum;
              return this;
            },
            single() {
              isSingle = true;
              return this;
            },
            then(onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any) {
              return execute().then(onfulfilled, onrejected);
            },
            catch(onrejected?: (reason: any) => any) {
              return execute().catch(onrejected);
            }
          };
        },
        
        insert(records: any[]) {
          return (async () => {
            if (table === 'users_list' || table === 'users' || endpoint === 'users') {
              syncLocalUsersRecords(records);
            } else {
              try {
                const saved = localStorage.getItem(`cg_${endpoint}`);
                const current = saved ? JSON.parse(saved) : [];
                localStorage.setItem(`cg_${endpoint}`, JSON.stringify([...current, ...records]));
              } catch (e) {}
            }

            try {
              const res = await fetch(`${API_URL}/api/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(records)
              });
              if (!res.ok) throw new Error(`HTTP error ${res.status}`);
              const data = await res.json();
              return { data, error: null };
            } catch (error: any) {
              console.warn(`Notice: Local storage synced for ${table}. Remote server notice:`, error.message);
              return { data: records, error: null };
            }
          })();
        },

        upsert(records: any[]) {
          return (async () => {
            if (table === 'users_list' || table === 'users' || endpoint === 'users') {
              syncLocalUsersRecords(records);
            }

            try {
              const res = await fetch(`${API_URL}/api/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(records)
              });
              if (!res.ok) throw new Error(`HTTP error ${res.status}`);
              const data = await res.json();
              return { data, error: null };
            } catch (error: any) {
              console.warn(`Notice: Local storage synced for ${table}. Remote server notice:`, error.message);
              return { data: records, error: null };
            }
          })();
        },
        
        update(updateData: any) {
          return {
            eq(field: string, value: any) {
              return (async () => {
                if (table === 'users_list' || table === 'users' || endpoint === 'users') {
                  const localUsers = getNormalizedLocalUsers();
                  const updated = localUsers.map(u => {
                    if (String(u[field]) === String(value)) {
                      return { ...u, ...updateData };
                    }
                    return u;
                  });
                  syncLocalUsersRecords(updated);
                }

                try {
                  const url = field === 'id' 
                    ? `${API_URL}/api/${endpoint}/${value}` 
                    : `${API_URL}/api/${endpoint}?field=${field}&value=${value}`;
                  
                  const res = await fetch(url, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updateData)
                  });
                  if (!res.ok) throw new Error(`HTTP error ${res.status}`);
                  const data = await res.json();
                  return { data, error: null };
                } catch (error: any) {
                  return { data: updateData, error: null };
                }
              })();
            }
          };
        },
        
        delete() {
          return {
            eq(field: string, value: any) {
              return (async () => {
                if (table === 'users_list' || table === 'users' || endpoint === 'users') {
                  const localUsers = getNormalizedLocalUsers();
                  const filtered = localUsers.filter(u => String(u[field]) !== String(value));
                  localStorage.setItem('cg_users', JSON.stringify(filtered));
                  localStorage.setItem('campaign_users_list', JSON.stringify(filtered.map(u => ({
                    id: u.id,
                    name: u.name,
                    email: u.email,
                    role: u.role_id,
                    status: u.status
                  }))));
                }

                try {
                  const url = field === 'id' 
                    ? `${API_URL}/api/${endpoint}/${value}` 
                    : `${API_URL}/api/${endpoint}?field=${field}&value=${value}`;
                    
                  const res = await fetch(url, {
                    method: 'DELETE'
                  });
                  if (!res.ok) throw new Error(`HTTP error ${res.status}`);
                  const data = await res.json();
                  return { data, error: null };
                } catch (error: any) {
                  return { data: { success: true }, error: null };
                }
              })();
            }
          };
        }
      };
    }
  },
  
  emails: {
    async send(payload: any) {
      console.log('📧 Mock email sent successfully:', payload);
      return { data: { success: true }, error: null };
    }
  },

  async rpc(name: string, params: any) {
    try {
      const res = await fetch(`${API_URL}/api/rpc/${name}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      return { data, error: null };
    } catch (error: any) {
      console.error(`Error in RPC ${name}:`, error);
      return { data: null, error };
    }
  }
};
