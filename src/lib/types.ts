export interface PersonalDetailsForm {
  plan:string;
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

export interface IdentificationDetailsForm {
  idType: string;
  idNumber: string;
  issuingAuthority: string;
}

export interface PaymentPlanDetailsForm {
  paymentPlan: string;
  agents: string;
  discountCode: string;
  discountPercent: string;
  discountAmount: string;
  tax: string;
  agreeToTerms: boolean;
  receiveUpdates: boolean;
  acceptPolicy: boolean;
}

export type FormData = PersonalDetailsForm | OrganizationDetailsForm | IdentificationDetailsForm | PaymentPlanDetailsForm;

export interface Errors {
  [key: string]: string;
}

export interface StepComponentProps {
  form: FormData;
  errors: Errors;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}
