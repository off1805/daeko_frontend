import React from 'react';
import type { LocalisationDto, ContactEtablissementDto } from '~/modules/etablissement/application/dto/etablissement-read.dto';

interface LocalisationSectionProps {
  localisation: LocalisationDto;
  contacts: ContactEtablissementDto;
}

export const LocalisationSection: React.FC<LocalisationSectionProps> = ({ localisation, contacts }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Localisation Administrative */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">Ancrage Territorial</h3>
          <p className="text-xs text-slate-500">Hiérarchie administrative camerounaise</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Région</span>
            <p className="text-sm font-semibold text-slate-800">{localisation.regionCode}</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Département</span>
            <p className="text-sm font-semibold text-slate-800">{localisation.departementCode}</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Arrondissement</span>
            <p className="text-sm font-semibold text-slate-800">{localisation.arrondissementCode}</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Ville / Localité</span>
            <p className="text-sm font-semibold text-slate-800">{localisation.ville}</p>
          </div>
        </div>
      </div>

      {/* Contacts & Canaux */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">Contacts & Canaux</h3>
          <p className="text-xs text-slate-500">Coordonnées institutionnelles</p>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between border-b border-slate-50 pb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Email Officiel</span>
            <span className="text-sm font-medium text-slate-800">{contacts.email || '—'}</span>
          </div>
          <div className="flex justify-between border-b border-slate-50 pb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Téléphone</span>
            <span className="text-sm font-medium text-slate-800">{contacts.telephone || '—'}</span>
          </div>
          <div className="flex justify-between border-b border-slate-50 pb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Adresse Postale</span>
            <span className="text-sm font-medium text-slate-800">{contacts.adressePostale || '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Site Web</span>
            <span className="text-sm font-medium text-blue-600">{contacts.siteWeb || '—'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};