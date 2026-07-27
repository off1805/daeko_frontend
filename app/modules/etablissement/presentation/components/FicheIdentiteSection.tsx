import React from 'react';
import type { EtablissementReadDto } from '~/modules/etablissement/application/dto/etablissement-read.dto';

interface FicheIdentiteSectionProps {
  etablissement: EtablissementReadDto;
  onEditClick?: () => void;
}

export const FicheIdentiteSection: React.FC<FicheIdentiteSectionProps> = ({ etablissement, onEditClick }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Fiche d'Identité Administrative</h2>
          <p className="text-sm text-slate-500">Informations signalétiques et statut juridico-administratif</p>
        </div>
        {onEditClick && (
          <button
            onClick={onEditClick}
            className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            Modifier la fiche
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Nom Officiel</span>
          <p className="text-base font-semibold text-slate-800">{etablissement.nomOfficiel}</p>
        </div>
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Sigle</span>
          <p className="text-base font-medium text-slate-800">{etablissement.sigle || '—'}</p>
        </div>
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Code Officiel</span>
          <p className="text-base font-mono text-slate-700 bg-slate-50 px-2 py-1 rounded inline-block">{etablissement.codeOfficiel || '—'}</p>
        </div>
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Arrêté d'Agrément</span>
          <p className="text-base font-medium text-slate-800">{etablissement.agrement || '—'}</p>
        </div>
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Statut Juridique</span>
          <p className="text-base font-medium text-slate-800">{etablissement.statutJuridiqueLibelle}</p>
        </div>
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Devise Propre</span>
          <p className="text-base italic text-slate-700">"{etablissement.devisePropre || '—'}"</p>
        </div>
      </div>
    </div>
  );
};