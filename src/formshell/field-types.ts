/**
 * FormShell Field Types
 * Field types with validation for multi-step forms
 * Includes: text, number, email, URL, date, choice, multiple-choice, rating, yes/no
 */

import { Theme } from './theme.js';
import type { 
  FieldType,
  FieldValue,
  ValidationResult, 
  FieldConfig,
  TextFieldConfig,
  NumberFieldConfig,
  ChoiceFieldConfig,
  MultipleChoiceFieldConfig,
  RatingFieldConfig,
  FormData
} from './types.js';

/**
 * Base class for all field types
 */
export class BaseField {
  readonly type: FieldType;
  id: string;
  label: string;
  required: boolean;
  value: FieldValue;
  error: string | null;
  condition?: (formData: FormData) => boolean;

  constructor(config: FieldConfig) {
    this.type = config.type;
    this.id = config.id;
    this.label = config.label;
    this.required = config.required !== false; // Default true
    this.value = config.defaultValue ?? null;
    this.error = null;
    this.condition = 'condition' in config ? config.condition : undefined;
  }

  /**
   * Validate the field (to be overridden in subclasses)
   */
  validate(value: FieldValue): ValidationResult {
    if (this.required && (value === null || value === undefined || value === '')) {
      return {
        valid: false,
        error: 'This field is required'
      };
    }
    return { valid: true };
  }

  /**
   * Format the value for display
   */
  format(value: FieldValue): string {
    return String(value ?? '');
  }

  /**
   * Get the current value
   */
  getValue(): FieldValue {
    return this.value;
  }

  /**
   * Set the value
   */
  setValue(value: FieldValue): boolean {
    const validation = this.validate(value);
    if (validation.valid) {
      this.value = value;
      this.error = null;
      return true;
    } else {
      this.error = validation.error!;
      return false;
    }
  }
}

/**
 * Free text field
 */
export class TextField extends BaseField {
  minLength: number | null;
  maxLength: number | null;
  pattern: RegExp | null;

  constructor(config: TextFieldConfig | FieldConfig) {
    super(config);
    this.minLength = 'minLength' in config ? (config.minLength ?? null) : null;
    this.maxLength = 'maxLength' in config ? (config.maxLength ?? null) : null;
    this.pattern = 'pattern' in config ? (config.pattern ?? null) : null;
  }

  validate(value: FieldValue): ValidationResult {
    // Base validation
    const baseValidation = super.validate(value);
    if (!baseValidation.valid) return baseValidation;

    // If empty and not required, it's valid
    if (!value && !this.required) {
      return { valid: true };
    }

    const strValue = String(value);

    // Validate minimum length
    if (this.minLength && strValue.length < this.minLength) {
      return {
        valid: false,
        error: `Minimum ${this.minLength} characters required`
      };
    }

    // Validate maximum length
    if (this.maxLength && strValue.length > this.maxLength) {
      return {
        valid: false,
        error: `Maximum ${this.maxLength} characters allowed`
      };
    }

    // Validate pattern
    if (this.pattern && !this.pattern.test(strValue)) {
      return {
        valid: false,
        error: 'Invalid format'
      };
    }

    return { valid: true };
  }
}

/**
 * Numeric field
 */
export class NumberField extends BaseField {
  min: number | null;
  max: number | null;
  integer: boolean;

  constructor(config: NumberFieldConfig | FieldConfig) {
    super(config);
    this.min = 'min' in config && config.min !== undefined ? config.min : null;
    this.max = 'max' in config && config.max !== undefined ? config.max : null;
    this.integer = 'integer' in config ? (config.integer ?? false) : false;
  }

  validate(value: FieldValue): ValidationResult {
    // Base validation
    const baseValidation = super.validate(value);
    if (!baseValidation.valid) return baseValidation;

    // If empty and not required, it's valid
    if (!value && !this.required) {
      return { valid: true };
    }

    // Convert to number
    const numValue = Number(value);
    if (isNaN(numValue)) {
      return {
        valid: false,
        error: 'Must be a valid number'
      };
    }

    // Validate integer
    if (this.integer && !Number.isInteger(numValue)) {
      return {
        valid: false,
        error: 'Must be an integer'
      };
    }

    // Validate min
    if (this.min !== null && numValue < this.min) {
      return {
        valid: false,
        error: `Minimum value: ${this.min}`
      };
    }

    // Validate max
    if (this.max !== null && numValue > this.max) {
      return {
        valid: false,
        error: `Maximum value: ${this.max}`
      };
    }

    return { valid: true };
  }

  format(value: FieldValue): string {
    return value !== null && value !== undefined ? String(value) : '';
  }
}

/**
 * Email field
 */
