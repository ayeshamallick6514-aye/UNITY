import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

export function useSentinel() {
  const queryClient = useQueryClient();

  const historyQuery = useQuery({
    queryKey: ['sentinel-history'],
    queryFn: () => api.sentinelHistory(),
  });

  const reviewMutation = useMutation({
    mutationFn: ({ dependencyId, decisionKey }) => 
      api.sentinelReview(dependencyId, decisionKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sentinel-history'] });
    }
  });

  const queryMutation = useMutation({
    mutationFn: (query) => api.sentinelQuery(query),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sentinel-history'] });
    }
  });

  const ingestMutation = useMutation({
    mutationFn: (data) => api.sentinelIngest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sentinel-history'] });
    }
  });

  return {
    history: historyQuery.data || { queries: [], reviews: [], documents: [] },
    loadingHistory: historyQuery.isLoading,
    runReview: reviewMutation.mutateAsync,
    isReviewing: reviewMutation.isPending,
    runQuery: queryMutation.mutateAsync,
    isQuerying: queryMutation.isPending,
    runIngest: ingestMutation.mutateAsync,
    isIngesting: ingestMutation.isPending,
  };
}
