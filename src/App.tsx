import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ViewMode, 
  ChatMessage, 
  CalendarEvent, 
  E14Record, 
  BankTransaction, 
  GeofenceAlert, 
  TerritorialZone, 
  TweetPost,
  AuthUser 
} from './types';
import { 
  initialChatMessages, 
  initialTweets, 
  candidateTweets as initialCandidateTweets, 
  initialCalendarEvents, 
  initialE14Records, 
  initialBankTransactions, 
  initialGeofenceAlerts, 
  initialTerritorialZones 
} from './data/initialData';
import {
  subscribeTerritorialZones,
  subscribeE14Records,
  subscribeCalendarEvents,
  subscribeBankTransactions,
  addCalendarEventDoc,
  addBankTransactionDoc
} from './lib/firestoreService';
import { isViewAllowed, getDefaultViewForRole, isViewAllowedForModule, getDefaultViewForRoleAndModule } from './utils/rolePermissions';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { RedSunBeeCampaignLanding } from './components/RedSunBeeCampaignLanding';

const PrimeraInterfaz = React.lazy(() => import('./components/views/PrimeraInterfaz').then(m => ({ default: m.PrimeraInterfaz })));
const ModuloAdministrativo = React.lazy(() => import('./components/views/ModuloAdministrativo').then(m => ({ default: m.ModuloAdministrativo })));
const GestionEstrategica = React.lazy(() => import('./components/views/GestionEstrategica').then(m => ({ default: m.GestionEstrategica })));
const GestionTerritorial = React.lazy(() => import('./components/views/GestionTerritorial').then(m => ({ default: m.GestionTerritorial })));
const PresupuestoContabilidad = React.lazy(() => import('./components/views/PresupuestoContabilidad').then(m => ({ default: m.PresupuestoContabilidad })));
const ConfiguracionView = React.lazy(() => import('./components/views/ConfiguracionView').then(m => ({ default: m.ConfiguracionView })));
const PruebasElectoralesView = React.lazy(() => import('./components/views/PruebasElectoralesView').then(m => ({ default: m.PruebasElectoralesView })));
const TestigoCampoView = React.lazy(() => import('./components/views/TestigoCampoView').then(m => ({ default: m.TestigoCampoView })));
const EncuestasView = React.lazy(() => import('./components/views/EncuestasView').then(m => ({ default: m.EncuestasView })));
const JuradoCampoView = React.lazy(() => import('./components/views/JuradoCampoView').then(m => ({ default: m.JuradoCampoView })));

import { Modals } from './components/common/Modals';
import { ShieldAlert, ArrowRight, Lock } from 'lucide-react';

// iOS Spring Physics Configuration
const iosSpring = {
  type: 'spring',
  stiffness: 380,
  damping: 32,
  mass: 0.8
};

