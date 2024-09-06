import {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

import { useMemo, useState } from 'react';

import { generateId } from '@/lib/utils'

import { ContainerType, FormFieldType, FormType, Id } from './types';

const useAnamnesisHooks = () => {

  const [anamnesisTitle, setAnamnesisTitle] = useState('');
  const [anamnesisDescription, setAnamnesisDescription] = useState('');

  const [containers, setContainers] = useState<ContainerType[]>([
    { id: 1, title: 'Container 1' },
  ]);
  const containersIds = useMemo(
    () => containers.map((container) => container.id),
    [containers],
  );
  const [activeContainer, setActiveContainer] = useState<ContainerType | null>(
    null,
  );

  const [forms, setForms] = useState<FormType[]>([]);
  const formsIds = useMemo(() => forms.map((form) => form.id), [forms]);
  const [activeForm, setActiveForm] = useState<FormType | null>(null);


  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
  );

  // Create
  const createNewContainer = () => {
    const newColumn: ContainerType = {
      id: generateId(),
      title: `Container ${containers.length + 1}`,
    };

    setContainers((prevState) => {
      return [...prevState, newColumn];
    });
  };

  // Update
  const updateContainer = (id: Id, title: string) => {
    const updatedContainers = containers.map((container) => {
      if (container.id !== id) return container;
      return { ...container, title };
    });

    setContainers(updatedContainers);
  };

  // Delete
  const deleteContainer = (id: Id) => {
    const filteredContainers = containers.filter((item) => item.id !== id);
    setContainers(filteredContainers);

    const filteredForms = forms.filter((form) => form.id !== id);
    setForms(filteredForms);
  };

  // Form Functions
  const addForm = (
    containerId: Id,
    label: string,
    type: FormFieldType,
    choices?: string[],
  ) => {
    const newForm: FormType = {
      id: generateId(),
      containerId,
      label,
      type,
      choices,
    };

    setForms([...forms, newForm]);
  };

  const updateForm = (
    formId: Id,
    label: string,
    type: FormFieldType,
    choices?: string[],
  ) => {
    const updatedForms = forms.map((form) => {
      if (form.id !== formId) return form;
      return { ...form, label, type, choices };
    });

    setForms(updatedForms);
  };

  const deleteForm = (formId: Id) => {
    const filteredForms = forms.filter((item) => item.id !== formId);
    setForms(filteredForms);
  };

  // Drag and Drop Functions
  const onDragStart = (e: DragStartEvent) => {
    if (e.active.data.current?.type === 'Container') {
      setActiveContainer(e.active.data.current.container);
      return;
    }

    if (e.active.data.current?.type === 'Form') {
      setActiveForm(e.active.data.current.form);
      return;
    }
  };

  const onDragEnd = (e: DragEndEvent) => {
    setActiveContainer(null);
    setActiveForm(null);

    const { active, over } = e;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    setContainers((prevState) => {
      const activeIndex = prevState.findIndex(
        (container) => container.id === activeId,
      );

      const overIndex = prevState.findIndex(
        (container) => container.id === overId,
      );

      return arrayMove(containers, activeIndex, overIndex);
    });
  };

  const onDragOver = (e: DragOverEvent) => {
    const { active, over } = e;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveForm = active.data.current?.type === 'Form';
    const isOverForm = over.data.current?.type === 'Form';

    if (!isActiveForm) return;

    if (isActiveForm && isOverForm) {
      setForms((prevState) => {
        const activeIndex = prevState.findIndex((form) => form.id === activeId);
        const overIndex = prevState.findIndex((form) => form.id === overId);

        forms[activeIndex].containerId = forms[overIndex].containerId;

        return arrayMove(forms, activeIndex, overIndex);
      });
    }

    const isOverContainer = over.data.current?.type === 'Container';

    if (isActiveForm && isOverContainer) {
      setForms((prevState) => {
        const activeIndex = prevState.findIndex((form) => form.id === activeId);

        forms[activeIndex].containerId = overId;

        return arrayMove(forms, activeIndex, activeIndex);
      });
    }
  };

  return {
    anamnesisTitle,
    setAnamnesisTitle,
    anamnesisDescription,
    setAnamnesisDescription,
    containers,
    containersIds,
    activeContainer,
    forms,
    formsIds,
    activeForm,
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
  };
};

export default useAnamnesisHooks;
