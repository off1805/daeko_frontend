import { useEffect, useState } from "react";
import { elevesContainer } from "../../infrastructure/eleves.container";
import { IDS_DEMO } from "../../infrastructure/mock-data/eleves.seed-data";
import type { InscriptionReadDto } from "../../application/dto/inscription-read.dto";
import { DomainError } from "~/shared/domain/domain-error";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

interface InscriptionSectionProps {
  eleveId: string;
}

const CLASSES_DISPONIBLES = [
  { id: IDS_DEMO.classe3emeA, libelle: "3ème A" },
  { id: IDS_DEMO.classe4emeB, libelle: "4ème B" },
];

const LIBELLES_ETAT: Record<string, string> = {
  ACTIVE: "Active",
  ABANDONNEE: "Abandonnée",
  EXCLUE: "Exclue",
  ACHEVEE: "Achevée",
};

/** CU-03/04/05 : inscription, mutation, clôture, réactivation (dossier fonctionnel §3.3-3.5). */
export function InscriptionSection({ eleveId }: InscriptionSectionProps) {
  const [inscription, setInscription] = useState<InscriptionReadDto | null>(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [actionEnCours, setActionEnCours] = useState(false);

  const [classeChoisie, setClasseChoisie] = useState(CLASSES_DISPONIBLES[0].id);
  const [motif, setMotif] = useState("");
  const [afficherMutation, setAfficherMutation] = useState(false);
  const [afficherCloture, setAfficherCloture] = useState<"ABANDON" | "EXCLUSION" | null>(null);

  async function charger() {
    setChargement(true);
    try {
      const dto = await elevesContainer.obtenirInscriptionEleveUseCase.execute({
        eleveId,
        anneeAcademiqueId: IDS_DEMO.anneeAcademiqueId,
      });
      setInscription(dto);
    } finally {
      setChargement(false);
    }
  }

  useEffect(() => {
    charger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eleveId]);

  async function gererInscrire() {
    setErreur(null);
    setActionEnCours(true);
    try {
      await elevesContainer.inscrireEleveUseCase.execute({
        etablissementId: IDS_DEMO.etablissementId,
        eleveId,
        classeId: classeChoisie,
      });
      await charger();
    } catch (err) {
      setErreur(err instanceof DomainError ? err.message : "Une erreur est survenue.");
    } finally {
      setActionEnCours(false);
    }
  }

  async function gererMuter() {
    if (!inscription) return;
    setErreur(null);
    setActionEnCours(true);
    try {
      await elevesContainer.muterInscriptionUseCase.execute({
        inscriptionId: inscription.id,
        etablissementId: IDS_DEMO.etablissementId,
        classeCibleId: classeChoisie,
        motif,
        acteurId: "utilisateur-demo",
      });
      setAfficherMutation(false);
      setMotif("");
      await charger();
    } catch (err) {
      setErreur(err instanceof DomainError ? err.message : "Une erreur est survenue.");
    } finally {
      setActionEnCours(false);
    }
  }

  async function gererCloturer(type: "ABANDON" | "EXCLUSION") {
    if (!inscription) return;
    setErreur(null);
    setActionEnCours(true);
    try {
      await elevesContainer.cloturerInscriptionUseCase.execute({
        inscriptionId: inscription.id,
        type,
        motif,
      });
      setAfficherCloture(null);
      setMotif("");
      await charger();
    } catch (err) {
      setErreur(err instanceof DomainError ? err.message : "Une erreur est survenue.");
    } finally {
      setActionEnCours(false);
    }
  }

  async function gererReactiver() {
    if (!inscription) return;
    setErreur(null);
    setActionEnCours(true);
    try {
      await elevesContainer.reactiverInscriptionUseCase.execute({
        inscriptionId: inscription.id,
        etablissementId: IDS_DEMO.etablissementId,
      });
      await charger();
    } catch (err) {
      setErreur(err instanceof DomainError ? err.message : "Une erreur est survenue.");
    } finally {
      setActionEnCours(false);
    }
  }

  const libelleClasse = (classeId: string) =>
    CLASSES_DISPONIBLES.find((c) => c.id === classeId)?.libelle ?? classeId;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inscription</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {erreur && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{erreur}</p>
        )}

        {chargement ? (
          <p className="text-sm text-muted-foreground">Chargement...</p>
        ) : !inscription ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Aucune inscription pour l'année en cours.
            </p>
            <div className="flex items-end gap-3">
              <div>
                <Label htmlFor="classeInscription">Classe</Label>
                <Select
                  value={classeChoisie}
                  onValueChange={(value) => {
                    if (value) setClasseChoisie(value);
                  }}
                >
                  <SelectTrigger id="classeInscription" className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CLASSES_DISPONIBLES.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.libelle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="button" disabled={actionEnCours} onClick={gererInscrire}>
                Inscrire
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-sm">
                Classe : <strong>{libelleClasse(inscription.classeId)}</strong>
              </span>
              <span className="text-sm text-muted-foreground">
                N° d'ordre : {inscription.numeroOrdre}
              </span>
              <Badge
                className={
                  inscription.etat === "ACTIVE"
                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-100"
                }
              >
                {LIBELLES_ETAT[inscription.etat]}
              </Badge>
            </div>

            {inscription.etat === "ACTIVE" ? (
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setAfficherMutation(!afficherMutation)}
                >
                  Muter
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setAfficherCloture("ABANDON")}
                >
                  Départ / abandon
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setAfficherCloture("EXCLUSION")}
                >
                  Exclure
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={actionEnCours}
                onClick={gererReactiver}
              >
                Réactiver
              </Button>
            )}

            {afficherMutation && (
              <div className="space-y-3 rounded-md border border-dashed p-3">
                <div className="flex items-end gap-3">
                  <div>
                    <Label htmlFor="classeMutation">Nouvelle classe</Label>
                    <Select
                      value={classeChoisie}
                      onValueChange={(value) => {
                        if (value) setClasseChoisie(value);
                      }}
                    >
                      <SelectTrigger id="classeMutation" className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CLASSES_DISPONIBLES.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.libelle}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="motifMutation">Motif</Label>
                  <Input id="motifMutation" value={motif} onChange={(e) => setMotif(e.target.value)} />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setAfficherMutation(false)}>
                    Annuler
                  </Button>
                  <Button type="button" disabled={actionEnCours} onClick={gererMuter}>
                    Confirmer la mutation
                  </Button>
                </div>
              </div>
            )}

            {afficherCloture && (
              <div className="space-y-3 rounded-md border border-dashed p-3">
                <p className="text-sm font-medium">
                  {afficherCloture === "ABANDON" ? "Départ / abandon" : "Exclusion définitive"}
                </p>
                <div>
                  <Label htmlFor="motifCloture">Motif (obligatoire)</Label>
                  <Input id="motifCloture" value={motif} onChange={(e) => setMotif(e.target.value)} />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setAfficherCloture(null)}>
                    Annuler
                  </Button>
                  <Button
                    type="button"
                    disabled={actionEnCours || !motif.trim()}
                    onClick={() => gererCloturer(afficherCloture)}
                  >
                    Confirmer
                  </Button>
                </div>
              </div>
            )}

            {inscription.mutations.length > 0 && (
              <div className="text-sm text-muted-foreground">
                <p className="mb-1 font-medium text-foreground">Historique des mutations</p>
                {inscription.mutations.map((m) => (
                  <p key={m.id}>
                    {libelleClasse(m.classeOrigineId)} → {libelleClasse(m.classeArriveeId)} ({m.motif})
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}