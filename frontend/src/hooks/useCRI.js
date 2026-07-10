import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export function useCRI(projectId) {
  const { data: cri, isLoading, error } = useQuery({
    queryKey: ['cri', projectId],
    queryFn: () => api.fetchProjectCRI(projectId),
    enabled: !!projectId,
    staleTime: 30_000,
  });

  return { cri, loading: isLoading, error };
}

export function useAllCRI() {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['cri', 'all'],
    queryFn: () => api.fetchAllProjectsCRI(),
    staleTime: 30_000,
  });

  return { projects: projects || [], loading: isLoading };
}
