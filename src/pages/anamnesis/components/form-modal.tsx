import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/custom/button'
import { Input } from '@/components/ui/input'

import { FormFieldType, FormType } from '../types';

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOk: (label: string, type: FormFieldType, choices?: string[]) => void;
  isEdit?: boolean;
  form?: FormType;
}

const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  onOk,
  isEdit = false,
  form,
}) => {
  const [formLabel, setFormLabel] = useState('');
  const [formType, setFormType] = useState<FormFieldType>(
    FormFieldType.ShortText,
  );
  const [formChoices, setFormChoices] = useState<string[] | undefined>(
    undefined,
  );

  const handleSave = () => {
    onOk(
      formLabel,
      formType,
      formType === 'multipleChoice' ? formChoices : undefined,
    );
    setFormLabel('');
    setFormType(FormFieldType.ShortText);
    setFormChoices([]);
  };

  useEffect(() => {
    if (isOpen && isEdit && form) {
      setFormLabel(form?.label);
      setFormType(form?.type);
      setFormChoices(form?.choices);
    }
  }, [isOpen, isEdit, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Form Item' : 'Add Form Item'}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Input
            className="w-full rounded border border-black p-2 shadow"
            type="text"
            placeholder="Form Label"
            value={formLabel}
            onChange={(e) => setFormLabel(e.target.value)}
          />
          <select
            className="w-full rounded border border-black px-3 py-2 shadow"
            value={formType}
            onChange={(e) => setFormType(e.target.value as FormFieldType)}
          >
            <option value="shortText">Short Text</option>
            <option value="longText">Long Text</option>
            <option value="multipleChoice">Multiple Choice</option>
            <option value="time">Time</option>
          </select>
          {formType === 'multipleChoice' && (
            <Input
              className="w-full rounded border border-black px-3 py-2 shadow"
              type="text"
              placeholder="Choices (comma-separated)"
              value={formChoices?.join(',')}
              onChange={(e) => setFormChoices(e.target.value.split(','))}
            />
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="default" onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FormModal;
