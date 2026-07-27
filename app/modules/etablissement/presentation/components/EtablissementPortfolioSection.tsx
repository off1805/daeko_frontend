import React, { useState } from 'react';
import type { EtablissementReadDto, AuditEtablissementDto } from '~/modules/etablissement/application/dto/etablissement-read.dto';
import { FicheIdentiteSection } from './FicheIdentiteSection';
import { LocalisationSection } from './LocalisationSection';
import { EditeurEnTeteSection } from './EditeurEnTeteSection';
import { SignatairesSection } from './SignatairesSection';
import { HistoriqueEtablissementSection } from './HistoriqueEtablissementSection';
import { SuspensionArchivageModal } from './SuspensionArchivageModal';

interface EtablissementPortfolioSectionProps {
  etablissement: EtablissementReadDto;
  audits: AuditEtablissementDto[];
  onUpdateEnTete: (mode: 'SIMPLE' | 'BILINGUE', lignes: Array<{ ordre: number; texteFr: string; texteEn?: string }>) => void;
  onAddSignataire: (data: { nom: string; prenom?: string; fonction: string; estPrincipal: boolean }) => void;
  onChangerEtat: (etat: 'ACTIF' | 'SUSPENDU' | 'ARCHIVE', motif?: string) => void;
}

export const EtablissementPortfolioSection: React.FC<EtablissementPortfolioSectionProps> = ({
  etablissement,
  audits,
  onUpdateEnTete,
  onAddSignataire,
  onChangerEtat,
}) => {
  const [activeTab, setActiveTab] = useState<'fiche' | 'entete' | 'signataires' | 'audit'>('fiche');
  const [modalCible, setModalCible] = useState<'SUSPENDU' | 'ARCHIVE' | null>(null);

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      {/* Header bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{etablissement.nomOfficiel}</h1>
            <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${
              etablissement.etat === 'ACTIF' ? 'bg-emerald-100 text-emerald-800' :
              etablissement.etat === 'SUSPENDU' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
            }`}>
              {etablissement.etat}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Jauge de complétude de la fiche : <b className="text-slate-800">{etablissement.completude.pourcentage}%</b>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {etablissement.etat !== 'ACTIF' && (
            <button
              onClick={() => onChangerEtat('ACTIF')}
              className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 shadow-xs"
            >
              Activer la fiche
            </button>
          )}
          {etablissement.etat === 'ACTIF' && (
            <button
              onClick={() => setModalCible('SUSPENDU')}
              className="px-4 py-2 text-sm font-semibold text-white bg-amber-600 rounded-xl hover:bg-amber-700 shadow-xs"
            >
              Suspendre
            </button>
          )}
          <button
            onClick={() => setModalCible('ARCHIVE')}
            className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 rounded-xl hover:bg-rose-700 shadow-xs"
          >
            Archiver
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 pb-2">
        {[
          { id: 'fiche', label: "Fiche & Localisation" },
          { id: 'entete', label: "En-Tête Officiel" },
          { id: 'signataires', label: "Signataires" },
          { id: 'audit', label: "Journal d'Audit" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === 'fiche' && (
        <div className="space-y-6">
          <FicheIdentiteSection etablissement={etablissement} />
          <LocalisationSection localisation={etablissement.localisation} contacts={etablissement.contacts} />
        </div>
      )}

      {activeTab === 'entete' && (
        <EditeurEnTeteSection enTete={etablissement.enTete} onSave={onUpdateEnTete} />
      )}

      {activeTab === 'signataires' && (
        <SignatairesSection signataires={etablissement.signataires} onAddSignataire={onAddSignataire} />
      )}

      {activeTab === 'audit' && (
        <HistoriqueEtablissementSection audits={audits} />
      )}

      <SuspensionArchivageModal
        isOpen={modalCible !== null}
        cibleEtat={modalCible || 'SUSPENDU'}
        onClose={() => setModalCible(null)}
        onConfirm={(motif) => {
          if (modalCible) {
            onChangerEtat(modalCible, motif);
            setModalCible(null);
          }
        }}
      />
    </div>
  );
};