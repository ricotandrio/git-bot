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

if [ -n "${ACR_NAME:-}" ]; then
	az acr login --name "$ACR_NAME"
fi

docker push "$BOT_IMAGE"
docker push "$API_IMAGE"

echo "Pushed images:"
echo "- $API_IMAGE"
echo "- $BOT_IMAGE"

