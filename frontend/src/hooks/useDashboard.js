import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

/**
 * useDashboard — hook for fetching dashboard summary, alerts, and event logs.
 */
export function useDashboard() {
  const dashboardQuery = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.getDashboard(),
  });

  const briefQuery = useQuery({
    queryKey: ['brief-summary'],
    queryFn: () => api.getBriefSummary(),
  });

  const alertsQuery = useQuery({
    queryKey: ['alerts-priorities'],
    queryFn: () => api.getAttentionPriorities(),
  });

  const eventsQuery = useQuery({
    queryKey: ['events'],
    queryFn: () => api.getEvents('all'),
  });

  return {
    dashboard: dashboardQuery.data,
    brief: briefQuery.data,
    alerts: alertsQuery.data,
    events: eventsQuery.data,
    loading: dashboardQuery.isLoading || briefQuery.isLoading || alertsQuery.isLoading,
    isError: dashboardQuery.isError || briefQuery.isError || alertsQuery.isError,
    refetch: () => {
      dashboardQuery.refetch();
      briefQuery.refetch();
      alertsQuery.refetch();
      eventsQuery.refetch();
    }
  };
}
