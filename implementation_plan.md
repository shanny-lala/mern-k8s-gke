# Projet GCP / Kubernetes / MERN – Plan d'Implémentation

Application MERN conteneurisée avec Docker, orchestrée par Kubernetes avec HPA, déployée sur GCP.

## État Actuel du Projet

| Composant | État | Détails |
|-----------|------|---------|
| Frontend | Template Vite+React par défaut | Aucune logique métier |
| Backend | Express minimal (1 route `/`) | Pas de connexion MongoDB, pas de structure |
| MongoDB | Non configuré | Mongoose installé mais non utilisé |
| Docker | Inexistant | Aucun Dockerfile |
| Kubernetes | Inexistant | Aucun manifest YAML |

## User Review Required

> [!IMPORTANT]
> **Choix du domaine métier** : Pour l'application MERN, je propose un **système de gestion de tâches (Task Manager)** — suffisamment simple pour le scope académique, mais assez riche pour démontrer les opérations CRUD, le responsive design, et le scaling. C'est aussi un bon candidat pour les tests de charge (beaucoup de requêtes GET/POST).

> [!IMPORTANT]
> **MongoDB** : Souhaitez-vous utiliser MongoDB en local (via Docker dans le cluster), ou préférez-vous MongoDB Atlas (cloud) ? Je recommande **MongoDB dans le cluster Kubernetes** pour la cohérence du projet.

## Open Questions

1. **Nom du projet / de l'application** : Avez-vous un nom spécifique en tête ?
2. **Docker Hub** : Avez-vous un compte Docker Hub pour pousser les images ? Sinon, je configurerai pour Minikube local d'abord.
3. **Projet GCP** : Avez-vous déjà un projet GCP créé ? Si oui, quel est l'ID ?

---

## Proposed Changes

### Architecture Clean Code

```
GCP/
├── backend/                    # API Node.js/Express
│   ├── src/
│   │   ├── config/             # Configuration (DB, env, constants)
│   │   ├── controllers/        # Contrôleurs (logique des routes)
│   │   ├── middleware/         # Middleware (error handler, validation, cors)
│   │   ├── models/            # Modèles Mongoose
│   │   ├── routes/            # Définition des routes
│   │   ├── services/          # Logique métier
│   │   ├── utils/             # Utilitaires
│   │   └── app.js             # Configuration Express
│   ├── server.js              # Point d'entrée (lance le serveur)
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env.example
│   └── package.json
│
├── frontend/                   # React + Vite
│   ├── src/
│   │   ├── assets/            # Images, icônes
│   │   ├── components/        # Composants réutilisables
│   │   │   ├── common/        # Header, Footer, Loading, etc.
│   │   │   └── tasks/         # Composants spécifiques aux tâches
│   │   ├── pages/             # Pages (Home, Tasks, About)
│   │   ├── services/          # Appels API (axios/fetch)
│   │   ├── hooks/             # Custom hooks React
│   │   ├── context/           # Context API (state global)
│   │   ├── styles/            # CSS modules ou fichiers CSS
│   │   ├── utils/             # Fonctions utilitaires
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── nginx.conf             # Config Nginx pour production
│   └── package.json
│
├── k8s/                        # Manifests Kubernetes
│   ├── namespace.yaml
│   ├── configmap.yaml
│   ├── secret.yaml
│   ├── mongodb/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   └── pvc.yaml           # Persistent Volume Claim
│   ├── backend/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   └── hpa.yaml
│   ├── frontend/
│   │   ├── deployment.yaml
│   │   └── service.yaml
│   └── ingress.yaml           # (optionnel) Ingress controller
│
├── docker-compose.yaml         # Pour tests locaux
├── .gitignore
└── README.md
```

---

### Phase 1 : Restructuration Backend (Clean Architecture)

#### [MODIFY] [server.js](file:///home/shanny/dev/GCP/backend/server.js)
- Simplifier en point d'entrée uniquement : importer `app` et lancer `listen()`
- Connexion MongoDB au démarrage avec gestion gracieuse des erreurs

#### [NEW] src/app.js
- Configuration Express : middleware CORS, JSON parser, error handler
- Montage des routes

#### [NEW] src/config/database.js
- Connexion Mongoose avec retry logic et logs

#### [NEW] src/config/index.js
- Centralisation de toutes les variables d'environnement

