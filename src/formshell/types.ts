/**
 * Core TypeScript types for FormShell
 */

// Field types
export type FieldType = 
  | 'text' 
  | 'number' 
  | 'email' 
  | 'url' 
  | 'date' 
  | 'choice' 
  | 'multiple-choice' 
  | 'rating' 
  | 'yesno';

// Base field configuration
export interface BaseFieldConfig {
  id: string;
  type: FieldType;
  label: string;
  description?: string;
  required?: boolean;
  defaultValue?: string | number | boolean | null;
  condition?: (formData: FormData) => boolean;
}

// Text field configuration
export interface TextFieldConfig extends BaseFieldConfig {
  type: 'text';
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
}

// Number field configuration
export interface NumberFieldConfig extends BaseFieldConfig {
  type: 'number';
  min?: number;
  max?: number;
  integer?: boolean;
}

// Email field configuration
export interface EmailFieldConfig extends BaseFieldConfig {
  type: 'email';
  minLength?: number;
  maxLength?: number;
}

// URL field configuration
export interface URLFieldConfig extends BaseFieldConfig {
  type: 'url';
}

// Date field configuration
export interface DateFieldConfig extends BaseFieldConfig {
  type: 'date';
}

// Choice field configuration
export interface ChoiceFieldConfig extends BaseFieldConfig {
  type: 'choice';
  options: string[] | Array<{ value: string; label: string }>;
}

// Multiple choice field configuration
export interface MultipleChoiceFieldConfig extends BaseFieldConfig {
  type: 'multiple-choice';
  options: string[] | Array<{ value: string; label: string }>;
  minChoices?: number;
  maxChoices?: number;
}

// Rating field configuration
export interface RatingFieldConfig extends BaseFieldConfig {
  type: 'rating';
  min?: number;
  max?: number;
}

// Yes/No field configuration
export interface YesNoFieldConfig extends BaseFieldConfig {
  type: 'yesno';
  defaultValue?: boolean;
}

// Union type for all field configs
export type FieldConfig = 
  | TextFieldConfig
  | NumberFieldConfig
  | EmailFieldConfig
  | URLFieldConfig
  | DateFieldConfig
  | ChoiceFieldConfig
  | MultipleChoiceFieldConfig
  | RatingFieldConfig
  | YesNoFieldConfig;

// Form configuration
export interface FormConfig {
  title: string;
  subtitle?: string;
  endpoint?: string;
  steps: FieldConfig[];
  onComplete?: (data: FormData) => void | Promise<void>;
}

// Value types that form fields can hold
export type FieldValue = string | number | boolean | string[] | null;

// Form data (collected responses)
export interface FormData {
  [fieldId: string]: FieldValue;
}

// Validation result
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

// Progress information
export interface ProgressInfo {
  current: number;
  total: number;
  percentage: number;
}

// Minimal field interface used by Step to avoid circular imports with field-types.ts
export interface FieldInstance {
  readonly type: FieldType;
  id: string;
  label: string;
  required: boolean;
  value: FieldValue;
  error: string | null;
  condition?: (formData: FormData) => boolean;
  validate(value: FieldValue): ValidationResult;
  format(value: FieldValue): string;
  getValue(): FieldValue;
  setValue(value: FieldValue): boolean;
}

// Step internal structure
export interface Step {
  id: string;
  field: FieldInstance;
  description: string | null;
  answered: boolean;
}
