#!/usr/bin/env bash
set -euo pipefail

cd /repo

export LALA_STATE_DIR="/tmp/lala-test"
export LALA_CONFIG_PATH="${LALA_STATE_DIR}/lala.json"

echo "==> Build"
pnpm build

echo "==> Seed state"
mkdir -p "${LALA_STATE_DIR}/credentials"
mkdir -p "${LALA_STATE_DIR}/agents/main/sessions"
echo '{}' >"${LALA_CONFIG_PATH}"
echo 'creds' >"${LALA_STATE_DIR}/credentials/marker.txt"
echo 'session' >"${LALA_STATE_DIR}/agents/main/sessions/sessions.json"

echo "==> Reset (config+creds+sessions)"
pnpm lala reset --scope config+creds+sessions --yes --non-interactive

test ! -f "${LALA_CONFIG_PATH}"
test ! -d "${LALA_STATE_DIR}/credentials"
test ! -d "${LALA_STATE_DIR}/agents/main/sessions"

echo "==> Recreate minimal config"
mkdir -p "${LALA_STATE_DIR}/credentials"
echo '{}' >"${LALA_CONFIG_PATH}"

echo "==> Uninstall (state only)"
pnpm lala uninstall --state --yes --non-interactive

test ! -d "${LALA_STATE_DIR}"

echo "OK"
