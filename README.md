# nilCC Attestation Verifier

**Verify that nilCC workloads are running expected code within Trusted Execution Environments.**

A complete toolkit for verifying nilCC attestation reports with both embeddable React components and a public verification page.

---

## ✨ Features

- 🔐 **Verify TEE Attestations** - Compare measurement hashes from reports
- 🧩 **Embeddable Badge Component** - Drop into any React/Next.js app
- 🌐 **Public Verification Page** - Standalone tool at `/verify`
- 🔧 **Hash Computation** - Compute expected measurement hashes
- 🐳 **Self-Hosted Verifier Service** - Optional backend for full automation
- 📱 **Mobile Responsive** - Works on all devices

---

## 🚀 Quick Start

### Option 1: Simple (No Backend)

```bash
npm install
npm run dev
```

Visit http://localhost:3000

### Option 2: Full Stack (With Verifier Service)

```bash
docker-compose up
```

Visit http://localhost:3000

**See [QUICKSTART.md](QUICKSTART.md) for detailed setup.**

---

## 📦 What's Included

### Components

**`AttestationBadge`** - Visual verification badge
```tsx
<AttestationBadge
  reportUrl="https://your-workload/nilcc/api/v2/report"
  expectedHash="a6aca421e04458158d4c287cb1682c090198308ee6667e949800bbad5b24ea65..."
/>
```

**`SimpleHashComputer`** - Client-side hash computation
- Computes docker-compose SHA256 in browser
- Generates nilcc-verifier command
- No backend required

**`HashComputer`** - Full hash computation (requires verifier service)
- Computes measurement hash automatically
- Uses backend API

### Pages

- **`/`** - Demo page with examples
- **`/verify`** - Public verification tool

### API Routes

- **`/api/compute-hash`** - Compute measurement hash (requires verifier service)

---

## 🏗️ Architecture

### Simple Mode
```
User → Next.js App → Client-side hash → Manual nilcc-verifier
```

### Full Stack Mode
```
User → Next.js App → API Route → Verifier Service → nilcc-verifier Docker
                                       ↓
                                Measurement Hash
```

---

## 📚 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Get started in 5 minutes
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment options
- **[VERIFIER-SERVICE.md](VERIFIER-SERVICE.md)** - Verifier service API docs

---

## 🎯 Use Cases

### 1. Verify Known Deployments (nilgpt)

```tsx
<AttestationBadge
  reportUrl="https://nilgpt.xyz/nilcc/api/v2/report"
  expectedHash="a6aca421e04458158d4c287cb1682c090198308ee6667e949800bbad5b24ea65b31b8d1ac5faf56e977c45c76647d9b0"
/>
```

### 2. Verify Custom Workloads

1. Paste your docker-compose.yaml
2. Compute measurement hash
3. Deploy to nilCC
4. Verify report matches

### 3. Public Verification Page

Share link: `https://your-domain/verify?reportUrl=...&hash=...`

---

## 🛠️ Tech Stack

- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **js-sha256** (client-side hashing)
- **Docker** (optional, for verifier service)

---

## 📂 Project Structure

```
attestation-test/
├── app/
│   ├── page.tsx                    # Demo page
│   ├── verify/
│   │   └── page.tsx                # Public verification tool
│   └── api/
│       └── compute-hash/
│           └── route.ts            # Hash computation API
├── components/
│   ├── AttestationBadge.tsx        # Main verification badge
│   ├── SimpleHashComputer.tsx      # Client-side hash tool
│   └── HashComputer.tsx            # Full backend hash tool
├── lib/
│   ├── types.ts                    # TypeScript types
│   ├── verify.ts                   # Verification logic
│   └── hash.ts                     # Hash utilities
├── verifier-service/               # Optional backend service
│   ├── index.js                    # Express server
│   ├── Dockerfile                  # Container config
│   └── package.json
├── scripts/
│   └── measurement-hash.sh         # Bash script wrapper
├── docker-compose.yml              # Full stack setup
└── Dockerfile                      # Next.js container
```

---

## 🚢 Deployment Options

### 1. Vercel (Simple - No Backend)
```bash
vercel
```
Users run nilcc-verifier themselves.

### 2. Docker Compose (Full Stack)
```bash
docker-compose up -d
```
Everything bundled, ready to deploy on VPS.

### 3. Hybrid (Vercel + Fly.io)
- Deploy web app to Vercel
- Deploy verifier service to Fly.io
- Connect via environment variable

**See [DEPLOYMENT.md](DEPLOYMENT.md) for complete guide.**

---

## 🔍 How Verification Works

### The Flow

1. **Workload deployed** → nilcc-attester generates report
2. **User fetches report** → `GET /nilcc/api/v2/report`
3. **Extract measurement** → `report.report.measurement`
4. **Compare with expected** → Verify match ✅

### Why Measurement Hashes?

The TEE (AMD SEV-SNP) measures:
- Your workload (docker-compose)
- nilCC runtime (version)
- VM configuration (CPUs, type)

This produces a **measurement hash** that cryptographically proves what code is running.

**Key insight:** You can't just SHA256 your docker-compose. The measurement is computed by nilcc-verifier using the TEE's algorithm.

---

## 💡 Tips

**For known deployments:** Use pre-computed hashes from `measurement-hash-index.json`

**For custom workloads:** Run nilcc-verifier to compute expected hash

**For public verification:** Share URLs with embedded params

**For embedding:** Use `AttestationBadge` component in your app

---

**Ready to verify?** See [QUICKSTART.md](QUICKSTART.md) to get started!