export class EmailField extends TextField {
  constructor(config: FieldConfig) {
    super(config);
    // Simplified but effective email regex pattern
    this.pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  }

  validate(value: FieldValue): ValidationResult {
    const baseValidation = super.validate(value);
    if (!baseValidation.valid) {
      return {
        valid: false,
        error: baseValidation.error === 'Invalid format' 
          ? 'Invalid email address'
          : baseValidation.error!
      };
    }
    return baseValidation;
  }
}

/**
 * URL field
 */
export class URLField extends TextField {
  constructor(config: FieldConfig) {
    super(config);
    // URL regex pattern
    this.pattern = /^https?:\/\/.+\..+/;
  }

  validate(value: FieldValue): ValidationResult {
    const baseValidation = super.validate(value);
    if (!baseValidation.valid) {
      return {
        valid: false,
        error: baseValidation.error === 'Invalid format' 
          ? 'Invalid URL (must start with http:// or https://)'
          : baseValidation.error!
      };
    }
    return baseValidation;
  }
}

/**
 * Date field (format DD/MM/YYYY)
 */
export class DateField extends TextField {
  constructor(config: FieldConfig) {
    super(config);
    // Pattern for DD/MM/YYYY date
    this.pattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/(19|20)\d\d$/;
  }

  validate(value: FieldValue): ValidationResult {
    const baseValidation = super.validate(value);
    if (!baseValidation.valid) {
      return {
        valid: false,
        error: baseValidation.error === 'Invalid format' 
          ? 'Invalid date (format: DD/MM/YYYY)'
          : baseValidation.error!
      };
    }

    // Additional validation: check if date is real
    if (value && typeof value === 'string' && this.pattern!.test(value)) {
      const [day, month, year] = value.split('/').map(Number);
      const date = new Date(year, month - 1, day);
      
      if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
        return {
          valid: false,
          error: 'Invalid date (format: DD/MM/YYYY)'
        };
      }
    }

    return baseValidation;
  }
}

/**
 * Single choice field
 */
export class ChoiceField extends BaseField {
  options: Array<string | { value: string; label: string }>;

  constructor(config: ChoiceFieldConfig | FieldConfig) {
    super(config);
    this.options = 'options' in config ? (config.options ?? []) : [];
  }

  validate(value: FieldValue): ValidationResult {
    const baseValidation = super.validate(value);
    if (!baseValidation.valid) return baseValidation;

    // If empty and not required, it's valid
    if (!value && !this.required) {
      return { valid: true };
    }

    // Accept both index (number) and direct value
    if (typeof value === 'number') {
      if (value < 1 || value > this.options.length) {
        return {
          valid: false,
          error: `Choose a number between 1 and ${this.options.length}`
        };
      }
      return { valid: true };
    }

    // Check if value is among options
    const validOptions = this.options.map(opt => 
      typeof opt === 'string' ? opt : opt.value
    );
    
    if (typeof value === 'string' && !validOptions.includes(value)) {
      return {
        valid: false,
        error: 'Invalid choice'
      };
    }

    return { valid: true };
  }

  setValue(value: FieldValue): boolean {
    // Convert number to actual value
    if (typeof value === 'number') {
      const index = value - 1;
      if (index >= 0 && index < this.options.length) {
        const option = this.options[index];
        const actualValue = typeof option === 'string' ? option : option.value;
        return super.setValue(actualValue);
      }
    }
    return super.setValue(value);
  }

  format(value: FieldValue): string {
    if (!value) return '';
    const option = this.options.find(opt => 
      (typeof opt === 'string' ? opt : opt.value) === value
    );
    return typeof option === 'string' ? option : (option?.label || String(value));
  }
}

/**
 * Multiple choice field
 */
export class MultipleChoiceField extends BaseField {
  options: Array<string | { value: string; label: string }>;
  minChoices: number;
  maxChoices: number;

  constructor(config: MultipleChoiceFieldConfig | FieldConfig) {
    super(config);
    this.options = 'options' in config ? (config.options ?? []) : [];
    this.minChoices = 'minChoices' in config ? (config.minChoices ?? (this.required ? 1 : 0)) : (this.required ? 1 : 0);
    this.maxChoices = 'maxChoices' in config ? (config.maxChoices ?? this.options.length) : this.options.length;
  }

  validate(value: FieldValue): ValidationResult {
    // Value must be an array
    if (!Array.isArray(value)) {
      if (this.required) {
        return {
          valid: false,
          error: 'Select at least 1 option(s)'
        };
      }
      return { valid: true };
    }

    // Validate minimum number of choices
    if (value.length < this.minChoices) {
      return {
        valid: false,
        error: `Select at least ${this.minChoices} option(s)`
      };
    }

    // Validate maximum number of choices
    if (value.length > this.maxChoices) {
      return {
        valid: false,
        error: `Select maximum ${this.maxChoices} option(s)`
      };
    }

    // Validate each individual choice
    const validOptions = this.options.map(opt => 
      typeof opt === 'string' ? opt : opt.value
    );

    for (const choice of value) {
      if (!validOptions.includes(choice)) {
        return {
          valid: false,
          error: 'One or more choices are invalid'
        };
      }
    }

    return { valid: true };
  }

