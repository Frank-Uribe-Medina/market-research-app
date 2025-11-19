import { useInfiniteQuery } from "@tanstack/react-query"

import { InfiniteParam } from "../../../types/params.model"
import { CACHE_KEY } from "../../../utils/cacheKeys"
import { KeyWordActions } from "../actions/KeyWords"

export const useGetAllKeyWordLists = (userId = "", limit = 10) => {
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
    enabled: !!userId,
    queryKey: [CACHE_KEY.getAllKeywords, limit],
    queryFn: async ({}: InfiniteParam) => {
      return await KeyWordActions.GetAllKeyWords(userId, limit, null)
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
