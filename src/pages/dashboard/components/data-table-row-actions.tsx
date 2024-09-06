import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'
import { Link } from 'react-router-dom'
import { Button } from '@/components/custom/button'
import { useEffect, useRef, useState } from 'react'
import useRemoveAnamnesis from '@/apis/mutations/useRemoveAnamnesis'
import useAnamnesis from '@/apis/queries/useAnamnesis'

interface DataTableRowActionsProps {
  row: Row<any>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { mutate, data } = useRemoveAnamnesis()
  const { refetch } = useAnamnesis()

  const onDeleteAnamnesis = () => {
    const payload = {
      id: String(row?.original?.id),
    }
    mutate(payload)
  }

  useEffect(() => {
    if (data?.status === 200) {
      refetch()
    }

    // Close dropdown if clicked outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [data, refetch])

  return (
    <div className='relative' ref={dropdownRef}>
      {/* Trigger button */}
      <Button
        variant='ghost'
        className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
        onClick={() => setIsOpen(!isOpen)}
      >
        <DotsHorizontalIcon className='h-4 w-4' />
        <span className='sr-only'>Open menu</span>
      </Button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          id='dropdownDivider'
          className='absolute right-0 z-10 mt-2 w-44 divide-y divide-gray-100 rounded-lg bg-white shadow dark:divide-gray-600 dark:bg-gray-700'
        >
          <ul
            className='text-sm text-gray-700 dark:text-gray-200'
            aria-labelledby='dropdownDividerButton'
          >
            <li>
              <Link
                to={`/view/anamnesis/${row?.original?.id}`}
                className='block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'
              >
                View
              </Link>
            </li>
            <li>
              <Link
                to={`/edit/anamnesis/${row?.original?.id}`}
                className='block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'
              >
                Edit
              </Link>
            </li>
          </ul>
          <div>
            <a
              href='#'
              className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white'
              onClick={onDeleteAnamnesis}
            >
              Delete
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
