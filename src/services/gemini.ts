import { GoogleGenAI, Type } from "@google/genai";
import { RSKIAAResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const SYSTEM_INSTRUCTION = `
You are RSKIAA — Real-world Signal to Knowledge, Intelligence, Action & Accountability. 
A Responsible AI Intent Bridge engineered for societal benefit.

Your sole purpose is to convert unstructured, messy, real-world inputs (medical notes, emergency reports, weather alerts, incident descriptions, social media crisis posts, environmental hazard reports) into structured, verified, prioritized response intelligence — with full accountability at every step.

════════════════════════════════════════
RESPONSIBLE AI CORE DIRECTIVES (NON-NEGOTIABLE)
════════════════════════════════════════
1. TRANSPARENCY FIRST: State what you know, infer, and guess. Label certainty: CONFIRMED / SUSPECTED / POSSIBLE.
2. HUMAN OVERSIGHT ALWAYS: Include a human_oversight_note. Assist professionals, never replace them.
3. SAFETY OVER COMPLETENESS: Bias toward safer, cautious action. Never fabricate data.
4. PRIVACY BY DEFAULT: Minimize PII.
5. HONEST UNCERTAINTY: Provide granular confidence scores.
6. EXPLAINABILITY: Show reasoning chain and rationales. Include a "do_not_do" list.

════════════════════════════════════════
HARD CONSTRAINTS
════════════════════════════════════════
- Never provide a diagnosis — only differential considerations.
- Never invent data to fill gaps — flag the gap instead.
- Never omit the human_oversight_note.
- Never output prose — always structured JSON.
- Never assign CRITICAL severity without citing specific input fragments.
- Never recommend an irreversible action without a P1 rationale.
- For mental health: center autonomy and dignity, no clinical labels as certainties.

════════════════════════════════════════
TONE & REGISTER
════════════════════════════════════════
- Clinical precision, no emotional language in structured fields.
- Plain English in summary and oversight note.
- Calm and directive.
- Humble about limitations.

Output MUST be a single JSON object matching the RSKIAA schema.
`;

export async function processSignal(input: string): Promise<RSKIAAResponse> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: input,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          rskiaa_version: { type: Type.STRING },
          domain: { type: Type.STRING },
          severity: { type: Type.STRING, enum: ["CRITICAL", "HIGH", "MEDIUM", "LOW"] },
          confidence_percent: { type: Type.NUMBER },
          summary: { type: Type.STRING },
          key_findings: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                finding: { type: Type.STRING },
                significance: { type: Type.STRING, enum: ["HIGH", "MEDIUM", "LOW"] },
                certainty: { type: Type.STRING, enum: ["CONFIRMED", "SUSPECTED", "POSSIBLE"] },
                source_in_input: { type: Type.STRING }
              },
              required: ["finding", "significance", "certainty", "source_in_input"]
            }
          },
          immediate_actions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                priority: { type: Type.INTEGER },
                action: { type: Type.STRING },
                rationale: { type: Type.STRING },
                time_sensitive: { type: Type.BOOLEAN },
                agency_or_role: { type: Type.STRING }
              },
              required: ["priority", "action", "rationale", "time_sensitive", "agency_or_role"]
            }
          },
          do_not_do: { type: Type.ARRAY, items: { type: Type.STRING } },
          missing_information: { type: Type.ARRAY, items: { type: Type.STRING } },
          ai_assumptions: { type: Type.ARRAY, items: { type: Type.STRING } },
          confidence_breakdown: {
            type: Type.OBJECT,
            properties: {
              input_clarity: { type: Type.NUMBER },
              domain_recognition: { type: Type.NUMBER },
              finding_confidence: { type: Type.NUMBER },
              action_confidence: { type: Type.NUMBER }
            },
            required: ["input_clarity", "domain_recognition", "finding_confidence", "action_confidence"]
          },
          human_oversight_note: { type: Type.STRING },
          rskiaa_accountability: {
            type: Type.OBJECT,
            properties: {
              pii_minimized: { type: Type.BOOLEAN },
              uncertainty_stated: { type: Type.BOOLEAN },
              assumptions_disclosed: { type: Type.BOOLEAN },
              human_loop_recommended: { type: Type.BOOLEAN },
              do_not_do_included: { type: Type.BOOLEAN },
              missing_info_flagged: { type: Type.BOOLEAN },
              safe_default_applied: { type: Type.BOOLEAN },
              source_fragments_cited: { type: Type.BOOLEAN }
            },
            required: ["pii_minimized", "uncertainty_stated", "assumptions_disclosed", "human_loop_recommended", "do_not_do_included", "missing_info_flagged", "safe_default_applied", "source_fragments_cited"]
          },
          medical: {
            type: Type.OBJECT,
            properties: {
              differential_considerations: { type: Type.ARRAY, items: { type: Type.STRING } },
              contraindicated_actions: { type: Type.ARRAY, items: { type: Type.STRING } },
              vitals_extracted: { type: Type.OBJECT }
            }
          },
          mental_health: {
            type: Type.OBJECT,
            properties: {
              risk_indicators: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    indicator: { type: Type.STRING },
                    weight: { type: Type.STRING, enum: ["HIGH", "MEDIUM", "LOW"] }
                  }
                }
              },
              protective_factors: { type: Type.ARRAY, items: { type: Type.STRING } },
              resources_to_connect: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    resource: { type: Type.STRING },
                    contact: { type: Type.STRING }
                  }
                }
              },
              sensitivity_note: { type: Type.STRING }
            }
          },
          disaster_public_safety: {
            type: Type.OBJECT,
            properties: {
              vulnerable_populations: { type: Type.ARRAY, items: { type: Type.STRING } },
              perimeter_or_evacuation_note: { type: Type.STRING },
              resource_gaps: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          },
          environmental: {
            type: Type.OBJECT,
            properties: {
              exposure_risks: { type: Type.ARRAY, items: { type: Type.STRING } },
              containment_priorities: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          }
        },
        required: ["rskiaa_version", "domain", "severity", "confidence_percent", "summary", "key_findings", "immediate_actions", "do_not_do", "missing_information", "ai_assumptions", "confidence_breakdown", "human_oversight_note", "rskiaa_accountability"]
      }
    }
  });

  return JSON.parse(response.text);
}
