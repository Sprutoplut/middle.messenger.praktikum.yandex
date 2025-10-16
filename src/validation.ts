export interface ValidationResult {
    error?: boolean;
    errorText?: string;
}

export const validateField = (fieldName: string, value: string, formState?:
    Record<string, string>): ValidationResult => {
  const loginRegex = /^[a-zA-Z0-9_-]+$/;
  const digitsOnly = /^\d+$/;
  const hasUpperCase = /[A-Z]/;
  const hasDigit = /\d/;
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const parts = value.split('@');
  const domainPart = parts[1];
  const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const domainParts = domainPart.split('.');
  const lastPart = domainParts[domainParts.length - 1];
  const phoneRegex = /^\+?\d{10,15}$/;
  switch (fieldName) {
    case 'login':
      // Проверяем длину
      if (value.length < 3 || value.length > 20) {
        return {
          error: true,
          errorText: 'Логин должен содержать от 3 до 20 символов',
        };
      }

      // Проверяем на допустимые символы

      if (!loginRegex.test(value)) {
        return {
          error: true,
          errorText: 'Логин содержит недопустимые символы',
        };
      }

      // Проверяем, что логин не состоит только из цифр

      if (digitsOnly.test(value)) {
        return {
          error: true,
          errorText: 'Логин не может состоять только из цифр',
        };
      }
      break;
    case 'password':
      // Проверяем длину
      if (value.length < 8 || value.length > 40) {
        return {
          error: true,
          errorText: 'Пароль должен содержать от 8 до 40 символов',
        };
      }

      // Проверяем наличие заглавной буквы

      if (!hasUpperCase.test(value)) {
        return {
          error: true,
          errorText: 'Пароль должен содержать хотя бы одну заглавную букву',
        };
      }

      // Проверяем наличие цифры

      if (!hasDigit.test(value)) {
        return {
          error: true,
          errorText: 'Пароль должен содержать хотя бы одну цифру',
        };
      }
      if (formState && formState.password_repeat && value !== formState.password_repeat) {
        return {
          error: true,
          errorText: 'Пароли не совпадают',
        };
      }
      break;
    case 'first_name':
      // Новая валидация для имени и фамилии
      if (!/^[А-Яа-яA-Za-z]+(-[А-Яа-яA-Za-z]+)*$/.test(value)) {
        return {
          error: true,
          errorText: 'Имя должно содержать только буквы и дефис',
        };
      }

      if (!/^[А-ЯA-Z]/.test(value)) {
        return {
          error: true,
          errorText: 'Первая буква имени должна быть заглавной',
        };
      }

      if (/\s/.test(value)) {
        return {
          error: true,
          errorText: 'Имя не должны содержать пробелы',
        };
      }

      if (/\d/.test(value)) {
        return {
          error: true,
          errorText: 'Имя не должно содержать цифры',
        };
      }
      break;
    case 'second_name':
      // Новая валидация для имени и фамилии
      if (!/^[А-Яа-яA-Za-z]+(-[А-Яа-яA-Za-z]+)*$/.test(value)) {
        return {
          error: true,
          errorText: 'Фамилия должна содержать только буквы и дефис',
        };
      }

      if (!/^[А-ЯA-Z]/.test(value)) {
        return {
          error: true,
          errorText: 'Первая буква фамилии должна быть заглавной',
        };
      }

      if (/\s/.test(value)) {
        return {
          error: true,
          errorText: 'Фамилия не должна содержать пробелы',
        };
      }

      if (/\d/.test(value)) {
        return {
          error: true,
          errorText: 'Фамилия не должна содержать цифры',
        };
      }
      break;
    case 'email':
      // Проверяем общую структуру email

      if (!emailRegex.test(value)) {
        return {
          error: true,
          errorText: 'Некорректный формат email',
        };
      }

      // Проверяем наличие @ и корректной доменной части

      if (parts.length !== 2) {
        return {
          error: true,
          errorText: 'Email должен содержать символ @',
        };
      }

      if (!domainRegex.test(domainPart)) {
        return {
          error: true,
          errorText: 'Некорректная доменная часть email',
        };
      }

      // Проверяем наличие букв перед точкой в домене

      if (!/^[a-zA-Z]{2,}$/.test(lastPart)) {
        return {
          error: true,
          errorText: 'После точки в домене должны быть буквы',
        };
      }
      break;
    case 'password_repeat':
      // Проверяем совпадение с основным паролем
      if (formState && formState.password && value !== formState.password) {
        return {
          error: true,
          errorText: 'Пароли не совпадают',
        };
      }
      break;
    case 'phone':

      if (!phoneRegex.test(value)) {
        return {
          error: true,
          errorText: 'Введите корректный номер телефона',
        };
      }
      break;
    default:
      return { error: false, errorText: '' };
  }

  return { error: false, errorText: '' };
};
// Новая функция для обработки ввода
export const handleInputValidation = (
  e: Event | null,
  setProps: (props: any) => void,
  labelError: any,
  updateFormState: (fieldName: string, value: string) => void,
  formState: Record<string, string>,
) => {
  let error: boolean | undefined;
  let errorText: string | undefined = '';

  if (e) {
    // Валидация конкретного поля при наличии события
    const target = e.target as HTMLInputElement;
    const fieldName = target.name;
    const { value } = target;
    ({ error, errorText } = validateField(fieldName, value, formState));
  } else {
    // Полная валидация всех полей
    error = Object.keys(formState).some((fieldName) => {
      const value = formState[fieldName];
      const { error: fieldError } = validateField(fieldName, value, formState);
      return fieldError;
    });
    errorText = 'Пожалуйста, исправьте ошибки в форме';
  }

  setProps({ isError: error });
  labelError.setProps({ text: errorText });

  if (e) {
    updateFormState((e.target as HTMLInputElement).name, (e.target as HTMLInputElement).value);
  }

  setProps({ inputErrors: error });
};
