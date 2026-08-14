import { useState } from "react";
import { elevesContainer } from "../../infrastructure/eleves.container";
import { IDS_DEMO } from "../../infrastructure/mock-data/eleves.seed-data";
import type { EleveReadDto, TuteurReadDto } from "../../application/dto/eleve-read.dto";
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

type LienParenteOption = "PERE" | "MERE" | "TUTEUR" | "AUTRE";

interface TuteursSectionProps {
  eleve: EleveReadDto;
  onChange: (eleve: EleveReadDto) => void;
}

const LIBELLES_LIEN: Record<LienParenteOption, string> = {
  PERE: "Père",
  MERE: "Mère",
  TUTEUR: "Tuteur",
  AUTRE: "Autre",
};

/** RM-E-04 : au moins un tuteur, un seul principal — les boutons reflètent cette contrainte. */
export function TuteursSection({ eleve, onChange }: TuteursSectionProps) {
  const [erreur, setErreur] = useState<string | null>(null);
  const [ajoutOuvert, setAjoutOuvert] = useState(false);
  const [idEnCours, setIdEnCours] = useState<string | null>(null);

  const [nom, setNom] = useState("");
  const [lienParente, setLienParente] = useState<LienParenteOption>("PERE");
  const [telephone, setTelephone] = useState("");

  async function gererAjouter() {
    setErreur(null);
    try {
      const dto = await elevesContainer.ajouterTuteurUseCase.execute({
        eleveId: eleve.id,
        etablissementId: IDS_DEMO.etablissementId,
        input: { nom, lienParente, telephone, estContactPrincipal: false },
      });
      onChange(dto);
      setNom("");
      setTelephone("");
      setAjoutOuvert(false);
    } catch (err) {
      setErreur(err instanceof DomainError ? err.message : "Une erreur est survenue.");
    }
  }

  async function gererDesignerPrincipal(tuteurId: string) {
    setErreur(null);
    setIdEnCours(tuteurId);
    try {
      const dto = await elevesContainer.definirTuteurPrincipalUseCase.execute({
        eleveId: eleve.id,
        etablissementId: IDS_DEMO.etablissementId,
        tuteurId,
      });
      onChange(dto);
    } catch (err) {
      setErreur(err instanceof DomainError ? err.message : "Une erreur est survenue.");
    } finally {
      setIdEnCours(null);
    }
  }

  async function gererSupprimer(tuteurId: string) {
    if (!confirm("Supprimer ce tuteur ?")) return;
    setErreur(null);
    setIdEnCours(tuteurId);
    try {
      const dto = await elevesContainer.supprimerTuteurUseCase.execute({
        eleveId: eleve.id,
        etablissementId: IDS_DEMO.etablissementId,
        tuteurId,
      });
      onChange(dto);
    } catch (err) {
      setErreur(err instanceof DomainError ? err.message : "Une erreur est survenue.");
    } finally {
      setIdEnCours(null);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Tuteurs</CardTitle>
        {!ajoutOuvert && (
          <Button type="button" variant="outline" size="sm" onClick={() => setAjoutOuvert(true)}>
            + Ajouter un tuteur
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {erreur && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{erreur}</p>
        )}

        {eleve.tuteurs.map((tuteur: TuteurReadDto) => (
          <div
            key={tuteur.id}
            className="flex items-center justify-between rounded-md border p-3"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{tuteur.nom}</span>
                <Badge variant="outline">
                  {LIBELLES_LIEN[tuteur.lienParente as LienParenteOption]}
                </Badge>
                {tuteur.estContactPrincipal && (
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Principal</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{tuteur.telephone}</p>
            </div>
            <div className="flex gap-2">
              {!tuteur.estContactPrincipal && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={idEnCours === tuteur.id}
                  onClick={() => gererDesignerPrincipal(tuteur.id)}
                >
                  Définir principal
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={idEnCours === tuteur.id}
                onClick={() => gererSupprimer(tuteur.id)}
              >
                Supprimer
              </Button>
            </div>
          </div>
        ))}

        {ajoutOuvert && (
          <div className="space-y-3 rounded-md border border-dashed p-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="nouveauTuteurNom">Nom</Label>
                <Input id="nouveauTuteurNom" value={nom} onChange={(e) => setNom(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="nouveauTuteurLien">Lien de parenté</Label>
                <Select
                  value={lienParente}
                  onValueChange={(value) => {
                    if (value) setLienParente(value as LienParenteOption);
                  }}
                >
                  <SelectTrigger id="nouveauTuteurLien">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERE">Père</SelectItem>
                    <SelectItem value="MERE">Mère</SelectItem>
                    <SelectItem value="TUTEUR">Tuteur</SelectItem>
                    <SelectItem value="AUTRE">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="nouveauTuteurTelephone">Téléphone</Label>
                <Input
                  id="nouveauTuteurTelephone"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setAjoutOuvert(false)}>
                Annuler
              </Button>
              <Button type="button" onClick={gererAjouter}>
                Ajouter
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}