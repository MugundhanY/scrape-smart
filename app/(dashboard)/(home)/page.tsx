import { GetPeriods } from "@/actions/analytics/getPeriods";
import React, { Suspense } from "react";
import PeriodSelector from "./_components/PeriodSelector";
import { Period } from "@/types/analytics";
import { Skeleton } from "@/components/ui/skeleton";
import { GetStatsCardsValues } from "@/actions/analytics/getStatsCardsValue";
import { CirclePlay, CoinsIcon, Waypoints, WaypointsIcon } from "lucide-react";
import StatsCard from "./_components/StatsCard";
import { waitFor } from "@/lib/helper/waitFor";
import { GetWorkflowExecutionStats } from "@/actions/analytics/getWorkflowExecutionStats";
import ExecutionStatusChart from "./_components/ExecutionStatusChart";
import { GetCreditUsageInPeriod } from "@/actions/analytics/getCreditUsageInPeriod";
import CreditUsageChart from "../billing/_components/CreditUsageChart";

function HomePage({searchParams}: {
  searchParams: {month?: string, year?: string};
}) {
  const currentDate = new Date();
  const { month, year } = searchParams;
  const period : Period = {
    month: month ? parseInt(month) : currentDate.getMonth(),
    year: year ? parseInt(year) : currentDate.getFullYear()
  };
  return <div className="flex flex-1 flex-col h-full"> 
    <div className="flex justify-between">
      <h1 className="text-3xl font-bold">Home</h1>
      <Suspense fallback={<Skeleton className="w-[180px] h-[40px]" />}>
        <PeriodSelectorWrapper selectedPeriod={period}/>
      </Suspense>
    </div>
    <div className="h-full py-6 flex flex-col gap-4">
      <Suspense fallback={<StatsCardSkeleton />}>
        <StatsCards selectedPeriod={period} />
      </Suspense>
      <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
        <StatsExecutionStatus selectedPeriod={period} />
      </Suspense>
      <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
        <CreditsUsageInPeriod selectedPeriod={period} />
      </Suspense>
    </div>
  </div>
}

function StatsCardSkeleton() {
  return <div className="grid gap-3 lg:gap-8 lg:grid-cols-3">
  {
    [1,2,3].map(i => <Skeleton key={i} className="w-full min-h-[120px]"/>)
  }
  </div>;
}

async function PeriodSelectorWrapper({selectedPeriod}: {selectedPeriod: Period}) {
  const periods = await GetPeriods();
  return <PeriodSelector selectedPeriod={selectedPeriod} periods={periods} />;
}

async function StatsCards({selectedPeriod}: {selectedPeriod: Period}) {
  const data = await GetStatsCardsValues(selectedPeriod);
  return <div className="grid gap-3 lg:gap-8 lg:grid-cols-3 min-h-[120px]">
    <StatsCard title="Workflow executions" value={data.workflowExecutions} icon={CirclePlay}/>
    <StatsCard title="Phase executions" value={data.phaseExecutions} icon={WaypointsIcon}/>
    <StatsCard title="Credits consumed" value={data.creditsConsumed} icon={CoinsIcon}/>
  </div>
}

async function StatsExecutionStatus({selectedPeriod}: {selectedPeriod: Period}) {
  const data = await GetWorkflowExecutionStats(selectedPeriod);
  return <ExecutionStatusChart data={data} />;
}

async function CreditsUsageInPeriod({selectedPeriod}: {selectedPeriod: Period}) {
  const data = await GetCreditUsageInPeriod(selectedPeriod);
  return <CreditUsageChart data={data} title="Daily credits spent" description="Daily credit consumed in selected period" />;
}

export default HomePage;