#### [NEW] src/models/Task.js
- Schéma Mongoose : `title`, `description`, `status` (pending/in-progress/completed), `priority` (low/medium/high), `createdAt`, `updatedAt`

#### [NEW] src/controllers/taskController.js
- `getAllTasks` — GET /api/tasks (avec filtres et pagination)
- `getTaskById` — GET /api/tasks/:id
- `createTask` — POST /api/tasks
- `updateTask` — PUT /api/tasks/:id
- `deleteTask` — DELETE /api/tasks/:id
- `getTaskStats` — GET /api/tasks/stats (pour le dashboard)

#### [NEW] src/services/taskService.js
- Logique métier découplée des contrôleurs

#### [NEW] src/routes/taskRoutes.js
- Définition des routes avec les contrôleurs

#### [NEW] src/routes/healthRoutes.js
- `GET /health` — Liveness probe pour Kubernetes
- `GET /ready` — Readiness probe (vérifie la connexion MongoDB)

#### [NEW] src/middleware/errorHandler.js
- Middleware global de gestion d'erreurs

#### [NEW] src/middleware/validateRequest.js
- Validation des requêtes entrantes

#### [NEW] src/utils/ApiError.js
- Classe d'erreur personnalisée avec codes HTTP

#### [NEW] src/utils/logger.js
- Logger structuré (console avec timestamps pour le scope académique)

#### [MODIFY] [package.json](file:///home/shanny/dev/GCP/backend/package.json)
- Ajouter scripts : `start`, `dev` (avec nodemon)
- Ajouter dépendances : `dotenv`, `morgan`, `helmet`
- Ajouter devDependencies : `nodemon`

#### [NEW] .env.example
- Template des variables d'environnement

---

### Phase 2 : Développement Frontend (UI Moderne)

#### [MODIFY] [App.jsx](file:///home/shanny/dev/GCP/frontend/src/App.jsx)
- Remplacer le template Vite par l'application Task Manager
- Routing entre les pages (Dashboard, Tasks, About)

#### [NEW] src/services/api.js
- Client HTTP centralisé avec base URL configurable
- Fonctions CRUD pour les tâches

#### [NEW] src/components/common/Header.jsx
- Barre de navigation avec logo et liens

#### [NEW] src/components/common/Footer.jsx
- Pied de page avec infos projet

#### [NEW] src/components/common/LoadingSpinner.jsx
- Indicateur de chargement animé

#### [NEW] src/components/common/StatusBadge.jsx
- Badge coloré pour les statuts des tâches

#### [NEW] src/components/tasks/TaskCard.jsx
- Carte individuelle pour une tâche avec actions

#### [NEW] src/components/tasks/TaskList.jsx
- Liste de tâches avec filtres (status, priority)

#### [NEW] src/components/tasks/TaskForm.jsx
- Formulaire de création/modification d'une tâche

#### [NEW] src/components/tasks/TaskStats.jsx
- Statistiques visuelles (compteurs, indicateurs)

#### [NEW] src/pages/DashboardPage.jsx
- Vue d'ensemble : stats, tâches récentes, actions rapides

#### [NEW] src/pages/TasksPage.jsx
- Liste complète avec filtres, recherche et pagination

#### [NEW] src/pages/AboutPage.jsx
- Description du projet, architecture, technologies

#### [NEW] src/context/TaskContext.jsx
- State management global pour les tâches

#### [NEW] src/hooks/useTasks.js
- Custom hook pour la logique des tâches

