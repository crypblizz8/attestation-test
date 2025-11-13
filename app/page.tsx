import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <p>demo for allowlist for verify</p>
      <iframe
        src="https://nilcc.nillion.com/api/badge?verificationUrl=https%3A%2F%2Fgithub.com%2FNillionNetwork%2Fblind-module-examples%2Fblob%2Fmain%2Fnilcc%2Fattestation-verification%2Fmeasurement-hash.json&reportUrl=https%3A%2F%2F74850b5b-33e2-493b-982e-43aaad9df1bb.workloads.nilcc.sandbox.nillion.network%2Fnilcc%2Fapi%2Fv2%2Freport"
        width={260}
        height={90}
        style={{ border: 'none' }}
      />
      {/* <iframe
        src="https://nilcc.nillion.com/api/badge?verificationUrl=https%3A%2F%2Fgithub.com%2FNillionNetwork%2Fblind-module-examples%2Fblob%2Fmain%2Fnilcc%2Fattestation-verification%2Fmeasurement-hash.json&reportUrl=https%3A%2F%2F74850b5b-33e2-493b-982e-43aaad9df1bb.workloads.nilcc.sandbox.nillion.network%2Fnilcc%2Fapi%2Fv2%2Freport"
        width={260}
        height={90}
        style={{ border: 'none' }}
      />

      <p>failed demo</p>
      <iframe
        src="https://nilcc.nillion.com/api/badge?verificationUrl=https%3A%2F%2Fgithub.com%2FNillionNetwork%2Fblind-module-examples%2Fblob%2Fmain%2Fnilcc%2Fattestation-verification%2Ffailed-measurement-hash.json&reportUrl=https%3A%2F%2F74850b5b-33e2-493b-982e-43aaad9df1bb.workloads.nilcc.sandbox.nillion.network%2Fnilcc%2Fapi%2Fv2%2Freport"
        width={260}
        height={90}
        scrolling="no"
        style={{ border: 'none' }}
      /> */}
    </main>
  );
}
