// ============================================================================
// CROSS-DOC TABLE JOINS ENGINE — schema alignment across documents
// premium_amount vs prime_annuelle; validity-aware joins
// Responsible AI & Security Compliant: Zero PII / synthetic demo data only
// ============================================================================

export const ALIGN_STEPS = [
  { step: 1, name: "Harvest columns", detail: "Per-doc table_df → column inventory + samples + types" },
  { step: 2, name: "Propose mapping", detail: "LLM maps prime_annuelle→premium_amount with confidence + evidence" },
  { step: 3, name: "Human confirm", detail: "Ambiguous (<0.85) mappings need approval; log decisions" },
  { step: 4, name: "Validity join", detail: "JOIN on keys + valid_from<=x<=valid_to; never cross versions" }
];

export const MAPPING_TABLE = [
  { contractA: "premium_amount (decimal)", contractB: "prime_annuelle (decimal)", unified: "premium_amount", conf: 0.97, status: "auto" },
  { contractA: "start_date (date)", contractB: "date_effet (date)", unified: "start_date", conf: 0.93, status: "auto" },
  { contractA: "coverage (varchar)", contractB: "garantie (varchar)", unified: "coverage", conf: 0.72, status: "needs approval" },
  { contractA: "deductible (decimal)", contractB: "— (absent)", unified: "deductible NULL+B", conf: 1.0, status: "nullable" }
];

// ── Simulator: unify two contract tables ────────────────────────────────────
const A = [
  { policy: "PX-1", premium_amount: 1200, start_date: "2024-01-01", coverage: "property" },
  { policy: "PX-2", premium_amount: 950, start_date: "2024-03-01", coverage: "property" }
];
const B = [
  { policy: "PY-1", prime_annuelle: 2100, date_effet: "2024-02-01", garantie: "responsabilité" },
  { policy: "PY-2", prime_annuelle: 780, date_effet: "2024-04-01", garantie: "auto" }
];

export const UNIFY = (approveAmbiguous = true) => {
  const unified = [
    ...A.map(r => ({ policy: r.policy, premium_amount: r.premium_amount, start_date: r.start_date, coverage: r.coverage, src: "A" })),
    ...B.map(r => ({ policy: r.policy, premium_amount: r.prime_annuelle, start_date: r.date_effet, coverage: approveAmbiguous ? r.garantie : "UNMAPPED", src: "B" }))
  ];
  const total = unified.reduce((a, r) => a + r.premium_amount, 0);
  return {
    rows: unified, total,
    sql: "SELECT SUM(premium_amount) FROM unified_schedule;  -- corpus aggregate, impossible pre-alignment",
    warning: approveAmbiguous ? "garantie→coverage approved at 0.72 — spot-check FR translations." : "B coverage UNMAPPED — approve mapping to complete corpus view."
  };
};

export const PYTHON_JOIN_CODE = `# ============================================================================
# CROSS-DOC JOINS: harvest -> propose -> confirm -> validity join
# ============================================================================
MAPPING = {"prime_annuelle": ("premium_amount", 0.97),
           "date_effet": ("start_date", 0.93),
           "garantie": ("coverage", 0.72)}   # <0.85 needs human approval

def unify(rows_b: list[dict], approve: set[str]) -> list[dict]:
    out = []
    for r in rows_b:
        u = {}
        for k, v in r.items():
            target, conf = MAPPING.get(k, (k, 1.0))
            if conf < 0.85 and k not in approve:
                u[target] = "UNMAPPED"
            else:
                u[target] = v
        out.append(u)
    return out

# Joins add validity predicates: ... AND a.valid_from <= x <= a.valid_to
`;
