export type CustomPageCategory = 'plc' | 'lab' | 'form' | 'dashboard';

export interface CustomPageField {
  name: string;
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

export interface CustomPage {
  id: string;
  title: string;
  category: CustomPageCategory;
  factoryId: string;
  schema: CustomPageField[];
}
