import axios, { AxiosError, AxiosResponse } from "axios";
import {
  useMutation,
  UseMutationResult,
  MutationFunction,
  QueryClient,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

// Define types for request and response data
interface RequestData {
  [key: string]: any;
}

interface ParamsType {
  headers?: Record<string, string>;
  queryKey?: string | string[];
  onSuccess?: (data: AxiosResponse<Response>) => void;
  onError?: (error: AxiosError) => void;
  retry?: number;
}

// Define the POST function
const postData = async ({
  endpoint,
  data,
  headers,
}: {
  endpoint: string;
  data: RequestData;
  headers?: Record<string, string>;
}): Promise<AxiosResponse<Response>> => {
  const config = headers ? { headers } : {};
  const response = await axios.put<Response>(endpoint, data, config);
  return response;
};

// Custom hook to handle POST requests
const usePostData = ({
  endpoint,
  params,
}: {
  endpoint: string;
  params: ParamsType;
}): UseMutationResult<AxiosResponse<Response>, AxiosError, RequestData> => {
  const queryClient = useQueryClient();
  const querykey: Array<String> = [];
  if (!Array.isArray(params.queryKey)) {
    querykey.push(params.queryKey as string);
  } else {
    querykey.push(...params.queryKey);
  }
  return useMutation<AxiosResponse<Response>, AxiosError, RequestData>({
    mutationFn: (data) => postData({ endpoint, data, headers: params.headers }),
    onSuccess:
      params.onSuccess ??
      (() => {
        queryClient.invalidateQueries({ queryKey: querykey }),
          toast.success("Data updated successfully");
      }),

    onError:
      params.onError ?? ((error: AxiosError) => toast.error(error.message)),
    retry: params.retry ?? 3,
    onSettled: (data) => {
      console.log(data);
    },
  });
};

export { usePostData };
