import { useMemo } from "react";
import axios, { type AxiosInstance } from "axios";

function useAxiosClient(baseURL = ""): AxiosInstance {
  return useMemo(() => {
    return axios.create({
      baseURL,
      timeout: 5000,
    });
  }, [baseURL]);
}

export default useAxiosClient;