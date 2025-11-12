const express = require('express');
const Docker = require('dockerode');

const app = express();
const docker = new Docker({ socketPath: '/var/run/docker.sock' });
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'nilcc-verifier-service' });
});

// Compute measurement hash
app.post('/compute-measurement', async (req, res) => {
  try {
    const {
      dockerComposeHash,
      nilccVersion = '0.2.1',
      cpus = 1,
      vmType = 'cpu'
    } = req.body;

    if (!dockerComposeHash) {
      return res.status(400).json({ error: 'dockerComposeHash is required' });
    }

    // Run nilcc-verifier container
    const container = await docker.createContainer({
      Image: 'ghcr.io/nillionnetwork/nilcc-verifier:0.3.0',
      Cmd: [
        'measurement-hash',
        dockerComposeHash,
        nilccVersion,
        '--vm-type',
        vmType,
        '--cpus',
        cpus.toString()
      ],
      HostConfig: {
        AutoRemove: true,
        Binds: ['/tmp/nilcc-verifier-cache:/tmp/nilcc-verifier-cache']
      }
    });

    await container.start();

    // Get output
    const stream = await container.logs({
      follow: true,
      stdout: true,
      stderr: true
    });

    let output = '';
    stream.on('data', (chunk) => {
      output += chunk.toString();
    });

    await new Promise((resolve) => {
      stream.on('end', resolve);
    });

    // Wait for container to finish
    await container.wait();

    // Extract measurement hash (last non-empty line)
    const lines = output.split('\n').filter(line => line.trim());
    const measurementHash = lines[lines.length - 1].trim();

    res.json({
      dockerComposeHash,
      measurementHash,
      nilccVersion,
      cpus,
      vmType
    });

  } catch (error) {
    console.error('Error computing measurement:', error);
    res.status(500).json({
      error: 'Failed to compute measurement hash',
      details: error.message
    });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`nilcc-verifier service listening on port ${PORT}`);
});
