// ============================================================================
// TEXT-TO-SQL ENGINE — schema linking, guarded generation, interpret
// Responsible AI & Security Compliant: Zero PII / synthetic demo data only
// ============================================================================

export const SQL_LOOP = [
  { step: 1, name: "Schema link", detail: "Map question terms → tables/columns (premium→schedule.premium)" },
  { step: 2, name: "Guarded generate", detail: "SELECT-only, allow-listed tables, row caps, masked PII" },
  { step: 3, name: "Execute + repair", detail: "Run, fix syntax once from error, else escalate" },
  { step: 4, name: "Interpret", detail: "LLM turns scalar/rows into cited answer + query" }
];

export const GUARD_TABLE = [
  { guard: "Read-only role", blocks: "INSERT/UPDATE/DELETE/DDL — parse AST, reject" },
  { guard: "Table allow-list", blocks: "Off-scope tables (HR, secrets)" },
  { guard: "Row + timeout caps", blocks: "LIMIT 200, 10s timeout, no cartesian" },
  { guard: "PII masking", blocks: "SSN/IBAN masked unless entitled + logged" }
];

export const DIFFICULTY = [
  { level: "Lookup", ex: "Premium for property/CA?", sql: "SELECT premium … WHERE …", risk: "low" },
  { level: "Aggregate", ex: "Total premium by state?", sql: "SELECT state, SUM(premium) … GROUP BY", risk: "medium — check grain" },
  { level: "Join", ex: "Contracts + amendments active?", sql: "JOIN on policy_id + validity dates", risk: "high — fan-out traps" }
];

// ── Simulator: guarded SQL draft ────────────────────────────────────────────
export const DRAFT_SQL = (intent = "lookup", state = "CA", coverage = "property") => {
  const where = `WHERE state = '${state}' AND coverage = '${coverage}'`;
  const sql = intent === "lookup" ? `SELECT premium FROM schedule ${where} LIMIT 5;`
    : intent === "aggregate" ? `SELECT state, SUM(premium) AS total FROM schedule GROUP BY state;`
      : `SELECT c.policy_id, c.premium, a.valid_to FROM contracts c JOIN amendments a ON a.policy_id = c.policy_id ${where};`;
  const guards = ["read-only role ✓", "allow-listed: schedule/contracts ✓", "LIMIT/timeout ✓", intent === "join" ? "⚠ join grain review required" : "grain: single-table ✓"];
  return { sql, guards, cite: "Answer cites SQL + result hash, not a passage." };
};

export const PYTHON_T2S_CODE = `# ============================================================================
# TEXT-TO-SQL: link -> guarded generate -> execute+repair -> interpret
# ============================================================================
import sqlparse
ALLOW = {"schedule", "contracts", "amendments"}

def guard(sql: str) -> list[str]:
    v = []
    ast = sqlparse.parse(sql)[0]
    if ast.get_type() != "SELECT": v.append("non-SELECT rejected")
    if not ALLOW.issuperset(tables_of(ast)): v.append("off-allow-list table")
    if "limit" not in sql.lower(): v.append("missing LIMIT cap")
    return v

def answer(question: str, schema: dict) -> dict:
    linked = link_schema(question, schema)   # terms -> columns
    sql = generate(linked)                   # LLM, SELECT-only prompt
    if guard(sql): return {"error": guard(sql)}
    try:
        rows = execute(sql, timeout_s=10)
    except Exception as e:
        sql = repair(sql, str(e))            # ONE repair, then escalate
        rows = execute(sql, timeout_s=10)
    return {"sql": sql, "rows": rows[:200], "cite": "sql+hash"}
`;
