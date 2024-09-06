import { Button } from '@/components/custom/button'
import { useState } from 'react'

export function UserNav() {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className='relative'>
      <Button
        id='dropdownInformationButton'
        variant='default'
        className='relative h-8 w-8 rounded-full border-gray-200'
        onClick={() => setIsOpen(!isOpen)}
      >
        FF
      </Button>

      {isOpen && (
        <div
          id='dropdownInformation'
          className='absolute right-0 z-10 w-44 divide-y divide-gray-100 rounded-lg bg-white shadow dark:divide-gray-600 dark:bg-gray-700'
        >
          <div className='px-4 py-3 text-sm text-gray-900 dark:text-white'>
            <div>Superadmin</div>
            <div className='truncate font-medium'>ferryalmfajar@gmail.com</div>
          </div>
          <ul
            className='py-2 text-sm text-gray-700 dark:text-gray-200'
            aria-labelledby='dropdownInformationButton'
          >
            <li>
              <a
                href='#'
                className='block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'
              >
                Profile
              </a>
            </li>
            <li>
              <a
                href='#'
                className='block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'
              >
                Settings
              </a>
            </li>
          </ul>
          <div className='py-2'>
            <a
              href='#'
              className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white'
            >
              Log out
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
