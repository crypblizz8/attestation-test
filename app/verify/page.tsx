"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AttestationBadge } from "@/components/AttestationBadge";
import { SimpleHashComputer } from "@/components/SimpleHashComputer";

export default function VerifyPage() {
  const searchParams = useSearchParams();

  const [reportUrl, setReportUrl] = useState("");
  const [expectedHash, setExpectedHash] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [copied, setCopied] = useState(false);

  // Pre-populate from URL parameters
  useEffect(() => {
    const urlParam = searchParams.get("reportUrl");
    const hashParam = searchParams.get("hash");

    if (urlParam) {
      setReportUrl(urlParam);
    }
    if (hashParam) {
      setExpectedHash(hashParam);
    }
    if (urlParam && hashParam) {
      setShowResult(true);
    }
  }, [searchParams]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResult(true);
  };

  const handleReset = () => {
    setReportUrl("");
    setExpectedHash("");
    setShowResult(false);
    setCopied(false);
  };

  const handleCopyShareLink = () => {
    const shareUrl = `${window.location.origin}/verify?reportUrl=${encodeURIComponent(reportUrl)}&hash=${encodeURIComponent(expectedHash)}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-24">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/"
            className="mb-6 inline-block text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            ← Back to Demo
          </Link>
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold">nilCC Attestation Verifier</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Verify that nilCC workloads are running expected code within Trusted Execution Environments
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="mb-8 rounded-lg border border-gray-300 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <form onSubmit={handleVerify} className="space-y-6">
            {/* Report URL */}
            <div>
              <label htmlFor="reportUrl" className="mb-2 block text-sm font-semibold">
                Report URLs
              </label>
              <input
                id="reportUrl"
                type="url"
                required
                value={reportUrl}
                onChange={(e) => setReportUrl(e.target.value)}
                placeholder="https://[workload-id].workloads.nilcc.sandbox.nillion.network/nilcc/api/v2/report"
                className="w-full rounded border border-gray-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800"
              />
            </div>

            {/* Expected Hash */}
            <div>
              <label htmlFor="expectedHash" className="mb-2 block text-sm font-semibold">
                Expected Measurement Hash
              </label>
              <input
                id="expectedHash"
                type="text"
                required
                value={expectedHash}
                onChange={(e) => setExpectedHash(e.target.value)}
                placeholder="a6aca421e04458158d4c287cb1682c090198308ee6667e949800bbad5b24ea65..."
                className="w-full rounded border border-gray-300 bg-white px-4 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 rounded bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Verify Attestation
              </button>
              {showResult && (
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
        {showResult && reportUrl && expectedHash && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Verification Result</h2>
              <button
                onClick={handleCopyShareLink}
                className="rounded border border-gray-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
              >
                {copied ? "✓ Copied!" : "Share Link"}
              </button>
            </div>
            <AttestationBadge reportUrl={reportUrl} expectedHash={expectedHash} />
          </div>
        )}

        {/* Hash Computer Section */}
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-semibold">Compute Expected Hash</h2>
          <SimpleHashComputer />
        </div>

        {/* Info Section */}
        <div className="mt-12 space-y-6 rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-neutral-800 dark:bg-neutral-900/50">
          <h3 className="text-lg font-semibold">What is Attestation Verification?</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            nilCC workloads run in Trusted Execution Environments (TEEs) with hardware-guaranteed privacy.
            The measurement hash cryptographically proves that the workload is running the expected code
            without tampering.
          </p>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">How it works:</h4>
            <ol className="list-inside list-decimal space-y-1 text-sm text-gray-700 dark:text-gray-300">
              <li>The attestation report is fetched from the workload URL</li>
              <li>The measurement hash is extracted from the report</li>
              <li>The measurement is compared with the expected hash</li>
              <li>A match confirms the workload is running the expected code</li>
            </ol>
          </div>
        </div>
      </div>
    </main>
  );
}
