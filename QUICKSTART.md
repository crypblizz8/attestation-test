# Quick Start Guide

## 1. Choose Your Path

### Path A: Full Stack (Web App + Verifier Service)
**Best for:** Self-hosting, full functionality
**Requires:** Docker

### Path B: Simple (Client-Side Only)
**Best for:** Quick deployment, no infrastructure
**Limitation:** Users run nilcc-verifier themselves

---

## Path A: Full Stack Setup

### Step 1: Clone & Install

```bash
cd attestation-test
npm install
```

### Step 2: Start with Docker Compose

```bash
docker-compose up
```

This starts:
- Next.js app on http://localhost:3000
- Verifier service on http://localhost:3001

### Step 3: Test It

Visit http://localhost:3000/verify

1. Paste a docker-compose.yaml:
```yaml
services:
  app:
    image: public.ecr.aws/x8g8t2h7/nilgpt:0.5.2
    ports:
      - "3000:3000"
```

2. Set nilCC version: `0.2.1`
3. Set CPUs: `1`
4. Click "Compute Hash"
5. Get measurement hash ✅

### Step 4: Verify an Attestation

1. Paste report URL: `https://your-workload.nilcc.sandbox.nillion.network/nilcc/api/v2/report`
2. Paste expected hash (from step 3)
3. Click "Verify Attestation"
4. See result ✅ or ❌

---

## Path B: Simple Setup (No Backend)

### Step 1: Install & Run

```bash
cd attestation-test
npm install
npm run dev
```

### Step 2: Visit the App

Go to http://localhost:3000/verify

### Step 3: Compute Hash (Manual)

1. Scroll to "Compute Docker Compose Hash"
2. Paste your docker-compose.yaml
3. Click "Compute Hash"
4. Copy the command shown
5. Run it yourself:
```bash
docker run --rm ghcr.io/nillionnetwork/nilcc-verifier:0.3.0 \
  measurement-hash <hash> 0.2.1 --vm-type cpu --cpus 1
```
6. Use the output as expected hash

### Step 4: Verify

Paste report URL + hash → Verify ✅

---

## Common Use Cases

### Use Case 1: Verify nilgpt Deployment

```bash
# Get nilgpt report
curl https://nilgpt.xyz/nilcc/api/v2/report

# In the app:
# Report URL: https://nilgpt.xyz/nilcc/api/v2/report
# Expected hash: a6aca421e04458158d4c287cb1682c090198308ee6667e949800bbad5b24ea65b31b8d1ac5faf56e977c45c76647d9b0
# (from measurement-hash-index.json for v0.5.2)
```

### Use Case 2: Verify Custom Workload

```bash
# 1. Get your docker-compose hash
# 2. Compute measurement hash
# 3. Deploy to nilCC
# 4. Verify attestation report matches
```

### Use Case 3: Embed Badge in Your App

```tsx
import { AttestationBadge } from '@/components/AttestationBadge'

<AttestationBadge
  reportUrl="https://your-workload/nilcc/api/v2/report"
  expectedHash="9e2244972be6..."
/>
```

---

## What You Get

### Components

**AttestationBadge**
- Takes: reportUrl + expectedHash
- Shows: ✅ Verified / ❌ Failed / ⏳ Loading

**SimpleHashComputer**
- Client-side hash computation
- Shows command to run
- No backend needed

**HashComputer** (requires verifier service)
- Full computation
- Returns measurement hash
- Backend API required

### Pages

**/** - Demo page with examples
**/verify** - Public verification tool

### API Routes

**/api/compute-hash** - Compute measurement hash (requires verifier service)

---

## Deploy to Production

### Simplest: Vercel (Path B only)

```bash
vercel
```

Done! Users run nilcc-verifier themselves.

### Full Stack: Docker Compose on VPS

```bash
# On your server
git clone ...
cd attestation-test
docker-compose up -d
```

Point domain to your server → Done!

### Hybrid: Vercel + Fly.io

```bash
# Deploy verifier to Fly.io
cd verifier-service
fly launch

# Deploy web to Vercel
vercel --env NILCC_VERIFIER_URL=https://your-verifier.fly.dev
```

---

## Need Help?

**Check logs:**
```bash
docker-compose logs -f
```

**Test verifier:**
```bash
curl http://localhost:3001/health
```

**Rebuild:**
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up
```

---

## Next Steps

- [ ] Customize styling to match your brand
- [ ] Add more examples to demo page
- [ ] Set up monitoring
- [ ] Add rate limiting
- [ ] Deploy to production

That's it! You have a working nilCC attestation verifier.
