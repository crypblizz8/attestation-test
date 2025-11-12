import { sha256 } from "js-sha256";

export function computeDockerComposeHash(content: string): string {
  return sha256(content);
}

export function generateVerifierCommand(
  dockerComposeHash: string,
  nilccVersion: string = "0.2.1",
  cpus: number = 1,
  vmType: string = "cpu"
): string {
  return `docker run --rm ghcr.io/nillionnetwork/nilcc-verifier:0.3.0 measurement-hash ${dockerComposeHash} ${nilccVersion} --vm-type ${vmType} --cpus ${cpus}`;
}
