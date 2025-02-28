import axios, { AxiosError } from "axios";
import { useState, useEffect } from "react";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { toast } from "sonner";

interface ParamsType {
  queryKey?: string | string[];
  headers?: Record<string, string>;
  queryKeyId?: number | string | undefined;
  queryFn?: () => Promise<Response>;
  retry?: number;
  refetchOnWindowFocus?: boolean;
  onSuccess?: (data: Response) => void;
  onError?: (error: AxiosError) => void;
}

const fetchData = async ({
  endpoint,
  headers,
}: {
  endpoint: string;
  headers?: Record<string, string>;
}): Promise<Response> => {
  const config = headers ? { headers } : {};
  const response = await axios.get<Response>(endpoint, config);
  return response.data;
};
const useFetchData = ({
  endpoint,
  params,
}: {
  endpoint: string;
  params: ParamsType & { enabled?: boolean }; // include enabled if needed
}): UseQueryResult<Response, AxiosError> => {
  // Compute custom parameters synchronously
  const customParams: ParamsType = {
    queryKey: params.queryKey
      ? params.queryKey
      : params.queryKeyId
      ? [`${endpoint}`, params.queryKeyId]
      : endpoint,
    retry: params.retry ?? 5,
    queryFn: params.queryFn
      ? params.queryFn
      : () => fetchData({ endpoint, headers: params.headers }),
    refetchOnWindowFocus: params.refetchOnWindowFocus ?? true,
    onSuccess:
      params.onSuccess ?? (() => toast.success("Successfully Fetched Data")),
    onError:
      params.onError ?? ((error: AxiosError) => toast.error(error.message)),
  };

  return useQuery<Response, AxiosError>({
    queryKey: Array.isArray(customParams.queryKey)
      ? customParams.queryKey
      : [customParams.queryKey],
    queryFn: customParams.queryFn,
    retry: customParams.retry,
    refetchOnWindowFocus: customParams.refetchOnWindowFocus,
    onSuccess: customParams.onSuccess,
    onError: customParams.onError,
    enabled: params.enabled, // pass enabled if needed
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

export { useFetchData };
