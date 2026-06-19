#!/usr/bin/env bash
# load-test.sh
# Test de charge Apache Benchmark sur le backend
# Usage : bash scripts/load-test.sh [URL_BASE]
# Exemple : bash scripts/load-test.sh http://192.168.49.2:30500

set -euo pipefail

NAMESPACE="mern-app"

log()  { echo "[INFO]  $*"; }
warn() { echo "[WARN]  $*"; }
fail() { echo "[ERROR] $*" >&2; exit 1; }

command -v ab &>/dev/null || fail "Apache Benchmark (ab) n'est pas installe. Installer avec : sudo apt-get install apache2-utils"
command -v kubectl &>/dev/null || fail "kubectl n'est pas installe"

# Determiner l'URL de base
if [ -n "${1:-}" ]; then
  BASE_URL="$1"
else
  log "Recuperation de l'URL du service backend via Minikube..."
  BASE_URL=$(minikube service backend-service -n "$NAMESPACE" --url 2>/dev/null | head -1)
  [ -z "$BASE_URL" ] && fail "Impossible de recuperer l'URL. Passez l'URL en argument : bash scripts/load-test.sh http://<IP>:<PORT>"
fi

TARGET_URL="${BASE_URL}/api/tasks"

log "URL cible        : $TARGET_URL"
log "Etat HPA initial :"
kubectl get hpa -n "$NAMESPACE" 2>/dev/null || warn "HPA non disponible"
echo ""

# Phase 1 : test leger (verification de connectivite)
log "Phase 1 : Test de connectivite (100 requetes, concurrence 10)..."
ab -n 100 -c 10 -q "$TARGET_URL" || fail "Impossible d'atteindre $TARGET_URL"
echo ""

# Phase 2 : montee en charge progressive
log "Phase 2 : Montee en charge (1000 requetes, concurrence 50)..."
ab -n 1000 -c 50 "$TARGET_URL"
echo ""

# Phase 3 : test de charge eleve (declenche le HPA)
log "Phase 3 : Charge elevee (10000 requetes, concurrence 100)..."
log "Observer l'autoscaling dans un autre terminal :"
log "  kubectl get hpa -n $NAMESPACE --watch"
echo ""
ab -n 10000 -c 100 "$TARGET_URL"
echo ""

log "Test termine. Etat HPA final :"
kubectl get hpa -n "$NAMESPACE" 2>/dev/null || warn "HPA non disponible"
echo ""
kubectl get pods -n "$NAMESPACE" 2>/dev/null || true
