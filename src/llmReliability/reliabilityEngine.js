// ============================================================================
// LLM APPLICATION RELIABILITY & FAULT TOLERANCE ENGINE
// Based on Production LLM Reliability Architecture
// Responsible AI & Security Compliant: Zero PII / Zero Copyrighted Materials
// ============================================================================

export const PARSE_MARKUP_TAGS = (rawResponseText, tagName = 'answer') => {
  if (!rawResponseText) return { extractedContent: "", success: false, log: "Empty response text" };

  const startTag = `<${tagName}>`;
  const endTag = `</${tagName}>`;

  if (rawResponseText.includes(startTag) && rawResponseText.includes(endTag)) {
    const extracted = rawResponseText.split(startTag)[1].split(endTag)[0].trim();
    return {
      extractedContent: extracted,
      success: true,
      log: `Successfully extracted content inside <${tagName}> tags.`
    };
  }

  return {
    extractedContent: rawResponseText,
    success: false,
    log: `Warning: Markup tags <${tagName}> not found. Falling back to full response parsing.`
  };
};

export const VALIDATE_OUTPUT_SCHEMA = (jsonText) => {
  if (!jsonText) return { isValid: false, errors: ["Empty JSON payload"], parsedObject: null };

  try {
    const parsed = JSON.parse(jsonText);
    const errors = [];

    if (!parsed.record_id || typeof parsed.record_id !== 'number') {
      errors.push("Field 'record_id' is missing or not a number.");
    }
    if (!parsed.status || typeof parsed.status !== 'string') {
      errors.push("Field 'status' is missing or not a string.");
    }
    if (!parsed.metric_value || typeof parsed.metric_value !== 'number') {
      errors.push("Field 'metric_value' is missing or not a number.");
    }

    return {
      isValid: errors.length === 0,
      errors,
      parsedObject: parsed
    };
  } catch (err) {
    return {
      isValid: false,
      errors: [`JSON Syntax Error: ${err.message}`],
      parsedObject: null
    };
  }
};

export const SIMULATE_RETRY_FALLBACK = (failPrimary = true, failSecondary = false) => {
  const attempts = [];
  const providers = ["OpenAI (Primary)", "Gemini (Backup 1)", "Claude (Backup 2)", "Local Ollama (Fallback)"];

  let temperature = 0.0;
  let currentProviderIdx = 0;

  // Attempt 1: Primary provider
  attempts.push({
    attempt: 1,
    provider: providers[0],
    temperature: temperature.toFixed(1),
    status: failPrimary ? "FAILED_RATE_LIMIT" : "SUCCESS",
    log: failPrimary ? "Primary API 429 Rate Limit encountered." : "Primary API request succeeded."
  });

  if (failPrimary) {
    // Attempt 2: Retry with exponential backoff & temp escalation
    temperature = 0.1;
    attempts.push({
      attempt: 2,
      provider: providers[0],
      temperature: temperature.toFixed(1),
      status: "FAILED_TIMEOUT",
      log: "Retry 1 with backoff 2000ms & Temp=0.1 timed out."
    });

    // Attempt 3: Failover to Secondary Provider
    currentProviderIdx = 1;
    temperature = 0.2;
    attempts.push({
      attempt: 3,
      provider: providers[1],
      temperature: temperature.toFixed(1),
      status: failSecondary ? "FAILED_MODERATION" : "SUCCESS",
      log: failSecondary ? "Backup 1 Content Moderation Refusal." : "Failover to Gemini succeeded!"
    });

    if (failSecondary) {
      // Attempt 4: Failover to Tertiary Provider
      currentProviderIdx = 2;
      temperature = 0.3;
      attempts.push({
        attempt: 4,
        provider: providers[2],
        temperature: temperature.toFixed(1),
        status: "SUCCESS",
        log: "Failover to Claude succeeded! Application response delivered with 99.9% uptime."
      });
    }
  }

  const finalAttempt = attempts[attempts.length - 1];

  return {
    totalAttempts: attempts.length,
    finalStatus: finalAttempt.status === "SUCCESS" ? "RESOLVED_RELIABLE" : "UNRESOLVED",
    finalProvider: finalAttempt.provider,
    attempts
  };
};

export const PYTHON_RELIABILITY_PIPELINE = `# ============================================================================
# PRODUCTION LLM RELIABILITY & FAULT TOLERANCE ENGINE (PYTHON)
# XML Parsing, Pydantic Schema Validation, Retries & Fallback Chain
# ============================================================================

import time
import json
import re
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field, ValidationError

# ── 1. Type-Safe Pydantic Output Model ──────────────────────────────────────
class ServiceStatusReport(BaseModel):
    record_id: int = Field(..., description="Unique integer ID")
    status: str = Field(..., description="Status string: OK, WARN, ERROR")
    metric_value: float = Field(..., description="Numeric metric value")

# ── 2. XML Markup Tag Extractor ──────────────────────────────────────────────
def extract_markup_tag(text: str, tag_name: str = "answer") -> str:
    """Enforce XML tag extraction to guarantee model output consistency"""
    pattern = f"<{tag_name}>(.*?)</{tag_name}>"
    match = re.search(pattern, text, re.DOTALL)
    if match:
        return match.group(1).strip()
    return text.strip()

# ── 3. Multi-Provider Fallback & Exponential Backoff Class ───────────────────
class ReliableLLMClient:
    def __init__(self):
        self.providers = ["OpenAI", "Gemini", "Claude", "Ollama"]

    def execute_with_resilience(self, prompt: str, schema: BaseModel) -> Dict[str, Any]:
        """Executes API calls with backoff retries, temperature step, and failover"""
        max_retries_per_provider = 2
        
        for provider in self.providers:
            temperature = 0.0
            for attempt in range(max_retries_per_provider):
                try:
                    print(f"Executing call via {provider} (Attempt {attempt+1}, Temp={temperature})...")
                    # Simulated API Call
                    raw_response = '<answer>{"record_id": 101, "status": "OK", "metric_value": 98.4}</answer>'
                    
                    # Step A: Parse XML Markup Tag
                    extracted_json = extract_markup_tag(raw_response, "answer")
                    
                    # Step B: Validate Pydantic Schema
                    validated_obj = schema.model_validate_json(extracted_json)
                    
                    return {
                        "success": True,
                        "provider_used": provider,
                        "data": validated_obj.model_dump()
                    }
                except (ValidationError, Exception) as e:
                    print(f"Warning: {provider} attempt {attempt+1} failed: {e}")
                    temperature += 0.1
                    time.sleep(2 ** attempt)  # Exponential backoff
        
        raise RuntimeError("All LLM providers in fallback chain failed!")

# ── Usage Example ────────────────────────────────────────────────────────────
client = ReliableLLMClient()
result = client.execute_with_resilience("Return status of Node 101", ServiceStatusReport)
print("Production Reliable Output:", json.dumps(result, indent=2))
`;
