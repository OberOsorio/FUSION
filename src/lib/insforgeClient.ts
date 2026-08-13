// Mock client that redirects database and RPC calls to the local or remote Express server API
const API_URL = import.meta.env.VITE_API_URL || '';

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
            try {
              // Build the URL based on filters
              let url = `${API_URL}/api/${endpoint}`;
              
              // Optimistic quick check if we filter by ID
              const idFilter = filters.find(f => f.field === 'id');
              if (idFilter) {
                url = `${API_URL}/api/${endpoint}/${idFilter.value}`;
              }

              const res = await fetch(url);
              if (!res.ok) throw new Error(`HTTP error ${res.status}`);
              let data = await res.json();

              // Apply filtering in memory to ensure perfect behavior
              if (Array.isArray(data)) {
                filters.forEach(f => {
                  if (f.field === 'email') {
                    data = data.filter((item: any) => 
                      item.email && String(item.email).trim().toLowerCase() === String(f.value).trim().toLowerCase()
                    );
                  } else {
                    data = data.filter((item: any) => String(item[f.field]) === String(f.value));
                  }
                });
                if (isSingle) {
                  data = data[0] || null;
                } else if (limitVal !== null) {
                  data = data.slice(0, limitVal);
                }
              } else {
                // If single object returned directly
                if (isSingle && Array.isArray(data)) {
                  data = data[0] || null;
                }
              }

              return { data, error: null };
            } catch (error: any) {
              console.warn(`Error in select for ${table}, attempting local storage fallback:`, error);
              let data: any[] = [];
              const saved = localStorage.getItem(`cg_${endpoint}`);
              if (saved) {
                try {
                  data = JSON.parse(saved);
                } catch (e) {
                  data = [];
                }
              }
              if (Array.isArray(data) && data.length > 0) {
                filters.forEach(f => {
                  if (f.field === 'email') {
                    data = data.filter((item: any) => 
                      item.email && String(item.email).trim().toLowerCase() === String(f.value).trim().toLowerCase()
                    );
                  } else {
                    data = data.filter((item: any) => String(item[f.field]) === String(f.value));
                  }
                });
                if (isSingle) data = data[0] || null;
                else if (limitVal !== null) data = data.slice(0, limitVal);
                return { data, error: null };
              }
              return { data: null, error };
            }
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
              console.error(`Error in insert for ${table}:`, error);
              return { data: null, error };
            }
          })();
        },

        upsert(records: any[]) {
          return (async () => {
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
              console.error(`Error in upsert for ${table}:`, error);
              return { data: null, error };
            }
          })();
        },
        
        update(updateData: any) {
          return {
            eq(field: string, value: any) {
              return (async () => {
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
                  console.error(`Error in update for ${table}:`, error);
                  return { data: null, error };
                }
              })();
            }
          };
        },
        
        delete() {
          return {
            eq(field: string, value: any) {
              return (async () => {
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
                  console.error(`Error in delete for ${table}:`, error);
                  return { data: null, error };
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
