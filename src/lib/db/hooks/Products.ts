import { useInfiniteQuery, useQuery } from "@tanstack/react-query"

import { InfiniteParam } from "../../../types/params.model"
import { CACHE_KEY } from "../../../utils/cacheKeys"
import { KeyWordActions } from "../actions/KeyWords"
import { ProductActions } from "../actions/ProductHistory"

export const useGetAllProductHistory = (userId = "", limit = 10) => {
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
    queryKey: [CACHE_KEY.getAllProductHistory, limit],
    queryFn: async ({}: InfiniteParam) => {
      return await KeyWordActions.GetAllProductHistory(userId, limit, null)
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

export const useGetProduct = (userId = "", product_id = "") => {
  const { data, isLoading, isError, isFetched, refetch } = useQuery({
    enabled: !!userId && !!product_id,
    queryKey: [CACHE_KEY.getAllProductHistory, product_id],
    queryFn: async () => {
      return await ProductActions.GetProductHistory(userId, product_id)
    },
  })

  return {
    data,
    isLoading,
    isError,
    isFetched,
    refetch,
  }
}
