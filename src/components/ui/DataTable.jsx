import { useState, useMemo, useCallback } from "react";

/**
 * DataTable — interactive, sortable, searchable, highlightable table.
 *
 * Props:
 *  - columns: [{ key, label, numeric?, sortable?, render?(value, row), align? }]
 *  - rows: array of objects keyed by column.key
 *  - caption, searchable (bool), searchKeys (array of keys to search), initialSort ({key, dir}),
 *  - rowKey (key or fn), maxHeight, zebra, highlightOnHover, emptyText
 */

export default function DataTable({
  columns = [],
  rows = [],
  caption,
  searchable = true,
  searchKeys,
  initialSort,
  rowKey = (row, i) => i,
  maxHeight,
  zebra = true,
  highlightOnHover = true,
  emptyText = "No rows match your filter.",
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState(initialSort || null);
  const [selected, setSelected] = useState(null);

  const keys = searchKeys || columns.filter((c) => c.sortable !== false).map((c) => c.key);

  const filtered = useMemo(() => {
    let out = rows;
    const q = query.trim().toLowerCase();
    if (q) {
      out = out.filter((r) =>
        keys.some((k) => String(r[k] ?? "").toLowerCase().includes(q))
      );
    }
    if (sort) {
      const col = columns.find((c) => c.key === sort.key);
      const numeric = col?.numeric;
      out = [...out].sort((a, b) => {
        let av = a[sort.key];
        let bv = b[sort.key];
        if (numeric) {
          av = parseFloat(av); bv = parseFloat(bv);
          return sort.dir === "asc" ? av - bv : bv - av;
        }
        av = String(av).toLowerCase(); bv = String(bv).toLowerCase();
        return sort.dir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      });
    }
    return out;
  }, [rows, query, sort, keys, columns]);

  const toggleSort = useCallback((key) => {
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, dir: "asc" };
      if (prev.dir === "asc") return { key, dir: "desc" };
      return null;
    });
  }, []);

  return (
    <div style={{
      border: "1px solid var(--ds-color-border-subtle)", borderRadius: "var(--ds-radius-lg)",
      overflow: "hidden", background: "var(--ds-color-bg-surface)",
    }}>
      {caption && (
        <div style={{
          padding: "0.6rem 0.9rem", background: "var(--ds-color-bg-surfaceHover)",
          borderBottom: "1px solid var(--ds-color-border-subtle)",
          fontSize: "0.72rem", fontWeight: 600, color: "var(--ds-color-text-secondary)",
          fontFamily: "var(--ds-font-family-sans)",
        }}>
          {caption}
        </div>
      )}

      {searchable && (
        <div style={{ padding: "0.6rem 0.9rem", borderBottom: "1px solid var(--ds-color-border-subtle)" }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="🔍 Filter rows…"
            aria-label="Filter table rows"
            style={{
              width: "100%", padding: "8px 10px", fontSize: "var(--ds-font-size-body)",
              fontFamily: "var(--ds-font-family-sans)", color: "var(--ds-color-text-primary)",
              background: "var(--ds-color-bg-canvas)", border: "1px solid var(--ds-color-border-default)",
              borderRadius: "var(--ds-radius-md)", outline: "none",
            }}
          />
        </div>
      )}

      <div style={{ overflowX: "auto", maxHeight, overflowY: maxHeight ? "auto" : "visible" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--ds-font-size-bodySm)" }}>
          <thead>
            <tr style={{ background: "var(--ds-color-bg-surfaceHover)" }}>
              {columns.map((c) => {
                const isSorted = sort?.key === c.key;
                const sortable = c.sortable !== false;
                return (
                  <th
                    key={c.key}
                    onClick={sortable ? () => toggleSort(c.key) : undefined}
                    style={{
                      position: "sticky", top: 0, zIndex: 1,
                      textAlign: c.numeric ? "right" : "left",
                      padding: "10px 12px", whiteSpace: "nowrap",
                      fontFamily: "var(--ds-font-family-sans)", fontWeight: 700,
                      color: "var(--ds-color-text-secondary)",
                      borderBottom: "1px solid var(--ds-color-border-default)",
                      background: "var(--ds-color-bg-surfaceHover)",
                      cursor: sortable ? "pointer" : "default", userSelect: "none",
                    }}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                      {c.label}
                      {sortable && (
                        <span style={{ opacity: isSorted ? 1 : 0.35, fontSize: "0.7rem" }}>
                          {isSorted ? (sort.dir === "asc" ? "▲" : "▼") : "↕"}
                        </span>
                      )}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={columns.length} style={{ padding: "1.5rem", textAlign: "center", color: "var(--ds-color-text-tertiary)" }}>{emptyText}</td></tr>
            )}
            {filtered.map((row, i) => {
              const key = rowKey(row, i);
              const isSel = selected === key;
              return (
                <tr
                  key={key}
                  onClick={() => setSelected(isSel ? null : key)}
                  style={{
                    background: isSel ? "var(--ds-color-module-foundations-light)" : zebra && i % 2 ? "var(--ds-color-bg-surfaceHover)" : "var(--ds-color-bg-surface)",
                    cursor: "pointer",
                    transition: "background 0.12s",
                  }}
                  onMouseEnter={(e) => { if (highlightOnHover && !isSel) e.currentTarget.style.background = "var(--ds-color-bg-surfaceHover)"; }}
                  onMouseLeave={(e) => { if (highlightOnHover && !isSel) e.currentTarget.style.background = zebra && i % 2 ? "var(--ds-color-bg-surfaceHover)" : "var(--ds-color-bg-surface)"; }}
                >
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      style={{
                        textAlign: c.numeric ? "right" : "left",
                        padding: "9px 12px", borderBottom: "1px solid var(--ds-color-border-subtle)",
                        color: "var(--ds-color-text-primary)", verticalAlign: "top",
                      }}
                    >
                      {c.render ? c.render(row[c.key], row, i) : row[c.key]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ padding: "0.5rem 0.9rem", borderTop: "1px solid var(--ds-color-border-subtle)", fontSize: "0.7rem", color: "var(--ds-color-text-tertiary)", display: "flex", justifyContent: "space-between" }}>
        <span>{filtered.length} / {rows.length} rows</span>
        {selected != null && <span>Row selected · click again to deselect</span>}
      </div>
    </div>
  );
}
