// ============================================================================
// MEMORY HIERARCHY & LIFECYCLE ENGINE
// Tiers (working/episodic/semantic), MemGPT paging, forgetting, privacy
// Responsible AI & Security Compliant: Zero PII / synthetic demo data only
// ============================================================================

export const MEMORY_TIERS = [
  { tier: "Working", scope: "Current session, prompt window", capacity: "4k–1M tokens", latency: "instant", evict: "Compaction / summarise on overflow", example: "open task, recent turns" },
  { tier: "Episodic", scope: "Past sessions, per user", capacity: "1k–100k events", latency: "ms (vector + metadata)", evict: "Salience-scored forgetting", example: "user prefers API over UI" },
  { tier: "Semantic", scope: "Cross-user durable facts", capacity: "curated KB", latency: "ms–s (review-gated)", evict: "Human/LLM curation only", example: "refund window = 14 days" },
  { tier: "Cold archive", scope: "Compliance / audit trail", capacity: "unbounded", latency: "s–min", evict: "Retention policy (TTL)", example: "2024 consent logs" }
];

export const MEMGPT_LOOP = [
  { step: 1, name: "Main-context pressure check", detail: "Token budget meter; if >85% trigger paging" },
  { step: 2, name: "Function-call page-out", detail: "LLM emits archival_search / recall to move spans out" },
  { step: 3, name: "External store read", detail: "Vector + metadata fetch into scratchpad" },
  { step: 4, name: "Page-in + continue", detail: "Resume with pointers, not full history" }
];

export const FORGETTING_RULES = [
  { rule: "Recency × salience score", detail: "score = 0.6·salience + 0.3·recency + 0.1·frequency; drop below threshold", keeps: "preferences, corrections, decisions" },
  { rule: "Contradiction supersedes", detail: "New verified fact tombstones old (bitemporal valid_to)", keeps: "latest verified only" },
  { rule: "Privacy redaction first", detail: "PII spans quarantined before salience scoring", keeps: "nothing raw — hashes/pointers only" },
  { rule: "User-erase wins", detail: "'Forget X' deletes + confirms; audit logs the deletion", keeps: "tombstone receipt" }
];

// ── Simulator: route a memory event ─────────────────────────────────────────
export const ROUTE_MEMORY = (kind = "preference", pii = false, verified = true, ageDays = 30, salience = 0.8) => {
  if (pii) return { tier: "Quarantine → Cold archive (hashed)", action: "Redact spans, store pointer + TTL; never in working/episodic raw.", risk: "high if skipped" };
  const recency = Math.max(0, 1 - ageDays / 90);
  const score = 0.6 * salience + 0.3 * recency + 0.1 * 0.5;
  if (kind === "session-fact") return { tier: "Working", action: "Keep in context; compact on overflow.", score: +score.toFixed(2) };
  if (!verified) return { tier: "Episodic (unverified flag)", action: "Retrievable but labelled; promote on verification.", score: +score.toFixed(2) };
  if (score >= 0.5) return { tier: score >= 0.75 ? "Semantic (curated)" : "Episodic", action: score >= 0.75 ? "Promote to durable KB with provenance." : "Keep episodic; re-score on access.", score: +score.toFixed(2) };
  return { tier: "Cold archive", action: "Page out; TTL-governed.", score: +score.toFixed(2) };
};

export const PYTHON_MEMORY_CODE = `# ============================================================================
# MEMORY HIERARCHY: tier + salience forgetting + PII quarantine
# ============================================================================
from dataclasses import dataclass
import time, hashlib

@dataclass
class MemoryEvent:
    text: str; kind: str            # session-fact | preference | correction | decision
    salience: float                # 0..1 (LLM-judged importance)
    ts: float = time.time()
    pii: bool = False
    verified: bool = True

def quarantine(text: str) -> str:
    return "sha256:" + hashlib.sha256(text.encode()).hexdigest()[:16]

def route(ev: MemoryEvent) -> str:
    if ev.pii:
        return f"COLD(hashed={quarantine(ev.text)})"
    age_days = (time.time() - ev.ts) / 86400
    recency = max(0.0, 1 - age_days / 90)
    score = 0.6 * ev.salience + 0.3 * recency + 0.1 * 0.5
    if ev.kind == "session-fact":
        return f"WORKING(score={score:.2f})"
    if not ev.verified:
        return f"EPISODIC-unverified(score={score:.2f})"
    if score >= 0.75:
        return f"SEMANTIC(score={score:.2f})"
    return f"EPISODIC(score={score:.2f})" if score >= 0.5 else f"COLD(score={score:.2f})"

if __name__ == "__main__":
    print(route(MemoryEvent("prefers API over UI", "preference", 0.9)))
    print(route(MemoryEvent("SSN 123-45-6789", "session-fact", 0.9, pii=True)))
`;
