# Mon projet Playwright

Tests automatisés de l'application [Notes](https://practice.expandtesting.com/notes/app/) avec Playwright :
tests UI (Page Object Model), tests API et mocking réseau.

## Installation

```bash
npm ci
npx playwright install
```


## Lancer les tests

| Commande | Ce qu'elle fait |
| --- | --- |
| `npm test` | Tous les tests, sur Chromium |
| `npm run test:ui` | Mode UI interactif |
| `npm run test:api` | Seulement les tests API |
| `npm run test:all-browsers` | Chromium, Firefox et WebKit |
| `npm run report` | Ouvre le dernier rapport HTML |

Le projet `setup` (`tests/auth.setup.js`) se lance automatiquement avant les tests :
il connecte les deux utilisateurs et sauvegarde leur session dans `playwright/.auth/`.

## Structure

```
pages/            Page Objects (BasePage, NotesPage, RegisterPage)
tests/fixtures/   test personnalisé (blocage des pubs automatique)
tests/            tests UI + setup d'authentification
tests/api/        tests API
tests/apiMocking/ tests de mocking réseau
```

## CI

GitHub Actions lance les tests à chaque push et pull request sur `main`/`master`.
Ajoute ces secrets dans *Settings > Secrets and variables > Actions* du dépôt :
`USER1_EMAIL`, `USER1_PASSWORD`, `USER2_EMAIL`, `USER2_PASSWORD`.
