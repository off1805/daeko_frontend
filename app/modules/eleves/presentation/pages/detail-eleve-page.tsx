import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { elevesContainer } from "../../infrastructure/eleves.container";
import { IDS_DEMO } from "../../infrastructure/mock-data/eleves.seed-data";
import type { EleveReadDto } from "../../application/dto/eleve-read.dto";
import { DomainError } from "~/shared/domain/domain-error";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { TuteursSection } from "../components/tuteurs-section";
import { InscriptionSection } from "../components/inscription-section";

/** GET /eleves/{id} (dossier technique §5.1) : fiche détail complète. */
export function DetailElevePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [eleve, setEleve] = useState<EleveReadDto | null>(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [modeEdition, setModeEdition] = useState(false);

  const [nom, setNom] = useState("");
  const [prenoms, setPrenoms] = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [lieuNaissance, setLieuNaissance] = useState("");

  async function charger() {
    if (!id) return;
    setChargement(true);
    try {
      const dto = await elevesContainer.obtenirEleveUseCase.execute({
        eleveId: id,
        etablissementId: IDS_DEMO.etablissementId,
      });
      setEleve(dto);
      setNom(dto.nom);
      setPrenoms(dto.prenoms);
      setDateNaissance(dto.dateNaissance);
      setLieuNaissance(dto.lieuNaissance ?? "");
    } catch (err) {
      setErreur(err instanceof DomainError ? err.message : "Élève introuvable.");
    } finally {
      setChargement(false);
    }
  }

  useEffect(() => {
    charger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function gererEnregistrer() {
    if (!id) return;
    setErreur(null);
    try {
      const dto = await elevesContainer.modifierEleveUseCase.execute({
        eleveId: id,
        etablissementId: IDS_DEMO.etablissementId,
        input: { nom, prenoms, dateNaissance, lieuNaissance: lieuNaissance || undefined },
      });
      setEleve(dto);
      setModeEdition(false);
    } catch (err) {
      setErreur(err instanceof DomainError ? err.message : "Une erreur est survenue.");
    }
  }

  if (chargement) return <p className="p-6 text-sm text-muted-foreground">Chargement...</p>;
  if (!eleve) {
    return (
      <div className="p-6">
        <p className="text-sm text-red-700">{erreur ?? "Élève introuvable."}</p>
        <Button type="button" variant="outline" className="mt-4" onClick={() => navigate("/eleves")}>
          Retour à la liste
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <Button type="button" variant="outline" onClick={() => navigate("/eleves")}>
          ← Retour
        </Button>
        <Badge
          className={
            eleve.etat === "ACTIF"
              ? "bg-green-100 text-green-800 hover:bg-green-100"
              : "bg-gray-100 text-gray-600 hover:bg-gray-100"
          }
        >
          {eleve.etat === "ACTIF" ? "Actif" : "Archivé"}
        </Badge>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{eleve.nomComplet}</CardTitle>
          {!modeEdition && (
            <Button type="button" variant="outline" size="sm" onClick={() => setModeEdition(true)}>
              Modifier
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {erreur && (
            <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{erreur}</p>
          )}

          {modeEdition ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nom">Nom</Label>
                  <Input id="nom" value={nom} onChange={(e) => setNom(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="prenoms">Prénoms</Label>
                  <Input id="prenoms" value={prenoms} onChange={(e) => setPrenoms(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="dateNaissance">Date de naissance</Label>
                  <Input
                    id="dateNaissance"
                    type="date"
                    value={dateNaissance}
                    onChange={(e) => setDateNaissance(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="lieuNaissance">Lieu de naissance</Label>
                  <Input
                    id="lieuNaissance"
                    value={lieuNaissance}
                    onChange={(e) => setLieuNaissance(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setModeEdition(false)}>
                  Annuler
                </Button>
                <Button type="button" onClick={gererEnregistrer}>
                  Enregistrer
                </Button>
              </div>
            </div>
          ) : (
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-muted-foreground">Matricule</dt>
                <dd className="font-mono">{eleve.matricule}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Sexe</dt>
                <dd>{eleve.sexe === "M" ? "Masculin" : "Féminin"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Date de naissance</dt>
                <dd>{eleve.dateNaissance}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Lieu de naissance</dt>
                <dd>{eleve.lieuNaissance ?? "—"}</dd>
              </div>
            </dl>
          )}
        </CardContent>
      </Card>

      <Separator />

      <TuteursSection eleve={eleve} onChange={setEleve} />

      <Separator />

      <InscriptionSection eleveId={eleve.id} />
    </div>
  );
}