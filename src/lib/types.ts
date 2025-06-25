export interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  contactNumber: string;
  department: string;
  designation: string;
  verify:boolean;
}

export interface Errors {
  [key: string]: string;
}

export interface StepComponentProps {
  form: FormData;
  errors: Errors;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}
