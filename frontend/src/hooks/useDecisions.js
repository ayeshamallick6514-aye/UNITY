import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import useAuthStore from '../store/authStore';

export function useDecisions() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const decisionsQuery = useQuery({
    queryKey: ['decisions'],
    queryFn: () => api.getActiveDecisions(),
  });

  const matrixQuery = useQuery({
    queryKey: ['matrix'],
    queryFn: () => api.getMatrixGrid(),
  });

  const actionMutation = useMutation({
    mutationFn: ({ dependencyId, action, reason }) => {
      // Pass the current user's designation or role title as authorizedBy
      const payload = {
        dependencyId,
        action,
        reason,
        authorizedBy: user?.name || 'Authorized Officer'
      };

      // Header is dynamically injected by axiosInstance, but backend controller expects 'x-user-role'.
      // We will override headers manually if needed. Let's make sure the role starts with uppercase in backend (Collector/Commissioner)
      const roleStr = user?.role === 'collector' ? 'Collector' : user?.role === 'commissioner' ? 'Commissioner' : 'Officer';
      
      return api.executeDecisionAction(payload, {
        headers: {
          'x-user-role': roleStr
        }
      });
    },
    onSuccess: () => {
      // Invalidate queries to refresh lists and dashboard states
      queryClient.invalidateQueries({ queryKey: ['decisions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['matrix'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['cost-exposure'] });
    }
  });

  return {
    decisions: decisionsQuery.data || [],
    matrix: matrixQuery.data,
    loading: decisionsQuery.isLoading || matrixQuery.isLoading,
    executeAction: actionMutation.mutateAsync,
    isExecuting: actionMutation.isPending,
  };
}
