export interface AuthUser {
  name: string;
  email: string;
  role: UserRole;
  roleName: string;
  moduleName: string;
  clientId?: string;
  clientName?: string;
}

export type ViewMode = 
  | 'primera_interfaz'
  | 'modulo_admin' 
  | 'gestion_estrategica' 
  | 'gestion_territorial' 
  | 'testigo_campo'
  | 'encuestas'
  | 'jurado_campo'
  | 'presupuesto' 
  | 'configuracion'
  | 'agenda_electoral'
  | 'pruebas_electorales';

export type UserRole = 
  | 'superadmin'
  | 'administrador' 
  | 'auditor'
  | 'candidato'
  | 'coordinador_general_zona'
  | 'coordinador_zona'
  | 'coordinador_puesto'
  | 'lider_zonal_senior'
  | 'lider'
  | 'lider_barrio_vereda'
  | 'puntero_territorial'
  | 'testigo_electoral'
  | 'jurado_mesa'
  | 'estrategico' 
  | 'territorial';

export interface ModuleAccess {
  id: string;
  name: string;
  description: string;
  route: ViewMode;
  requiredRoles: UserRole[];
  allowedRoleNames: string[];
  iconName: string;
  badge: string;
  features: string[];
}

export interface ChatMessage {
  id: string;
  sender: string;
  avatar?: string;
  role: 'user' | 'assistant' | 'team';
  text: string;
  actions?: { label: string; action: string }[];
  timestamp: string;
}

export interface SocialTrend {
  topic: string;
  count: number;
}

export interface TweetPost {
  id: string;
  user: string;
  handle: string;
  text: string;
  hashtags: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  avatar?: string;
}

export interface CalendarEvent {
  id: string;
  date: string;
  title: string;
  type: string;
}

export interface E14Record {
  id: string;
  mesa: string;
  ocrStatus: 'Completado' | 'Error OCR' | 'Procesando';
  validation: 'Reviewed (Verde)' | 'Error (Rojo)' | 'Pendiente';
  puesto: string;
  votosRegistrados?: number;
  timestamp: string;
}

export interface BudgetItem {
  id: string;
  codigoRubro: string;
  nombreRubro: string;
  nombre: string;
  tipo: 'Ingreso' | 'Gasto';
  centroCosto: 'Comunicaciones & Pauta' | 'Operación Territorial' | 'Operación Día E' | 'Administración & Sedes' | 'Estrategia Jurídica' | 'Eventos & Logística';
  montoAsignado: number;
  montoEjecutado: number;
  estado: 'Borrador' | 'Pendiente Aprobación' | 'Aprobado' | 'Ejecutado' | 'Soportado OCR' | 'Auditado CNE';
  terceroNombre?: string;
  terceroNit?: string;
  facturaNumero?: string;
  fechaRegistro: string;
  observaciones?: string;
}

export type FinancialRole = 
  | 'tesorero'
  | 'contador'
  | 'gerente'
  | 'candidato'
  | 'auditor';

export interface FinancialRolePermission {
  role: FinancialRole;
  title: string;
  description: string;
  canApproveDraft: boolean;
  canModifyLimits: boolean;
  canAddExpense: boolean;
  canValidateOCR: boolean;
  canSignCuentasClaras: boolean;
  canCloseAccountingPeriod: boolean;
}

export interface BankTransaction {
  id: string;
  fecha: string;
  descripcion: string;
  categoria: 'Ingresos' | 'Operaciones' | 'Personal' | 'Eventos' | 'Publicidad';
  monto: number;
  estado: 'Completado' | 'Procesando' | 'Pendiente';
}

export interface GeofenceAlert {
  id: string;
  type: 'alert' | 'confirmation';
  title: string;
  message: string;
  mesa: string;
  timestamp: string;
}

export interface TerritorialZone {
  id: string;
  nombre: string;
  lideres: number;
  votantes: number;
  cobertura: number;
  heatValue: number;
  coordenadas: { x: number; y: number };
  testigosActivos: number;
  testigosFaltantes: number;
  metaVotos?: number;
}
