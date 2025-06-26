export interface PersonalDetailsForm {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  contactNumber: string;
  department: string;
  designation: string;
  verify: boolean;
}

export interface OrganizationDetailsForm {
  organizationName: string;
  taxId: string;
  organizationContact?: string;
  organizationEmail?: string;
  organizationIndustry: string;
  numberOfEmployees: string;
  organizationWebsite: string;
  address: {
    address: string;
    zip: string;
    city: string;
    state: string;
    country: string;
  };
}

export type FormData = PersonalDetailsForm | OrganizationDetailsForm;

export interface Errors {
  [key: string]: string;
}

export interface StepComponentProps {
  form: FormData;
  errors: Errors;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}
