/**
 * FormShell - Main Entry Point
 * Elegant framework for creating interactive multi-step forms in the browser console
 */

// Export main form class
export { FormShell } from './form-framework.js';
export { default } from './form-framework.js';

// Export field types
export {
  BaseField,
  TextField,
  NumberField,
  EmailField,
  URLField,
  DateField,
  ChoiceField,
  MultipleChoiceField,
  RatingField,
  YesNoField,
  FieldFactory
} from './field-types.js';

// Export renderer
export { TUIRenderer } from './tui-renderer.js';

// Export theme
export { Theme } from './theme.js';

// Export types
export type {
  FieldType,
  FieldValue,
  BaseFieldConfig,
  TextFieldConfig,
  NumberFieldConfig,
  EmailFieldConfig,
  URLFieldConfig,
  DateFieldConfig,
  ChoiceFieldConfig,
  MultipleChoiceFieldConfig,
  RatingFieldConfig,
  YesNoFieldConfig,
  FieldConfig,
  FormConfig,
  FormData,
  FieldInstance,
  ValidationResult,
  ProgressInfo,
  Step
} from './types.js';
