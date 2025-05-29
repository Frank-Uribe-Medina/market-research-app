import { useInfiniteQuery } from "@tanstack/react-query"

import { InfiniteParam } from "../../../types/params.model"
import { CACHE_KEY } from "../../../utils/cacheKeys"
import { UserActions } from "../actions/UserActions"

export const useUsers = (term: string, limit = 10) => {
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isFetched,
    refetch,
  } = useInfiniteQuery({
    queryKey: [CACHE_KEY.getUsers, term, limit],
    queryFn: async ({ pageParam }: InfiniteParam) => {
      return await UserActions.GetList(term, limit, pageParam)
    },
    initialPageParam: null,
    getPreviousPageParam: (firstPage) => firstPage.lastKey ?? undefined,
    getNextPageParam: (lastPage) => lastPage.lastKey ?? undefined,
  })

  return {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isFetched,
    refetch,
  }
}
