import axios, { type AxiosInstance } from "axios";
import { useMemo } from "react";

function useAxiosClient(): AxiosInstance {
  return useMemo(() => {
    return axios.create({
      baseURL: "/api",
      timeout: 5000,
    });
  }, []);
}

export default useAxiosClient;
