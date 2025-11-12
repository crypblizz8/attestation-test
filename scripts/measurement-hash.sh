#!/bin/bash

set -euo pipefail

SCRIPT_PATH=$(dirname $(realpath $0))
ROOT_PATH="$SCRIPT_PATH/../"

# Configuration - update these based on your deployment
DOCKER_COMPOSE_FILE="${1:-$ROOT_PATH/docker-compose-nilcc.yaml}"
VCPUS="${2:-1}"  # Default to 1 CPU (matches most sandbox deployments)
NILCC_VERSION="${3:-0.2.1}"  # nilCC version
NILCC_VERIFIER_VERSION=0.3.0

# Calculate docker-compose hash
if [ ! -f "$DOCKER_COMPOSE_FILE" ]; then
  echo "Error: Docker compose file not found: $DOCKER_COMPOSE_FILE" >&2
  exit 1
fi

DOCKER_COMPOSE_HASH=$(sha256sum "$DOCKER_COMPOSE_FILE" | cut -d" " -f1)

echo "Computing measurement hash..." >&2
echo "Docker-compose hash: $DOCKER_COMPOSE_HASH" >&2
echo "nilCC version: $NILCC_VERSION" >&2
echo "CPUs: $VCPUS" >&2
echo "VM type: cpu" >&2
echo "" >&2

# Run nilcc-verifier to compute measurement hash
MEASUREMENT_HASH=$(docker run -v/tmp/nilcc-verifier-cache:/tmp/nilcc-verifier-cache --rm ghcr.io/nillionnetwork/nilcc-verifier:$NILCC_VERIFIER_VERSION measurement-hash $DOCKER_COMPOSE_HASH $NILCC_VERSION --vm-type cpu --cpus $VCPUS)

echo "Measurement hash: $MEASUREMENT_HASH" >&2
echo "$MEASUREMENT_HASH"
