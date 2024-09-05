import axios from 'axios'
import { useMutation } from 'react-query'

interface FormType {
  id: string | number
  containerId: string | number
  label: string
  type: 'shortText' | 'longText' | 'multipleChoice' | 'time'
}

interface ContainerType {
  id: string | number
  title: string
}

interface AnamnesisPayload {
  title: string
  description: string
  creationDate: string
  containers: ContainerType[]
  forms: FormType[]
}

const updateAnamnesis = async (payload: AnamnesisPayload) => {
  const response = await axios({
    url: 'https://66d6f347006bfbe2e64f38bc.mockapi.io/noscai/api/v1/anamnesis',
    method: 'PUT',
    data: payload,
  })

  return response.data
}

const useUpdateAnamnesis = () => {
  const mutation = useMutation<any, Error, AnamnesisPayload>((payload: any) =>
    updateAnamnesis(payload)
  )

  return mutation
}

export default useUpdateAnamnesis
