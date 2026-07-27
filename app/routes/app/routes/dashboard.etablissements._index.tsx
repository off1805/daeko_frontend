import React from 'react';
import { etablissementContainer } from '~/modules/etablissement/infrastructure/etablissement.container';
// Importe ou crée ta vue de liste ici

export default function EtablissementsIndexPage() {
  // Tu peux récupérer les données via le conteneur ou les loaders React Router
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-black text-slate-900">Portefeuille des Établissements</h1>
      {/* Tableau ou liste des établissements */}
    </div>
  );
}