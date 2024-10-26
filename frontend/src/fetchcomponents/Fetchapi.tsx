import axios, { AxiosError } from "axios";
import { useState, useEffect } from "react";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { toast } from "sonner";

 interface ParamsType {
  queryKey?: string | string[];
  headers?: Record<string, string>;
  queryKeyId?: number | string | undefined;
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

// Custom hook to fetch data
const useFetchData = ({
  endpoint,
  params,
}: {
  endpoint: string;
  params: ParamsType;
}): UseQueryResult<Response, AxiosError> => {
  const [customParams, setCustomParams] = useState<ParamsType>({});

  useEffect(() => {
    const newCustomParams: ParamsType = {
      queryKey: params.queryKey 
        ? `${params.queryKey}`
        : params.queryKeyId
        ? [`${endpoint}`, params.queryKeyId]
        : `${endpoint}`,
      retry: params.retry ?? 5,
      refetchOnWindowFocus: params.refetchOnWindowFocus ?? true,
      onSuccess: params.onSuccess ?? (() => toast.success("Successfully Fetched Data")),
      onError: params.onError ?? ((error: AxiosError) => toast.error(error.message)),
    };
    
    setCustomParams(newCustomParams);
  }, [endpoint, JSON.stringify(params)]);

  const { data, isLoading, isFetching, isError } = useQuery<Response, AxiosError>({
    queryKey: Array.isArray(customParams.queryKey) 
      ? customParams.queryKey 
      : [customParams.queryKey],
    queryFn: () => fetchData({ endpoint, headers: params.headers }),
    retry: customParams.retry,
    refetchOnWindowFocus: customParams.refetchOnWindowFocus,
    onSuccess: customParams.onSuccess,
    onError: customParams.onError,
    staleTime: 5 * 60 * 1000,  // Cache for 5 minutes
  });

  return { data, isLoading, isFetching, isError };
};

export { useFetchData };
