import React, { useState } from 'react';
import type { EtatCompte } from '~/modules/etablissement/domain/shared/etat-compte';

interface SuspensionArchivageModalProps {
  isOpen: boolean;
  cibleEtat: 'SUSPENDU' | 'ARCHIVE';
  onClose: () => void;
  onConfirm: (motif: string) => void;
}

export const SuspensionArchivageModal: React.FC<SuspensionArchivageModalProps> = ({ isOpen, cibleEtat, onClose, onConfirm }) => {
  const [motif, setMotif] = useState('');

  if (!isOpen) return null;

  const isSuspension = cibleEtat === 'SUSPENDU';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            {isSuspension ? 'Confirmation de la Suspension' : "Confirmation de l'Archivage"}
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Un motif explicite et obligatoire est requis pour valider cette opération administrative.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">Motif officiel *</label>
          <textarea
            rows={3}
            placeholder="Saisissez le motif détaillé..."
            value={motif}
            onChange={(e) => setMotif(e.target.value)}
            className="w-full text-sm border border-slate-300 rounded-xl p-3 text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200"
          >
            Annuler
          </button>
          <button
            onClick={() => {
              if (motif.trim()) onConfirm(motif);
            }}
            disabled={!motif.trim()}
            className={`px-4 py-2 text-sm font-semibold text-white rounded-xl shadow-sm ${
              isSuspension ? 'bg-amber-600 hover:bg-amber-700' : 'bg-rose-600 hover:bg-rose-700'
            } disabled:opacity-50`}
          >
            Confirmer l'opération
          </button>
        </div>
      </div>
    </div>
  );
};