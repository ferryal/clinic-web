import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretSortIcon,
  EyeNoneIcon,
} from '@radix-ui/react-icons'
import { Column } from '@tanstack/react-table'
import { Button } from '@/components/custom/button'
import { cn } from '@/lib/utils'
import { useEffect, useState, useRef } from 'react'

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown if click outside
  useEffect(() => {
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
  }, [])

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <Button
        variant='ghost'
        size='sm'
        className='-ml-3 h-8 data-[state=open]:bg-accent'
        onClick={toggleDropdown}
      >
        <span>{title}</span>
        {column.getIsSorted() === 'desc' ? (
          <ArrowDownIcon className='ml-2 h-4 w-4' />
        ) : column.getIsSorted() === 'asc' ? (
          <ArrowUpIcon className='ml-2 h-4 w-4' />
        ) : (
          <CaretSortIcon className='ml-2 h-4 w-4' />
        )}
      </Button>

      {isOpen && (
        <div
          id='dropdownDivider'
          // className="z-10 absolute right-0 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
          className='absolute left-20 top-3 z-10 w-44 divide-y divide-gray-100 rounded-lg bg-white shadow dark:divide-gray-600 dark:bg-gray-700'
        >
          <ul className='text-sm text-gray-700 dark:text-gray-200'>
            <li>
              <button
                className='flex w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'
                onClick={() => column.toggleSorting(false)}
              >
                <ArrowUpIcon className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
                Asc
              </button>
            </li>
            <li>
              <button
                className='flex w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'
                onClick={() => column.toggleSorting(true)}
              >
                <ArrowDownIcon className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
                Desc
              </button>
            </li>
          </ul>
          <div>
            <button
              className='flex w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white'
              onClick={() => column.toggleVisibility(false)}
            >
              <EyeNoneIcon className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
              Hide
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
