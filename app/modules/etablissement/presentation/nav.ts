export interface ModuleNavRoute {
  title: string;
  path: string;
  icon: string;
}

export const ETABLISSEMENT_NAV_ROUTES: ModuleNavRoute[] = [
  {
    title: 'Portefeuille Établissements',
    path: '/dashboard/etablissements',
    icon: 'building',
  },
  {
    title: 'Configuration En-Tête',
    path: '/dashboard/etablissements/en-tete',
    icon: 'file-text',
  },
  {
    title: 'Signataires Officiels',
    path: '/dashboard/etablissements/signataires',
    icon: 'users',
  },
  {
    title: 'Journal Audit & Traçabilité',
    path: '/dashboard/etablissements/audit',
    icon: 'shield',
  },
];