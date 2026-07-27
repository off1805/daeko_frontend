import React, { useState } from 'react';
import type { EnTeteDto } from '~/modules/etablissement/application/dto/etablissement-read.dto';

interface EditeurEnTeteSectionProps {
  enTete?: EnTeteDto;
  onSave: (mode: 'SIMPLE' | 'BILINGUE', lignes: Array<{ ordre: number; texteFr: string; texteEn?: string }>) => void;
}

export const EditeurEnTeteSection: React.FC<EditeurEnTeteSectionProps> = ({ enTete, onSave }) => {
  const [mode, setMode] = useState<'SIMPLE' | 'BILINGUE'>(enTete?.mode || 'BILINGUE');
  const [lignes, setLignes] = useState(
    enTete?.lignes || [
      { ordre: 1, texteFr: 'REPUBLIQUE DU CAMEROUN', texteEn: 'REPUBLIC OF CAMEROON' },
      { ordre: 2, texteFr: 'Paix - Travail - Patrie', texteEn: 'Peace - Work - Fatherland' },
      { ordre: 3, texteFr: 'MINISTERE DES ENSEIGNEMENTS SECONDAIRES', texteEn: 'MINISTRY OF SECONDARY EDUCATION' },
      { ordre: 4, texteFr: '', texteEn: '' },
      { ordre: 5, texteFr: '', texteEn: '' },
      { ordre: 6, texteFr: '', texteEn: '' },
    ]
  );

  const handleLigneChange = (index: number, field: 'texteFr' | 'texteEn', value: string) => {
    const updated = [...lignes];
    updated[index] = { ...updated[index], [field]: value };
    setLignes(updated);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">En-Tête Officiel (Aperçu & Édition)</h2>
          <p className="text-sm text-slate-500">Structure hiérarchique réglementaire des documents scolaires</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-medium text-slate-500">Mode :</span>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as 'SIMPLE' | 'BILINGUE')}
            className="text-sm border border-slate-300 rounded-lg px-3 py-1.5 bg-slate-50 font-medium text-slate-700"
          >
            <option value="BILINGUE">Bilingue (FR / EN)</option>
            <option value="SIMPLE">Unilingue</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {lignes.map((ligne, idx) => (
          <div key={ligne.ordre} className="flex flex-col md:flex-row gap-3 items-start md:items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
            <span className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold shrink-0">
              {ligne.ordre}
            </span>
            <div className="flex-1 w-full">
              <input
                type="text"
                placeholder="Texte en Français"
                value={ligne.texteFr}
                onChange={(e) => handleLigneChange(idx, 'texteFr', e.target.value)}
                className="w-full text-xs font-medium bg-white border border-slate-200 rounded px-3 py-2 text-slate-800"
              />
            </div>
            {mode === 'BILINGUE' && (
              <div className="flex-1 w-full">
                <input
                  type="text"
                  placeholder="Texte en Anglais"
                  value={ligne.texteEn || ''}
                  onChange={(e) => handleLigneChange(idx, 'texteEn', e.target.value)}
                  className="w-full text-xs font-medium bg-white border border-slate-200 rounded px-3 py-2 text-slate-800"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={() => onSave(mode, lignes)}
          className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-all"
        >
          Enregistrer l'en-tête
        </button>
      </div>
    </div>
  );
};