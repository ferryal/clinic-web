import { useState, useRef, useEffect } from 'react'
import { MixerHorizontalIcon, CheckIcon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/custom/button'

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown if clicked outside
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

  return (
    <div className='relative' ref={dropdownRef}>
      {/* Trigger button */}
      <Button
        id='dropdownDividerButton'
        variant='outline'
        size='sm'
        className='ml-auto hidden h-8 lg:flex'
        onClick={() => setIsOpen(!isOpen)}
      >
        <MixerHorizontalIcon className='mr-2 h-4 w-4' />
        View
      </Button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          id='dropdownDivider'
          className='absolute right-0 z-10 mt-2 w-44 divide-y divide-gray-100 rounded-lg bg-white shadow dark:divide-gray-600 dark:bg-gray-700'
        >
          <div>
            <a
              href='#'
              className='block px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white'
            >
              Toggle columns
            </a>
          </div>
          <ul className='py-2 text-sm text-gray-700 dark:text-gray-200'>
            {table
              .getAllColumns()
              .filter(
                (column) =>
                  typeof column.accessorFn !== 'undefined' &&
                  column.getCanHide()
              )
              .map((column) => (
                <li key={column.id}>
                  <label className='block flex items-center px-4 py-2 capitalize hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'>
                    {/* Checkbox with custom styles */}
                    <div className='relative'>
                      <input
                        type='checkbox'
                        className='mr-2 h-4 w-4 appearance-none rounded-sm border border-gray-300 checked:bg-black focus:ring-0'
                        checked={column.getIsVisible()}
                        onChange={(e) =>
                          column.toggleVisibility(e.target.checked)
                        }
                      />
                      {/* CheckIcon for the white check mark */}
                      {column.getIsVisible() && (
                        <CheckIcon className='absolute left-0 top-0 h-4 w-4 text-white' />
                      )}
                    </div>
                    <span className='ml-2'>{column.id}</span>
                  </label>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  )
}
