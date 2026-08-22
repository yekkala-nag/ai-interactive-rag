// ============================================================================
// DATA HUMANIZATION & STORYTELLING ENGINE
// Beyond Numbers: Escaping the 'Data-Rich, Action-Poor' Paradox
// Responsible AI & Security Compliant: Zero PII / Zero Copyrighted Materials
// ============================================================================

export const KPI_TO_HUMANIZED_INSIGHTS = [
  {
    id: 1,
    symptomKpi: "Cart abandonment rate is 75%",
    humanizedInsight: "75% of shoppers abandon carts. 60% of drop-offs occur specifically at the shipping page, citing unexpected $15.00 delivery fees.",
    impactCategory: "E-Commerce Customer Experience",
    actionPlan: "Display transparent shipping calculators early in checkout to recover ~25% of abandoned carts."
  },
  {
    id: 2,
    symptomKpi: "Project Delta is 30% over budget",
    humanizedInsight: "Budget overrun is driven by 800 hours of unplanned overtime from core engineers fixing scope creep in Module 3.",
    impactCategory: "Engineering Operations",
    actionPlan: "Freeze scope creep in Module 3 and reallocate 2 senior engineers to automated regression testing."
  },
  {
    id: 3,
    symptomKpi: "Production Line B uptime is 88%",
    humanizedInsight: "Line B's 12% downtime is almost entirely due to manual tooling changeovers between shifts.",
    impactCategory: "Manufacturing Automation",
    actionPlan: "Automate changeovers with quick-release fixtures to reclaim 10 production hours per week ($45K value)."
  },
  {
    id: 4,
    symptomKpi: "Q3 Customer Churn increased by 8%",
    humanizedInsight: "Churn increase was driven by long-time customers (3+ years) experiencing the new self-service portal, reporting a 50% drop in first-call resolution.",
    impactCategory: "Customer Success",
    actionPlan: "Re-enable direct VIP agent routing for 3+ year accounts to halt churn immediately."
  }
];

export const NARRATIVE_FRAMEWORKS = {
  AIDA: {
    name: "AIDA (Attention, Interest, Desire, Action)",
    bestFor: "Securing funding or executive sign-off for new platform investments.",
    steps: [
      { stage: "Attention", desc: "Highlight a glaring, high-cost anomaly (e.g., 'Spreadsheet confusion costs $120K annually')." },
      { stage: "Interest", desc: "Demonstrate root-cause evidence (e.g., 'Managers spend 14 hours/week re-translating raw metrics')." },
      { stage: "Desire", desc: "Showcase the transformed state (e.g., 'Data Artisan workflows cut decision latency from 10 days to 5 minutes')." },
      { stage: "Action", desc: "Clear call-to-action (e.g., 'Approve $12K pilot budget for 1-page Looker Data Artisan dashboard')." }
    ]
  },
  SCQA: {
    name: "SCQA (Situation, Complication, Question, Answer)",
    bestFor: "Reporting operational bottlenecks and presenting structured recommendations.",
    steps: [
      { stage: "Situation", desc: "Establish baseline reality (e.g., 'Our engineering team delivers bi-weekly product sprints')." },
      { stage: "Complication", desc: "Introduce the problem (e.g., 'Scope creep in Module 3 ballooned overtime by 30%')." },
      { stage: "Question", desc: "Frame the key decision (e.g., 'How can we freeze scope without delaying release timelines?')" },
      { stage: "Answer", desc: "Deliver actionable solution (e.g., 'Implement automated regression testing and strict gate reviews')." }
    ]
  }
};

export const CALCULATE_DATA_HUMANIZATION_ROI = (numManagers = 5, hourlyRate = 75, hoursWastedPerWeek = 4, decisionGainMonthly = 15000) => {
  // Baseline Bad Data Costs (Monthly)
  const weeklyWastedHours = numManagers * hoursWastedPerWeek;
  const monthlyWastedHours = weeklyWastedHours * 4.33;
  const monthlyConfusionCost = monthlyWastedHours * hourlyRate;

  // Humanized Dashboard Cost (One-time investment)
  const dashboardBuildCost = 2500;

  // Returns
  const monthlyTimeSavings = monthlyConfusionCost * 0.85; // 85% time recovered
  const netMonthlyGain = monthlyTimeSavings + decisionGainMonthly;
  const roiPct = Math.round(((netMonthlyGain * 12 - dashboardBuildCost) / dashboardBuildCost) * 100);

  return {
    monthlyConfusionCost: Math.round(monthlyConfusionCost),
    dashboardBuildCost,
    monthlyTimeSavings: Math.round(monthlyTimeSavings),
    decisionGainMonthly,
    netMonthlyGain: Math.round(netMonthlyGain),
    annualValue: Math.round(netMonthlyGain * 12),
    roiPct
  };
};

export const PYTHON_DATA_HUMANIZATION_PIPELINE = `# ============================================================================
# DATA HUMANIZATION & AUTOMATED INSIGHT GENERATOR (PYTHON)
# Responsible AI & Security Compliant: Zero PII / Zero Copyrighted Materials
# ============================================================================

import pandas as pd
from typing import Dict, Any

class DataHumanizer:
    def __init__(self, df: pd.DataFrame):
        self.df = df

    def generate_humanized_story(self, metric_col: str, threshold: float) -> Dict[str, Any]:
        """Translates raw KPI metrics (The What) into humanized insights (The Why)"""
        anomalies = self.df[self.df[metric_col] > threshold]
        total_records = len(self.df)
        anomaly_count = len(anomalies)
        pct = (anomaly_count / total_records) * 100

        raw_kpi = f"{metric_col} anomaly rate is {pct:.1f}%"
        
        # Humanized Root Cause Analysis
        humanized_insight = (
            f"Out of {total_records} monitored nodes, {anomaly_count} nodes ({pct:.1f}%) "
            f"exceeded threshold {threshold}. Primary root cause: unexpected latency spikes "
            f"during peak automated changeover windows."
        )

        return {
            "raw_kpi": raw_kpi,
            "humanized_insight": humanized_insight,
            "actionable_recommendation": "Automate quick-release changeovers to recover ~10 hours weekly."
        }

# ── Usage Example ────────────────────────────────────────────────────────────
sample_data = pd.DataFrame({
    'node_id': [1, 2, 3, 4, 5],
    'latency_ms': [12.4, 45.8, 14.1, 88.2, 15.0]
})

humanizer = DataHumanizer(sample_data)
report = humanizer.generate_humanized_story('latency_ms', 40.0)

print("RAW KPI (Symptom):", report['raw_kpi'])
print("HUMANIZED INSIGHT (Why):", report['humanized_insight'])
print("ACTION PLAN:", report['actionable_recommendation'])
`;
