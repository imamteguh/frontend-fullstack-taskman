import { RecentProjects } from "@/components/dashboard/recent-projects";
import { StatsCard } from "@/components/dashboard/stat-card";
import { StatisticsCharts } from "@/components/dashboard/statistics-charts";
import { Loader } from "@/components/loader";
import { UpcomingTasks } from "@/components/upcoming-tasks";
import { useGetWorkspaceStatsQuery, useGetWorkspacesQuery } from "@/hooks/use-workspace";
import type {
  Project,
  ProjectStatusData,
  StatsCardProps,
  Task,
  TaskPriorityData,
  TaskTrendsData,
  WorkspaceProductivityData,
} from "@/types";
import { useNavigate, useSearchParams } from "react-router";
import { useEffect, useMemo, useState } from "react";
import type { Workspace } from "@/types";

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspaceId");

  const { data: workspaces, isLoading: isWorkspacesLoading } =
    useGetWorkspacesQuery() as { data: Workspace[]; isLoading: boolean };

  const [isAutoSelecting, setIsAutoSelecting] = useState(false);

  const latestWorkspace = useMemo(() => {
    if (!workspaces || workspaces.length === 0) return null;
    if (workspaces.length === 1) return workspaces[0];

    return [...workspaces].sort((a, b) => {
      const aTime = Math.max(
        new Date(a.updatedAt).getTime(),
        new Date(a.createdAt).getTime()
      );
      const bTime = Math.max(
        new Date(b.updatedAt).getTime(),
        new Date(b.createdAt).getTime()
      );
      return bTime - aTime;
    })[0];
  }, [workspaces]);

  const { data, isPending } = useGetWorkspaceStatsQuery(workspaceId!) as {
    data: {
      stats: StatsCardProps;
      taskTrendsData: TaskTrendsData[];
      projectStatusData: ProjectStatusData[];
      taskPriorityData: TaskPriorityData[];
      workspaceProductivityData: WorkspaceProductivityData[];
      upcomingTasks: Task[];
      recentProjects: Project[];
    };
    isPending: boolean;
  };

  useEffect(() => {
    if (workspaceId) return;
    if (isWorkspacesLoading) return;
    if (!latestWorkspace) return;

    setIsAutoSelecting(true);
    const basePath = window.location.pathname;
    navigate(`${basePath}?workspaceId=${latestWorkspace._id}`, { replace: true });
  }, [workspaceId, isWorkspacesLoading, latestWorkspace, navigate]);

  if (!workspaceId) {
    if (isWorkspacesLoading || isAutoSelecting) {
      return (
        <div>
          <Loader />
        </div>
      );
    }

    return (
      <div>
        <p>No workspaces found</p>
      </div>
    );
  }

  if (isPending) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-3xl font-bold">Dashboard</h2>
      </div>

      <StatsCard data={data.stats} />

      <StatisticsCharts
        stats={data.stats}
        taskTrendsData={data.taskTrendsData}
        projectStatusData={data.projectStatusData}
        taskPriorityData={data.taskPriorityData}
        workspaceProductivityData={data.workspaceProductivityData}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentProjects data={data.recentProjects} />
        <UpcomingTasks data={data.upcomingTasks} />
      </div>
    </div>
  );
};

export default Dashboard;