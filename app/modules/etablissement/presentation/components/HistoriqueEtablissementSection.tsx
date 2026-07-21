import React from 'react';
import type { AuditEtablissementDto } from '~/modules/etablissement/application/dto/etablissement-read.dto';

interface HistoriqueEtablissementSectionProps {
  audits: AuditEtablissementDto[];
}

export const HistoriqueEtablissementSection: React.FC<HistoriqueEtablissementSectionProps> = ({ audits }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Historique & Traçabilité des Actions</h2>
        <p className="text-sm text-slate-500">Journal d'audit technique et administratif conforme RM-12</p>
      </div>

      <div className="space-y-4">
        {audits.length === 0 ? (
          <p className="text-sm text-slate-400 italic py-4 text-center">Aucune entrée d'audit enregistrée pour le moment.</p>
        ) : (
          audits.map((audit) => (
            <div key={audit.id} className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-4 last:border-none">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded">{audit.action}</span>
                  <span className="text-xs text-slate-400">par {audit.auteurNom}</span>
                </div>
                <div className="text-xs text-slate-600 space-x-2">
                  {audit.modifications.map((m, i) => (
                    <span key={i} className="inline-block bg-slate-50 border border-slate-200 px-2 py-1 rounded">
                      <b>{m.champ}</b> : {m.valeurAncienne ? `${m.valeurAncienne} ➔ ` : ''}{m.valeurNouvelle}
                    </span>
                  ))}
                </div>
              </div>
              <span className="text-xs text-slate-400 mt-2 md:mt-0 font-medium">
                {new Date(audit.date).toLocaleString('fr-FR')}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};