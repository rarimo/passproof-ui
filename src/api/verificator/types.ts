export interface VerificationLinkRequest {
  id: string
  uniqueness: boolean
  event_id: string
}

export interface VerificationLinkResponse {
  id: string
  type: string
  get_proof_params: string
}

export enum VerificationStatuses {
  NotVerified = 'not_verified',
  Verified = 'verified',
  FailedVerification = 'failed_verification',
  UniquenessCheckFailed = 'uniqueness_check_failed',
}

export interface ZKProof {
  proof: {
    pi_a: string[]
    pi_b: string[][]
    pi_c: string[]
    protocol: string
  }
  pub_signals: string[]
}

export interface VerifiedProofResponse {
  id: string
  type: string
  proof: ZKProof
}
