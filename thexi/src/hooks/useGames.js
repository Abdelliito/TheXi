import { useQuery } from '@tanstack/react-query';
import { getGames } from '../services/api';

export function useGames() {
  return useQuery({
    queryKey: ['games'],
    queryFn: getGames,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });
}
