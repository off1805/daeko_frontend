import { useState } from "react";
import { useNavigate } from "react-router";
import { elevesContainer } from "../../infrastructure/eleves.container";
import { IDS_DEMO } from "../../infrastructure/mock-data/eleves.seed-data";
import { CHAMPS_OBLIGATOIRES_IMPORT } from "../../domain/entities/import-lot.entity";
import type { ImportLotReadDto, ImportLigneReadDto } from "../../application/dto/import-read.dto";
import { DomainError } from "~/shared/domain/domain-error";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
interface PrevisualisationLigneUI {
  numeroLigne: number;
  donneesInterpretees: Record<string, string>;
  problemesDetectes: string[];
}

type Etape = "DEBUT" | "CORRESPONDANCE" | "PREVISUALISATION" | "TERMINE";

const CLASSES_DISPONIBLES = [
  { id: IDS_DEMO.classe3emeA, libelle: "3ème A" },
  { id: IDS_DEMO.classe4emeB, libelle: "4ème B" },
];

/** CU-02 : import en masse, assistant en 4 étapes (dossier technique §5.4). */
export function ImportElevesPage() {
  const navigate = useNavigate();
  const [etape, setEtape] = useState<Etape>("DEBUT");
  const [erreur, setErreur] = useState<string | null>(null);
  const [enCours, setEnCours] = useState(false);

  const [lot, setLot] = useState<ImportLotReadDto | null>(null);
  const [colonnesDetectees, setColonnesDetectees] = useState<string[]>([]);
  const [correspondance, setCorrespondance] = useState<Record<string, string>>({});
  const [classeCibleId, setClasseCibleId] = useState<string>("");
  const [previsualisation, setPrevisualisation] = useState<PrevisualisationLigneUI[]>([]);
  const [rejets, setRejets] = useState<ImportLigneReadDto[]>([]);

  // --- Étape 1 : téléversement (simulé) --------------------------------

  async function gererTeleverser() {
    setErreur(null);
    setEnCours(true);
    try {
      const resultat = await elevesContainer.televerserImportUseCase.execute({
        etablissementId: IDS_DEMO.etablissementId,
        fichierNom: "eleves-rentree.xlsx",
        fichierRef: "fichier-demo", // référence fixe, le FakeFichierImportParser ignore son contenu réel
        classeCibleId: classeCibleId || undefined,
        creePar: "utilisateur-demo",
      });
      setLot(resultat.lot);
      setColonnesDetectees(resultat.colonnesDetectees);
      // Correspondance pré-remplie automatiquement quand le nom de colonne ressemble au champ attendu.
      const correspondanceInitiale: Record<string, string> = {};
      resultat.colonnesDetectees.forEach((colonne) => {
        const champTrouve = CHAMPS_OBLIGATOIRES_IMPORT.find((champ) =>
          colonne.toLowerCase().replace(/\s|é/g, (c) => (c === "é" ? "e" : "_")).includes(champ)
        );
        if (champTrouve) correspondanceInitiale[colonne] = champTrouve;
      });
      setCorrespondance(correspondanceInitiale);
      setEtape("CORRESPONDANCE");
    } catch (err) {
      setErreur(err instanceof DomainError ? err.message : "Une erreur est survenue.");
    } finally {
      setEnCours(false);
    }
  }

  // --- Étape 2 : correspondance des colonnes ----------------------------

  function gererChangementCorrespondance(colonne: string, champ: string) {
    setCorrespondance((prec) => ({ ...prec, [colonne]: champ === "AUCUN" ? "" : champ }));
  }

  async function gererValiderCorrespondance() {
    if (!lot) return;
    setErreur(null);
    setEnCours(true);
    try {
      const correspondanceFiltree = Object.fromEntries(
        Object.entries(correspondance).filter(([, champ]) => champ)
      );
      const lotMisAJour = await elevesContainer.enregistrerCorrespondanceImportUseCase.execute({
        lotId: lot.id,
        etablissementId: IDS_DEMO.etablissementId,
        correspondance: correspondanceFiltree,
      });
      setLot(lotMisAJour);

      const apercu = await elevesContainer.previsualiserImportUseCase.execute({
        lotId: lot.id,
        etablissementId: IDS_DEMO.etablissementId,
      });
      setPrevisualisation(apercu.lignes);
      setEtape("PREVISUALISATION");
    } catch (err) {
      setErreur(err instanceof DomainError ? err.message : "Une erreur est survenue.");
    } finally {
      setEnCours(false);
    }
  }

  // --- Étape 3 : exécution ----------------------------------------------

  async function gererExecuter() {
    if (!lot) return;
    setErreur(null);
    setEnCours(true);
    try {
      const lotTermine = await elevesContainer.executerImportUseCase.execute({
        lotId: lot.id,
        etablissementId: IDS_DEMO.etablissementId,
        acteurId: "utilisateur-demo",
      });
      setLot(lotTermine);

      if (lotTermine.nbRejetees > 0) {
        const lignesRejetees = await elevesContainer.listerRejetsImportUseCase.execute({
          lotId: lot.id,
        });
        setRejets(lignesRejetees);
      }
      setEtape("TERMINE");
    } catch (err) {
      setErreur(err instanceof DomainError ? err.message : "Une erreur est survenue.");
    } finally {
      setEnCours(false);
    }
  }

  return (
    <Card className="max-w-3xl">
      <CardHeader>
        <CardTitle>Import en masse</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {erreur && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{erreur}</p>
        )}

        {/* Étape 1 */}
        {etape === "DEBUT" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Téléversez un fichier Excel/CSV contenant vos élèves. Un fichier de démonstration
              (2 lignes, dont une volontairement incomplète) sera utilisé pour ce test.
            </p>
            <div>
              <Label htmlFor="classeCible">Classe cible (optionnel — inscrit directement)</Label>
              <Select value={classeCibleId} onValueChange={(v) => setClasseCibleId(v ?? "")}>
                <SelectTrigger id="classeCible" className="w-48">
                  <SelectValue placeholder="Aucune" />
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
            <Button type="button" disabled={enCours} onClick={gererTeleverser}>
              {enCours ? "Analyse..." : "Simuler un import"}
            </Button>
          </div>
        )}

        {/* Étape 2 */}
        {etape === "CORRESPONDANCE" && lot && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Associez chaque colonne détectée à un champ de la plateforme. Champs obligatoires :{" "}
              {CHAMPS_OBLIGATOIRES_IMPORT.join(", ")}.
            </p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Colonne du fichier</TableHead>
                  <TableHead>Champ correspondant</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {colonnesDetectees.map((colonne) => (
                  <TableRow key={colonne}>
                    <TableCell>{colonne}</TableCell>
                    <TableCell>
                      <Select
                        value={correspondance[colonne] || "AUCUN"}
                        onValueChange={(v) => gererChangementCorrespondance(colonne, v ?? "AUCUN")}
                      >
                        <SelectTrigger className="w-56">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AUCUN">— Ignorer —</SelectItem>
                          {CHAMPS_OBLIGATOIRES_IMPORT.map((champ) => (
                            <SelectItem key={champ} value={champ}>
                              {champ}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button type="button" disabled={enCours} onClick={gererValiderCorrespondance}>
              {enCours ? "Validation..." : "Valider et prévisualiser"}
            </Button>
          </div>
        )}

        {/* Étape 3 */}
        {etape === "PREVISUALISATION" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Aperçu des {previsualisation.length} premières lignes interprétées :
            </p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ligne</TableHead>
                  <TableHead>Données interprétées</TableHead>
                  <TableHead>Problèmes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {previsualisation.map((ligne) => (
                  <TableRow key={ligne.numeroLigne}>
                    <TableCell>{ligne.numeroLigne}</TableCell>
                    <TableCell className="text-sm">
                      {Object.entries(ligne.donneesInterpretees)
                        .map(([champ, valeur]) => `${champ}: ${valeur || "—"}`)
                        .join(", ")}
                    </TableCell>
                    <TableCell>
                      {ligne.problemesDetectes.length > 0 ? (
                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                          {ligne.problemesDetectes.join(" ; ")}
                        </Badge>
                      ) : (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">OK</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button type="button" disabled={enCours} onClick={gererExecuter}>
              {enCours ? "Exécution en cours..." : "Lancer l'import"}
            </Button>
          </div>
        )}

        {/* Étape 4 */}
        {etape === "TERMINE" && lot && (
          <div className="space-y-4">
            <div className="flex gap-4">
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                {lot.nbCreees} créée(s)
              </Badge>
              {lot.nbRejetees > 0 && (
                <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                  {lot.nbRejetees} rejetée(s)
                </Badge>
              )}
            </div>

            {rejets.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium">Lignes rejetées :</p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ligne</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Message</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rejets.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell>{r.numeroLigne}</TableCell>
                        <TableCell className="font-mono text-sm">{r.codeRejet}</TableCell>
                        <TableCell className="text-sm">{r.messageRejet}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            <Button type="button" onClick={() => navigate("/eleves")}>
              Retour à la liste des élèves
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}