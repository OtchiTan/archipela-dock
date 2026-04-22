import { useMemo } from "react"
import axios from 'axios';


function AxiosClient() {
  return useMemo(() => {
    const client = axios.create({
      baseURL: 'https://jsonplaceholder.typicode.com',
      timeout: 1000,
    })
    return client
  }, [])
}

export default AxiosClient