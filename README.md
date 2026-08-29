# Angular Leaflet Geocoding Map

Mini-application Angular 13 concue comme piece portfolio frontend : recherche
geographique, selection de resultats, carte interactive et points sauvegardes.

**Demo live :** https://benzina.github.io/angular-leaflet-geocoding-map/

![Demo de recherche et sauvegarde de point](docs/demo-screenshot.png)

## Fonctionnalites

- Recherche d'adresses et de lieux avec l'API Nominatim OpenStreetMap.
- Gestion visible des etats de chargement, erreurs reseau et recherches sans resultat.
- Liste de resultats cliquables pour centrer la carte et afficher un marqueur temporaire.
- Formulaire de sauvegarde d'un point avec nom, latitude et longitude editables.
- Validation du formulaire : nom obligatoire, latitude entre `-90` et `90`, longitude entre `-180` et `180`.
- Marqueurs persistants sur la carte, sauvegardes dans `localStorage`.
- Carte Leaflet reactive basee sur `@asymmetrik/ngx-leaflet`.
- Tests unitaires pour le geocodage, le formulaire et le service de persistence.
- Licence MIT.

## Stack technique

- Angular `13.2`
- TypeScript `4.5`
- Leaflet `1.8`
- `@asymmetrik/ngx-leaflet`
- RxJS `7.5`
- Karma + Jasmine

## Architecture

L'application separe volontairement les responsabilites pour montrer un flux de
donnees Angular clair.

`AppComponent` joue le role de composant conteneur. Il conserve l'etat de la
recherche courante : resultats, resultat selectionne et indicateur "une
recherche a deja ete lancee".

`GeocodingComponent` gere le champ de recherche, appelle Nominatim via
`HttpClient`, puis emet les resultats normalises avec `@Output`.

`ResultsListComponent` est presentational : il recoit les resultats avec
`@Input`, affiche les etats vide/resultats, puis emet le resultat choisi avec
`@Output`.

`MapPointFormComponent` recoit le resultat selectionne avec `@Input`, pre-remplit
son formulaire reactif et sauvegarde le point via `MapPointsService`.

`MapComponent` ecoute le meme `MapPointsService`. Le service expose un
`Observable` base sur un `BehaviorSubject`, ce qui permet a la carte de se
mettre a jour automatiquement des qu'un nouveau point est ajoute.

`MapPointsService` est la source de verite pour les points sauvegardes. Il garde
les points en memoire et les persiste dans `localStorage`, ce qui conserve les
marqueurs apres rechargement de la page.

## API Nominatim

La recherche utilise :

```text
https://nominatim.openstreetmap.org/search
```

Le projet limite volontairement les appels a une recherche explicite au submit
du formulaire. Dans un navigateur, l'en-tete `User-Agent` ne peut pas etre
defini manuellement par le code frontend ; l'identification publique se fait
donc via le `Referer` de l'application deployee.

## Installation

```bash
npm install
```

## Lancer l'application

```bash
npm start
```

Application locale :

```text
http://localhost:4200/
```

## Scripts disponibles

```bash
npm start
```

Lance le serveur de developpement Angular.

```bash
npm run build
```

Compile l'application dans `dist/angular-leaflet-geocoding-map`.

```bash
npm run watch
```

Compile en mode watch avec la configuration de developpement.

```bash
npm test -- --watch=false --browsers=ChromeHeadless
```

Lance les tests unitaires en mode CI local.

## Structure du projet

```text
src/
  app/
    geocoding/             Recherche Nominatim
    map/                   Carte Leaflet et marqueurs
    map-point-form/        Formulaire de sauvegarde de point
    models/                Types partages
    results-list/          Liste presentational des resultats
    services/              Etat et persistence des points
    app.component.*        Composant conteneur
    app.module.ts          Module principal
  assets/
    marker-icon.png        Icone du marqueur
```

## Deploiement

Le build GitHub Pages a ete publie avec `angular-cli-ghpages`.

Commande de build utilisee pour ce repository :

```bash
npm run build -- --base-href /angular-leaflet-geocoding-map/
```

Puis publication du dossier compile :

```bash
npx angular-cli-ghpages --dir=dist/angular-leaflet-geocoding-map
```

## Evolutions possibles

- Ajouter l'edition et la suppression des points sauvegardes.
- Remplacer `localStorage` par un backend persistant.
- Ajouter une limite/debounce si la recherche evolue vers de l'autocomplete.
