/**
 * Exit-check bank E — AI Engineer Roadmap home tab. Same shape.
 */
export const EXIT_CHECKS_E = {
  airoadmap: [
    { q: 'The roadmap’s 8 stages run…', o: ['Orient → How LLMs → Prompt → Models → Vectors → RAG → Agents → Ship', 'Random order', 'Agents first', 'Ship first'], a: 0, e: 'Serpentine order is dependency order.' },
    { q: 'A stage dot fills when…', o: ['Its topics are proven via exit checks', 'You open the page', 'A week passes', 'You bookmark it'], a: 0, e: 'Visits don’t fill dots; proof does.' },
    { q: 'The week planner re-weights stages by…', o: ['Goal, and fast-forwards by background', 'Moon phase', 'Token price', 'Nothing'], a: 0, e: 'RAG goal weights retrieval; dev background skips orientation.' }
  ]
};
