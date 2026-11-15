import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import { fetchCrmData } from "@/lib/crm/data";

import { KpiCards } from "./_components/kpi-cards";
import { OpportunitiesSection } from "./_components/opportunities-section";
import { PipelineActivity } from "./_components/pipeline-activity";
import { TaskReminders } from "./_components/task-reminders";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "CRM Dashboard | Supabase Connected",
  description:
    "Explore a CRM dashboard with pipeline activity, opportunities, sales performance, and task reminders powered by live Supabase data.",
  alternates: {
    canonical: "/dashboard/crm",
  },
};

export default async function Page() {
  const crmData = await fetchCrmData();

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Badge
            variant="outline"
            className="gap-1.5 border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-medium text-[11px] text-emerald-600 dark:text-emerald-400"
          >
            <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
            Supabase Connected
          </Badge>
          <span className="text-muted-foreground text-xs">Syncing CRM pipeline with live database</span>
        </div>
      </div>

      <KpiCards data={crmData.kpis} />
      <PipelineActivity data={crmData.pipelineFlow} discoveryStats={crmData.discoveryStats} />
      <TaskReminders proposals={crmData.proposals} meetings={crmData.meetings} />
      <OpportunitiesSection opportunities={crmData.opportunities} />
    </div>
  );
}
