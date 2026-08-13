import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ViewMode, AuthUser } from '../types';
import { CampaignLogoBadge } from './common/CampaignLogoIcon';
import { isViewAllowed, isViewAllowedForModule } from '../utils/rolePermissions';
import { 
  Activity, 
  CreditCard, 
  ShieldAlert, 
  UserCheck, 
  Sliders, 
  Bot, 
  Users, 
  Settings,
  Building2,
  Lock,
  PieChart,
  MapPin,
  Shield,
  Layers,
  Sparkles,
  User,
  FileText,
  MessageSquare,
  DollarSign,
  BookOpen,
  Share2,
  BarChart3,
  Calendar,
  X,
  ClipboardList
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  adminTab?: string;
  onSelectAdminTab?: (tab: string) => void;
  strategicTab?: string;
  onSelectStrategicTab?: (tab: string) => void;
  territorialSubTab?: 'registro' | 'mapa';
  onSelectTerritorialSubTab?: (tab: 'registro' | 'mapa') => void;
  onOpenUserRolesModal?: () => void;
  isOpen?: boolean;
  onCloseMobile?: () => void;
  authUser?: AuthUser | null;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  adminTab = 'inicio',
  onSelectAdminTab,
  strategicTab = 'diagnostico',
  onSelectStrategicTab,
  territorialSubTab = 'registro',
  onSelectTerritorialSubTab,
  onOpenUserRolesModal,
  isOpen = true,
  onCloseMobile,
  authUser
}) => {
  const userRole = authUser?.role || 'superadmin';

  const [perms, setPerms] = useState<{ id: string; name: string; enabled: boolean }[]>([]);

  useEffect(() => {
    const loadPerms = () => {
      if (!authUser) return;
      const usersListStr = localStorage.getItem('campaign_users_list');
      const permissionsStr = localStorage.getItem('campaign_user_permissions');
      if (usersListStr && permissionsStr) {
        try {
          const usersList = JSON.parse(usersListStr);
          const permissions = JSON.parse(permissionsStr);
          const foundUser = usersList.find((u: any) => u.email.toLowerCase() === authUser.email.toLowerCase());
          if (foundUser && permissions[foundUser.id]) {
            setPerms(permissions[foundUser.id]);
            return;
          }
        } catch (e) {
          console.error("Error parsing user permissions in sidebar:", e);
        }
      }
      setPerms([]);
    };

    loadPerms();

    const handleUpdate = () => {
      loadPerms();
    };

    window.addEventListener('permissions-updated', handleUpdate);
    window.addEventListener('storage', loadPerms);
    return () => {
      window.removeEventListener('permissions-updated', handleUpdate);
      window.removeEventListener('storage', loadPerms);
    };
  }, [authUser]);

  const hasPermission = (permId: string) => {
    if (userRole === 'superadmin' || userRole === 'candidato' || userRole === 'auditor') {
      return true;
    }
    if (perms.length === 0) return true;
    const match = perms.find(p => p.id === permId);
    return match ? match.enabled : false;
  };

  // Módulo Estratégico Sub-Items (Mapped to permission IDs)
  const strategicMenuItems = [
    { id: 'est_diag_360', label: '1. Diagnóstico 360° AI', tab: 'diagnostico', icon: <Activity className="w-4 h-4 text-emerald-400" /> },
    { id: 'est_diag_territorial', label: '2. Diagnóstico Territorial', tab: 'diagnostico_territorial', icon: <MapPin className="w-4 h-4 text-cyan-400" /> },
    { id: 'est_programa', label: '3. Programa de Gobierno', tab: 'programa_gobierno', icon: <BookOpen className="w-4 h-4 text-amber-400" /> },
    { id: 'est_perfil', label: '4. Perfil del Candidato', tab: 'perfil', icon: <UserCheck className="w-4 h-4 text-teal-400" /> },
    { id: 'est_carga_cv', label: '5. Carga & Análisis CV', tab: 'hoja_vida', icon: <FileText className="w-4 h-4 text-teal-400" /> },
    { id: 'est_dofa', label: '6. Matriz DOFA / SWOT AI', tab: 'dofa', icon: <PieChart className="w-4 h-4 text-emerald-400" /> },
    { id: 'est_narrativa', label: '7. Narrativa & Discurso', tab: 'discurso', icon: <MessageSquare className="w-4 h-4 text-cyan-400" /> },
    { id: 'est_comunicacion', label: '8. Comunicación & Redes', tab: 'comunicacion_redes', icon: <Share2 className="w-4 h-4 text-emerald-400" /> },
    { id: 'est_analisis_datos', label: '9. Análisis de Datos AI', tab: 'analisis_datos', icon: <BarChart3 className="w-4 h-4 text-cyan-400" /> },
    { id: 'est_agenda', label: '10. Agenda & Calendario Electoral', tab: 'agenda_electoral', icon: <Calendar className="w-4 h-4 text-amber-400" /> },
  ];

  // Administrative Section Sub-Items (Mapped to permission IDs)
  const adminMenuItems = [
    { id: 'admin_inicio', label: '1. Inicio', tab: 'inicio', icon: <Activity className="w-4 h-4" /> },
    { id: 'admin_roles', label: '2. Gestión de Roles', tab: 'roles', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'admin_lideres', label: '3. Líderes / Votantes', tab: 'lideres_votantes', icon: <Users className="w-4 h-4" /> },
    { id: 'admin_presupuesto', label: '4. Presupuesto / CNE', tab: 'presupuesto_cne', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'admin_campana', label: '5. Gestión de Campaña', tab: 'gestion_campana', icon: <Building2 className="w-4 h-4" /> },
    { id: 'admin_testigos', label: '6. Gestión de Testigos', tab: 'gestion_testigos', icon: <ShieldAlert className="w-4 h-4" /> },
    { id: 'admin_jurados', label: '7. Jurados Electorales', tab: 'jurados_electorales', icon: <Sliders className="w-4 h-4" /> },
    { id: 'admin_encuestas', label: '8. Encuestas y Sondeos', tab: 'encuestas_sondeos', icon: <PieChart className="w-4 h-4 text-cyan-400" /> },
  ];

  return (
    <>
      {/* Mobile dark backdrop overlay when drawer is open */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm md:hidden animate-in fade-in transition-all"
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#051329] border-r border-cyan-500/20 text-slate-100 flex flex-col justify-between shrink-0 transition-transform duration-300 ease-in-out select-none md:relative md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
      <div className="p-5 space-y-5 overflow-y-auto max-h-[calc(100vh-80px)] custom-scrollbar">
        
        {/* Header Block matching app design */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <CampaignLogoBadge size="md" />
            <div>
              <h1 className="font-extrabold text-sm tracking-wide text-white leading-tight">
                Campaña Ganadora IA
              </h1>
              <p className="text-[11px] font-semibold text-emerald-400/90 mt-0.5">
                Panel de Control
              </p>
            </div>
          </div>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-xl bg-slate-900 border border-cyan-500/20 text-cyan-300 hover:text-white cursor-pointer transition-all"
              title="Cerrar menú"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>



        {/* Navigation Menu Links Filtered By Role */}
        <div className="space-y-4">
          
          {/* Módulo Estratégico (Perfil del Candidato) */}
          {isViewAllowed(userRole, 'gestion_estrategica') && isViewAllowedForModule(authUser?.moduleName, 'gestion_estrategica') && (
            <div>
              <p className="px-3 text-[10px] font-black uppercase tracking-wider text-emerald-400/90 mb-2">
                Módulo Estratégico
              </p>
              <nav className="space-y-1">
                {strategicMenuItems.filter(item => hasPermission(item.id)).map((item) => {
                  const isActive = currentView === 'gestion_estrategica' && strategicTab === item.tab;
                  
                  return (
                    <motion.button
                      key={item.id}
                      whileHover={{ scale: 1.01, x: 2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        onSelectView('gestion_estrategica');
                        if (item.tab && onSelectStrategicTab) {
                          onSelectStrategicTab(item.tab);
                        }
                        if (onCloseMobile) onCloseMobile();
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-900/40 border border-emerald-400/50'
                          : 'text-slate-300 hover:text-white hover:bg-emerald-500/10'
                      }`}
                    >
                      <div className={`shrink-0 transition-transform ${isActive ? 'scale-110 text-white' : 'text-slate-400'}`}>
                        {item.icon}
                      </div>
                      <span className="truncate tracking-wide text-left">{item.label}</span>
                    </motion.button>
                  );
                })}
              </nav>
            </div>
          )}



          {/* Operación Territorial */}
          {isViewAllowed(userRole, 'gestion_territorial') && isViewAllowedForModule(authUser?.moduleName, 'gestion_territorial') && (
            <div>
              <p className="px-3 text-[10px] font-black uppercase tracking-wider text-teal-400/90 mb-2">
                Operación Territorial
              </p>
              <div className="space-y-1">
                {hasPermission('terr_voters_reg') && (
                  <button
                    onClick={() => {
                      onSelectView('gestion_territorial');
                      if (onSelectTerritorialSubTab) onSelectTerritorialSubTab('registro');
                      if (onCloseMobile) onCloseMobile();
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      currentView === 'gestion_territorial' && territorialSubTab === 'registro'
                        ? 'bg-gradient-to-r from-teal-700 to-emerald-700 text-white shadow-md shadow-teal-900/40 border border-teal-400/50'
                        : 'text-slate-300 hover:text-white hover:bg-teal-500/10'
                    }`}
                  >
                    <div className={`shrink-0 transition-transform ${currentView === 'gestion_territorial' && territorialSubTab === 'registro' ? 'scale-110 text-white' : 'text-teal-400'}`}>
                      <UserCheck className="w-4 h-4 text-teal-400" />
                    </div>
                    <div className="text-left truncate">
                      <div className="tracking-wide text-white">Registro de Votantes</div>
                      <div className="text-[10px] text-teal-300/80 font-normal">Censo Medellín & Padrón</div>
                    </div>
                  </button>
                )}

                {hasPermission('terr_territorial_mgmt') && (
                  <button
                    onClick={() => {
                      onSelectView('gestion_territorial');
                      if (onSelectTerritorialSubTab) onSelectTerritorialSubTab('mapa');
                      if (onCloseMobile) onCloseMobile();
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      currentView === 'gestion_territorial' && territorialSubTab === 'mapa'
                        ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md shadow-amber-900/40 border border-amber-400/50'
                        : 'text-slate-300 hover:text-white hover:bg-amber-500/10'
                    }`}
                  >
                    <div className={`shrink-0 transition-transform ${currentView === 'gestion_territorial' && territorialSubTab === 'mapa' ? 'scale-110 text-white' : 'text-amber-400'}`}>
                      <MapPin className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="text-left truncate">
                      <div className="tracking-wide text-white">Gestión Territorial</div>
                      <div className="text-[10px] text-amber-300/80 font-normal">Mapa de Votos & Sectores</div>
                    </div>
                  </button>
                )}

                {hasPermission('terr_field_witness') && isViewAllowed(userRole, 'testigo_campo') && isViewAllowedForModule(authUser?.moduleName, 'testigo_campo') && (
                  <button
                    onClick={() => {
                      onSelectView('testigo_campo');
                      if (onCloseMobile) onCloseMobile();
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      currentView === 'testigo_campo'
                        ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md shadow-emerald-950/40 border border-emerald-400/50'
                        : 'text-slate-300 hover:text-white hover:bg-emerald-500/10'
                    }`}
                  >
                    <div className={`shrink-0 transition-transform ${currentView === 'testigo_campo' ? 'scale-110 text-white' : 'text-emerald-400'}`}>
                      <ClipboardList className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-left truncate">
                      <div className="tracking-wide text-white">Testigos en Campo</div>
                      <div className="text-[10px] text-emerald-300/80 font-normal">Día E: Reportes y E-14</div>
                    </div>
                  </button>
                )}

                {hasPermission('terr_surveys') && isViewAllowed(userRole, 'encuestas') && isViewAllowedForModule(authUser?.moduleName, 'encuestas') && (
                  <button
                    onClick={() => {
                      onSelectView('encuestas');
                      if (onCloseMobile) onCloseMobile();
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      currentView === 'encuestas'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-950/40 border border-blue-400/50'
                        : 'text-slate-300 hover:text-white hover:bg-blue-500/10'
                    }`}
                  >
                    <div className={`shrink-0 transition-transform ${currentView === 'encuestas' ? 'scale-110 text-white' : 'text-blue-400'}`}>
                      <BarChart3 className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="text-left truncate">
                      <div className="tracking-wide text-white">Módulo de Encuestas</div>
                      <div className="text-[10px] text-blue-300/80 font-normal">Estadísticas & Respuestas</div>
                    </div>
                  </button>
                )}

                {hasPermission('terr_table_witness') && isViewAllowed(userRole, 'jurado_campo') && isViewAllowedForModule(authUser?.moduleName, 'jurado_campo') && (
                  <button
                    onClick={() => {
                      onSelectView('jurado_campo');
                      if (onCloseMobile) onCloseMobile();
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      currentView === 'jurado_campo'
                        ? 'bg-gradient-to-r from-cyan-600 to-cyan-700 text-white shadow-md shadow-cyan-950/40 border border-cyan-400/50'
                        : 'text-slate-300 hover:text-white hover:bg-cyan-500/10'
                    }`}
                  >
                    <div className={`shrink-0 transition-transform ${currentView === 'jurado_campo' ? 'scale-110 text-white' : 'text-cyan-400'}`}>
                      <Users className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className="text-left truncate">
                      <div className="tracking-wide text-white">Jurados en Mesa</div>
                      <div className="text-[10px] text-cyan-300/80 font-normal">Padrón E-11, Conteo & E-14</div>
                    </div>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Control Electoral & QA */}
          {isViewAllowed(userRole, 'pruebas_electorales') && 
            isViewAllowedForModule(authUser?.moduleName, 'pruebas_electorales') && (
            <div>
              <p className="px-3 text-[10px] font-black uppercase tracking-wider text-rose-400/90 mb-2">
                Escrutinio & Testigos
              </p>
              <div className="space-y-1.5">
                {isViewAllowed(userRole, 'pruebas_electorales') && (
                  <button
                    onClick={() => {
                      onSelectView('pruebas_electorales');
                      if (onCloseMobile) onCloseMobile();
                    }}
                    className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                      currentView === 'pruebas_electorales'
                        ? 'bg-gradient-to-r from-teal-600 to-emerald-700 text-white shadow-lg shadow-teal-900/40 border border-teal-400/50'
                        : 'bg-teal-950/40 text-teal-300 border border-teal-500/30 hover:bg-teal-900/60 hover:text-white'
                    }`}
                  >
                    <div className="shrink-0 p-1 bg-teal-500/20 rounded-lg text-teal-300">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div className="text-left truncate">
                      <div className="tracking-wide text-white">QA & Pruebas Electorales</div>
                      <div className="text-[10px] text-teal-300/80 font-normal">Simulacro & Auditoría</div>
                    </div>
                  </button>
                )}
              </div>
            </div>
          )}


          {/* Administrative Functions Group */}
          {isViewAllowed(userRole, 'modulo_admin') && isViewAllowedForModule(authUser?.moduleName, 'modulo_admin') && (
            <div>
              <p className="px-3 text-[10px] font-black uppercase tracking-wider text-cyan-400/80 mb-2">
                Gestión Administrativa
              </p>
              <nav className="space-y-1">
                {adminMenuItems.filter(item => hasPermission(item.id)).map((item) => {
                  const isActive = currentView === 'modulo_admin' && adminTab === item.tab;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectView('modulo_admin');
                        if (item.tab && onSelectAdminTab) {
                          onSelectAdminTab(item.tab);
                        }
                        if (onCloseMobile) onCloseMobile();
                      }}
                      className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#006e62] text-white shadow-lg shadow-teal-900/40 border border-emerald-400/30'
                          : 'text-slate-300 hover:text-white hover:bg-cyan-500/10'
                      }`}
                    >
                      <div className={`shrink-0 transition-transform ${isActive ? 'scale-110 text-white' : 'text-slate-400'}`}>
                        {item.icon}
                      </div>
                      <span className="truncate tracking-wide">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          )}



          {/* Configuración */}
          {isViewAllowed(userRole, 'configuracion') && isViewAllowedForModule(authUser?.moduleName, 'configuracion') && (
            <div>
              <p className="px-3 text-[10px] font-black uppercase tracking-wider text-cyan-400/60 mb-2">
                Sistema
              </p>
              <button
                onClick={() => {
                  onSelectView('configuracion');
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  currentView === 'configuracion'
                    ? 'bg-[#006e62] text-white shadow-lg shadow-teal-900/40 border border-emerald-400/30'
                    : 'text-slate-300 hover:text-white hover:bg-cyan-500/10'
                }`}
              >
                <div className="shrink-0 text-slate-400">
                  <Settings className="w-4 h-4" />
                </div>
                <span className="truncate tracking-wide text-xs">Configuración</span>
              </button>
            </div>
          )}

        </div>

      </div>

      {/* System Security Profiles Badge Footer */}
      <div className="p-3.5 border-t border-cyan-500/15 bg-[#030e1f]/80 m-3 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div className="text-left text-xs overflow-hidden">
            <div className="font-bold text-white truncate">Acceso por Rol</div>
            <div className="text-[10px] text-emerald-400 font-medium font-mono truncate">
              {userRole === 'superadmin' ? 'Acceso Total (Root)' : `Limitado a ${userRole}`}
            </div>
          </div>
        </div>
      </div>
    </aside>
    </>
  );
};

