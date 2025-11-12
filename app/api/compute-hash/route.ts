import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const VERIFIER_SERVICE_URL = process.env.NILCC_VERIFIER_URL || "http://localhost:3001";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { dockerComposeContent, nilccVersion = "0.2.1", cpus = 1 } = body;

    if (!dockerComposeContent) {
      return NextResponse.json(
        { error: "dockerComposeContent is required" },
        { status: 400 }
      );
    }

    // Calculate docker-compose hash
    const dockerComposeHash = crypto
      .createHash("sha256")
      .update(dockerComposeContent)
      .digest("hex");

    // Call the nilcc-verifier service
    const response = await fetch(`${VERIFIER_SERVICE_URL}/compute-measurement`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dockerComposeHash,
        nilccVersion,
        cpus,
        vmType: "cpu",
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to compute measurement hash");
    }

    const data = await response.json();

    return NextResponse.json({
      dockerComposeHash: data.dockerComposeHash,
      measurementHash: data.measurementHash,
      nilccVersion: data.nilccVersion,
      cpus: data.cpus,
      vmType: data.vmType,
    });
  } catch (error) {
    console.error("Error computing hash:", error);
    return NextResponse.json(
      {
        error: "Failed to compute measurement hash",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