export default function App() {
  const [appMode, setAppMode] = useState<'landing' | 'dashboard'>('landing');
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [currentView, setCurrentView] = useState<ViewMode>('primera_interfaz');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminTab, setAdminTab] = useState<string>('inicio');
  const [strategicTab, setStrategicTab] = useState<string>('diagnostico');
  const [territorialSubTab, setTerritorialSubTab] = useState<'registro' | 'mapa'>('registro');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(initialCalendarEvents);
  const [e14Records, setE14Records] = useState<E14Record[]>(initialE14Records);
  const [transactions, setTransactions] = useState<BankTransaction[]>(initialBankTransactions);
  const [geofenceAlerts] = useState<GeofenceAlert[]>(initialGeofenceAlerts);
  const [zones, setZones] = useState<TerritorialZone[]>(initialTerritorialZones);

  // Firestore Real-Time Subscriptions (only when authenticated)
  useEffect(() => {
    if (!authUser) return;

    const unsubZones = subscribeTerritorialZones(setZones);
    const unsubE14 = subscribeE14Records(setE14Records);
    const unsubEvents = subscribeCalendarEvents(setCalendarEvents);
    const unsubTx = subscribeBankTransactions(setTransactions);

    return () => {
      unsubZones();
      unsubE14();
      unsubEvents();
      unsubTx();
    };
  }, [authUser]);

  // Clickjacking (frame-busting) protection
  useEffect(() => {
    if (window.self !== window.top) {
      try {
        window.top!.location.href = window.self.location.href;
      } catch (e) {
        console.error('Frame busting blocked:', e);
      }
    }
  }, []);

  // DevTools inspection & right-click prevention for high security
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Block F12
      if (e.key === 'F12') {
        e.preventDefault();
      }
      // Block Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
      if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C' || e.key === 'i' || e.key === 'j' || e.key === 'c')) {
        e.preventDefault();
      }
      // Block Cmd+Opt+I (Mac)
      if (e.metaKey && e.altKey && (e.key === 'i' || e.key === 'I')) {
        e.preventDefault();
      }
      // Block Ctrl+U (View Source)
      if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
      }
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Inactivity Session Timeout (15 minutes of inactivity triggers logout)
  useEffect(() => {
    if (!authUser) return;

    let timeoutId: any;

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      // 15 minutes = 900,000 ms
      timeoutId = setTimeout(() => {
        handleLogout();
        alert('Sesión cerrada automáticamente por motivos de seguridad debido a inactividad (15 minutos).');
      }, 900000);
    };

    const events = ['mousemove', 'keydown', 'mousedown', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [authUser]);

  // Modals state
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedE14, setSelectedE14] = useState<E14Record | null>(null);
  const [unreadCount, setUnreadCount] = useState(3);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Login Handler with Role Routing
  const handleLoginSuccess = (user: AuthUser, route: ViewMode) => {
    setAuthUser(user);
    const initialRoute = (isViewAllowed(user.role, route) && isViewAllowedForModule(user.moduleName, route))
      ? route 
      : getDefaultViewForRoleAndModule(user.role, user.moduleName);
    setCurrentView(initialRoute);
    setSidebarOpen(false);
  };

  // Logout Handler
  const handleLogout = () => {
    setAuthUser(null);
    setCurrentView('primera_interfaz');
    setSidebarOpen(false);
    setAppMode('landing');
  };

  // Handle User Chat Input in Centro de Comando AI
  const handleSendMessage = (text: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: authUser ? authUser.name : 'Santiago Pérez',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      text,
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);

    // Simulated AI Assistant Intelligent Reply
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'AI Assistant',
        role: 'assistant',
        avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
        text: `Procesando comando: "${text}". He analizado los datos territoriales y actualizado las prioridades electorales.`,
        actions: [
          { label: 'Ver Impacto', action: 'view_impact' },
          { label: 'Crear Evento', action: 'create_event' }
        ],
        timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, aiResponse]);
      setUnreadCount(prev => prev + 1);
    }, 1200);
  };

  // Handle Quick Action Tags in Chat Messages
  const handleActionClick = (action: string, context?: string) => {
    if (action === 'create_event') {
      setActiveModal('add_event');
    } else if (action === 'convert_task') {
      if (isViewAllowed(authUser?.role, 'modulo_admin') && isViewAllowedForModule(authUser?.moduleName, 'modulo_admin')) {
        setCurrentView('modulo_admin');
      }
    } else if (action === 'analyze' || action === 'view_impact') {
      if (isViewAllowed(authUser?.role, 'gestion_estrategica') && isViewAllowedForModule(authUser?.moduleName, 'gestion_estrategica')) {
        setCurrentView('gestion_estrategica');
      }
    } else if (action === 'save') {
      alert(`Guardado en el repositorio de la campaña: "${context?.slice(0, 40)}..."`);
    }
  };

  const handleAddCalendarEvent = (newEvent: CalendarEvent) => {
    addCalendarEventDoc(newEvent).catch(err => console.error("Error saving event:", err));
  };

  const handleAddTransaction = (newTx: BankTransaction) => {
    addBankTransactionDoc(newTx).catch(err => console.error("Error saving transaction:", err));
  };

  // LANDING PAGE MODE:
  if (appMode === 'landing') {
    return (
      <div className="relative min-h-screen bg-[#030712] text-slate-100 selection:bg-emerald-500 selection:text-white font-sans antialiased overflow-x-clip">
        <div className="relative z-10">
          <RedSunBeeCampaignLanding onLogin={() => setAppMode('dashboard')} />
        </div>
      </div>
    );
  }

  // UNAUTHENTICATED / PORTAL SESSION MODE:
  // Hide Panel de Control (Sidebar + Header) completely until logged in!
  if (!authUser) {
    return (
      <div className="min-h-screen bg-[#030712] font-sans antialiased text-slate-100 flex flex-col justify-center">
        <PrimeraInterfaz
          onLoginSuccess={handleLoginSuccess}
          onBackToLanding={() => setAppMode('landing')}
        />
      </div>
    );
  }

  // Check if current view is allowed for logged in user's role and module
  const allowed = isViewAllowed(authUser.role, currentView) && isViewAllowedForModule(authUser.moduleName, currentView);

  // AUTHENTICATED MODE:
  // Panel de Control (Sidebar + Header) is visible once logged in
  return (
    <div className="min-h-screen bg-[#020612] font-sans antialiased text-slate-100 flex overflow-x-hidden relative">
      
      {/* Left Navigation Sidebar (Panel de Control) */}
      <Sidebar
        currentView={currentView}
        onSelectView={setCurrentView}
        adminTab={adminTab}
        onSelectAdminTab={setAdminTab}
        strategicTab={strategicTab}
        onSelectStrategicTab={setStrategicTab}
        territorialSubTab={territorialSubTab}
        onSelectTerritorialSubTab={setTerritorialSubTab}
        onOpenUserRolesModal={() => setActiveModal('user_roles')}
        authUser={authUser}
        isOpen={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
      />

      {/* Right Main Panel Container with Parallax Stacking Depth Effect */}
      <motion.div
        animate={{
          scale: activeModal ? 0.95 : 1,
          filter: activeModal ? 'brightness(0.82) blur(0.5px)' : 'brightness(1) blur(0px)',
          borderRadius: activeModal ? '28px' : '0px'
        }}
        transition={iosSpring}
        className="flex-1 flex flex-col min-w-0 min-h-screen origin-center transition-all bg-[#030712] overflow-hidden"
      >
        
        {/* Top Global Navigation Bar (Panel de Control) */}
        <Header
          currentView={currentView}
          onSelectView={setCurrentView}
          unreadNotifications={unreadCount}
          onClearNotifications={() => setUnreadCount(0)}
          authUser={authUser}
          onLogout={handleLogout}
          onToggleSidebar={() => setSidebarOpen(prev => !prev)}
        />

        {/* Main View Router with Access Control Guard & Spatial Slide */}
        <div className="flex-1 relative overflow-hidden">
          {!allowed ? (
            <motion.div
              key="restricted"
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-20%', opacity: 0 }}
              transition={iosSpring}
              className="p-8 max-w-2xl mx-auto my-12 bg-slate-900/90 border border-rose-500/40 rounded-3xl text-center space-y-6 shadow-2xl"
            >
              <div className="w-16 h-16 bg-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center mx-auto border border-rose-500/40">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">Acceso Restringido</h2>
                <p className="text-slate-300 text-sm mt-2">
                  Su perfil actual (<strong className="text-emerald-400">{authUser.roleName}</strong>) o el módulo seleccionado no tiene privilegios para visualizar esta sección.
                </p>
              </div>
              <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>Usuario:</span>
                  <strong className="text-white">{authUser.name}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Rol Activo:</span>
                  <strong className="text-emerald-400 uppercase">{authUser.role}</strong>
                </div>
              </div>
              <button
                onClick={() => setCurrentView(getDefaultViewForRoleAndModule(authUser.role, authUser.moduleName))}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold text-sm hover:from-emerald-500 hover:to-teal-600 transition-all cursor-pointer shadow-lg shadow-emerald-950/50"
              >
                <span>Ir a mi Módulo Autorizado</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ x: '100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '-20%', opacity: 0 }}
                transition={iosSpring}
                className="w-full h-full"
              >
                <React.Suspense fallback={
                  <div className="flex items-center justify-center h-[calc(100vh-80px)] w-full">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin"></div>
                      <span className="text-cyan-400 font-mono text-xs tracking-wider uppercase animate-pulse">Cargando Módulo...</span>
                    </div>
                  </div>
                }>
                {currentView === 'primera_interfaz' && (
                  <PrimeraInterfaz
                    onLoginSuccess={handleLoginSuccess}
                  />
                )}


                {currentView === 'modulo_admin' && (
                  <ModuloAdministrativo
                    onSelectView={setCurrentView}
                    calendarEvents={calendarEvents}
                    onAddEventClick={() => setActiveModal('add_event')}
                    onOpenUserRolesModal={() => setActiveModal('user_roles')}
                    activeTab={adminTab}
                    onTabChange={setAdminTab}
                    authUser={authUser}
                  />
                )}

                {(currentView === 'gestion_estrategica' || currentView === 'agenda_electoral') && (
                  <GestionEstrategica
                    onSelectView={setCurrentView}
                    activeTab={currentView === 'agenda_electoral' ? 'agenda_electoral' : (strategicTab as any)}
                    onSelectTab={(tab) => {
                      setStrategicTab(tab);
                      if (currentView === 'agenda_electoral' && tab !== 'agenda_electoral') {
                        setCurrentView('gestion_estrategica');
                      }
                    }}
                    onOpenUpdateProfileModal={() => setCurrentView('configuracion')}
                    onOpenBudgetModal={() => setCurrentView('presupuesto')}
                  />
                )}

                {currentView === 'gestion_territorial' && (
                  <GestionTerritorial
                    onSelectView={setCurrentView}
                    zones={zones}
                    onOpenFieldRegistrationModal={() => setActiveModal('add_event')}
                    initialSubTab={territorialSubTab}
                    onSubTabChange={setTerritorialSubTab}
                    authUser={authUser}
                  />
                )}

                {currentView === 'testigo_campo' && (
                  <TestigoCampoView
                    onSelectView={setCurrentView}
                    authUser={authUser}
                  />
                )}

                {currentView === 'encuestas' && (
                  <EncuestasView
                    onSelectView={setCurrentView}
                    authUser={authUser}
                  />
                )}

                {currentView === 'jurado_campo' && (
                  <JuradoCampoView
                    onSelectView={setCurrentView}
                    authUser={authUser}
                  />
                )}

                {currentView === 'presupuesto' && (
                  <PresupuestoContabilidad
                    onSelectView={setCurrentView}
                    transactions={transactions}
                    onOpenAddTransactionModal={() => setActiveModal('add_tx')}
                    onOpenOCRModal={() => setActiveModal('ocr_scanner')}
                  />
                )}


                {currentView === 'pruebas_electorales' && (
                  <PruebasElectoralesView
                    onSelectView={setCurrentView}
                    authUser={authUser}
                  />
                )}

                {currentView === 'configuracion' && (
                  <ConfiguracionView
                    onSelectView={setCurrentView}
                  />
                )}
              </React.Suspense>
            </motion.div>
            </AnimatePresence>
          )}
        </div>
      </motion.div>

      {/* Interactive Global Modals */}
      <Modals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        selectedE14={selectedE14}
        onAddCalendarEvent={handleAddCalendarEvent}
        onAddTransaction={handleAddTransaction}
      />

    </div>
  );
}
