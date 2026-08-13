import React, { useState } from 'react';
import { ViewMode, BankTransaction, BudgetItem, FinancialRole } from '../../types';
import { 
  UploadCloud, 
  CheckCircle2, 
  Clock, 
  Plus, 
  FileText, 
  Download, 
  Search, 
  DollarSign, 
  Sparkles,
  ShieldCheck,
  Lock,
  Unlock,
  AlertTriangle,
  Layers,
  Building2,
  FileSpreadsheet,
  Award,
  Filter,
  CheckSquare,
  ChevronRight,
  Eye,
  PenSquare,
  Trash2,
  RefreshCw,
  HelpCircle
} from 'lucide-react';

interface PresupuestoContabilidadProps {
  onSelectView?: (view: ViewMode) => void;
  transactions?: BankTransaction[];
  onOpenAddTransactionModal?: () => void;
  onOpenOCRModal?: () => void;
}

// Initial Colombia CNE Compliant Budget Items
const initialBudgetItems: BudgetItem[] = [
  // INGRESOS
  {
    id: 'it-101',
    codigoRubro: '101',
    nombreRubro: 'Aportes Propios del Candidato',
    nombre: 'Aporte de Capital Propio del Candidato Javier Méndez',
    tipo: 'Ingreso',
    centroCosto: 'Administración & Sedes',
    montoAsignado: 350000000,
    montoEjecutado: 350000000,
    estado: 'Auditado CNE',
    terceroNombre: 'Javier Méndez (Candidato)',
    terceroNit: 'CC 71.345.890',
    facturaNumero: 'REC-001-2026',
    fechaRegistro: '2026-02-10'
  },
  {
    id: 'it-102',
    codigoRubro: '102',
    nombreRubro: 'Créditos Entidades Financieras',
    nombre: 'Crédito Aprobado Banco de Bogotá para Campaña',
    tipo: 'Ingreso',
    centroCosto: 'Administración & Sedes',
    montoAsignado: 500000000,
    montoEjecutado: 400000000,
    estado: 'Soportado OCR',
    terceroNombre: 'Banco de Bogotá S.A.',
    terceroNit: 'NIT 860.002.964-4',
    facturaNumero: 'PAG-883920',
    fechaRegistro: '2026-02-25'
  },
  {
    id: 'it-103',
    codigoRubro: '103',
    nombreRubro: 'Donaciones de Particulares',
    nombre: 'Aporte Donación Simpatizantes Sector Empresarial Medellín',
    tipo: 'Ingreso',
    centroCosto: 'Eventos & Logística',
    montoAsignado: 250000000,
    montoEjecutado: 180000000,
    estado: 'Aprobado',
    terceroNombre: 'Asociación de Comercio Local',
    terceroNit: 'NIT 900.123.456-1',
    facturaNumero: 'DON-044',
    fechaRegistro: '2026-03-01'
  },
  {
    id: 'it-104',
    codigoRubro: '104',
    nombreRubro: 'Aportes del Partido / Coalición',
    nombre: 'Transferencia Fondo Electoral Partido Unidos por el Futuro',
    tipo: 'Ingreso',
    centroCosto: 'Comunicaciones & Pauta',
    montoAsignado: 150000000,
    montoEjecutado: 150000000,
    estado: 'Auditado CNE',
    terceroNombre: 'Partido Unidos por el Futuro',
    terceroNit: 'NIT 800.999.111-0',
    facturaNumero: 'TRF-PAR-90',
    fechaRegistro: '2026-01-20'
  },

  // GASTOS
  {
    id: 'it-201',
    codigoRubro: '201',
    nombreRubro: 'Gastos de Administración',
    nombre: 'Arriendo Sede Principal de Campaña Medellín y Servicios',
    tipo: 'Gasto',
    centroCosto: 'Administración & Sedes',
    montoAsignado: 85000000,
    montoEjecutado: 62000000,
    estado: 'Soportado OCR',
    terceroNombre: 'Inmobiliaria El Poblado S.A.S.',
    terceroNit: 'NIT 900.444.222-3',
    facturaNumero: 'FE-10928',
    fechaRegistro: '2026-03-05'
  },
  {
    id: 'it-202',
    codigoRubro: '202',
    nombreRubro: 'Propaganda Electoral y Publicidad',
    nombre: 'Impresión de Volantes, Pauta Meta Ads y Vallas Led Comunas 1 a 16',
    tipo: 'Gasto',
    centroCosto: 'Comunicaciones & Pauta',
    montoAsignado: 380000000,
    montoEjecutado: 290000000,
    estado: 'Auditado CNE',
    terceroNombre: 'Agencia Medios & Publicidad Digital S.A.S.',
    terceroNit: 'NIT 830.555.777-9',
    facturaNumero: 'FE-4482',
    fechaRegistro: '2026-03-12'
  },
  {
    id: 'it-203',
    codigoRubro: '203',
    nombreRubro: 'Actos Públicos y Eventos',
    nombre: 'Montaje de Tarima, Sonido y Logística Gran Evento Plaza de Botero',
    tipo: 'Gasto',
    centroCosto: 'Eventos & Logística',
    montoAsignado: 190000000,
    montoEjecutado: 145000000,
    estado: 'Aprobado',
    terceroNombre: 'Eventos & Producciones Colombia S.A.S.',
    terceroNit: 'NIT 901.222.333-8',
    facturaNumero: 'FE-8812',
    fechaRegistro: '2026-03-20'
  },
  {
    id: 'it-204',
    codigoRubro: '204',
    nombreRubro: 'Transporte y Movilización',
    nombre: 'Alquiler de Buses y Transporte de Voluntarios Recorridos Comunas',
    tipo: 'Gasto',
    centroCosto: 'Operación Territorial',
    montoAsignado: 120000000,
    montoEjecutado: 85000000,
    estado: 'Soportado OCR',
    terceroNombre: 'Transportes Especiales del Norte S.A.',
    terceroNit: 'NIT 890.111.222-5',
    facturaNumero: 'FE-3310',
    fechaRegistro: '2026-03-22'
  },
  {
    id: 'it-205',
    codigoRubro: '205',
    nombreRubro: 'Capacitación Electoral y Testigos',
    nombre: 'Kit de Acreditación, Alimentación y Capacitación 240 Testigos Día E',
    tipo: 'Gasto',
    centroCosto: 'Operación Día E',
    montoAsignado: 160000000,
    montoEjecutado: 110000000,
    estado: 'Pendiente Aprobación',
    terceroNombre: 'Proveedor Logística Electoral S.A.S.',
    terceroNit: 'NIT 900.888.777-6',
    facturaNumero: 'FE-9011',
    fechaRegistro: '2026-03-28'
  },
  {
    id: 'it-206',
    codigoRubro: '206',
    nombreRubro: 'Gastos de Financiamiento',
    nombre: 'Comisiones Bancarias y Cuotas de Manejo Cuenta Única de Campaña',
    tipo: 'Gasto',
    centroCosto: 'Administración & Sedes',
    montoAsignado: 15000000,
    montoEjecutado: 8000000,
    estado: 'Auditado CNE',
    terceroNombre: 'Banco de Bogotá S.A.',
    terceroNit: 'NIT 860.002.964-4',
    facturaNumero: 'EST-MAR-2026',
    fechaRegistro: '2026-03-31'
  }
];

