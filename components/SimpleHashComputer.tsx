"use client";

import { useState } from "react";
import { computeDockerComposeHash, generateVerifierCommand } from "@/lib/hash";

export function SimpleHashComputer() {
  const [dockerCompose, setDockerCompose] = useState("");
  const [nilccVersion, setNilccVersion] = useState("0.2.1");
  const [cpus, setCpus] = useState("1");
  const [dockerComposeHash, setDockerComposeHash] = useState("");
  const [verifierCommand, setVerifierCommand] = useState("");

  const handleCompute = (e: React.FormEvent) => {
    e.preventDefault();

    // Compute docker-compose hash client-side
    const hash = computeDockerComposeHash(dockerCompose);
    setDockerComposeHash(hash);

    // Generate command to run nilcc-verifier
    const command = generateVerifierCommand(hash, nilccVersion, parseInt(cpus));
    setVerifierCommand(command);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleReset = () => {
    setDockerCompose("");
    setDockerComposeHash("");
    setVerifierCommand("");
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-300 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="mb-4 text-lg font-semibold">Compute Docker Compose Hash</h3>
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          Paste your docker-compose.yaml content to compute the SHA256 hash.
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

          {/* nilCC Version & CPU Count */}
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

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 rounded bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Compute Hash
            </button>
            {dockerComposeHash && (
              <button
                type="button"
                onClick={handleReset}
                className="rounded border border-gray-300 px-6 py-3 font-semibold transition-colors hover:bg-gray-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
              >
                Reset
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Results */}
      {dockerComposeHash && (
        <div className="space-y-4 rounded-lg border border-green-300 bg-green-50 p-6 dark:border-green-800 dark:bg-green-950">
          <h4 className="font-semibold text-green-800 dark:text-green-200">✓ Docker Compose Hash Computed</h4>

          {/* Docker Compose Hash */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-green-700 dark:text-green-300">
              Docker Compose SHA256 Hash
            </label>
            <div className="flex items-center space-x-2">
              <code className="flex-1 rounded bg-white px-3 py-2 font-mono text-xs text-gray-800 dark:bg-neutral-900 dark:text-gray-200">
                {dockerComposeHash}
              </code>
              <button
                onClick={() => handleCopy(dockerComposeHash)}
                className="rounded border border-green-600 px-3 py-2 text-xs font-medium hover:bg-green-100 dark:hover:bg-green-900"
              >
                Copy
              </button>
            </div>
          </div>

          {/* Verifier Command */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-green-700 dark:text-green-300">
              Run this command to get the Measurement Hash:
            </label>
            <div className="flex items-center space-x-2">
              <code className="flex-1 rounded bg-white px-3 py-2 font-mono text-xs text-gray-800 dark:bg-neutral-900 dark:text-gray-200">
                {verifierCommand}
              </code>
              <button
                onClick={() => handleCopy(verifierCommand)}
                className="rounded border border-green-600 px-3 py-2 text-xs font-medium hover:bg-green-100 dark:hover:bg-green-900"
              >
                Copy
              </button>
            </div>
          </div>

          <div className="border-t border-green-300 pt-4 dark:border-green-700">
            <p className="mb-2 text-xs font-semibold text-green-700 dark:text-green-300">Next steps:</p>
            <ol className="list-inside list-decimal space-y-1 text-xs text-green-700 dark:text-green-300">
              <li>Copy and run the command above (requires Docker)</li>
              <li>The output is your <strong>Expected Measurement Hash</strong></li>
              <li>Use that hash to verify your attestation report</li>
            </ol>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-xs text-gray-700 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-gray-300">
        <p className="mb-2 font-semibold">How it works:</p>
        <ol className="list-inside list-decimal space-y-1">
          <li>Your docker-compose.yaml is hashed (SHA256) in your browser</li>
          <li>You run the nilcc-verifier command with this hash</li>
          <li>nilcc-verifier computes the measurement hash that the TEE will produce</li>
          <li>This expected hash can be compared against the actual attestation report</li>
        </ol>
      </div>
    </div>
  );
}
