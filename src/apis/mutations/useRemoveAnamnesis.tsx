import axios from 'axios'
import { useMutation } from 'react-query'

interface Payload {
  id: string
}

const removeAnamnesis = async (payload: Payload) => {
  const response = await axios({
    url: `https://66d6f347006bfbe2e64f38bc.mockapi.io/noscai/api/v1/anamnesis/${payload.id}`,
    method: 'DELETE',
  })

  return response
}

const useRemoveAnamnesis = () => {
  const mutation = useMutation<any, Error, Payload>((payload: any) =>
    removeAnamnesis(payload)
  )

  return mutation
}

export default useRemoveAnamnesis
