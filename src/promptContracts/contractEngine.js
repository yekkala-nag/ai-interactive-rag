// ============================================================================
// PROMPT CONTRACT VALIDATION ENGINE (companion: Prompt Management Isn't)
// Schemas, allowed-sections, version pins, breaking-change gates
// Responsible AI & Security Compliant: Zero PII / synthetic demo data only
// ============================================================================

export const CONTRACT_PARTS = [
  { part: "Section manifest", rule: "Prompt declares named sections; unknown sections rejected", breaks: "Rename refund_policy → refunds without alias" },
  { part: "Version pin", rule: "Agents pin component@version; floating imports fail CI", breaks: "Silent upgrade to untested v2" },
  { part: "I/O schema", rule: "JSON schema for inputs/outputs; validate both sides", breaks: "New required field without default" },
  { part: "Capability flags", rule: "Declares tools/data it may touch; overreach blocked", breaks: "Prompt quietly gains delete-tool scope" }
];

export const BREAKING_TABLE = [
  { change: "Reword within section, same intent", breaking: "No", gate: "Auto-pass + sample eval" },
  { change: "Add optional section", breaking: "No", gate: "Auto-pass" },
  { change: "Rename/remove section", breaking: "YES", gate: "Block; require alias + dependents re-eval" },
  { change: "Change output schema", breaking: "YES", gate: "Block; bump major + re-eval consumers" },
  { change: "Widen capability flags", breaking: "YES", gate: "Block; security review" }
];

// ── Simulator: validate a prompt change against its contract ────────────────
export const VALIDATE_CHANGE = (rename = false, schemaChange = false, widerCaps = false, pinned = true) => {
  const violations = [];
  if (rename) violations.push("Section rename without alias (dependents' section refs dangle)");
  if (schemaChange) violations.push("Output schema changed (consumers' parsers break)");
  if (widerCaps) violations.push("Capability widened (tool overreach — security review)");
  if (!pinned) violations.push("Floating version (untested upgrade can ship silently)");
  return {
    verdict: violations.length ? "BLOCKED — breaking contract change" : "PASS — backward compatible",
    violations,
    next: violations.length ? "Add alias + major bump + re-eval candidate set (see dependency graph)." : "Ship + sample-monitor 5%."
  };
};

export const PYTHON_CONTRACT_CODE = `# ============================================================================
# PROMPT CONTRACT: manifest + pins + schema gate (CI check)
# ============================================================================
import json

CONTRACT = {"component": "base-policy", "version": 2,
            "sections": ["refunds", "privacy", "escalation"],
            "output_schema": {"type": "object", "required": ["answer", "citations"]},
            "capabilities": ["read:kb"]}

def validate_change(old: dict, new: dict) -> list[str]:
    v = []
    if set(new["sections"]) - set(old["sections"] | set(old.get("aliases", []))):
        v.append("new sections without alias mapping")
    if set(old["sections"]) - set(new["sections"]):
        v.append("removed/renamed section without alias")
    if new["output_schema"] != old["output_schema"]:
        v.append("output schema changed -> major bump required")
    if set(new["capabilities"]) - set(old["capabilities"]):
        v.append("capability widened -> security review")
    return v

if __name__ == "__main__":
    print(validate_change(CONTRACT, {**CONTRACT, "sections": ["refund", "privacy", "escalation"]}))
`;
