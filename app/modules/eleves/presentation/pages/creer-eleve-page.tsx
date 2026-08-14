import { useState } from "react";
import { useNavigate } from "react-router";
import { elevesContainer } from "../../infrastructure/eleves.container";
import { IDS_DEMO } from "../../infrastructure/mock-data/eleves.seed-data";
import { DomainError } from "~/shared/domain/domain-error";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";

type LienParenteOption = "PERE" | "MERE" | "TUTEUR" | "AUTRE";
type SexeOption = "M" | "F";

/** CU-01 : création d'une fiche élève, avec un premier tuteur (dossier technique §5.1). */
export function CreerElevePage() {
  const navigate = useNavigate();
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const [matricule, setMatricule] = useState("");
  const [nom, setNom] = useState("");
  const [prenoms, setPrenoms] = useState("");
  const [sexe, setSexe] = useState<SexeOption>("M");
  const [dateNaissance, setDateNaissance] = useState("");
  const [lieuNaissance, setLieuNaissance] = useState("");

  const [tuteurNom, setTuteurNom] = useState("");
  const [tuteurLienParente, setTuteurLienParente] = useState<LienParenteOption>("PERE");
  const [tuteurTelephone, setTuteurTelephone] = useState("");

  async function gererSoumission(e: { preventDefault: () => void }) {
    e.preventDefault();
    setErreur(null);
    setEnCours(true);

    try {
      await elevesContainer.creerEleveUseCase.execute({
        etablissementId: IDS_DEMO.etablissementId,
        matricule,
        nom,
        prenoms,
        sexe,
        dateNaissance,
        lieuNaissance: lieuNaissance || undefined,
        tuteurs: [
          {
            nom: tuteurNom,
            lienParente: tuteurLienParente,
            telephone: tuteurTelephone,
            estContactPrincipal: true,
          },
        ],
      });
      navigate("/eleves");
    } catch (err) {
      setErreur(err instanceof DomainError ? err.message : "Une erreur est survenue.");
    } finally {
      setEnCours(false);
    }
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Nouvelle fiche élève</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={gererSoumission} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="matricule">Matricule national</Label>
              <Input
                id="matricule"
                value={matricule}
                onChange={(e) => setMatricule(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="sexe">Sexe</Label>
              <Select
                value={sexe}
                onValueChange={(value) => {
                  if (value) setSexe(value as SexeOption);
                }}
              >
                <SelectTrigger id="sexe">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Masculin</SelectItem>
                  <SelectItem value="F">Féminin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="nom">Nom</Label>
              <Input id="nom" value={nom} onChange={(e) => setNom(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="prenoms">Prénoms</Label>
              <Input
                id="prenoms"
                value={prenoms}
                onChange={(e) => setPrenoms(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="dateNaissance">Date de naissance</Label>
              <Input
                id="dateNaissance"
                type="date"
                value={dateNaissance}
                onChange={(e) => setDateNaissance(e.target.value)}
                required
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

          <Separator />

          <div>
            <h3 className="mb-3 text-sm font-medium">Tuteur (contact principal)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tuteurNom">Nom du tuteur</Label>
                <Input
                  id="tuteurNom"
                  value={tuteurNom}
                  onChange={(e) => setTuteurNom(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="tuteurLien">Lien de parenté</Label>
                <Select
                  value={tuteurLienParente}
                  onValueChange={(value) => {
                    if (value) setTuteurLienParente(value as LienParenteOption);
                  }}
                >
                  <SelectTrigger id="tuteurLien">
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
                <Label htmlFor="tuteurTelephone">Téléphone</Label>
                <Input
                  id="tuteurTelephone"
                  value={tuteurTelephone}
                  onChange={(e) => setTuteurTelephone(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {erreur && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{erreur}</p>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => navigate("/eleves")}>
              Annuler
            </Button>
            <Button type="submit" disabled={enCours}>
              {enCours ? "Création..." : "Créer la fiche"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}