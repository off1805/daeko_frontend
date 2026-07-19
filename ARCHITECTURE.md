# Architecture DDD

Ce projet organise le code métier en **modules** (bounded contexts), chacun
structuré en 4 couches. `app/modules/user/` est un module d'exemple complet
à dupliquer pour chaque nouveau domaine.

```
app/
  routes/            Routes React Router (framework mode). Fines : elles
                      appellent l'application layer via loader/action et
                      composent des vues de presentation. Aucune logique
                      métier ici.

  modules/
    <context>/
      domain/         Cœur métier. Zéro dépendance externe (pas de React,
                       pas de fetch, pas de React Router, pas de lib UI).
        entities/          Objets avec identité (ex: user.entity.ts)
        value-objects/     Objets sans identité, immuables, auto-validants
                            (ex: email.vo.ts)
        repositories/      Ports (interfaces) — pas d'implémentation
        errors/            Erreurs métier (extends DomainError)

      application/    Orchestration des cas d'usage. Dépend uniquement du
                       domain (via les ports). Ne connaît ni React, ni
                       fetch, ni la couche infrastructure.
        use-cases/         Un fichier = une action métier
        dto/               Formes de données exposées à la presentation

      infrastructure/ Détails techniques. Implémente les ports du domain,
                       consomme des APIs externes, expose des hooks
                       TanStack Query, et sert de composition root (câblage
                       repository -> use-case) pour le module.
        repositories/      Implémentations concrètes (Http*Repository, ...)
        queries/           Hooks TanStack Query qui appellent les use-cases
        <context>.container.ts   Instancie et câble les dépendances

      presentation/   Composants et hooks React consommés par les routes.
        components/
        index.ts           Barrel : c'est la SEULE porte d'entrée du module
                            depuis l'extérieur (routes, autres modules).

  shared/
    domain/           Briques DDD génériques réutilisables par tous les
                       modules : Entity, ValueObject, DomainError, UseCase.
    infrastructure/   Câblage technique transverse (ex: query-client.tsx).

  components/, lib/, hooks/   Kit UI partagé (shadcn/ui). Généré et géré
                       par la CLI shadcn (voir components.json) — ne pas
                       réorganiser ces dossiers.
```

## Règles de dépendance entre couches

```
presentation → application → domain
infrastructure → application, domain
routes → presentation, application (via modules/<context>/presentation)
```

- **domain** n'importe jamais depuis `application`, `infrastructure`,
  `presentation`, ni depuis `react`/`react-router`/`@tanstack/*`.
- **application** n'importe que depuis `domain` (types, ports). Elle ne sait
  pas *comment* les données sont récupérées (fetch, DB, etc.), seulement
  *quoi* faire avec (via l'interface `Repository`).
- **infrastructure** implémente les ports définis dans `domain` et peut
  utiliser n'importe quelle lib technique (fetch, TanStack Query, SDK...).
- **presentation** compose `application` + `infrastructure` pour offrir des
  composants/hooks prêts à consommer par les routes.
- Un module ne doit importer un **autre** module que via son
  `presentation/index.ts` (jamais directement `modules/x/domain/...` depuis
  un autre module) — ça garde chaque bounded context substituable.

Ces règles ne sont pas imposées par un outil (par choix, pour rester léger) :
elles reposent sur la relecture de code. Si le projet grossit, envisager
`eslint-plugin-boundaries` pour les faire respecter automatiquement.

## Data fetching : approche hybride

- **Loaders/actions React Router** pour le chargement initial (SSR, pas de
  flash de chargement, cohérent avec React Router 8 en mode framework).
- **TanStack Query** (`app/shared/infrastructure/query-client.tsx`, monté
  dans `root.tsx`) pour l'interactivité côté client après hydratation :
  revalidation, polling, mutations optimistes, cache partagé entre
  composants non liés par la hiérarchie de routes.
- Pattern recommandé : le loader appelle le use-case et retourne son
  résultat ; le composant hydrate un hook TanStack Query avec `initialData`
  pour éviter un double fetch au montage, puis s'en sert pour les
  interactions ultérieures (refetch, invalidation après mutation).
- Voir `app/routes/ddd-example.tsx` et `app/modules/user/` pour un exemple
  complet de bout en bout (à supprimer une fois que tu as ton premier vrai
  module, ou à garder comme référence).

## Créer un nouveau module

1. Copier la structure de `app/modules/user/` en remplaçant `user` par le
   nom du bounded context.
2. Écrire le domain en premier (entities, value objects, ports) sans se
   soucier de l'implémentation technique.
3. Écrire les use-cases dans `application/`, en dépendant seulement des
   ports du domain.
4. Implémenter les ports dans `infrastructure/`, câbler dans
   `<context>.container.ts`, exposer des hooks TanStack Query si besoin
   d'interactivité client.
5. Exposer uniquement ce qui doit être public via `presentation/index.ts`.
6. Consommer le module depuis une route.
