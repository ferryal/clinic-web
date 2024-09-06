import React, { useEffect } from 'react'
import { DndContext, DragOverlay } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import { createPortal } from 'react-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/custom/button'
import { useNavigate, useParams } from 'react-router-dom'

import { Layout } from '@/components/custom/layout'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/toast'
import Loader from '@/components/loader'
import dayjs from 'dayjs'

import FormContainer from './components/form-container'
import useAnamnesisHooks from './useAnamnesisHooks'
import useCreateAnamnesis from '@/apis/mutations/useCreateAnamnesis'
import useUpdateAnamnesis from '@/apis/mutations/useUpdateAnamnesis'
import useDetailAnamnesis from '@/apis/queries/useDetailAnamnesis'
import useAnamnesis from '@/apis/queries/useAnamnesis'

// Define the Zod schema for validation
const anamnesisSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
})

interface AnamnesisProps {
  type?: 'view' | 'edit'
}

const Anamnesis: React.FC<AnamnesisProps> = ({ type }) => {
  const isView = type?.includes('view') || false
  const isEdit = type?.includes('edit') || false
  const {
    containers,
    containersIds,
    activeContainer,
    forms,
    formsIds,
    sensors,
    createNewContainer,
    updateContainer,
    deleteContainer,
    addForm,
    updateForm,
    deleteForm,
    setContainers,
    setForms,
    onDragStart,
    onDragEnd,
    onDragOver,
  } = useAnamnesisHooks()

  // Set up react-hook-form and integrate zod resolver for validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(anamnesisSchema),
  })

  const { id } = useParams()

  const {
    mutate: createAnamnesis,
    isLoading: isLoadingCreateAnamnesis,
    isSuccess: isSuccessCreatedAnamnesis,
  } = useCreateAnamnesis()
  const {
    mutate: updateAnamnesis,
    isLoading: isLoadingUpdateAnamnesis,
    isSuccess: isSuccessUpdateAnamnesis,
  } = useUpdateAnamnesis()
  const { data: detailAnamnesis, isLoading: isLoadingDetail } =
    useDetailAnamnesis({ id })
  const { refetch } = useAnamnesis()
  const { toast } = useToast()
  const navigate = useNavigate()


  useEffect(() => {
    if (detailAnamnesis?.data && !!id) {
      // Reset form values based on detailAnamnesis data
      reset({
        title: detailAnamnesis.data.title,
        description: detailAnamnesis.data.description,
      })

      if (detailAnamnesis?.data?.containers) {
        setContainers(detailAnamnesis?.data?.containers)
      }

      if (detailAnamnesis?.data?.forms) {
        setForms(detailAnamnesis?.data?.forms)
      }
    }
  }, [id, detailAnamnesis?.data, reset])

  useEffect(() => {
    if (isSuccessUpdateAnamnesis || isSuccessCreatedAnamnesis) {
      toast({
        title: `Anamnesis Form Successful ${isEdit ? 'Update' : 'Created'}!`,
        description: 'The action was completed successfully.',
        variant: 'default', // or 'destructive' for red toasts
        duration: 4000, // 4 seconds
      })
      navigate('/')
      refetch()
    }
  }, [isSuccessUpdateAnamnesis || isSuccessCreatedAnamnesis])

  // Handle form submission
  const onSubmit = (data: any) => {
    if (!!id) {
      console.log('masuk edit', !!id)
      const payload = {
        anamnesisId: String(id),
        title: data?.title,
        description: data?.description,
        creationDate: dayjs().format('YYYY-MM-DD'),
        containers,
        forms,
      }

      updateAnamnesis(payload)
    } else {
      console.log('masuk create')
      const payload = {
        title: data?.title,
        description: data?.description,
        creationDate: dayjs().format('YYYY-MM-DD'),
        containers,
        forms,
      }

      createAnamnesis(payload)
    }
  }

  const generateTitle = () => {
    if (type?.includes('view')) return 'Detail Anamnesis'

    if (type?.includes('edit')) return 'Edit Anamnesis'

    return 'Create Anamnesis'
  }

  if (isLoadingDetail) {
    return <Loader />
  }

  console.log('containers', containers)

  return (
    <Layout>
      <Layout.Header sticky>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <UserNav />
        </div>
      </Layout.Header>

      <Layout.Body>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              {generateTitle()}
            </h2>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
          {/* Title Input */}
          <div className='flex flex-col'>
            <label>Title</label>
            <Input
              {...register('title')}
              placeholder='Anamnesis title'
              disabled={isView}
            />
            {/* Safely render the error message */}
            {errors.title && (
              <span className='text-sm text-red-600'>
                {errors.title.message?.toString()}
              </span>
            )}
          </div>

          {/* Description Input */}
          <div className='flex flex-col'>
            <label>Description</label>
            <Input
              {...register('description')}
              placeholder='Anamnesis description'
              disabled={isView}
            />
            {/* Safely render the error message */}
            {errors.description && (
              <span className='text-sm text-red-600'>
                {errors.description.message?.toString()}
              </span>
            )}
          </div>

          {/* Drag and Drop Context */}
          <div className='mt-1'>
            <DndContext
              sensors={sensors}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onDragOver={onDragOver}
            >
              <div className='flex flex-col gap-4'>
                <SortableContext items={containersIds}>
                  {containers.map((container: any) => (
                    <FormContainer
                      isView={isView}
                      key={container.id}
                      container={container}
                      updateContainer={updateContainer}
                      deleteContainer={deleteContainer}
                      forms={forms.filter(
                        (form: any) => form.containerId === container.id
                      )}
                      formsIds={formsIds}
                      addForm={addForm}
                      updateForm={updateForm}
                      deleteForm={deleteForm}
                    />
                  ))}
                </SortableContext>
              </div>

              {/* Drag Overlay Portal */}
              {createPortal(
                <DragOverlay>
                  {activeContainer && (
                    <FormContainer
                      isView={isView}
                      container={activeContainer}
                      updateContainer={updateContainer}
                      deleteContainer={deleteContainer}
                      forms={forms.filter(
                        (form) => form.containerId === activeContainer.id
                      )}
                      formsIds={formsIds}
                      addForm={addForm}
                      updateForm={updateForm}
                      deleteForm={deleteForm}
                    />
                  )}
                </DragOverlay>,
                document.body
              )}
            </DndContext>
          </div>

          {/* Save / Create Button */}
          {!isView && (
            <div className='mt-5 flex items-center justify-end gap-2'>
              <Button
                type='button'
                disabled={isLoadingCreateAnamnesis || isLoadingUpdateAnamnesis}
                onClick={createNewContainer}
              >
                Add new form container
              </Button>

              <Button
                type='submit'
                disabled={isLoadingCreateAnamnesis || isLoadingUpdateAnamnesis}
              >
                {isEdit ? 'Update' : 'Submit'}
              </Button>
            </div>
          )}
        </form>
      </Layout.Body>
    </Layout>
  )
}

export default Anamnesis
