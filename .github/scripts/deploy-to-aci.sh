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

RESOURCE_GROUP="${AZURE_RESOURCE_GROUP:?AZURE_RESOURCE_GROUP is required in $ENV_FILE}"
ACI_REGION="${AZURE_LOCATION:?AZURE_LOCATION is required in $ENV_FILE}"
API_NAME="${ACI_API_NAME:-git-api}"
BOT_NAME="${ACI_BOT_NAME:-git-bot}"
API_DNS="${ACI_API_DNS_LABEL:-gitbot-api-$(date +%s)}"
API_PORT="${PORT:-3000}"
CPU="${ACI_CPU:-1}"
MEMORY="${ACI_MEMORY:-1}"

ACR_LOGIN_SERVER="${ACR_LOGIN_SERVER:?ACR_LOGIN_SERVER is required in $ENV_FILE}"
ACR_USERNAME="${ACR_USERNAME:?ACR_USERNAME is required in $ENV_FILE}"
ACR_PASSWORD="${ACR_PASSWORD:?ACR_PASSWORD is required in $ENV_FILE}"
IMAGE_TAG="${IMAGE_TAG:-latest}"
API_IMAGE_NAME="${API_IMAGE_NAME:-git-bot-api}"
BOT_IMAGE_NAME="${BOT_IMAGE_NAME:-git-bot-bot}"

API_IMAGE="$ACR_LOGIN_SERVER/$API_IMAGE_NAME:$IMAGE_TAG"
BOT_IMAGE="$ACR_LOGIN_SERVER/$BOT_IMAGE_NAME:$IMAGE_TAG"

if az container show --resource-group "$RESOURCE_GROUP" --name "$API_NAME" >/dev/null 2>&1; then
  az container delete --resource-group "$RESOURCE_GROUP" --name "$API_NAME" --yes
fi

if az container show --resource-group "$RESOURCE_GROUP" --name "$BOT_NAME" >/dev/null 2>&1; then
  az container delete --resource-group "$RESOURCE_GROUP" --name "$BOT_NAME" --yes
fi

az container create \
  --resource-group "$RESOURCE_GROUP" \
  --name "$API_NAME" \
  --location "$ACI_REGION" \
  --image "$API_IMAGE" \
  --cpu "$CPU" \
  --memory "$MEMORY" \
  --registry-login-server "$ACR_LOGIN_SERVER" \
  --registry-username "$ACR_USERNAME" \
  --registry-password "$ACR_PASSWORD" \
  --ip-address Public \
  --dns-name-label "$API_DNS" \
  --ports "$API_PORT" \
  --os-type Linux \
  --restart-policy Always \
  --environment-variables \
  NODE_ENV="$NODE_ENV" \
  PORT="$PORT" \
  DISCORD_CLIENT_ID="$DISCORD_CLIENT_ID" \
  DISCORD_GUILD_ID="$DISCORD_GUILD_ID" \
  GITHUB_OWNER="$GITHUB_OWNER" \
  GITHUB_REPO="$GITHUB_REPO" \
  --secure-environment-variables \
  DISCORD_BOT_TOKEN="$DISCORD_BOT_TOKEN" \
  GITHUB_PAT="$GITHUB_PAT" \
  GEMINI_API_KEY="$GEMINI_API_KEY"

echo "API container deployed at: http://$API_DNS.$ACI_REGION.azurecontainer.io:$API_PORT"

az container create \
  --resource-group "$RESOURCE_GROUP" \
  --name "$BOT_NAME" \
  --location "$ACI_REGION" \
  --image "$BOT_IMAGE" \
  --cpu "$CPU" \
  --memory "$MEMORY" \
  --registry-login-server "$ACR_LOGIN_SERVER" \
  --registry-username "$ACR_USERNAME" \
  --registry-password "$ACR_PASSWORD" \
  --os-type Linux \
  --restart-policy Always \
  --environment-variables \
  NODE_ENV="$NODE_ENV" \
  DISCORD_CLIENT_ID="$DISCORD_CLIENT_ID" \
  DISCORD_GUILD_ID="$DISCORD_GUILD_ID" \
  GITHUB_OWNER="$GITHUB_OWNER" \
  GITHUB_REPO="$GITHUB_REPO" \
  --secure-environment-variables \
  DISCORD_BOT_TOKEN="$DISCORD_BOT_TOKEN" \
  GITHUB_PAT="$GITHUB_PAT" \
  GEMINI_API_KEY="$GEMINI_API_KEY"

echo "Bot container deployed"
