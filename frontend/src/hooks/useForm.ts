import { useState, useCallback, ChangeEvent } from "react";

export type ValidationRule = {
  required?: boolean | string;
  minLength?: { value: number; message: string };
  maxLength?: { value: number; message: string };
  min?: { value: number; message: string };
  max?: { value: number; message: string };
  pattern?: { value: RegExp; message: string };
  validate?: {
    [key: string]: (
      value: any,
      formValues: Record<string, any>
    ) => boolean | string;
  };
};

export type FormValidationRules<T extends Record<string, any>> = {
  [K in keyof T]?: ValidationRule;
};

type FormErrors<T> = Partial<Record<keyof T, string>>;

/**
 * Hook quản lý form với validation
 * @param initialValues Giá trị ban đầu của form
 * @param validationRules Quy tắc validation cho form
 * @param onSubmit Hàm submit form
 */
export function useForm<T extends Record<string, any>>({
  initialValues,
  validationRules = {} as FormValidationRules<T>,
  onSubmit,
}: {
  initialValues: T;
  validationRules?: FormValidationRules<T>;
  onSubmit: (
    values: T,
    helpers: { resetForm: () => void }
  ) => void | Promise<void>;
}) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Xử lý thay đổi giá trị của input
   */
  const handleChange = useCallback(
    (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      const { name, value, type } = e.target as HTMLInputElement;

      setValues((prev) => ({
        ...prev,
        [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
      }));

      // Validate lại field khi thay đổi giá trị
      if (touched[name as keyof T]) {
        validateField(
          name as keyof T,
          type === "number" ? (value === "" ? "" : Number(value)) : value
        );
      }
    },
    [touched]
  );

  /**
   * Xử lý blur input
   */
  const handleBlur = useCallback(
    (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      const { name, value } = e.target;

      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));

      validateField(name as keyof T, value);
    },
    []
  );

  /**
   * Set giá trị cho field
   */
  const setValue = useCallback(
    <K extends keyof T>(name: K, value: T[K]) => {
      setValues((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (touched[name]) {
        validateField(name, value);
      }
    },
    [touched]
  );

  /**
   * Set nhiều giá trị cùng lúc
   */
  const setMultipleValues = useCallback(
    (newValues: Partial<T>) => {
      setValues((prev) => ({
        ...prev,
        ...newValues,
      }));

      // Validate các field đã touched
      Object.entries(newValues).forEach(([key, value]) => {
        if (touched[key as keyof T]) {
          validateField(key as keyof T, value);
        }
      });
    },
    [touched]
  );

  /**
   * Validate một field
   */
  const validateField = useCallback(
    (name: keyof T, value: any) => {
      const rules = validationRules[name];
      if (!rules) return "";

      let error = "";

      // Kiểm tra required
      if (rules.required) {
        const isEmptyValue =
          value === "" || value === null || value === undefined;
        if (isEmptyValue) {
          error =
            typeof rules.required === "string"
              ? rules.required
              : `${String(name)} là bắt buộc`;
          setErrors((prev) => ({ ...prev, [name]: error }));
          return error;
        }
      }

      // Kiểm tra minLength
      if (
        rules.minLength &&
        typeof value === "string" &&
        value.length < rules.minLength.value
      ) {
        error = rules.minLength.message;
        setErrors((prev) => ({ ...prev, [name]: error }));
        return error;
      }

      // Kiểm tra maxLength
      if (
        rules.maxLength &&
        typeof value === "string" &&
        value.length > rules.maxLength.value
      ) {
        error = rules.maxLength.message;
        setErrors((prev) => ({ ...prev, [name]: error }));
        return error;
      }

      // Kiểm tra min
      if (rules.min && typeof value === "number" && value < rules.min.value) {
        error = rules.min.message;
        setErrors((prev) => ({ ...prev, [name]: error }));
        return error;
      }

      // Kiểm tra max
      if (rules.max && typeof value === "number" && value > rules.max.value) {
        error = rules.max.message;
        setErrors((prev) => ({ ...prev, [name]: error }));
        return error;
      }

      // Kiểm tra pattern
      if (
        rules.pattern &&
        typeof value === "string" &&
        !rules.pattern.value.test(value)
      ) {
        error = rules.pattern.message;
        setErrors((prev) => ({ ...prev, [name]: error }));
        return error;
      }

      // Kiểm tra validate function
      if (rules.validate) {
        for (const [validatorName, validatorFn] of Object.entries(
          rules.validate
        )) {
          const validationResult = validatorFn(value, values);
          if (typeof validationResult === "string") {
            error = validationResult;
            setErrors((prev) => ({ ...prev, [name]: error }));
            return error;
          } else if (validationResult === false) {
            error = `${String(name)} không hợp lệ`;
            setErrors((prev) => ({ ...prev, [name]: error }));
            return error;
          }
        }
      }

      // Nếu không có lỗi, xóa lỗi cũ
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });

      return "";
    },
    [values, validationRules]
  );

  /**
   * Validate tất cả các field
   */
  const validateAllFields = useCallback(() => {
    let isValid = true;
    const newErrors: FormErrors<T> = {};

    // Set tất cả các field thành touched
    const allTouched: Partial<Record<keyof T, boolean>> = {};
    Object.keys(values).forEach((key) => {
      allTouched[key as keyof T] = true;
    });
    setTouched(allTouched);

    // Validate từng field
    Object.entries(validationRules).forEach(([name, rules]) => {
      if (!rules) return;

      const error = validateField(name as keyof T, values[name as keyof T]);
      if (error) {
        isValid = false;
        newErrors[name as keyof T] = error;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validationRules, validateField]);

  /**
   * Xử lý submit form
   */
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
      }

      setIsSubmitting(true);

      // Validate tất cả field trước khi submit
      const isValid = validateAllFields();
      if (!isValid) {
        setIsSubmitting(false);
        return;
      }

      try {
        await onSubmit(values, {
          resetForm: () => {
            setValues(initialValues);
            setErrors({});
            setTouched({});
          },
        });
      } catch (error) {
        console.error("Form submission error:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validateAllFields, onSubmit, initialValues]
  );

  /**
   * Reset form về giá trị ban đầu
   */
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setValue,
    setMultipleValues,
    resetForm,
    validateField,
    validateAllFields,
  };
}
