'use client';

import { useState, useCallback } from 'react';
import { z, ZodSchema } from 'zod';
import { sanitizeString } from '@/lib/sanitize';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
}

export interface FormField<T> {
  value: T;
  error?: string;
  touched: boolean;
}

export function useFormValidation<T extends Record<string, unknown>>(
  schema: ZodSchema<T>,
  initialValues: T
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate single field
  const validateField = useCallback((name: keyof T, value: unknown): string[] => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const shape = (schema as any).shape;
      if (!shape) return [];

      const fieldSchema = shape[name as string] as ZodSchema;
      if (!fieldSchema) return [];

      fieldSchema.parse(value);
      return [];
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.errors.map(err => err.message);
      }
      return ['Validation error'];
    }
  }, [schema]);

  // Validate all fields
  const validateAll = useCallback((): ValidationResult => {
    try {
      schema.parse(values);
      setErrors({});
      return { isValid: true, errors: {} };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string[]> = {};
        error.errors.forEach(err => {
          const field = err.path.join('.');
          if (!newErrors[field]) {
            newErrors[field] = [];
          }
          newErrors[field].push(err.message);
        });
        setErrors(newErrors);
        return { isValid: false, errors: newErrors };
      }
      return { isValid: false, errors: {} };
    }
  }, [schema, values]);

  // Set field value
  const setFieldValue = useCallback((name: keyof T, value: unknown, shouldValidate = true) => {
    // Sanitize string values
    const sanitizedValue = typeof value === 'string' ? sanitizeString(value) : value;

    setValues(prev => ({ ...prev, [name]: sanitizedValue }));

    if (shouldValidate && touched[name as string]) {
      const fieldErrors = validateField(name, sanitizedValue);
      setErrors(prev => ({
        ...prev,
        [name]: fieldErrors,
      }));
    }
  }, [validateField, touched]);

  // Mark field as touched
  const setFieldTouched = useCallback((name: keyof T, isTouched = true) => {
    setTouched(prev => ({ ...prev, [name as string]: isTouched }));

    if (isTouched) {
      const fieldErrors = validateField(name, values[name]);
      setErrors(prev => ({
        ...prev,
        [name]: fieldErrors,
      }));
    }
  }, [validateField, values]);

  // Handle blur
  const handleBlur = useCallback((name: keyof T) => {
    setFieldTouched(name, true);
  }, [setFieldTouched]);

  // Handle change
  const handleChange = useCallback((name: keyof T, value: unknown) => {
    setFieldValue(name, value, true);
  }, [setFieldValue]);

  // Handle submit
  const handleSubmit = useCallback((
    onSubmit: (values: T) => Promise<void> | void
  ) => {
    return async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
      }

      setIsSubmitting(true);

      // Mark all fields as touched
      const allTouched: Record<string, boolean> = {};
      Object.keys(values).forEach(key => {
        allTouched[key] = true;
      });
      setTouched(allTouched);

      // Validate
      const validation = validateAll();

      if (!validation.isValid) {
        setIsSubmitting(false);
        return;
      }

      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    };
  }, [values, validateAll]);

  // Reset form
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Get field props
  const getFieldProps = useCallback((name: keyof T) => {
    return {
      value: values[name],
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        handleChange(name, e.target.value);
      },
      onBlur: () => handleBlur(name),
      error: errors[name as string]?.[0],
      touched: touched[name as string],
    };
  }, [values, errors, touched, handleChange, handleBlur]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setFieldValue,
    setFieldTouched,
    handleBlur,
    handleChange,
    handleSubmit,
    validateAll,
    reset,
    getFieldProps,
    isValid: Object.keys(errors).length === 0,
  };
}

