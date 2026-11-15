import { createAdminClient } from "@/lib/supabase/admin";

export interface CrmDashboardData {
  kpis: {
    pipelineValue: string;
    pipelineChangePct: string;
    prevPipelineValue: string;
    qualifiedRate: string;
    qualifiedRateChange: string;
    prevQualifiedRate: string;
    openOpportunities: number;
    openOpportunitiesChange: string;
    prevOpenOpportunities: number;
    leadToDealRate: string;
    leadToDealChange: string;
    prevLeadToDealRate: string;
  };
  pipelineFlow: Array<{
    date: string;
    qualified: number;
  }>;
  discoveryStats: {
    discoveryCallsBooked: number;
    totalQualified: number;
    discoveryProgress: number;
  };
  meetings: Array<{
    id: string;
    title: string;
    company: string;
    timeSlot: string;
    status: string;
  }>;
  proposals: {
    proposalSent: number;
    proposalGoal: number;
    proposalProgressPercentage: number;
  };
  opportunities: Array<{
    id: string;
    account: string;
    stage: string;
    priority: number;
    health: string;
    value: string;
  }>;
}

export const defaultCrmData: CrmDashboardData = {
  kpis: {
    pipelineValue: "$284,500",
    pipelineChangePct: "+12%",
    prevPipelineValue: "$254,200",
    qualifiedRate: "28.4%",
    qualifiedRateChange: "-2.5%",
    prevQualifiedRate: "30.9%",
    openOpportunities: 42,
    openOpportunitiesChange: "+7",
    prevOpenOpportunities: 35,
    leadToDealRate: "16.8%",
    leadToDealChange: "+3.2%",
    prevLeadToDealRate: "13.6%",
  },
  pipelineFlow: [
    { date: "2026-01-01T00:00:00Z", qualified: 34 },
    { date: "2026-02-01T00:00:00Z", qualified: 38 },
    { date: "2026-03-01T00:00:00Z", qualified: 31 },
    { date: "2026-04-01T00:00:00Z", qualified: 47 },
    { date: "2026-05-01T00:00:00Z", qualified: 42 },
    { date: "2026-06-01T00:00:00Z", qualified: 51 },
    { date: "2026-07-01T00:00:00Z", qualified: 44 },
    { date: "2026-08-01T00:00:00Z", qualified: 40 },
    { date: "2026-09-01T00:00:00Z", qualified: 58 },
    { date: "2026-10-01T00:00:00Z", qualified: 46 },
    { date: "2026-11-01T00:00:00Z", qualified: 43 },
    { date: "2026-12-01T00:00:00Z", qualified: 49 },
  ],
  discoveryStats: {
    discoveryCallsBooked: 184,
    totalQualified: 517,
    discoveryProgress: 36,
  },
  meetings: [
    {
      id: "meet-1",
      title: "Product demo with Tim",
      company: "Weblabs Studio",
      timeSlot: "09:00 - 09:45",
      status: "Scheduled",
    },
    {
      id: "meet-2",
      title: "Security architecture review",
      company: "Omnia Cloud",
      timeSlot: "11:00 - 11:45",
      status: "Scheduled",
    },
  ],
  proposals: {
    proposalSent: 12,
    proposalGoal: 18,
    proposalProgressPercentage: 67,
  },
  opportunities: [
    {
      id: "OP-1842",
      account: "Asteron Bioworks",
      stage: "Proposal Sent",
      priority: 1,
      health: "On Track",
      value: "$42,000",
    },
    {
      id: "OP-1841",
      account: "BlueHaven Systems",
      stage: "Discovery",
      priority: 1,
      health: "On Hold",
      value: "$18,500",
    },
    { id: "OP-1840", account: "Cinder Health", stage: "Negotiation", priority: 1, health: "At Risk", value: "$63,000" },
    {
      id: "OP-1839",
      account: "Drift Manufacturing",
      stage: "Qualified",
      priority: 2,
      health: "At Risk",
      value: "$26,400",
    },
    {
      id: "OP-1838",
      account: "Everline Freight",
      stage: "Proposal Sent",
      priority: 1,
      health: "Needs Review",
      value: "$58,900",
    },
    {
      id: "OP-1837",
      account: "Fieldstone Capital",
      stage: "Discovery",
      priority: 1,
      health: "On Track",
      value: "$31,200",
    },
    { id: "OP-1836", account: "Gilded Solar", stage: "Negotiation", priority: 2, health: "On Track", value: "$19,800" },
    {
      id: "OP-1835",
      account: "Halcyon Robotics",
      stage: "Proposal Sent",
      priority: 1,
      health: "On Track",
      value: "$74,500",
    },
    {
      id: "OP-1834",
      account: "Ironclad Security",
      stage: "Qualified",
      priority: 3,
      health: "Needs Review",
      value: "$52,000",
    },
    {
      id: "OP-1833",
      account: "Juniper Analytics",
      stage: "Discovery",
      priority: 1,
      health: "On Track",
      value: "$37,600",
    },
    { id: "OP-1832", account: "Kestrel Aero", stage: "Negotiation", priority: 1, health: "On Track", value: "$88,000" },
    {
      id: "OP-1831",
      account: "Luminary Media",
      stage: "Proposal Sent",
      priority: 2,
      health: "On Track",
      value: "$22,400",
    },
    {
      id: "OP-1830",
      account: "Meridian Logistics",
      stage: "Discovery",
      priority: 1,
      health: "Needs Review",
      value: "$45,000",
    },
    {
      id: "OP-1829",
      account: "Nexus Biotech",
      stage: "Negotiation",
      priority: 1,
      health: "On Track",
      value: "$68,000",
    },
    {
      id: "OP-1828",
      account: "Omnia Cloud",
      stage: "Proposal Sent",
      priority: 1,
      health: "On Track",
      value: "$92,500",
    },
  ],
};

