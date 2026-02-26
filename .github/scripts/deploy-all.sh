#!/usr/bin/env bash
set -euo pipefail

ENV_FILE="${ENV_FILE:-.env}"

if [ ! -f "$ENV_FILE" ]; then
  echo "Environment file $ENV_FILE not found"
  exit 1
fi

bash ./.github/scripts/build-dockerfile.sh
bash ./.github/scripts/push-image-to-acr.sh
bash ./.github/scripts/deploy-to-aci.sh