  setValue(value: FieldValue): boolean {
    // Convert comma or space separated input to array
    if (typeof value === 'string') {
      const indices = value.split(/[,\s]+/).map(v => v.trim()).filter(v => v);
      const values: string[] = [];
      for (const idx of indices) {
        const num = Number(idx);
        if (!isNaN(num) && num >= 1 && num <= this.options.length) {
          const option = this.options[num - 1];
          values.push(typeof option === 'string' ? option : option.value);
        }
      }
      return super.setValue(values);
    }

    return super.setValue(value);
  }

  format(value: FieldValue): string {
    if (!Array.isArray(value) || value.length === 0) return 'No selection';
    
    const formatted = value.map(v => {
      const option = this.options.find(opt => 
        (typeof opt === 'string' ? opt : opt.value) === v
      );
      return typeof option === 'string' ? option : (option?.label || v);
    });
    
    return formatted.join(', ');
  }
}

/**
 * Rating field (scale 1-5 with stars)
 */
export class RatingField extends NumberField {
  constructor(config: RatingFieldConfig | FieldConfig) {
    super(config);
    this.min = 'min' in config && config.min !== undefined ? config.min : 1;
    this.max = 'max' in config && config.max !== undefined ? config.max : 5;
    this.integer = true;
  }

  validate(value: FieldValue): ValidationResult {
    const numValidation = super.validate(value);
    if (!numValidation.valid) {
      return {
        valid: false,
        error: numValidation.error!.includes('number')
          ? `Enter a number from ${this.min} to ${this.max}`
          : numValidation.error!
      };
    }
    return numValidation;
  }

  format(value: FieldValue): string {
    if (!value || typeof value !== 'number') return '';
    const stars = Theme.icons.star.repeat(value) + Theme.icons.starEmpty.repeat((this.max ?? 5) - value);
    return `${stars} (${value}/${this.max})`;
  }
}

/**
 * Yes/No field
 */
export class YesNoField extends BaseField {
  constructor(config: FieldConfig) {
    super(config);
    this.value = config.defaultValue || null;
  }

  validate(value: FieldValue): ValidationResult {
    const baseValidation = super.validate(value);
    if (!baseValidation.valid) return baseValidation;

    // Accept boolean, 'y', 'n', 'yes', 'no', 's', 'si', 'sì'
    if (typeof value === 'boolean') {
      return { valid: true };
    }

    if (typeof value === 'string') {
      const normalized = value.toLowerCase().trim();
      if (['y', 'yes', 's', 'si', 'sì', 'n', 'no'].includes(normalized)) {
        return { valid: true };
      }
    }

    return {
      valid: false,
      error: 'Answer with Y (yes) or N (no)'
    };
  }

  setValue(value: FieldValue): boolean {
    // Normalize value to boolean
    if (typeof value === 'string') {
      const normalized = value.toLowerCase().trim();
      if (['y', 'yes', 's', 'si', 'sì'].includes(normalized)) {
        this.value = true;
        this.error = null;
        return true;
      } else if (['n', 'no'].includes(normalized)) {
        this.value = false;
        this.error = null;
        return true;
      }
    }
    
    if (typeof value === 'boolean') {
      this.value = value;
      this.error = null;
      return true;
    }

    this.error = 'Answer with Y (yes) or N (no)';
    return false;
  }

  format(value: FieldValue): string {
    if (value === true) return 'Yes';
    if (value === false) return 'No';
    return '';
  }
}

/**
 * Factory to create fields from type
 */
export const FieldFactory = {
  create(config: FieldConfig): BaseField {
    const type = (config.type || 'text').toLowerCase();
    
    switch (type) {
      case 'text':
        return new TextField(config);
      case 'number':
        return new NumberField(config);
      case 'email':
        return new EmailField(config);
      case 'url':
        return new URLField(config);
      case 'date':
        return new DateField(config);
      case 'choice':
        return new ChoiceField(config);
      case 'multiple-choice':
      case 'multiplechoice':
        return new MultipleChoiceField(config);
      case 'rating':
        return new RatingField(config);
      case 'yesno':
      case 'yes-no':
        return new YesNoField(config);
      default:
        console.warn(`Unknown field type: ${type}, defaulting to text`);
        return new TextField(config);
    }
  }
};
