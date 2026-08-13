import React, { useState, useEffect, useRef } from 'react';
import { ViewMode, AuthUser } from '../types';
import { CampaignLogoBadge } from './common/CampaignLogoIcon';
import { isViewAllowed, isViewAllowedForModule } from '../utils/rolePermissions';
import {
  Bot,
  LayoutDashboard,
  User,
  Bell,
  Clock,
  Settings,
  LogOut,
  MapPin,
  Shield,
  CreditCard,
  Layers,
  Sparkles,
  Menu,
  FileText,
  BarChart3,
  Users
} from 'lucide-react';

interface HeaderProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  unreadNotifications: number;
  onClearNotifications?: () => void;
  authUser?: AuthUser | null;
  onLogout?: () => void;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onSelectView,
  unreadNotifications,
  onClearNotifications,
  authUser,
  onLogout,
  onToggleSidebar
}) => {
  const [time, setTime] = useState('01:28:57');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Nueva encuesta de intención de voto cargada en Gestión Territorial', time: 'Hace 5 min', read: false },
    { id: 2, text: 'Ober Osorio envió un comando de análisis al Centro de Control', time: 'Hace 15 min', read: false },
    { id: 3, text: 'Alerta: Posible abstención detectada en Comuna 4 (Aranjuez)', time: 'Hace 1 hora', read: false }
  ]);

  const [candidatePhoto, setCandidatePhoto] = useState<string | null>(() => {
    return localStorage.getItem('candidate_photo');
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Sync new notifications when unreadCount increases in parent
  useEffect(() => {
    const unreadLocal = notifications.filter(n => !n.read).length;
    if (unreadNotifications > unreadLocal) {
      const diff = unreadNotifications - unreadLocal;
      const newNotifs = Array.from({ length: diff }).map((_, i) => ({
        id: Date.now() + i,
        text: 'Nueva alerta del Centro de Comando IA: Se procesó un comando de análisis territorial.',
        time: 'Hace un momento',
        read: false
      }));
      setNotifications(prev => [...newNotifs, ...prev]);
    } else if (unreadNotifications === 0 && unreadLocal > 0) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  }, [unreadNotifications]);

  // Click outside listener for notification popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    if (onClearNotifications) {
      onClearNotifications();
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        localStorage.setItem('candidate_photo', base64String);
        setCandidatePhoto(base64String);
        window.dispatchEvent(new Event('candidate_photo_updated'));
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'OO';
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString('es-ES', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const allViews: { id: ViewMode; title: string; subtitle: string; icon: React.ReactNode; color: string }[] = [
    {
      id: 'gestion_estrategica',
      title: 'Diagnóstico & Perfil',
      subtitle: 'Auditoría 360°, CV & DOFA',
      icon: <Bot className="w-4 h-4" />,
      color: 'from-emerald-500 to-teal-600'
    },
    {
      id: 'modulo_admin',
      title: 'Gestión Administrativa',
      subtitle: 'Resumen, Roles & Cuotas',
      icon: <LayoutDashboard className="w-4 h-4" />,
      color: 'from-cyan-500 to-teal-600'
    },

    {
      id: 'gestion_territorial',
      title: 'Gestión Territorial',
      subtitle: 'Mapa de Calor & Puestos',
      icon: <MapPin className="w-4 h-4" />,
      color: 'from-amber-500 to-teal-600'
    },
    {
      id: 'testigo_campo',
      title: 'Testigo de Campo (Día E)',
      subtitle: 'Reportes de Mesa, Participación y E-14',
      icon: <FileText className="w-4 h-4" />,
      color: 'from-emerald-500 to-teal-600'
    },
    {
      id: 'encuestas',
      title: 'Módulo de Encuestas',
      subtitle: 'Respuestas, Estadísticas y Toma de Datos',
      icon: <BarChart3 className="w-4 h-4" />,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'jurado_campo',
      title: 'Módulo de Jurados de Mesa',
      subtitle: 'Instalación de Mesa, Padrón E-11, Conteo y Acta E-14',
      icon: <Users className="w-4 h-4" />,
      color: 'from-cyan-500 to-blue-600'
    },

    {
      id: 'presupuesto',
      title: 'Presupuesto y CNE',
      subtitle: 'Gastos, OCR & Cuentas',
      icon: <CreditCard className="w-4 h-4" />,
      color: 'from-emerald-600 to-cyan-600'
    },

    {
      id: 'configuracion',
      title: 'Configuración del Sistema',
      subtitle: 'IA, API & Seguridad',
      icon: <Settings className="w-4 h-4" />,
      color: 'from-cyan-600 to-teal-500'
    }
  ];

  const userRole = authUser?.role || 'superadmin';
  const allowedViews = allViews.filter(v => isViewAllowed(userRole, v.id) && isViewAllowedForModule(authUser?.moduleName, v.id));
  const currentViewData = allViews.find(v => v.id === currentView) || allowedViews[0] || allViews[0];

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-b from-[#08152e] to-[#040e21] border-b border-cyan-500/25 text-white px-3 py-3 sm:px-6 sm:py-4 md:py-5 shadow-2xl backdrop-blur-2xl transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

        {/* Left Side: Brand Logo + Active View Title & Role Pill */}
        <div className="flex items-center gap-4 sm:gap-6">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="md:hidden p-2.5 rounded-xl bg-[#0a1833] hover:bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 transition-all cursor-pointer mr-0.5 shrink-0"
              title="Abrir menú"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <div className="flex items-center gap-3.5">
            <CampaignLogoBadge size="md" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-xs sm:text-base md:text-xl tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent truncate max-w-[85px] xs:max-w-[130px] sm:max-w-none">
                  Campaña Ganadora IA
                </h1>
                <span className="text-[9px] sm:text-xs bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.5 sm:px-2.5 rounded-full font-bold uppercase tracking-wider shrink-0">
                  {userRole === 'admin' ? 'ADMIN' : userRole === 'estrategico' ? 'ESTRATÉGICO' : userRole === 'territorial' ? 'TERRITORIAL' : userRole}
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-cyan-200/90 flex items-center gap-1.5 mt-0.5 min-w-0">
                <span className="font-semibold text-white truncate max-w-[90px] xs:max-w-none">{currentViewData.title}</span>
                <span className="text-cyan-500/40 shrink-0">•</span>
                <span className="text-cyan-300/80 truncate max-w-[90px] xs:max-w-none hidden xs:inline">{currentViewData.subtitle}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Status Controls */}
        <div className="flex items-center gap-3.5">
          {/* Live Timer */}
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0a1833] border border-cyan-500/40 text-cyan-300 text-xs font-mono shadow-md font-bold">
            <Clock className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span>{time}</span>
          </div>

          {/* Notifications */}
          <div className="relative" ref={popoverRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl bg-[#0a1833] hover:bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 transition-all cursor-pointer shadow-md"
            >
              <Bell className="w-4 h-4 text-cyan-300" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                  {unreadNotifications}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3.5 w-80 bg-slate-900/95 border border-cyan-500/35 rounded-2xl p-4 shadow-2xl backdrop-blur-xl z-50 text-left space-y-3">
                <div className="flex items-center justify-between border-b border-cyan-500/10 pb-2">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">Notificaciones</h3>
                  {unreadNotifications > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-[10px] text-cyan-400 hover:text-cyan-200 font-black uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Marcar leídas
                    </button>
                  )}
                </div>
                <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">No hay notificaciones</p>
                  ) : (
                    notifications.map(notif => (
                      <div 
                        key={notif.id} 
                        className={`p-2.5 rounded-xl border transition-all ${
                          notif.read 
                            ? 'bg-slate-950/40 border-slate-800 text-slate-400' 
                            : 'bg-cyan-500/10 border-cyan-500/25 text-slate-200'
                        }`}
                      >
                        <p className="text-xs font-medium leading-relaxed">{notif.text}</p>
                        <span className="text-[9px] text-cyan-500/60 mt-1.5 block font-mono font-semibold">{notif.time}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-3.5 pl-3 border-l border-cyan-500/20">
            {candidatePhoto ? (
              <div className="relative group cursor-pointer w-10 h-10 shrink-0">
                <img
                  src={candidatePhoto}
                  alt={authUser?.name || "Usuario"}
                  className="w-10 h-10 rounded-full border-2 border-emerald-400 object-cover shadow-lg shadow-emerald-950/50 transition-all duration-300 group-hover:border-cyan-300"
                  onClick={() => fileInputRef.current?.click()}
                  loading="lazy"
                  decoding="async"
                  width={40}
                  height={40}
                />
                <div 
                  className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <span className="text-[8px] text-cyan-300 font-black uppercase tracking-widest text-center leading-none">Subir</span>
                </div>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-10 h-10 rounded-full border-2 border-cyan-500/40 bg-[#0a1833]/80 hover:bg-cyan-500/20 text-cyan-300 hover:text-cyan-100 flex items-center justify-center font-black text-sm tracking-wider shadow-lg transition-all shrink-0 cursor-pointer"
                title="Subir foto del candidato"
              >
                {getInitials(authUser?.name)}
              </button>
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"
              className="hidden"
            />
            <div className="hidden md:block text-left text-xs space-y-0.5">
              <div className="font-bold text-sm text-slate-100 leading-tight truncate max-w-[150px]">
                {authUser?.name || 'Usuario Autenticado'}
              </div>
              <div className="text-[11px] text-emerald-400 font-semibold tracking-wide">
                {authUser?.roleName || authUser?.moduleName || 'Rol Activo'}
              </div>
            </div>

            {onLogout && (
              <button
                onClick={onLogout}
                title="Cerrar Sesión"
                className="ml-2 px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/45 text-rose-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs font-extrabold shadow-md shadow-rose-950/40 active:scale-[0.98]"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Cerrar Sesión</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
