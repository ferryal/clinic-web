import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/custom/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import useRemoveAnamnesis from '@/apis/mutations/useRemoveAnamnesis'
import useAnamnesis from '@/apis/queries/useAnamnesis'
import { useEffect } from 'react'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const navigate = useNavigate()

  const { mutate, data } = useRemoveAnamnesis()
  const { refetch } = useAnamnesis()

  const onDeleteAnamnesis = () => {
    const payload = {
      id: String(row?.index + 1),
    }
    mutate(payload)
  }

  useEffect(() => {
    if (data?.status === 200) {
      refetch()
    }
  }, [data])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
        >
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        <DropdownMenuItem
          onClick={() => navigate(`/view/anamnesis/${row?.index + 1}`)}
        >
          View
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => navigate(`/edit/anamnesis/${row?.index + 1}`)}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onDeleteAnamnesis}>
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