#### Design System :
- **Palette** : Dark mode avec accents bleu/cyan (#0ea5e9, #06b6d4) sur fond sombre (#0f172a, #1e293b)
- **Typography** : Google Font "Inter"
- **Effets** : Glassmorphism sur les cards, micro-animations hover, gradients subtils
- **Responsive** : Mobile-first

#### [MODIFY] [package.json](file:///home/shanny/dev/GCP/frontend/package.json)
- Ajouter : `react-router-dom`, `axios`, `react-icons`

---

### Phase 3 : Dockerisation

#### [NEW] backend/Dockerfile
```dockerfile
# Multi-stage build pour optimisation
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 5000
USER node
CMD ["node", "server.js"]
```

#### [NEW] frontend/Dockerfile
```dockerfile
# Multi-stage : build React + serve via Nginx
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

#### [NEW] frontend/nginx.conf
- Configuration Nginx optimisée pour SPA React
- Proxy pass vers l'API backend

#### [NEW] docker-compose.yaml
- Services : frontend, backend, mongodb
- Réseau interne
- Volume persistant pour MongoDB
- Variables d'environnement

#### [NEW] backend/.dockerignore / frontend/.dockerignore
- Exclure `node_modules`, `.env`, etc.

---

### Phase 4 : Kubernetes Manifests

#### [NEW] k8s/namespace.yaml
- Namespace `mern-app` pour isoler les ressources

#### [NEW] k8s/configmap.yaml
- Variables non sensibles : `MONGODB_HOST`, `API_PORT`, `NODE_ENV`

#### [NEW] k8s/secret.yaml
- Variables sensibles : `MONGODB_URI`, credentials (base64)

#### [NEW] k8s/mongodb/deployment.yaml
- 1 réplica MongoDB
- Montage du PVC pour persistance

#### [NEW] k8s/mongodb/service.yaml
- Service ClusterIP pour accès interne

#### [NEW] k8s/mongodb/pvc.yaml
- PersistentVolumeClaim de 1Gi

#### [NEW] k8s/backend/deployment.yaml
- 2 réplicas minimum
- Liveness & Readiness probes (`/health`, `/ready`)
- Resource requests/limits (CPU: 100m-500m, Memory: 128Mi-256Mi)
- Variables d'env depuis ConfigMap et Secret

#### [NEW] k8s/backend/service.yaml
- Service ClusterIP (ou NodePort pour Minikube)

#### [NEW] k8s/backend/hpa.yaml
- Min replicas : 2
- Max replicas : 10
- Target CPU utilization : 50%
- Target Memory utilization : 70%

#### [NEW] k8s/frontend/deployment.yaml
- 2 réplicas
- Health checks sur port 80

#### [NEW] k8s/frontend/service.yaml
- Service NodePort (ou LoadBalancer sur GKE)

---

### Phase 5 : Scripts & Documentation

#### [NEW] scripts/deploy-minikube.sh
- Script automatisé : démarrer Minikube, build images, apply manifests

#### [NEW] scripts/load-test.sh
- Script Apache Benchmark : `ab -n 10000 -c 100 <URL>`
- Affichage des résultats avant/après HPA

#### [NEW] scripts/seed-db.js
- Script pour insérer des données de test dans MongoDB

#### [NEW] README.md
- Documentation complète : installation, architecture, déploiement, tests

---

## Verification Plan

### Automated Tests

1. **Backend API** :
   ```bash
   # Vérifier que le serveur démarre
   curl http://localhost:5000/health
   
   # Tester les endpoints CRUD
   curl -X POST http://localhost:5000/api/tasks -H "Content-Type: application/json" -d '{"title":"Test","description":"Description"}'
   curl http://localhost:5000/api/tasks
   ```

2. **Docker** :
   ```bash
   docker-compose up --build
   # Vérifier que tous les services sont accessibles
   ```

3. **Kubernetes** :
   ```bash
   kubectl get pods -n mern-app
   kubectl get hpa -n mern-app
   # Test de charge
   ab -n 10000 -c 100 http://<MINIKUBE_IP>:<NODE_PORT>/api/tasks
   kubectl get hpa -n mern-app --watch  # Observer l'autoscaling
   ```

### Manual Verification

- Vérifier l'interface frontend dans le navigateur
- Tester les opérations CRUD via l'interface
- Observer le HPA créer de nouveaux pods pendant le test de charge
- Vérifier la persistance des données après restart des pods

---

## Ordre d'Exécution

| Étape | Description | Durée estimée |
|-------|-------------|---------------|
| 1 | Restructuration backend + API CRUD | ~30 min |
| 2 | Frontend React (UI + appels API) | ~40 min |
| 3 | Dockerfiles + docker-compose | ~15 min |
| 4 | Kubernetes manifests + HPA | ~20 min |
| 5 | Scripts, seed data, documentation | ~15 min |

> [!NOTE]
> L'implémentation suivra une approche **bottom-up** : d'abord le backend (fondation), puis le frontend (consommateur), puis Docker (conteneurisation), et enfin Kubernetes (orchestration). Chaque phase sera testée indépendamment avant de passer à la suivante.
