import { useMemo } from "react";
import axios, { type AxiosInstance } from "axios";

const defaultBaseURL = import.meta.env.VITE_API_URL ?? "";

function useAxiosClient(baseURL = defaultBaseURL): AxiosInstance {
  return useMemo(() => {
    return axios.create({
      baseURL,
      timeout: 5000,
    });
  }, [baseURL]);
}

export default useAxiosClient;