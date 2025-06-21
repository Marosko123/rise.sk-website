import { useState, useCallback } from 'react';

export interface UseFormOptions<T> {
  initialValues: T;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  onSubmit?: (values: T) => Promise<void> | void;
}

export function useForm<T extends Record<string, unknown>>(options: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(options.initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = useCallback((field: keyof T, value: T[keyof T]) => {
    setValues(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const reset = useCallback(() => {
    setValues(options.initialValues);
    setErrors({});
    setIsSubmitting(false);
  }, [options.initialValues]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    // Validate if validation function provided
    if (options.validate) {
      const validationErrors = options.validate(values);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await options.onSubmit?.(values);
    } catch {
      // Silently handle errors - error handling should be done in onSubmit
    } finally {
      setIsSubmitting(false);
    }
  }, [values, options]);

  const getFieldProps = useCallback((field: keyof T) => ({
    value: values[field] || '',
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setValue(field, e.target.value as T[keyof T]);
    },
    error: errors[field],
  }), [values, errors, setValue]);

  return {
    values,
    errors,
    isSubmitting,
    setValue,
    setFieldError,
    clearErrors,
    reset,
    handleSubmit,
    getFieldProps,
  };
}
