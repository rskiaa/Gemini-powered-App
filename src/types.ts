export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type Certainty = 'CONFIRMED' | 'SUSPECTED' | 'POSSIBLE';
export type Significance = 'HIGH' | 'MEDIUM' | 'LOW';

export interface KeyFinding {
  finding: string;
  significance: Significance;
  certainty: Certainty;
  source_in_input: string;
}

export interface ImmediateAction {
  priority: 1 | 2 | 3;
  action: string;
  rationale: string;
  time_sensitive: boolean;
  agency_or_role: string;
}

export interface ConfidenceBreakdown {
  input_clarity: number;
  domain_recognition: number;
  finding_confidence: number;
  action_confidence: number;
}

export interface RSKIAAAccountability {
  pii_minimized: boolean;
  uncertainty_stated: boolean;
  assumptions_disclosed: boolean;
  human_loop_recommended: boolean;
  do_not_do_included: boolean;
  missing_info_flagged: boolean;
  safe_default_applied: boolean;
  source_fragments_cited: boolean;
}

export interface RSKIAAResponse {
  rskiaa_version: string;
  domain: string;
  severity: Severity;
  confidence_percent: number;
  summary: string;
  key_findings: KeyFinding[];
  immediate_actions: ImmediateAction[];
  do_not_do: string[];
  missing_information: string[];
  ai_assumptions: string[];
  confidence_breakdown: ConfidenceBreakdown;
  human_oversight_note: string;
  rskiaa_accountability: RSKIAAAccountability;

  // Domain-specific extensions
  medical?: {
    differential_considerations: string[];
    contraindicated_actions: string[];
    vitals_extracted: Record<string, any>;
  };
  mental_health?: {
    risk_indicators: { indicator: string; weight: 'HIGH' | 'MEDIUM' | 'LOW' }[];
    protective_factors: string[];
    resources_to_connect: { resource: string; contact: string }[];
    sensitivity_note: string;
  };
  disaster_public_safety?: {
    vulnerable_populations: string[];
    perimeter_or_evacuation_note: string;
    resource_gaps: string[];
  };
  environmental?: {
    exposure_risks: string[];
    containment_priorities: string[];
  };
}