export const PresupuestoContabilidad: React.FC<PresupuestoContabilidadProps> = ({
  onSelectView,
  transactions = [],
  onOpenAddTransactionModal,
  onOpenOCRModal
}) => {
  // Master Active Sub-Tab
  const [activeSubTab, setActiveSubTab] = useState<'oficial_cne' | 'borrador_estrategico' | 'gestion_items' | 'permisos_rbac' | 'ocr_scanner'>('oficial_cne');

  // RBAC Role State
  const [activeFinancialRole, setActiveFinancialRole] = useState<FinancialRole>('tesorero');
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);

  // Budget Items State
  const [items, setItems] = useState<BudgetItem[]>(initialBudgetItems);
  const [typeFilter, setTypeFilter] = useState<'Todos' | 'Ingreso' | 'Gasto'>('Todos');
  const [centroCostoFilter, setCentroCostoFilter] = useState<string>('Todos');
  const [statusFilter, setStatusFilter] = useState<string>('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Draft Simulator States
  const [selectedCorporation, setSelectedCorporation] = useState<'Alcaldía' | 'Gobernación' | 'Concejo' | 'Asamblea' | 'Ediles'>('Alcaldía');
  const [selectedScenario, setSelectedScenario] = useState<'Pesimista' | 'Base' | 'Optimista'>('Base');
  const [pctPauta, setPctPauta] = useState<number>(35);
  const [pctEventos, setPctEventos] = useState<number>(25);
  const [pctDiaE, setPctDiaE] = useState<number>(20);
  const [pctAdmin, setPctAdmin] = useState<number>(12);
  const [pctJuridico, setPctJuridico] = useState<number>(8);
  const [draftApproved, setDraftApproved] = useState(false);

  // Item Add/Edit Modal
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null);
  const [formCodigoRubro, setFormCodigoRubro] = useState('202');
  const [formNombre, setFormNombre] = useState('');
  const [formTipo, setFormTipo] = useState<'Ingreso' | 'Gasto'>('Gasto');
  const [formCentroCosto, setFormCentroCosto] = useState<BudgetItem['centroCosto']>('Comunicaciones & Pauta');
  const [formMontoAsignado, setFormMontoAsignado] = useState<number>(10000000);
  const [formMontoEjecutado, setFormMontoEjecutado] = useState<number>(0);
  const [formTerceroNombre, setFormTerceroNombre] = useState('');
  const [formTerceroNit, setFormTerceroNit] = useState('');
  const [formFacturaNumero, setFormFacturaNumero] = useState('');

  // CNE Legal Limits Map (COP)
  const cneLimits = {
    Alcaldía: 1250000000,
    Gobernación: 3500000000,
    Concejo: 450000000,
    Asamblea: 950000000,
    Ediles: 120000000
  };

  const currentLimit = cneLimits[selectedCorporation];

  // Calculated totals
  const totalIngresosAsignados = items.filter(i => i.tipo === 'Ingreso').reduce((acc, curr) => acc + curr.montoAsignado, 0);
  const totalIngresosEjecutados = items.filter(i => i.tipo === 'Ingreso').reduce((acc, curr) => acc + curr.montoEjecutado, 0);

  const totalGastosAsignados = items.filter(i => i.tipo === 'Gasto').reduce((acc, curr) => acc + curr.montoAsignado, 0);
  const totalGastosEjecutados = items.filter(i => i.tipo === 'Gasto').reduce((acc, curr) => acc + curr.montoEjecutado, 0);

  const saldoDisponibleCNE = currentLimit - totalGastosEjecutados;
  const pctEjecutadoTope = Math.min(100, Math.round((totalGastosEjecutados / currentLimit) * 100));

  // Role Permissions Helper
  const checkPermission = (action: 'approve_draft' | 'modify_limits' | 'add_expense' | 'validate_ocr' | 'sign_cne'): boolean => {
    switch (activeFinancialRole) {
      case 'candidato':
        return action === 'approve_draft';
      case 'tesorero':
        return action === 'add_expense' || action === 'validate_ocr';
      case 'contador':
        return action === 'add_expense' || action === 'validate_ocr' || action === 'sign_cne';
      case 'gerente':
        return action === 'approve_draft' || action === 'modify_limits' || action === 'add_expense';
      case 'auditor':
        return false; // read only
      default:
        return false;
    }
  };

  const handleGuardedAction = (action: 'approve_draft' | 'modify_limits' | 'add_expense' | 'validate_ocr' | 'sign_cne', callback: () => void) => {
    if (checkPermission(action)) {
      callback();
    } else {
      alert(`⚠️ Acción Denegada por Seguridad RBAC\n\nEl rol actualmente seleccionado [${activeFinancialRole.toUpperCase()}] no tiene atribuciones habilitadas para realizar esta acción.\n\nCambie su rol en el panel superior si posee la acreditación correspondiente (ej. Tesorero Oficial o Contador CNE).`);
    }
  };

  // Open Create Item Modal
  const handleOpenCreateModal = () => {
    handleGuardedAction('add_expense', () => {
      setEditingItem(null);
      setFormCodigoRubro('202');
      setFormNombre('');
      setFormTipo('Gasto');
      setFormCentroCosto('Comunicaciones & Pauta');
      setFormMontoAsignado(15000000);
      setFormMontoEjecutado(0);
      setFormTerceroNombre('');
      setFormTerceroNit('');
      setFormFacturaNumero('');
      setShowItemModal(true);
    });
  };

  // Open Edit Item Modal
  const handleOpenEditModal = (item: BudgetItem) => {
    handleGuardedAction('add_expense', () => {
      setEditingItem(item);
      setFormCodigoRubro(item.codigoRubro);
      setFormNombre(item.nombre);
      setFormTipo(item.tipo);
      setFormCentroCosto(item.centroCosto);
      setFormMontoAsignado(item.montoAsignado);
      setFormMontoEjecutado(item.montoEjecutado);
      setFormTerceroNombre(item.terceroNombre || '');
      setFormTerceroNit(item.terceroNit || '');
      setFormFacturaNumero(item.facturaNumero || '');
      setShowItemModal(true);
    });
  };

  // Save Item Handler
  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNombre.trim()) {
      alert('Por favor ingrese el nombre o concepto del ítem de presupuesto.');
      return;
    }

    const rubroNames: Record<string, string> = {
      '101': 'Aportes Propios del Candidato',
      '102': 'Créditos Entidades Financieras',
      '103': 'Donaciones de Particulares',
      '104': 'Aportes del Partido / Coalición',
      '201': 'Gastos de Administración',
      '202': 'Propaganda Electoral y Publicidad',
      '203': 'Actos Públicos y Eventos',
      '204': 'Transporte y Movilización',
      '205': 'Capacitación Electoral y Testigos',
      '206': 'Gastos de Financiamiento'
    };

    if (editingItem) {
      setItems(prev => prev.map(item => item.id === editingItem.id ? {
        ...item,
        codigoRubro: formCodigoRubro,
        nombreRubro: rubroNames[formCodigoRubro] || 'Rubro CNE',
        nombre: formNombre,
        tipo: formTipo,
        centroCosto: formCentroCosto,
        montoAsignado: Number(formMontoAsignado),
        montoEjecutado: Number(formMontoEjecutado),
        terceroNombre: formTerceroNombre,
        terceroNit: formTerceroNit,
        facturaNumero: formFacturaNumero,
        estado: formMontoEjecutado > 0 ? 'Soportado OCR' : 'Aprobado'
      } : item));
    } else {
      const newItem: BudgetItem = {
        id: 'it-' + Date.now(),
        codigoRubro: formCodigoRubro,
        nombreRubro: rubroNames[formCodigoRubro] || 'Rubro CNE',
        nombre: formNombre,
        tipo: formTipo,
        centroCosto: formCentroCosto,
        montoAsignado: Number(formMontoAsignado),
        montoEjecutado: Number(formMontoEjecutado),
        estado: 'Aprobado',
        terceroNombre: formTerceroNombre,
        terceroNit: formTerceroNit,
        facturaNumero: formFacturaNumero,
        fechaRegistro: new Date().toISOString().split('T')[0]
      };
      setItems(prev => [newItem, ...prev]);
    }

    setShowItemModal(false);
  };

  // Delete Item
  const handleDeleteItem = (id: string) => {
    handleGuardedAction('add_expense', () => {
      if (confirm('¿Está seguro de eliminar este ítem del presupuesto oficial?')) {
        setItems(prev => prev.filter(i => i.id !== id));
      }
    });
  };

  // Load Preset Template for Draft
  const handleLoadDraftTemplate = () => {
    const scenarioMultiplier = selectedScenario === 'Pesimista' ? 0.40 : selectedScenario === 'Base' ? 0.75 : 0.95;
    const baseAmount = currentLimit * scenarioMultiplier;

    const newDraftItems: BudgetItem[] = [
      {
        id: 'drf-1',
        codigoRubro: '202',
        nombreRubro: 'Propaganda Electoral y Publicidad',
        nombre: `[Borrador ${selectedCorporation}] Pauta Digital, Vallas y Materiales Impresos`,
        tipo: 'Gasto',
        centroCosto: 'Comunicaciones & Pauta',
        montoAsignado: Math.round((baseAmount * pctPauta) / 100),
        montoEjecutado: 0,
        estado: 'Borrador',
        fechaRegistro: new Date().toISOString().split('T')[0]
      },
      {
        id: 'drf-2',
        codigoRubro: '203',
        nombreRubro: 'Actos Públicos y Eventos',
        nombre: `[Borrador ${selectedCorporation}] Eventos de Lanzamiento, Tarimas y Sonido`,
        tipo: 'Gasto',
        centroCosto: 'Eventos & Logística',
        montoAsignado: Math.round((baseAmount * pctEventos) / 100),
        montoEjecutado: 0,
        estado: 'Borrador',
        fechaRegistro: new Date().toISOString().split('T')[0]
      },
      {
        id: 'drf-3',
        codigoRubro: '205',
        nombreRubro: 'Capacitación Electoral y Testigos',
        nombre: `[Borrador ${selectedCorporation}] Kits y Logística de Testigos Día E`,
        tipo: 'Gasto',
        centroCosto: 'Operación Día E',
        montoAsignado: Math.round((baseAmount * pctDiaE) / 100),
        montoEjecutado: 0,
        estado: 'Borrador',
        fechaRegistro: new Date().toISOString().split('T')[0]
      },
      {
        id: 'drf-4',
        codigoRubro: '201',
        nombreRubro: 'Gastos de Administración',
        nombre: `[Borrador ${selectedCorporation}] Arriendo Sedes y Servicios Administrativos`,
        tipo: 'Gasto',
        centroCosto: 'Administración & Sedes',
        montoAsignado: Math.round((baseAmount * pctAdmin) / 100),
        montoEjecutado: 0,
        estado: 'Borrador',
        fechaRegistro: new Date().toISOString().split('T')[0]
      },
      {
        id: 'drf-5',
        codigoRubro: '206',
        nombreRubro: 'Gastos de Financiamiento',
        nombre: `[Borrador ${selectedCorporation}] Asesoría Jurídica y Póliza de Cumplimiento CNE`,
        tipo: 'Gasto',
        centroCosto: 'Estrategia Jurídica',
        montoAsignado: Math.round((baseAmount * pctJuridico) / 100),
        montoEjecutado: 0,
        estado: 'Borrador',
        fechaRegistro: new Date().toISOString().split('T')[0]
      }
    ];

    setItems(prev => [...newDraftItems, ...prev.filter(i => i.estado !== 'Borrador')]);
    alert(`✅ Plantilla de Borrador cargada exitosamente para [${selectedCorporation} - Escenario ${selectedScenario}].\n\nPresupuesto Planificado Total: $${baseAmount.toLocaleString()} COP.`);
  };

  // Convert Draft to Official
  const handleApproveDraft = () => {
    handleGuardedAction('approve_draft', () => {
      setItems(prev => prev.map(item => item.estado === 'Borrador' ? { ...item, estado: 'Aprobado' } : item));
      setDraftApproved(true);
      alert('🎉 El Presupuesto Borrador ha sido aprobado formalmente y convertido en Presupuesto Oficial Ejecutable para Cuentas Claras CNE.');
    });
  };

  // Filtered Budget Items
  const filteredItems = items.filter(item => {
    const matchesType = typeFilter === 'Todos' || item.tipo === typeFilter;
    const matchesCentro = centroCostoFilter === 'Todos' || item.centroCosto === centroCostoFilter;
    const matchesStatus = statusFilter === 'Todos' || item.estado === statusFilter;
    const matchesSearch = item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.codigoRubro.includes(searchTerm) || 
                          (item.terceroNombre && item.terceroNombre.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesType && matchesCentro && matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-[calc(100vh-60px)] bg-slate-100 text-slate-800 p-4 md:p-8 space-y-6 animate-fadeIn">
      
      {/* Top Header Bar */}
      <div className="bg-[#1b2b48] text-white rounded-2xl p-5 shadow-xl border border-slate-700/50 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-amber-500/20 border border-amber-400/30 rounded-full text-[11px] text-amber-300 font-bold mb-1.5">
              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
              <span>Gestión Integral Financiera & Cuentas Claras CNE (Normatividad Vigente Colombia)</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>Presupuesto de Campaña & Rendición Oficial</span>
            </h2>
            <p className="text-xs text-slate-300 max-w-3xl mt-0.5">
              Programe el presupuesto borrador por centros de costos, audite la ejecución de topes legales del CNE y sincronice facturas con el escáner inteligente OCR.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1.5 bg-amber-500/20 text-amber-300 font-extrabold text-xs rounded-xl border border-amber-400/40">
              Tope CNE: ${currentLimit.toLocaleString()} COP
            </span>
            <button
              onClick={() => handleGuardedAction('sign_cne', () => alert('Generando paquete completo Cuentas Claras en formato PDF/XML oficial CNE...'))}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Exportar Cuentas Claras</span>
            </button>
          </div>
        </div>

        {/* Exclusive Financial Role Switcher (RBAC) */}
        <div className="bg-[#111e33] p-3 rounded-xl border border-cyan-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-bold text-slate-200">Rol Financiero Activo (RBAC):</span>
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-extrabold uppercase font-mono rounded border border-emerald-400/30">
              {activeFinancialRole}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1">
            {(['tesorero', 'contador', 'gerente', 'candidato', 'auditor'] as FinancialRole[]).map(role => (
              <button
                key={role}
                onClick={() => setActiveFinancialRole(role)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold capitalize transition-all cursor-pointer ${
                  activeFinancialRole === role
                    ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                }`}
              >
                {role}
              </button>
            ))}

            <button
              onClick={() => setShowPermissionsModal(true)}
              className="ml-2 text-[10px] text-cyan-300 hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <HelpCircle className="w-3 h-3" />
              <span>Ver Matriz de Permisos</span>
            </button>
          </div>
        </div>

        {/* Sub-Tabs Bar */}
        <div className="pt-2 border-t border-slate-700/60 flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'oficial_cne', label: '1. Presupuesto Oficial CNE & Cuentas Claras', icon: <Building2 className="w-4 h-4" /> },
            { id: 'borrador_estrategico', label: '2. Plantilla Borrador & Simulador', icon: <FileSpreadsheet className="w-4 h-4" /> },
            { id: 'gestion_items', label: '3. Gestión Integral de Ítems (' + items.length + ')', icon: <Layers className="w-4 h-4" /> },
            { id: 'ocr_scanner', label: '4. Escáner OCR & Comprobantes IA', icon: <Sparkles className="w-4 h-4 text-teal-300" /> },
            { id: 'permisos_rbac', label: '5. Permisos Exclusivos RBAC', icon: <Lock className="w-4 h-4 text-amber-300" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                activeSubTab === tab.id
                  ? 'bg-white text-slate-950 shadow-md font-extrabold scale-102'
                  : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* SUB-TAB 1: PRESUPUESTO OFICIAL CNE & RENDICIÓN DE CUENTAS CLARAS */}
      {/* ---------------------------------------------------------------------- */}
      {activeSubTab === 'oficial_cne' && (
        <div className="space-y-6">
          
          {/* Executive Legal Limit & Progress Meter */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-500 block">Tope Máximo CNE Ley 1475</span>
              <div className="text-2xl font-black text-slate-900">${currentLimit.toLocaleString()} COP</div>
              <span className="text-[10px] text-amber-800 bg-amber-100 font-bold px-2 py-0.5 rounded inline-block">
                Jurisdicción: {selectedCorporation} Medellín
              </span>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-500 block">Ingresos Recaudados y Validados</span>
              <div className="text-2xl font-black text-emerald-600">${totalIngresosEjecutados.toLocaleString()} COP</div>
              <div className="text-[10px] text-slate-500">
                Aportes propios, donaciones y crédito bancario
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-500 block">Gastos Ejecutados Reales</span>
              <div className="text-2xl font-black text-slate-900">${totalGastosEjecutados.toLocaleString()} COP</div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-1">
                <div 
                  className={`h-full transition-all ${pctEjecutadoTope > 90 ? 'bg-red-500' : 'bg-emerald-500'}`}
                  style={{ width: `${pctEjecutadoTope}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                <span>{pctEjecutadoTope}% del tope ejecutado</span>
                <span>OK CNE</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-500 block">Saldo Disponible sin Exceder Tope</span>
              <div className="text-2xl font-black text-cyan-800">${saldoDisponibleCNE.toLocaleString()} COP</div>
              <span className="text-[10px] text-emerald-800 bg-emerald-100 font-bold px-2 py-0.5 rounded inline-block">
                Cumplimiento CNE 100% Garantizado
              </span>
            </div>

          </div>

          {/* Statutory CNE Rubros Table */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-amber-600" />
                  Rubros Oficiales CNE - Formato Cuentas Claras (Candidatos y Partidos)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Estructura codificada según reglamentación del Consejo Nacional Electoral para elecciones territoriales en Colombia.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenCreateModal}
                  className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs rounded-xl shadow transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Registrar Movimiento / Ítem</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <th className="p-3">Código CNE</th>
                    <th className="p-3">Nombre Oficial del Rubro CNE</th>
                    <th className="p-3">Tipo</th>
                    <th className="p-3 text-right">Asignado</th>
                    <th className="p-3 text-right">Ejecutado</th>
                    <th className="p-3 text-right">Diferencia</th>
                    <th className="p-3 text-center">Estado Auditoría</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {[
                    { cod: '101', nom: 'Aportes Propios del Candidato', tipo: 'Ingreso' },
                    { cod: '102', nom: 'Créditos de Entidades Financieras', tipo: 'Ingreso' },
                    { cod: '103', nom: 'Donaciones de Particulares', tipo: 'Ingreso' },
                    { cod: '104', nom: 'Aportes de Partidos y Coaliciones', tipo: 'Ingreso' },
                    { cod: '201', nom: 'Gastos de Administración (Sedes y Asesores)', tipo: 'Gasto' },
                    { cod: '202', nom: 'Propaganda Electoral y Publicidad', tipo: 'Gasto' },
                    { cod: '203', nom: 'Actos Públicos y Eventos de Campaña', tipo: 'Gasto' },
                    { cod: '204', nom: 'Transporte y Movilización Territorial', tipo: 'Gasto' },
                    { cod: '205', nom: 'Capacitación Electoral y Testigos Día E', tipo: 'Gasto' },
                    { cod: '206', nom: 'Gastos de Financiamiento e Intereses', tipo: 'Gasto' }
                  ].map(rubro => {
                    const rubroItems = items.filter(i => i.codigoRubro === rubro.cod);
                    const asignado = rubroItems.reduce((acc, curr) => acc + curr.montoAsignado, 0);
                    const ejecutado = rubroItems.reduce((acc, curr) => acc + curr.montoEjecutado, 0);
                    const dif = asignado - ejecutado;

                    return (
                      <tr key={rubro.cod} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-mono font-bold text-amber-900">{rubro.cod}</td>
                        <td className="p-3 font-bold text-slate-900">{rubro.nom}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                            rubro.tipo === 'Ingreso' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'
                          }`}>
                            {rubro.tipo}
                          </span>
                        </td>
                        <td className="p-3 text-right font-mono text-slate-800">${asignado.toLocaleString()}</td>
                        <td className="p-3 text-right font-mono font-bold text-slate-900">${ejecutado.toLocaleString()}</td>
                        <td className="p-3 text-right font-mono text-emerald-700 font-bold">${dif.toLocaleString()}</td>
                        <td className="p-3 text-center">
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded border border-emerald-300">
                            Validado CNE
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Official Certification Card */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <h4 className="font-extrabold text-amber-300 text-sm">Certificación Digital & Cierre Contable CNE</h4>
                </div>
                <p className="text-xs text-slate-300">
                  Firmas electrónicas registradas del Tesorero de Campaña y Contador Público (TP-192844-T).
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => handleGuardedAction('sign_cne', () => alert('Firma digital estampada con éxito por el Contador Público Registrado.'))}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow cursor-pointer"
                >
                  Firmar Formato 5.1A
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* SUB-TAB 2: PLANTILLA BORRADOR & SIMULADOR ESTRATÉGICO */}
      {/* ---------------------------------------------------------------------- */}
      {activeSubTab === 'borrador_estrategico' && (
        <div className="space-y-6">
          
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-purple-600" />
                  Plantilla de Borrador & Simulador Financiero Interno
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Diseñe el escenario inicial de gastos por centros de costo antes de la formalización ejecutiva ante el CNE.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleLoadDraftTemplate}
                  className="px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white font-extrabold text-xs rounded-xl shadow transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Cargar Plantilla Sugerida</span>
                </button>

                <button
                  onClick={handleApproveDraft}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckSquare className="w-4 h-4" />
                  <span>Convertir a Presupuesto Oficial</span>
                </button>
              </div>
            </div>

            {/* Selectors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-purple-50/50 p-4 rounded-2xl border border-purple-100">
              
              {/* Corporation Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tipo de Campaña / Corporación *</label>
                <select
                  value={selectedCorporation}
                  onChange={(e) => setSelectedCorporation(e.target.value as any)}
                  className="w-full bg-white border border-purple-200 rounded-xl px-3 py-2 font-bold text-xs text-slate-900 focus:outline-none focus:border-purple-600"
                >
                  <option value="Alcaldía">Alcaldía Municipal ($1,250,000,000 COP)</option>
                  <option value="Gobernación">Gobernación Departamental ($3,500,000,000 COP)</option>
                  <option value="Concejo">Concejo Municipal ($450,000,000 COP)</option>
                  <option value="Asamblea">Asamblea Departamental ($950,000,000 COP)</option>
                  <option value="Ediles">Ediles / JAL ($120,000,000 COP)</option>
                </select>
              </div>

              {/* Scenario Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Escenario de Recaudación / Simulación *</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Pesimista', 'Base', 'Optimista'] as const).map(sc => (
                    <button
                      key={sc}
                      type="button"
                      onClick={() => setSelectedScenario(sc)}
                      className={`py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                        selectedScenario === sc
                          ? 'bg-purple-900 text-white shadow-sm'
                          : 'bg-white border border-purple-200 text-slate-700 hover:bg-purple-100'
                      }`}
                    >
                      {sc} ({sc === 'Pesimista' ? '40%' : sc === 'Base' ? '75%' : '95%'})
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Cost Centers Allocation Sliders */}
            <div className="space-y-4">
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                Distribución Porcentual por Centros de Costos
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Comunicaciones */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span>1. Comunicaciones, Pauta & Imprenta</span>
                    <span className="text-purple-700">{pctPauta}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    value={pctPauta}
                    onChange={(e) => setPctPauta(Number(e.target.value))}
                    className="w-full accent-purple-700 cursor-pointer"
                  />
                  <div className="text-[10px] text-slate-500 font-mono">
                    Monto Estimado: ${Math.round(((currentLimit * (selectedScenario === 'Pesimista' ? 0.4 : selectedScenario === 'Base' ? 0.75 : 0.95)) * pctPauta) / 100).toLocaleString()} COP
                  </div>
                </div>

                {/* Eventos */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span>2. Eventos Públicos & Logística</span>
                    <span className="text-purple-700">{pctEventos}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    value={pctEventos}
                    onChange={(e) => setPctEventos(Number(e.target.value))}
                    className="w-full accent-purple-700 cursor-pointer"
                  />
                  <div className="text-[10px] text-slate-500 font-mono">
                    Monto Estimado: ${Math.round(((currentLimit * (selectedScenario === 'Pesimista' ? 0.4 : selectedScenario === 'Base' ? 0.75 : 0.95)) * pctEventos) / 100).toLocaleString()} COP
                  </div>
                </div>

                {/* Operación Día E */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span>3. Operación Día E (Testigos & Logística)</span>
                    <span className="text-purple-700">{pctDiaE}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="40"
                    value={pctDiaE}
                    onChange={(e) => setPctDiaE(Number(e.target.value))}
                    className="w-full accent-purple-700 cursor-pointer"
                  />
                  <div className="text-[10px] text-slate-500 font-mono">
                    Monto Estimado: ${Math.round(((currentLimit * (selectedScenario === 'Pesimista' ? 0.4 : selectedScenario === 'Base' ? 0.75 : 0.95)) * pctDiaE) / 100).toLocaleString()} COP
                  </div>
                </div>

                {/* Administración */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span>4. Administración, Sedes & Staff</span>
                    <span className="text-purple-700">{pctAdmin}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    value={pctAdmin}
                    onChange={(e) => setPctAdmin(Number(e.target.value))}
                    className="w-full accent-purple-700 cursor-pointer"
                  />
                  <div className="text-[10px] text-slate-500 font-mono">
                    Monto Estimado: ${Math.round(((currentLimit * (selectedScenario === 'Pesimista' ? 0.4 : selectedScenario === 'Base' ? 0.75 : 0.95)) * pctAdmin) / 100).toLocaleString()} COP
                  </div>
                </div>

              </div>
            </div>

            {/* Current Draft Items Table */}
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <h4 className="font-extrabold text-slate-900 text-sm">
                Lista de Ítems en Borrador Estratégico
              </h4>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <th className="p-3">Rubro CNE</th>
                      <th className="p-3">Concepto / Ítem Borrador</th>
                      <th className="p-3">Centro de Costo</th>
                      <th className="p-3 text-right">Monto Estimado</th>
                      <th className="p-3 text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {items.filter(i => i.estado === 'Borrador').map(drf => (
                      <tr key={drf.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-purple-900">{drf.codigoRubro}</td>
                        <td className="p-3 font-bold text-slate-900">{drf.nombre}</td>
                        <td className="p-3 text-slate-700">{drf.centroCosto}</td>
                        <td className="p-3 text-right font-mono font-bold text-purple-950">${drf.montoAsignado.toLocaleString()} COP</td>
                        <td className="p-3 text-center">
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded border border-amber-300">
                            Borrador
                          </span>
                        </td>
                      </tr>
                    ))}
                    {items.filter(i => i.estado === 'Borrador').length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-slate-500 italic">
                          No hay ítems en estado borrador. Haga clic en &quot;Cargar Plantilla Sugerida&quot; para generar la proyección borrador.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* SUB-TAB 3: GESTIÓN INTEGRAL DE ÍTEMS DE PRESUPUESTO (MAESTRO) */}
      {/* ---------------------------------------------------------------------- */}
      {activeSubTab === 'gestion_items' && (
        <div className="space-y-6">
          
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-600" />
                  Gestión Integral Maestro de Ítems de Presupuesto
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Administre individualmente cada partida financiera con asignación de terceros, facturas y soportes contables.
                </p>
              </div>

              <button
                onClick={handleOpenCreateModal}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>+ Crear Nuevo Ítem</span>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
              
              {/* Search input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar ítem o tercero..."
                  className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              {/* Type Filter */}
              <div>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as any)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700"
                >
                  <option value="Todos">Todos los Tipos (Ingresos y Gastos)</option>
                  <option value="Ingreso">Solo Ingresos</option>
                  <option value="Gasto">Solo Gastos</option>
                </select>
              </div>

              {/* Centro Costo Filter */}
              <div>
                <select
                  value={centroCostoFilter}
                  onChange={(e) => setCentroCostoFilter(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700"
                >
                  <option value="Todos">Todos los Centros de Costo</option>
                  <option value="Comunicaciones & Pauta">Comunicaciones & Pauta</option>
                  <option value="Operación Territorial">Operación Territorial</option>
                  <option value="Operación Día E">Operación Día E</option>
                  <option value="Administración & Sedes">Administración & Sedes</option>
                  <option value="Estrategia Jurídica">Estrategia Jurídica</option>
                  <option value="Eventos & Logística">Eventos & Logística</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700"
                >
                  <option value="Todos">Todos los Estados</option>
                  <option value="Borrador">Borrador</option>
                  <option value="Aprobado">Aprobado</option>
                  <option value="Soportado OCR">Soportado OCR</option>
                  <option value="Auditado CNE">Auditado CNE</option>
                </select>
              </div>

            </div>

            {/* Master Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <th className="p-3">CNE</th>
                    <th className="p-3">Concepto / Ítem Presupuestal</th>
                    <th className="p-3">Tipo & Centro Costo</th>
                    <th className="p-3">Tercero / Proveedor</th>
                    <th className="p-3 text-right">Asignado</th>
                    <th className="p-3 text-right">Ejecutado</th>
                    <th className="p-3 text-center">Estado</th>
                    <th className="p-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-mono font-bold text-emerald-900">{item.codigoRubro}</td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{item.nombre}</div>
                        <div className="text-[10px] text-slate-500">{item.nombreRubro}</div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded block w-fit mb-0.5 ${
                          item.tipo === 'Ingreso' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-800'
                        }`}>
                          {item.tipo}
                        </span>
                        <span className="text-[10px] text-slate-500">{item.centroCosto}</span>
                      </td>
                      <td className="p-3">
                        {item.terceroNombre ? (
                          <div>
                            <div className="font-bold text-slate-800 text-[11px]">{item.terceroNombre}</div>
                            <div className="text-[10px] font-mono text-slate-500">{item.terceroNit}</div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">No asignado</span>
                        )}
                      </td>
                      <td className="p-3 text-right font-mono text-slate-800">${item.montoAsignado.toLocaleString()}</td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900">${item.montoEjecutado.toLocaleString()}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${
                          item.estado === 'Auditado CNE' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                          item.estado === 'Soportado OCR' ? 'bg-cyan-100 text-cyan-800 border-cyan-300' :
                          item.estado === 'Aprobado' ? 'bg-purple-100 text-purple-800 border-purple-300' : 'bg-amber-100 text-amber-800 border-amber-300'
                        }`}>
                          {item.estado}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded cursor-pointer"
                            title="Editar"
                          >
                            <PenSquare className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-1 bg-red-100 hover:bg-red-200 text-red-700 rounded cursor-pointer"
                            title="Eliminar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredItems.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-500 italic">
                        No se encontraron ítems de presupuesto con los filtros seleccionados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* SUB-TAB 4: ESCÁNER OCR & COMPROBANTES IA */}
      {/* ---------------------------------------------------------------------- */}
      {activeSubTab === 'ocr_scanner' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-teal-600" />
                  Lectura Inteligente IA & Escáner OCR de Facturas Electrónicas
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Procese facturas, cuentas de cobro y extractos bancarios con sugerencia automática de código de rubro CNE.
                </p>
              </div>

              <span className="px-3 py-1 bg-teal-100 text-teal-800 font-bold text-xs rounded-xl border border-teal-300">
                Lector DIAN + CNE Activo
              </span>
            </div>

            <div
              onClick={() => handleGuardedAction('validate_ocr', () => alert('Simulando escaneo OCR de factura... Extraído: Agencias Medios $12.500.000 COP, NIT 830.555.777-9, Asignado a Rubro 202.'))}
              className="bg-slate-50 border-2 border-dashed border-teal-300 hover:border-teal-500 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-teal-50/40"
            >
              <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mb-3">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-sm font-extrabold text-slate-900">
                Arrastre o seleccione comprobantes de pago aquí (PDF, XML DIAN, JPG)
              </p>
              <p className="text-xs text-slate-500 mt-1 max-w-md">
                El sistema extraerá automáticamente: NIT del Tercero, Número de Factura, Subtotal, IVA, Retención en la Fuente y clasificará en el Rubro CNE correspondiente.
              </p>

              <button
                type="button"
                className="mt-4 px-5 py-2 bg-[#1b2b48] hover:bg-[#122038] text-white font-black text-xs rounded-xl shadow cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-teal-300" />
                <span>Escanear Nuevo Comprobante</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* SUB-TAB 5: PERMISOS EXCLUSIVOS RBAC (MATRIZ DE ACCESO) */}
      {/* ---------------------------------------------------------------------- */}
      {activeSubTab === 'permisos_rbac' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Lock className="w-5 h-5 text-amber-600" />
                  Matriz de Permisos Exclusivos & Control RBAC Financiero
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Reglas de segregación de funciones exigidas por el CNE y Estatutos para evitar falsificaciones o giros no autorizados.
                </p>
              </div>

              <span className="px-3 py-1 bg-purple-100 text-purple-900 font-bold text-xs rounded-xl border border-purple-300">
                Aislamiento Activo
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <th className="p-3">Atribución / Acción Financiera</th>
                    <th className="p-3 text-center">Tesorero</th>
                    <th className="p-3 text-center">Contador CNE</th>
                    <th className="p-3 text-center">Gerente</th>
                    <th className="p-3 text-center">Candidato</th>
                    <th className="p-3 text-center">Auditor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {[
                    { act: 'Aprobar Presupuesto Borrador', t: false, c: false, g: true, cand: true, aud: false },
                    { act: 'Modificar Topes por Centros de Costo', t: false, c: false, g: true, cand: false, aud: false },
                    { act: 'Registrar Ítems y Gastos Reales', t: true, c: true, g: true, cand: false, aud: false },
                    { act: 'Validar y Escanear Comprobantes OCR', t: true, c: true, g: false, cand: false, aud: false },
                    { act: 'Firmar Formatos Cuentas Claras CNE', t: false, c: true, g: false, cand: false, aud: false },
                    { act: 'Cierre del Ejercicio Contable', t: false, c: true, g: false, cand: false, aud: false }
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">{row.act}</td>
                      <td className="p-3 text-center">{row.t ? <span className="text-emerald-600 font-bold">✓ SÍ</span> : <span className="text-slate-300">✕ NO</span>}</td>
                      <td className="p-3 text-center">{row.c ? <span className="text-emerald-600 font-bold">✓ SÍ</span> : <span className="text-slate-300">✕ NO</span>}</td>
                      <td className="p-3 text-center">{row.g ? <span className="text-emerald-600 font-bold">✓ SÍ</span> : <span className="text-slate-300">✕ NO</span>}</td>
                      <td className="p-3 text-center">{row.cand ? <span className="text-emerald-600 font-bold">✓ SÍ</span> : <span className="text-slate-300">✕ NO</span>}</td>
                      <td className="p-3 text-center">{row.aud ? <span className="text-emerald-600 font-bold">✓ SÍ</span> : <span className="text-slate-300">✕ Lectura</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* MODAL: CREAR / EDITAR ÍTEM DE PRESUPUESTO */}
      {/* ---------------------------------------------------------------------- */}
      {showItemModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    {editingItem ? 'Editar Ítem de Presupuesto' : 'Crear Nuevo Ítem de Presupuesto'}
                  </h4>
                  <p className="text-[10px] text-slate-500">Asignación codificada según normatividad CNE</p>
                </div>
              </div>
              <button
                onClick={() => setShowItemModal(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-3.5 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1">Tipo de Registro *</label>
                  <select
                    value={formTipo}
                    onChange={(e) => setFormTipo(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 font-bold text-slate-900"
                  >
                    <option value="Gasto">Gasto / Egreso</option>
                    <option value="Ingreso">Ingreso / Aporte</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1">Código Rubro CNE *</label>
                  <select
                    value={formCodigoRubro}
                    onChange={(e) => setFormCodigoRubro(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 font-mono font-bold text-slate-900"
                  >
                    <option value="101">101 - Aportes Propios Candidato</option>
                    <option value="102">102 - Créditos Bancarios</option>
                    <option value="103">103 - Donaciones Particulares</option>
                    <option value="104">104 - Aportes del Partido</option>
                    <option value="201">201 - Gastos de Administración</option>
                    <option value="202">202 - Propaganda Electoral</option>
                    <option value="203">203 - Actos Públicos y Eventos</option>
                    <option value="204">204 - Transporte y Movilización</option>
                    <option value="205">205 - Capacitación Electoral / Testigos</option>
                    <option value="206">206 - Gastos de Financiamiento</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-700 mb-1">Concepto / Nombre del Ítem *</label>
                <input
                  type="text"
                  required
                  value={formNombre}
                  onChange={(e) => setFormNombre(e.target.value)}
                  placeholder="Ej: Impresión de 50.000 Volantes Comunas Norte"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-700 mb-1">Centro de Costo *</label>
                <select
                  value={formCentroCosto}
                  onChange={(e) => setFormCentroCosto(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 font-bold text-slate-900"
                >
                  <option value="Comunicaciones & Pauta">Comunicaciones & Pauta</option>
                  <option value="Operación Territorial">Operación Territorial</option>
                  <option value="Operación Día E">Operación Día E</option>
                  <option value="Administración & Sedes">Administración & Sedes</option>
                  <option value="Estrategia Jurídica">Estrategia Jurídica</option>
                  <option value="Eventos & Logística">Eventos & Logística</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1">Monto Asignado (COP) *</label>
                  <input
                    type="number"
                    required
                    value={formMontoAsignado}
                    onChange={(e) => setFormMontoAsignado(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 font-mono font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1">Monto Ejecutado Real (COP)</label>
                  <input
                    type="number"
                    value={formMontoEjecutado}
                    onChange={(e) => setFormMontoEjecutado(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 font-mono font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1">Razón Social Tercero / Proveedor</label>
                  <input
                    type="text"
                    value={formTerceroNombre}
                    onChange={(e) => setFormTerceroNombre(e.target.value)}
                    placeholder="Ej: Imprenta Medellín S.A.S."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1">NIT / Cédula del Tercero</label>
                  <input
                    type="text"
                    value={formTerceroNit}
                    onChange={(e) => setFormTerceroNit(e.target.value)}
                    placeholder="Ej: NIT 900.123.456-7"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-700 mb-1">Número Factura / Comprobante</label>
                <input
                  type="text"
                  value={formFacturaNumero}
                  onChange={(e) => setFormFacturaNumero(e.target.value)}
                  placeholder="Ej: FE-98124"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-slate-900 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowItemModal(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow cursor-pointer"
                >
                  Guardar Ítem
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* MODAL: MATRIZ DE PERMISOS DETALLADA */}
      {/* ---------------------------------------------------------------------- */}
      {showPermissionsModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h4 className="font-extrabold text-slate-900 text-sm">Detalle de Permisos por Rol</h4>
              </div>
              <button
                onClick={() => setShowPermissionsModal(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="font-bold text-emerald-900 block">Tesorero Oficial:</span>
                Control de desembolsos, ordenación de pago y conciliación de cuenta bancaria única.
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                <span className="font-bold text-amber-900 block">Contador Público Registrado (CNE):</span>
                Único autorizado para firmar y transmitir el Formato 5.1A y validar soportes OCR.
              </div>
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
                <span className="font-bold text-purple-900 block">Gerente General & Candidato:</span>
                Aprobación del borrador estratégico y redistribución de topes entre centros de costo.
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowPermissionsModal(false)}
                className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
