# Enterprise Document Intelligence [Vol.1 #14]
## Agentic RAG: Let the Agent Search

### 1. Architectural Overview
Standard RAG treats retrieval as a rigid, single-shot pre-processing step:
$$\text{Query} \xrightarrow{\text{Embedding}} \text{Top-}k \text{ Chunks} \xrightarrow{\text{Context Window}} \text{LLM Output}$$

When answers require **cross-referencing multiple documents**, handling **overriding policy amendments**, or discovering **unforeseen prerequisites**, single-shot retrieval fails because:
1. **Semantic Similarity $\neq$ Usefulness**: High cosine similarity on surface words does not guarantee the chunk contains the governing exception or threshold.
2. **Top-$k$ Information Blindspot**: Critical evidence ranked at position $k+1$ is dropped completely.
3. **Context Split Across Doc Boundaries**: Multiple separate documents must be retrieved and reconciled in sequence.

**Agentic RAG** shifts retrieval from the infrastructure into the model's action space:
```
User Query
   │
   ▼
┌──► [ Reason / Scratchpad ] ──► Decides Next Search Action
│            │
│            ▼
│     [ Tool Execution ]
│            ├─► list_docs()              ➔ Orients to corpus metadata (0 body tokens)
│            ├─► search_docs(keywords)    ➔ Fetches top-3 short snippets (token overlap)
│            └─► read_doc(filename)       ➔ Deep-reads full candidate document
│            │
│            ▼
└─── [ Sufficient Evidence? ]
             │ (No ➔ Loop with new query)
             ▼ (Yes)
   [ Grounded Answer + Citations ]
```

---

### 2. The 3 Curated Tools
A minimal, complete search surface over document corpora:

| Tool | Function Signature | Purpose |
| :--- | :--- | :--- |
| **`list_docs`** | `list_docs() -> list[dict]` | Returns document metadata (`doc_name`, `title`, `effective`, `summary`) without body text. Orients the agent before burning context tokens. |
| **`search_docs`** | `search_docs(query: str) -> list[dict]` | Keyword token overlap search across all chunks. Returns top-3 short snippets ($\le 420$ chars) with section titles and match scores. |
| **`read_doc`** | `read_doc(doc_name: str) -> str` | Returns the complete text of a single document by filename for thorough verification and cross-clause validation. |

---

### 3. Production OpenAI Agents SDK Implementation

```python
from agents import Agent, Runner

INSTRUCTIONS = """
[Role]
You are a careful internal policy research assistant.

[Research Behavior]
1. Answer employee questions using the document tools.
2. Search and read documents until you have sufficient evidence.
3. Keep all conclusions strictly grounded in policy text.

[Expected Output]
- Provide a direct, actionable answer first.
- Explain the evidence and decision rules.
- Cite the exact document filenames used for every claim.
""".strip()

agent = Agent(
    name="Policy Research Assistant",
    instructions=INSTRUCTIONS,
    model="gpt-5.4",
    tools=[list_docs, search_docs, read_doc],
)

# Execute bounded loop with max_turns ceiling
result = await Runner.run(agent, user_query, max_turns=12)
```

---

### 4. 5 Architectural Decisions

1. **How much freedom?**: Start with curated tools (`list`, `search`, `read`). Avoid unrestricted shell/filesystem access unless strictly required.
2. **Raw text only?**: No. Build a knowledge metadata layer (titles, summaries, effective dates) to allow quick orientation.
3. **Do we still need embeddings?**: For small corpora, keyword token overlap is faster, cheaper, and 100% interpretable. For massive corpora, introduce embeddings as an additional tool action.
4. **Single Agent vs Multi-Agent?**: Start with a single agent. Introduce Planner-Retriever-Writer swarms only when research tasks exceed a single context window.
5. **Always default to Agentic RAG?**: No. Use Single-Shot RAG for direct factoids; reserve Agentic loops for multi-hop, cross-document reasoning.
