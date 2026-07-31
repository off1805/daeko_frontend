import { useEffect, useState } from "react";
import { Link } from "react-router";
import { elevesContainer } from "../../infrastructure/eleves.container";
import { IDS_DEMO } from "../../infrastructure/mock-data/eleves.seed-data";
import type { EleveResumeReadDto } from "../../application/dto/eleve-read.dto";
import { DomainError } from "~/shared/domain/domain-error";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

/**
 * Écran "Portefeuille des élèves" (dossier fonctionnel §7.2).
 * Actions branchées à ce jour : création, archivage, réactivation.
 * "Voir détail" et "Modifier" viendront avec les écrans correspondants
 * (pas encore construits) — jamais de bouton menant nulle part.
 */
export function ListeElevesPage() {
  const [eleves, setEleves] = useState<EleveResumeReadDto[]>([]);
  const [recherche, setRecherche] = useState("");
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [idEnCours, setIdEnCours] = useState<string | null>(null);

  async function chargerListe() {
    setChargement(true);
    try {
      const resultat = await elevesContainer.listerElevesUseCase.execute({
        etablissementId: IDS_DEMO.etablissementId,
        etat: "TOUS",
        recherche: recherche || undefined,
      });
      setEleves(resultat.items);
    } finally {
      setChargement(false);
    }
  }

  useEffect(() => {
    chargerListe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recherche]);

  async function gererArchiver(eleveId: string) {
    if (!confirm("Archiver cette fiche ? Elle disparaîtra des listes par défaut.")) return;
    setErreur(null);
    setIdEnCours(eleveId);
    try {
      await elevesContainer.archiverEleveUseCase.execute({
        eleveId,
        etablissementId: IDS_DEMO.etablissementId,
        anneeAcademiqueEnCoursId: IDS_DEMO.anneeAcademiqueId,
      });
      await chargerListe();
    } catch (err) {
      setErreur(err instanceof DomainError ? err.message : "Une erreur est survenue.");
    } finally {
      setIdEnCours(null);
    }
  }

  async function gererReactiver(eleveId: string) {
    setErreur(null);
    setIdEnCours(eleveId);
    try {
      await elevesContainer.reactiverEleveUseCase.execute({
        eleveId,
        etablissementId: IDS_DEMO.etablissementId,
      });
      await chargerListe();
    } catch (err) {
      setErreur(err instanceof DomainError ? err.message : "Une erreur est survenue.");
    } finally {
      setIdEnCours(null);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Élèves</CardTitle>
          <Input
            placeholder="Rechercher un élève (nom, matricule)..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="mt-2 max-w-sm"
          />
        </div>
        <div className="flex gap-2">
          <Link to="/eleves/import">
            <Button type="button" variant="outline">
              Importer en masse
            </Button>
          </Link>
          <Link to="/eleves/nouveau">
            <Button type="button">+ Nouvelle fiche</Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {erreur && (
          <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{erreur}</p>
        )}

        {chargement ? (
          <p className="text-sm text-muted-foreground">Chargement...</p>
        ) : eleves.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun élève trouvé.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Matricule</TableHead>
                <TableHead>Nom complet</TableHead>
                <TableHead>Sexe</TableHead>
                <TableHead>État</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eleves.map((eleve) => (
                <TableRow key={eleve.id}>
                  <TableCell className="font-mono text-sm">{eleve.matricule}</TableCell>
                  <TableCell>{eleve.nomComplet}</TableCell>
                  <TableCell>{eleve.sexe}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        eleve.etat === "ACTIF"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-100"
                      }
                    >
                      {eleve.etat === "ACTIF" ? "Actif" : "Archivé"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                   <Link to={`/eleves/${eleve.id}`} className="text-blue-600 hover:underline">
                      {eleve.nomComplet}
                   </Link>
                  </TableCell>
                  <TableCell className="text-right">
                    {eleve.etat === "ACTIF" ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={idEnCours === eleve.id}
                        onClick={() => gererArchiver(eleve.id)}
                      >
                        Archiver
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={idEnCours === eleve.id}
                        onClick={() => gererReactiver(eleve.id)}
                      >
                        Réactiver
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}