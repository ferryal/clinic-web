export type Id = number | string;

export type ContainerType = {
  id: Id;
  title: string;
};

export enum FormFieldType {
  ShortText = 'shortText',
  LongText = 'longText',
  MultipleChoice = 'multipleChoice',
  Time = 'time',
}

export type FormType = {
  id: Id;
  containerId: Id;
  label: string;
  type: FormFieldType;
  choices?: string[];
};
