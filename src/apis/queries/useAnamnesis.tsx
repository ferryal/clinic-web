import { useQuery } from 'react-query'
import axios from 'axios'

const fetchList = async () => {
  try {
    const response = await axios.get(
      'https://66d6f347006bfbe2e64f38bc.mockapi.io/noscai/api/v1/anamnesis'
    )

    return response.data
  } catch (error) {
    console.error('Request failed:', error)
    throw error
  }
}

const useAnamnesis = () => {
  return useQuery('anamnesis', fetchList)
}

export default useAnamnesis
