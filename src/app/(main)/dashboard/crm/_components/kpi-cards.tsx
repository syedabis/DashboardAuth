import { ArrowUpRight, TrendingDown, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { type CrmDashboardData, defaultCrmData } from "@/lib/crm/data";

interface KpiCardsProps {
  data?: CrmDashboardData["kpis"];
}

export function KpiCards({ data }: KpiCardsProps) {
  const kpis = data || defaultCrmData.kpis;

  return (
    <section className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-3xl tracking-tight">Pipeline Overview</h2>
        <p className="text-muted-foreground text-sm">
          Keep tabs on lead quality, open opportunities, and conversion rates across the current sales cycle.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Lead Pipeline Value</CardDescription>
            <CardAction>
              <ArrowUpRight className="size-4" />
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl leading-none tracking-tight">{kpis.pipelineValue}</span>

              <Badge
                variant="outline"
                className="border-green-200 bg-green-500/10 text-green-700 dark:border-green-900/40 dark:bg-green-500/15 dark:text-green-300"
              >
                <TrendingUp />
                {kpis.pipelineChangePct}
              </Badge>
            </div>
            <p className="text-sm">
              <span className="font-medium text-foreground">{kpis.prevPipelineValue}</span>{" "}
              <span className="text-muted-foreground">last month</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Qualified Lead Rate</CardDescription>
            <CardAction>
              <ArrowUpRight className="size-4" />
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl leading-none tracking-tight">{kpis.qualifiedRate}</span>

              <Badge variant="outline" className="border-destructive/20 bg-destructive/10 text-destructive">
                <TrendingDown />
                {kpis.qualifiedRateChange}
              </Badge>
            </div>
            <p className="text-sm">
              <span className="font-medium text-foreground">{kpis.prevQualifiedRate}</span>{" "}
              <span className="text-muted-foreground">last month</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Open Opportunities</CardDescription>
            <CardAction>
              <ArrowUpRight className="size-4" />
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl leading-none tracking-tight">{kpis.openOpportunities}</span>

              <Badge
                variant="outline"
                className="border-green-200 bg-green-500/10 text-green-700 dark:border-green-900/40 dark:bg-green-500/15 dark:text-green-300"
              >
                <TrendingUp />
                {kpis.openOpportunitiesChange}
              </Badge>
            </div>
            <p className="text-sm">
              <span className="font-medium text-foreground">{kpis.prevOpenOpportunities}</span>{" "}
              <span className="text-muted-foreground">last month</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Lead-to-Deal Rate</CardDescription>
            <CardAction>
              <ArrowUpRight className="size-4" />
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl leading-none tracking-tight">{kpis.leadToDealRate}</span>

              <Badge
                variant="outline"
                className="border-green-200 bg-green-500/10 text-green-700 dark:border-green-900/40 dark:bg-green-500/15 dark:text-green-300"
              >
                <TrendingUp />
                {kpis.leadToDealChange}
              </Badge>
            </div>
            <p className="text-sm">
              <span className="font-medium text-foreground">{kpis.prevLeadToDealRate}</span>{" "}
              <span className="text-muted-foreground">last month</span>
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
