# Enterprise Document Intelligence [Vol.1 #13]
## RAG Workflow and Loop Engineering: The Dispatcher That Decides When to Loop and When to Stop

### 1. Architectural Overview
Enterprise document intelligence systems frequently require combining multiple retrieval and reasoning patterns (TOC jump, two-hop cross-referencing, listing aggregation, adaptive vision parsing) on a single complex question.

Instead of handing orchestration to an unconstrained LLM agent (where prompt loops can drift, hallucinate, or burn infinite budget), an enterprise pipeline relies on **deterministic, auditable workflow engineering**:
1. **The Dispatcher (`decide_pipeline_patterns`)**: Turns the `ParsedQuestion` and `DocumentProfile` into an upfront explicit plan of pattern activations.
2. **The Bounded Loop (`pdf_qa_loop` + `iterate_with_bound`)**: Executes passes, critiques provisional outputs via typed feedback flags, and queues targeted recovery actions.
3. **The Decision Gate (`should_continue`)**: Enforces multi-dimensional termination conditions in code to guarantee convergence.

```
Incoming Question + Document Profile
                │
                ▼
   [ Dispatcher (decide.py) ] ──► Computes Activations (TOC, 2-Hop, Listing, Adaptive)
                │
                ▼
   ┌──► [ Pass 1: Parse ➔ Retrieval ➔ Generation ]
   │            │
   │            ▼
   │     [ Typed Feedback ] (complete_answer_found=False, pending_references=['Table 3'])
   │            │
   │            ▼
   │     [ should_continue() Guardrail Gate ] 
   │            ├─► Stable Candidates?  ➔ HALT & RETURN
   │            ├─► Stable Keywords?    ➔ HALT & RETURN
   │            ├─► Confidence Drop?    ➔ HALT & RETURN
   │            └─► Max Bound Hit (4)?  ➔ HALT & RETURN
   │            │ (If healthy)
   └─── Recovery Action: Pass 2 (Two-Hop Reference Resolution)
                │
                ▼
       [ Final Cited Answer ] + [ IterationRecord Compliance Audit Trail ]
```

---

### 2. Dispatcher Decision Rules (`decide_pipeline_patterns`)

| Pattern | Activation Trigger | Rationale |
| :--- | :--- | :--- |
| **`toc_retrieval`** | `doc_profile.has_usable_toc == True` | Navigates directly to candidate chapter/section anchor via PDF bookmarks. |
| **`dense_retrieval`** | `parsed.intent in ('open_scoped', 'open_corpus_wide')` | Fallback when question vocabulary diverges from document text. |
| **`two_hop_references`** | `section_hint` or `layout_hint` or `intent in ('section_retrieval', 'open_scoped')` | Follows cross-clause references and table pointers (e.g. "Table 3"). |
| **`listing_aggregation`** | `parsed.intent == 'listing'` | Guarantees complete enumeration of categories/sub-clauses across pages. |
| **`adaptive_parsing`** | `doc_profile.is_likely_scanned == True` | Triggers high-resolution Vision OCR cascade on degraded/raster pages. |
| **`iterative_feedback`** | Always `True` | Active safety rail monitoring typed generation flags. |

---

### 3. The 4 Termination Conditions (`should_continue`)
1. **Candidate Set Stability**: If Pass $N$ returns the exact same passage IDs as Pass $N-1$, further retrieval will find nothing new. The loop halts.
2. **Keyword Suggestion Stability**: If the LLM repeats identical vocabulary expansion terms, it has reached a knowledge ceiling. Stop iterating.
3. **Confidence Drop Threshold**: If confidence drops by $\Delta \ge 0.10$ between passes, the expansion is introducing noise. The loop halts and returns the highest-confidence prior answer.
4. **Hard Maximum Bound**: Hard ceiling of `max_iterations = 4` (default 3). If exhausted, the pipeline returns the provisional answer with an explicit audit flag.

---

### 4. Query Drift Defense (`expand_query_safely`)
- **The Threat**: Repeated LLM query rewrites drift away from user intent (*"premium"* ➔ *"insurance"* ➔ *"reinsurance economics"*).
- **The Defense**: Original anchor keywords are frozen in place. Discovered terms are appended and capped at 15 keywords max.

---

### 5. Production Python Reference Implementation

```python
from typing import Callable, Any, NamedTuple

class IterationRecord(NamedTuple):
    iteration: int
    trigger: str
    action_taken: str
    confidence: float
    candidates_count: int

def decide_pipeline_patterns(parsed: Any, doc_profile: Any) -> dict[str, bool]:
    activations = {
        "toc_retrieval": False,
        "keyword_retrieval": True,
        "dense_retrieval": False,
        "two_hop_references": False,
        "listing_aggregation": False,
        "adaptive_parsing": False,
        "iterative_feedback": True,
    }
    if getattr(doc_profile, "has_usable_toc", False):
        activations["toc_retrieval"] = True
    if getattr(parsed, "intent", "") in ("open_scoped", "open_corpus_wide"):
        activations["dense_retrieval"] = True
    if getattr(parsed.retrieval, "section_hint", None) or getattr(parsed.retrieval, "layout_hint", None):
        activations["two_hop_references"] = True
    if getattr(parsed, "intent", "") == "listing":
        activations["listing_aggregation"] = True
    if getattr(doc_profile, "is_likely_scanned", False):
        activations["adaptive_parsing"] = True
    return activations

def should_continue(history: list, current: Any, confidence_drop_threshold: float = 0.1) -> bool:
    if history:
        prev = history[-1]
        if getattr(prev, "candidates", None) == current.candidates:
            return False
        if getattr(prev, "suggested_keywords", None) == current.suggested_keywords:
            return False
        prev_conf = getattr(prev, "confidence", None)
        if prev_conf is not None and current.confidence < prev_conf - confidence_drop_threshold:
            return False
    return current.needs_iteration()
```