interface DbOpportunity {
  id: string;
  opportunity_code: string;
  account: string;
  stage: string;
  priority: number;
  health: string;
  value: number;
  contact_person?: string;
  expected_close_date?: string;
}

interface DbMeeting {
  id: string;
  title: string;
  company: string;
  time_slot: string;
  meeting_date: string;
  status: string;
}

interface DbPipelineStat {
  period: string;
  month_num: number;
  year: number;
  qualified_leads: number;
  discovery_calls: number;
  proposals_sent: number;
  closed_deals: number;
  pipeline_value: number;
}

interface DbKpiSummary {
  pipeline_value: number;
  pipeline_value_prev: number;
  qualified_lead_rate: number;
  qualified_lead_rate_prev: number;
  open_opportunities: number;
  open_opportunities_prev: number;
  lead_to_deal_rate: number;
  lead_to_deal_rate_prev: number;
  proposal_sent: number;
  proposal_goal: number;
  discovery_calls_booked: number;
}

export async function fetchCrmData(): Promise<CrmDashboardData> {
  try {
    const supabase = createAdminClient();

    const [oppsRes, kpiRes, statsRes, meetingsRes] = await Promise.all([
      supabase.from("crm_opportunities").select("*").order("created_at", { ascending: false }),
      supabase.from("crm_kpi_summary").select("*").limit(1).maybeSingle(),
      supabase.from("crm_pipeline_stats").select("*").order("month_num", { ascending: true }),
      supabase.from("crm_meetings").select("*").order("meeting_date", { ascending: true }),
    ]);

    // If tables do not exist or are empty, fallback cleanly
    if (oppsRes.error || !oppsRes.data || oppsRes.data.length === 0) {
      return defaultCrmData;
    }

    const opps = oppsRes.data as DbOpportunity[];
    const dbKpi = kpiRes.data as DbKpiSummary | null;
    const stats = (statsRes.data as DbPipelineStat[]) || [];
    const meetings = (meetingsRes.data as DbMeeting[]) || [];

    // Calculate dynamic values if opps exist
    const totalPipelineValue = opps.reduce((sum, o) => sum + Number(o.value || 0), 0);
    const openOppsCount = opps.length;

    // Format KPIs
    const prevPipeline = dbKpi?.pipeline_value_prev ?? 254200;
    const pipeChange = prevPipeline > 0 ? ((totalPipelineValue - prevPipeline) / prevPipeline) * 100 : 12;
    const pipeChangeFormatted = `${pipeChange >= 0 ? "+" : ""}${pipeChange.toFixed(0)}%`;

    const qualRate = dbKpi?.qualified_lead_rate ?? 28.4;
    const qualRatePrev = dbKpi?.qualified_lead_rate_prev ?? 30.9;
    const qualDiff = qualRate - qualRatePrev;
    const qualChangeFormatted = `${qualDiff >= 0 ? "+" : ""}${qualDiff.toFixed(1)}%`;

    const openPrev = dbKpi?.open_opportunities_prev ?? 35;
    const openDiff = openOppsCount - openPrev;
    const openChangeFormatted = `${openDiff >= 0 ? "+" : ""}${openDiff}`;

    const dealRate = dbKpi?.lead_to_deal_rate ?? 16.8;
    const dealRatePrev = dbKpi?.lead_to_deal_rate_prev ?? 13.6;
    const dealDiff = dealRate - dealRatePrev;
    const dealChangeFormatted = `${dealDiff >= 0 ? "+" : ""}${dealDiff.toFixed(1)}%`;

    const kpis = {
      pipelineValue: `$${totalPipelineValue.toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
      pipelineChangePct: pipeChangeFormatted,
      prevPipelineValue: `$${prevPipeline.toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
      qualifiedRate: `${qualRate}%`,
      qualifiedRateChange: qualChangeFormatted,
      prevQualifiedRate: `${qualRatePrev}%`,
      openOpportunities: openOppsCount,
      openOpportunitiesChange: openChangeFormatted,
      prevOpenOpportunities: openPrev,
      leadToDealRate: `${dealRate}%`,
      leadToDealChange: dealChangeFormatted,
      prevLeadToDealRate: `${dealRatePrev}%`,
    };

    // Format Pipeline Flow
    const pipelineFlow =
      stats.length > 0
        ? stats.map((s) => {
            const d = new Date(s.year, s.month_num - 1, 1);
            return {
              date: d.toISOString(),
              qualified: Number(s.qualified_leads || 0),
            };
          })
        : defaultCrmData.pipelineFlow;

    const totalQualified = pipelineFlow.reduce((sum, item) => sum + item.qualified, 0);
    const discoveryCallsBooked = dbKpi?.discovery_calls_booked ?? 184;
    const discoveryProgress = totalQualified > 0 ? Math.round((discoveryCallsBooked / totalQualified) * 100) : 36;

    const discoveryStats = {
      discoveryCallsBooked,
      totalQualified,
      discoveryProgress,
    };

    const proposals = {
      proposalSent: dbKpi?.proposal_sent ?? 12,
      proposalGoal: dbKpi?.proposal_goal ?? 18,
      proposalProgressPercentage: Math.round(((dbKpi?.proposal_sent ?? 12) / (dbKpi?.proposal_goal ?? 18)) * 100),
    };

    const opportunities = opps.map((o) => ({
      id: o.opportunity_code,
      account: o.account,
      stage: o.stage,
      priority: o.priority,
      health: o.health,
      value: `$${Number(o.value || 0).toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
    }));

    const formattedMeetings =
      meetings.length > 0
        ? meetings.map((m) => ({
            id: m.id,
            title: m.title,
            company: m.company,
            timeSlot: m.time_slot,
            status: m.status,
          }))
        : defaultCrmData.meetings;

    return {
      kpis,
      pipelineFlow,
      discoveryStats,
      meetings: formattedMeetings,
      proposals,
      opportunities,
    };
  } catch (err) {
    console.error("Error fetching CRM data from Supabase:", err);
    return defaultCrmData;
  }
}
