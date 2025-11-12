"use client";

import { useEffect, useState } from "react";
import { verifyAttestation } from "@/lib/verify";
import type { VerificationResult } from "@/lib/types";

interface AttestationBadgeProps {
  reportUrl: string;
  expectedHash: string;
}

export function AttestationBadge({ reportUrl, expectedHash }: AttestationBadgeProps) {
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verify() {
      setLoading(true);
      const verificationResult = await verifyAttestation(reportUrl, expectedHash);
      setResult(verificationResult);
      setLoading(false);
    }

    verify();
  }, [reportUrl, expectedHash]);

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-gray-300 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center space-x-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
          <span className="text-gray-600 dark:text-gray-300">Verifying attestation...</span>
        </div>
      </div>
    );
  }

  if (result?.error) {
    return (
      <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-6 dark:border-yellow-800 dark:bg-yellow-950">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <div className="font-semibold text-yellow-800 dark:text-yellow-200">Unable to Verify</div>
            <div className="text-sm text-yellow-700 dark:text-yellow-300">{result.error}</div>
          </div>
        </div>
      </div>
    );
  }

  if (result?.verified) {
    return (
      <div className="rounded-lg border border-green-300 bg-green-50 p-6 dark:border-green-800 dark:bg-green-950">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">✅</span>
          <div>
            <div className="font-semibold text-green-800 dark:text-green-200">Verified Attestation</div>
            {result.version && (
              <div className="text-sm text-green-700 dark:text-green-300">Attested on nilCC v{result.version}</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-red-300 bg-red-50 p-6 dark:border-red-800 dark:bg-red-950">
      <div className="flex items-center space-x-3">
        <span className="text-2xl">❌</span>
        <div>
          <div className="font-semibold text-red-800 dark:text-red-200">Verification Failed</div>
          <div className="text-sm text-red-700 dark:text-red-300">Hash mismatch detected</div>
        </div>
      </div>
    </div>
  );
}
