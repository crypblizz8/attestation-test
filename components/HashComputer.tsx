"use client";

import { useState } from "react";

interface ComputeResult {
  dockerComposeHash: string;
  measurementHash: string;
  nilccVersion: string;
  cpus: number;
  vmType: string;
}

export function HashComputer() {
  const [dockerCompose, setDockerCompose] = useState("");
  const [nilccVersion, setNilccVersion] = useState("0.2.1");
  const [cpus, setCpus] = useState("1");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ComputeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCompute = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/compute-hash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dockerComposeContent: dockerCompose,
          nilccVersion,
          cpus: parseInt(cpus),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to compute hash");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-300 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="mb-4 text-lg font-semibold">Compute Expected Measurement Hash</h3>
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          Paste your docker-compose.yaml content to compute the expected measurement hash for your nilCC workload.
        </p>

        <form onSubmit={handleCompute} className="space-y-4">
          {/* Docker Compose Content */}
          <div>
            <label htmlFor="dockerCompose" className="mb-2 block text-sm font-semibold">
              docker-compose.yaml Content
            </label>
            <textarea
              id="dockerCompose"
              required
              value={dockerCompose}
              onChange={(e) => setDockerCompose(e.target.value)}
              placeholder={`services:\n  app:\n    image: your-image:tag\n    ports:\n      - "3000:3000"`}
              rows={10}
              className="w-full rounded border border-gray-300 bg-white px-4 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800"
            />
          </div>

          {/* nilCC Version */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="nilccVersion" className="mb-2 block text-sm font-semibold">
                nilCC Version
              </label>
              <input
                id="nilccVersion"
                type="text"
                required
                value={nilccVersion}
                onChange={(e) => setNilccVersion(e.target.value)}
                placeholder="0.2.1"
                className="w-full rounded border border-gray-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800"
              />
            </div>

            {/* CPU Count */}
            <div>
              <label htmlFor="cpus" className="mb-2 block text-sm font-semibold">
                CPU Count
              </label>
              <input
                id="cpus"
                type="number"
                required
                min="1"
                max="16"
                value={cpus}
                onChange={(e) => setCpus(e.target.value)}
                className="w-full rounded border border-gray-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Computing..." : "Compute Hash"}
          </button>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4 rounded-lg border border-green-300 bg-green-50 p-6 dark:border-green-800 dark:bg-green-950">
          <h4 className="font-semibold text-green-800 dark:text-green-200">✓ Hash Computed</h4>

          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-green-700 dark:text-green-300">
                Docker Compose Hash (SHA256)
              </label>
              <div className="flex items-center space-x-2">
                <code className="flex-1 rounded bg-white px-3 py-2 font-mono text-xs text-gray-800 dark:bg-neutral-900 dark:text-gray-200">
                  {result.dockerComposeHash}
                </code>
                <button
                  onClick={() => handleCopy(result.dockerComposeHash)}
                  className="rounded border border-green-600 px-3 py-2 text-xs font-medium hover:bg-green-100 dark:hover:bg-green-900"
                >
                  Copy
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-green-700 dark:text-green-300">
                Expected Measurement Hash
              </label>
              <div className="flex items-center space-x-2">
                <code className="flex-1 rounded bg-white px-3 py-2 font-mono text-xs text-gray-800 dark:bg-neutral-900 dark:text-gray-200">
                  {result.measurementHash}
                </code>
                <button
                  onClick={() => handleCopy(result.measurementHash)}
                  className="rounded border border-green-600 px-3 py-2 text-xs font-medium hover:bg-green-100 dark:hover:bg-green-900"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2 text-xs">
              <div>
                <span className="font-semibold text-green-700 dark:text-green-300">nilCC Version:</span>{" "}
                <span className="text-green-800 dark:text-green-200">{result.nilccVersion}</span>
              </div>
              <div>
                <span className="font-semibold text-green-700 dark:text-green-300">CPUs:</span>{" "}
                <span className="text-green-800 dark:text-green-200">{result.cpus}</span>
              </div>
              <div>
                <span className="font-semibold text-green-700 dark:text-green-300">VM Type:</span>{" "}
                <span className="text-green-800 dark:text-green-200">{result.vmType}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-green-300 pt-4 dark:border-green-700">
            <p className="text-xs text-green-700 dark:text-green-300">
              Use this <strong>Expected Measurement Hash</strong> to verify your attestation report.
            </p>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-xs text-gray-700 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-gray-300">
        <p className="mb-2 font-semibold">How it works:</p>
        <ol className="list-inside list-decimal space-y-1">
          <li>Your docker-compose.yaml is hashed (SHA256)</li>
          <li>The hash is passed to nilcc-verifier along with version and CPU count</li>
          <li>nilcc-verifier computes the measurement hash that the TEE will produce</li>
          <li>This expected hash can be compared against the actual report</li>
        </ol>
      </div>
    </div>
  );
}
