/**
 * Exit-check bank J — complete 12-step pipeline. Same shape.
 */
export const EXIT_CHECKS_J = {
  completepipeline: [
    { q: 'Stage order is reliability order…', o: ['Ingest → index → retrieve → check', 'Retrieve → ingest → check', 'Generate first', 'Any order'], a: 0, e: 'Each stage feeds the next; errors compound downstream.' },
    { q: 'Skipping metadata tagging costs…', o: ['Precision — distractors survive filtering', 'Nothing', 'Recall only', 'Latency'], a: 0, e: 'No tags, no pre-filter: distractors reach ranking.' },
    { q: 'Skipping evaluation costs…', o: ['Invisible drift — nothing catches decay', 'Speed', 'Money saved safely', 'Better recall'], a: 0, e: 'Unevaluated faithfulness is a hope, not a metric.' }
  ]
};
