#!/usr/bin/env bash
set -euo pipefail

ENV_FILE="${ENV_FILE:-.env}"

if [ ! -f "$ENV_FILE" ]; then
  echo "Environment file $ENV_FILE not found"
  exit 1
fi

set -a
. "$ENV_FILE"
set +a

ACR_LOGIN_SERVER="${ACR_LOGIN_SERVER:?ACR_LOGIN_SERVER is required in $ENV_FILE}"
IMAGE_TAG="${IMAGE_TAG:-latest}"
API_IMAGE_NAME="${API_IMAGE_NAME:-git-bot-api}"
BOT_IMAGE_NAME="${BOT_IMAGE_NAME:-git-bot-bot}"

API_IMAGE="$ACR_LOGIN_SERVER/$API_IMAGE_NAME:$IMAGE_TAG"
BOT_IMAGE="$ACR_LOGIN_SERVER/$BOT_IMAGE_NAME:$IMAGE_TAG"

docker buildx build \
  --platform linux/amd64 \
  -f Dockerfile.api \
  -t "$API_IMAGE" \
  --load \
  .

docker buildx build \
  --platform linux/amd64 \
  -f Dockerfile.bot \
  -t "$BOT_IMAGE" \
  --load \
  .

echo "Built images:"
echo "- $API_IMAGE"
echo "- $BOT_IMAGE"