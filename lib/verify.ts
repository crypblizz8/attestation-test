import type { NilCCReport, VerificationResult } from "./types";

export async function verifyAttestation(
  reportUrl: string,
  expectedHash: string
): Promise<VerificationResult> {
  try {
    // Fetch the attestation report
    const response = await fetch(reportUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch report: ${response.statusText}`);
    }

    const report: NilCCReport = await response.json();

    // Extract measurement hash from report
    const measurement = report.report.measurement;
    const version = report.environment.nilcc_version;

    // Compare measurement with expected hash
    const verified = measurement === expectedHash;

    return {
      verified,
      measurement,
      expectedHash,
      version,
    };
  } catch (error) {
    return {
      verified: false,
      measurement: "",
      expectedHash,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
