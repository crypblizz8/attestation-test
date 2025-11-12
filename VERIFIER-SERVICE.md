# nilcc-verifier Service

A self-hosted measurement hash computation service that wraps the nilcc-verifier Docker container with an HTTP API.

## Architecture

```
User → Next.js App → nilcc-verifier Service → nilcc-verifier Docker Container
                           ↓
                    Measurement Hash
```

## Why This Approach?

Instead of requiring users to run `docker run nilcc-verifier` manually, we run it as a persistent service that can be queried via HTTP API.

**Benefits:**
- No manual Docker commands for users
- Fast computation (container is always available)
- Simple REST API
- Can be deployed anywhere (local, cloud, etc)

## Setup

### Option 1: Docker Compose (Recommended)

```bash
# Start both services
docker-compose up

# Your app will be at: http://localhost:3000
# Verifier service at: http://localhost:3001
```

### Option 2: Run Service Standalone

```bash
cd verifier-service

# Install dependencies
npm install

# Start service
npm start

# Service runs on port 3001
```

Then update your `.env.local`:
```
NILCC_VERIFIER_URL=http://localhost:3001
```

## API Reference

### POST /compute-measurement

Computes the measurement hash for a given docker-compose configuration.

**Request:**
```json
{
  "dockerComposeHash": "1d371953fa04141c6385380bde4e9074689def05c4cf9b0d023c737dec278d8c",
  "nilccVersion": "0.2.1",
  "cpus": 1,
  "vmType": "cpu"
}
```

**Response:**
```json
{
  "dockerComposeHash": "1d371953fa04141c6385380bde4e9074689def05c4cf9b0d023c737dec278d8c",
  "measurementHash": "9e2244972be6a17845c6a035c3926a09035b968f31fec4a238d7b3b994610b894f0f72628cb3d7ef9c0586f8efcb84f4",
  "nilccVersion": "0.2.1",
  "cpus": 1,
  "vmType": "cpu"
}
```

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "service": "nilcc-verifier-service"
}
```

## Testing

```bash
# Health check
curl http://localhost:3001/health

# Compute measurement
curl -X POST http://localhost:3001/compute-measurement \
  -H "Content-Type: application/json" \
  -d '{
    "dockerComposeHash": "1d371953fa04141c6385380bde4e9074689def05c4cf9b0d023c737dec278d8c",
    "nilccVersion": "0.2.1",
    "cpus": 1
  }'
```

## How It Works

1. **User pastes docker-compose.yaml** in the web UI
2. **Next.js computes SHA256** of the content (client or server side)
3. **Next.js API calls verifier service** with the hash
4. **Verifier service runs nilcc-verifier** Docker container
5. **Returns measurement hash** to the user

## Deployment

### Local Development
```bash
docker-compose up
```

### Production (Example: Fly.io)
```bash
# Deploy the verifier service
cd verifier-service
fly launch

# Update Next.js env
NILCC_VERIFIER_URL=https://your-verifier-service.fly.dev
```

### Self-Hosted
Run the verifier service on your own infrastructure and point `NILCC_VERIFIER_URL` to it.

## Security Considerations

- The verifier service needs access to Docker socket (`/var/run/docker.sock`)
- Consider rate limiting for public deployments
- The service doesn't validate input beyond basic checks
- Runs nilcc-verifier containers with `--rm` (auto-cleanup)

## Troubleshooting

**Service can't access Docker:**
- Ensure Docker socket is mounted: `-v /var/run/docker.sock:/var/run/docker.sock`
- Check Docker permissions

**Slow first request:**
- First computation pulls the nilcc-verifier image (one-time)
- Subsequent requests are fast (image is cached)

**Container cleanup:**
- Containers are automatically removed after computation (`AutoRemove: true`)
- Cache is persisted in `/tmp/nilcc-verifier-cache`
