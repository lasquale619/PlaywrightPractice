# Playwright Practice

[![Playwright Tests](https://github.com/lasquale619/PlaywrightPractice/actions/workflows/playwright.yml/badge.svg)](https://github.com/lasquale619/PlaywrightPractice/actions/workflows/playwright.yml)
![Playwright](https://img.shields.io/badge/Playwright-1.64-2EAD33?logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)

Projet d'automatisation de tests de l'application [Notes](https://practice.expandtesting.com/notes/app/) avec Playwright et TypeScript :
tests UI, tests API et mocking réseau, exécutés à chaque push par GitHub Actions.

## Ce que montre ce projet

- **Page Object Model** : `BasePage`, `LoginPage`, `NotesPage` et `RegisterPage` regroupent les sélecteurs et les actions de chaque page.
- **Authentification réutilisée** : un projet `setup` connecte deux utilisateurs une seule fois et sauvegarde leur session (`storageState`), que les tests réutilisent.
- **Fixture personnalisée** : une fixture automatique bloque les pubs et les trackers pour stabiliser les tests UI.
- **Client API** : un `NotesClient` (dossier `api/`) se connecte une fois et expose la création, lecture, mise à jour et suppression de notes, réutilisables par tous les tests.
- **Tests négatifs** : mauvais mot de passe, email inconnu ou déjà utilisé, mots de passe différents, et réponses d'erreur de l'API (401, 400, 409).
- **Mocking réseau** : `page.route()` pour remplacer une réponse d'API ou modifier la vraie réponse.
- **Tests indépendants** : données uniques générées avec Faker, nettoyage après chaque test, aucune dépendance à l'ordre ou à l'état du compte.
- **Secrets hors du code** : identifiants dans un fichier `.env` en local et dans les secrets GitHub sur la CI.

## Stack

Playwright 1.64 · TypeScript (strict) · Faker · dotenv · GitHub Actions

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
| `npm run test:e2e` | Seulement les tests UI |
| `npm run test:api` | Seulement les tests API |
| `npm run test:all-browsers` | Chromium, Firefox et WebKit |
| `npm run typecheck` | Vérifie les types TypeScript |
| `npm run report` | Ouvre le dernier rapport HTML |

## Structure

```
api/                client de l'API Notes (connexion, CRUD des notes)
fixtures/           test personnalisé (blocage automatique des pubs)
pages/              Page Objects (BasePage, LoginPage, NotesPage, RegisterPage)
tests/auth.setup.ts connexion des utilisateurs avant les tests
tests/e2e/          tests UI (connexion, inscription, notes)
tests/api/          tests API (authentification, notes)
tests/mocking/      tests de mocking réseau
```

## CI

GitHub Actions lance les tests à chaque push et pull request sur `main`/`master`, puis publie le rapport HTML en artefact.
Les identifiants viennent des secrets du dépôt : `USER1_EMAIL`, `USER1_PASSWORD`, `USER2_EMAIL`, `USER2_PASSWORD`.
