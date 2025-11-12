# Deployment Guide

## Overview

The nilCC Attestation Verifier consists of two services:
1. **Next.js Web App** - User interface on port 3000
2. **nilcc-verifier Service** - Measurement computation on port 3001

## Quick Start (Local Development)

```bash
# Option 1: Run with Docker Compose (includes verifier service)
docker-compose up

# Option 2: Run locally without Docker
npm install
npm run dev
# Note: HashComputer component won't work without verifier service
```

Visit: http://localhost:3000

---

## Deployment Options

### Option 1: Docker Compose (Recommended for Self-Hosting)

**Pros:** Everything bundled together, easy to deploy
**Cons:** Requires Docker on host machine

```bash
# Clone/copy the project
cd attestation-test

# Start services
docker-compose up -d

# Check logs
docker-compose logs -f

# Stop services
docker-compose down
```

**Deploy to:**
- Your own VPS (DigitalOcean, Linode, etc)
- AWS ECS/Fargate
- Google Cloud Run
- Azure Container Instances

---

### Option 2: Separate Deployment (Web + Verifier)

**Use case:** Deploy web app on Vercel/Netlify, verifier service elsewhere

#### Deploy Web App to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variable in Vercel dashboard:
NILCC_VERIFIER_URL=https://your-verifier-service.com
```

#### Deploy Verifier Service

**Option A: Fly.io**
```bash
cd verifier-service

# Install flyctl
curl -L https://fly.io/install.sh | sh

# Login and launch
fly auth login
fly launch

# Note the URL (e.g., https://your-verifier.fly.dev)
```

**Option B: Railway**
```bash
cd verifier-service

# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

**Option C: Render**
- Connect GitHub repo
- Select `verifier-service` directory
- Deploy as Web Service

---

### Option 3: Vercel + Vercel Edge API (No Separate Service)

**Limitation:** The verifier service needs Docker, which Vercel Edge doesn't support.

**Workaround:** Use SimpleHashComputer instead (client-side hash only, users run nilcc-verifier manually)

```bash
# Deploy to Vercel
vercel

# Users get the command to run:
docker run --rm ghcr.io/nillionnetwork/nilcc-verifier:0.3.0 measurement-hash ...
```

---

### Option 4: AWS Lambda + Docker Layer

**Advanced:** Package nilcc-verifier as Lambda function

1. Create Lambda function with Docker support
2. Package nilcc-verifier container
3. Expose via API Gateway
4. Point Next.js app to Lambda URL

---

## Environment Variables

Create `.env.local` (or `.env` for Docker):

```bash
# Required: URL of the nilcc-verifier service
NILCC_VERIFIER_URL=http://localhost:3001

# For production:
# NILCC_VERIFIER_URL=https://your-verifier-service.com
```

---

## Production Checklist

### Security
- [ ] Enable rate limiting on verifier service
- [ ] Add authentication if exposing publicly
- [ ] Use HTTPS for all endpoints
- [ ] Review Docker socket access (verifier service needs it)

### Performance
- [ ] Enable caching for measurement computations
- [ ] Set up CDN for static assets
- [ ] Monitor Docker container cleanup

### Monitoring
- [ ] Set up health checks (`/health` endpoint)
- [ ] Monitor verifier service errors
- [ ] Track API usage/rate limits

---

## Scaling Considerations

### Single Instance
- Good for: Personal use, small teams
- Handles: ~100 verifications/hour

### Horizontal Scaling
- Deploy multiple verifier service instances
- Load balance between them
- Shared cache volume

### Serverless
- Use AWS Lambda + API Gateway
- Auto-scales with demand
- Pay per use

---

## Troubleshooting

### Verifier service can't start
```bash
# Check Docker is running
docker ps

# Check logs
docker-compose logs nilcc-verifier

# Verify Docker socket access
ls -la /var/run/docker.sock
```

### Web app can't connect to verifier
```bash
# Check environment variable
echo $NILCC_VERIFIER_URL

# Test verifier directly
curl http://localhost:3001/health

# Check network in docker-compose
docker network ls
```

### Slow first computation
- First request pulls nilcc-verifier image (~500MB)
- Subsequent requests use cached image
- Pre-pull image: `docker pull ghcr.io/nillionnetwork/nilcc-verifier:0.3.0`

---

## Cost Estimates

### Self-Hosted (Docker Compose)
- **DigitalOcean Droplet:** $12/month (2GB RAM)
- **Linode Nanode:** $5/month (1GB RAM)
- **AWS EC2 t3.small:** ~$15/month

### Serverless
- **Vercel (Web):** Free tier covers most use
- **Fly.io (Verifier):** ~$5-10/month
- **AWS Lambda:** Pay per invocation (~$0.0001/request)

### Recommended Setup
- **Development:** Local docker-compose (free)
- **Production (low traffic):** Vercel + Fly.io (~$10/month)
- **Production (high traffic):** AWS ECS + Lambda (~$50-100/month)

---

## Alternative: Use SimpleHashComputer Only

If you don't want to deploy the verifier service:

1. Remove verifier service from docker-compose
2. Use `SimpleHashComputer` component instead of `HashComputer`
3. Users get copy-paste command to run themselves
4. No backend infrastructure needed ✅

This is the **simplest** deployment option.
