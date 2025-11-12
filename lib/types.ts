export interface NilCCReport {
  report: {
    version: number;
    guest_svn: number;
    policy: number;
    family_id: string;
    image_id: string;
    vmpl: number;
    sig_algo: number;
    current_tcb: {
      fmc: string | null;
      bootloader: number;
      tee: number;
      snp: number;
      microcode: number;
    };
    plat_info: number;
    key_info: number;
    report_data: string;
    measurement: string; // KEY FIELD for verification
    host_data: string;
    id_key_digest: string;
    author_key_digest: string;
    report_id: string;
    report_id_ma: string;
    reported_tcb: {
      fmc: string | null;
      bootloader: number;
      tee: number;
      snp: number;
      microcode: number;
    };
    cpuid_fam_id: number;
    cpuid_mod_id: number;
    cpuid_step: number;
    chip_id: string;
    committed_tcb: {
      fmc: string | null;
      bootloader: number;
      tee: number;
      snp: number;
      microcode: number;
    };
    current: {
      major: number;
      minor: number;
      build: number;
    };
    committed: {
      major: number;
      minor: number;
      build: number;
    };
    launch_tcb: {
      fmc: string | null;
      bootloader: number;
      tee: number;
      snp: number;
      microcode: number;
    };
    launch_mit_vector: string | null;
    current_mit_vector: string | null;
    signature: {
      r: string;
      s: string;
    };
  };
  gpu_token: string | null;
  environment: {
    nilcc_version: string;
    vm_type: "cpu" | "gpu";
    cpu_count: number;
  };
}

export interface VerificationResult {
  verified: boolean;
  measurement: string;
  expectedHash: string;
  version?: string;
  error?: string;
}
