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
  orgType: string;
  marketingChannel: string;
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


export interface SendOtpRequest {
  email: string;
  userName: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
} 

export interface SendOtpResponse {
  success: boolean;
  message: string;
}


export interface PlanDetails {
  id: string;
  name: string;
  rate?: number;
  duration?: string[];
  maxAgent:number
  status?: boolean;
  createdBy?: { _id: string; first_name: string; email: string };
  createdAt?: string;
  updatedAt?: string;
}

export type PlanDurationsResponse = {
  [key: string]: string;
};

export interface FullRegistrationForm {
  // PersonalDetailsForm
  plan?: string;
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  contactNumber?: string;
  department?: string;
  designation?: string;
  verify?: boolean;

  // OrganizationDetailsForm
  organizationName?: string;
  taxId?: string;
  organizationContact?: string;
  organizationEmail?: string;
  organizationIndustry?: string;
  numberOfEmployees?: string;
  organizationWebsite?: string;
  address?: {
    address?: string;
    zip?: string;
    city?: string;
    state?: string;
    country?: string;
  };
  orgType?: string;
  marketingChannel?: string;

  // IdentificationDetailsForm
  idType?: string;
  idNumber?: string;
  issuingAuthority?: string;
  uploadIdProof?: string;

  // PaymentPlanDetailsForm
  paymentPlan?: string;
  agents?: string;
  discountCode?: string;
  discountPercent?: string;
  discountAmount?: string;
  tax?: string;
  agreeToTerms?: boolean;
  receiveUpdates?: boolean;
  acceptPolicy?: boolean;

  // Additional fields for backend mapping
  planName?: string;
}