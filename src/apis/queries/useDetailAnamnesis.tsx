import { useQuery } from 'react-query'
import axios from 'axios'

interface GetAnamnesisDetailPayload {
  id?: string
}

const fetchAnamnesisDetail = async ({ id }: GetAnamnesisDetailPayload) => {
  try {
    const response = await axios.get(
      `https://66d6f347006bfbe2e64f38bc.mockapi.io/noscai/api/v1/anamnesis/${id}`
    )

    return response
  } catch (error) {
    console.error('Request failed:', error)
    throw error
  }
}

// Hook to use Anamnesis data with react-query
const useAnamnesisDetail = ({ id }: GetAnamnesisDetailPayload) => {
  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useQuery<any, Error>({
    queryKey: ['anamnesisDetail', id],
    queryFn: () => fetchAnamnesisDetail({ id }),
    enabled: !!id, // Only run the query if id exists
  })

  // Format the response for consistent handling
  const data = response?.data || ({} as any['data'])
  const result: any = {
    data,
    message: response?.message || '',
    status: response?.status || 0,
    traceID: response?.traceID || '',
  }

  return { data: result, isLoading, error, refetch }
}

export default useAnamnesisDetail
