import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

import { useState } from 'react'

import { FormFieldType, FormType, Id } from '../types'
import FormModal from './form-modal'

interface AnamnesisItemProps {
  isView: boolean
  form: FormType
  updateForm: (
    formId: Id,
    label: string,
    type: FormFieldType,
    choices?: string[]
  ) => void
  deleteForm: (id: Id) => void
}

const FormItem = ({
  isView,
  form,
  updateForm,
  deleteForm,
}: AnamnesisItemProps) => {
  const [isEditFormModalOpen, setIsEditFormModalOpen] = useState(false)

  const handleUpdateForm = (
    label: string,
    type: FormFieldType,
    choices?: string[]
  ) => {
    updateForm(form.id, label, type, choices)
    setIsEditFormModalOpen(false)
  }

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: form.id,
    data: {
      type: 'Form',
      form,
    },
    disabled: isView,
  })

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  }

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className='flex min-h-[100px] w-full cursor-grab items-start justify-between rounded bg-black p-4 opacity-40'
      />
    )
  }

  const renderFormInput = () => {
    switch (form.type) {
      case 'shortText':
        return (
          <input
            type='text'
            className='w-full rounded border border-black px-3 py-2 shadow'
          />
        )
      case 'longText':
        return (
          <Textarea className='w-full rounded border border-black px-3 py-2 shadow' />
        )
      case 'multipleChoice':
        return (
          <div className='flex flex-col gap-2'>
            {form.choices?.map((choice, index) => (
              <label key={index} className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  value={choice}
                  className='form-checkbox'
                />
                {choice}
              </label>
            ))}
          </div>
        )
      case 'time':
        return (
          <input
            type='datetime-local'
            className='w-full rounded border border-black px-3 py-2 shadow'
          />
        )
      default:
        return null
    }
  }

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className='flex min-h-[100px] w-full cursor-grab items-start justify-between rounded p-4'
      >
        <div className='flex w-full flex-col gap-2'>
          <div className='flex w-full justify-between'>
            <div className='font-semibold'>{form.label}</div>
            {!isView && (
              <div className='flex items-center gap-4'>
                {isView && <button onClick={() => setIsEditFormModalOpen(true)}>
                  <Pencil1Icon className='size-5' />
                </button>}

                <button onClick={() => deleteForm(form.id)}>
                  <TrashIcon className='size-5' />
                </button>
              </div>
            )}
          </div>

          <div>{renderFormInput()}</div>
        </div>
      </Card>

      {/* Edit Form Modal */}
      <FormModal
        isOpen={isEditFormModalOpen}
        onClose={() => setIsEditFormModalOpen(false)}
        onOk={handleUpdateForm}
        isEdit={true}
        form={form}
      />
    </>
  )
}

export default FormItem
