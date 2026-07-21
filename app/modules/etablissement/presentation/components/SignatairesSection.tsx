import React, { useState } from 'react';
import type { SignataireDto } from '~/modules/etablissement/application/dto/etablissement-read.dto';

interface SignatairesSectionProps {
  signataires: SignataireDto[];
  onAddSignataire: (data: { nom: string; prenom?: string; fonction: string; estPrincipal: boolean }) => void;
}

export const SignatairesSection: React.FC<SignatairesSectionProps> = ({ signataires, onAddSignataire }) => {
  const [showForm, setShowForm] = useState(false);
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [fonction, setFonction] = useState('Proviseur');
  const [estPrincipal, setEstPrincipal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom || !fonction) return;
    onAddSignataire({ nom, prenom, fonction, estPrincipal });
    setNom('');
    setPrenom('');
    setShowForm(false);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Signataires Officiels & Autorité</h2>
          <p className="text-sm text-slate-500">Gestion des autorités habilitées à signer les actes administratifs et bulletins</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
        >
          {showForm ? 'Fermer' : '+ Ajouter un signataire'}
        </button>
      </div>

      {showForm && (
        onSubmitForm => (
          <form onSubmit={handleSubmit} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
            <h4 className="text-sm font-bold text-slate-800">Nouveau Signataire</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nom"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
                className="text-sm bg-white border border-slate-300 rounded-lg px-3 py-2"
              />
              <input
                type="text"
                placeholder="Prénom (optionnel)"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                className="text-sm bg-white border border-slate-300 rounded-lg px-3 py-2"
              />
              <input
                type="text"
                placeholder="Fonction (ex: Proviseur, Directeur...)"
                value={fonction}
                onChange={(e) => setFonction(e.target.value)}
                required
                className="text-sm bg-white border border-slate-300 rounded-lg px-3 py-2"
              />
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="estPrincipal"
                  checked={estPrincipal}
                  onChange={(e) => setEstPrincipal(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300"
                />
                <label htmlFor="estPrincipal" className="text-sm font-medium text-slate-700">Définir comme signataire principal</label>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                Enregistrer
              </button>
            </div>
          </form>
        )
      )(undefined) as any}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {signataires.map((sig) => (
          <div key={sig.id} className="border border-slate-200 rounded-xl p-4 flex items-center justify-between bg-white shadow-xs">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-slate-800">{sig.nomComplet}</span>
                {sig.estPrincipal && (
                  <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">Principal</span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium">{sig.fonction}</p>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${sig.estActif ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
              {sig.estActif ? 'Actif' : 'Inactif'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
//modif de la mort