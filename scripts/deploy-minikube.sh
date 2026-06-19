#!/usr/bin/env bash
# deploy-minikube.sh
# Deploiement complet de l'application MERN sur Minikube
# Usage : bash scripts/deploy-minikube.sh

set -euo pipefail

NAMESPACE="mern-app"
BACKEND_IMAGE="mern-backend:latest"
FRONTEND_IMAGE="mern-frontend:latest"

log()  { echo "[INFO]  $*"; }
warn() { echo "[WARN]  $*"; }
fail() { echo "[ERROR] $*" >&2; exit 1; }

# Verification des outils requis
for cmd in minikube kubectl docker; do
  command -v "$cmd" &>/dev/null || fail "$cmd n'est pas installe ou pas dans le PATH"
done

# Demarrage Minikube si necessaire
if ! minikube status &>/dev/null; then
  log "Demarrage de Minikube..."
  minikube start --cpus=4 --memory=8192 --driver=docker
else
  log "Minikube est deja en cours d'execution"
fi

# Activer metrics-server pour le HPA
log "Activation de metrics-server..."
minikube addons enable metrics-server

# Les images mern-backend:latest et mern-frontend:latest ont été pré-chargées via `minikube image load`
log "Utilisation des images pré-chargées au lieu de les build (contournement timeout réseau)..."

# Application des manifests Kubernetes
log "Application des manifests Kubernetes..."

kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml

kubectl apply -f k8s/mongodb/pvc.yaml
kubectl apply -f k8s/mongodb/deployment.yaml
kubectl apply -f k8s/mongodb/service.yaml

log "Attente du demarrage de MongoDB..."
kubectl wait --for=condition=ready pod \
  -l app=mongodb \
  -n "$NAMESPACE" \
  --timeout=300s

kubectl apply -f k8s/backend/deployment.yaml
kubectl apply -f k8s/backend/service.yaml
kubectl apply -f k8s/backend/hpa.yaml

log "Attente du demarrage du backend..."
kubectl wait --for=condition=ready pod \
  -l app=backend \
  -n "$NAMESPACE" \
  --timeout=300s

kubectl apply -f k8s/frontend/deployment.yaml
kubectl apply -f k8s/frontend/service.yaml

log "Attente du demarrage du frontend..."
kubectl wait --for=condition=ready pod \
  -l app=frontend \
  -n "$NAMESPACE" \
  --timeout=300s

# Affichage du bilan
echo ""
log "Deploiement termine avec succes !"
echo ""
kubectl get pods     -n "$NAMESPACE"
echo ""
kubectl get services -n "$NAMESPACE"
echo ""
kubectl get hpa      -n "$NAMESPACE"
echo ""

# URL d'acces
FRONTEND_URL=$(minikube service frontend-service -n "$NAMESPACE" --url 2>/dev/null || echo "indisponible")
BACKEND_URL=$(minikube service backend-service   -n "$NAMESPACE" --url 2>/dev/null || echo "indisponible")

log "Frontend  : $FRONTEND_URL"
log "Backend   : $BACKEND_URL"
log "API sante : $BACKEND_URL/health"
