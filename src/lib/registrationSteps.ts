import { ZodTypeAny } from "zod";
import Personal_Details from "@/components/forms/personal_Details";
import Organization_details from "@/components/forms/organization_details";
import IdentificationDetails from "@/components/forms/official_docs";
import PaymentPlanDetails from "@/components/forms/payment-plan-details";
import RegistrationCompleted from "@/components/forms/registration-completed";
import {
  Iddocumentationschema,
  organizationDetailsSchema,
  personalDetailsSchema,
  paymentPlanDetailsSchema,
} from "@/lib/zodSchemas";
import type {
  PersonalDetailsForm,
  OrganizationDetailsForm,
  PaymentPlanDetailsForm,
  IdentificationDetailsForm,
} from "@/lib/types";

export type StepSchema = ZodTypeAny | ((maxAgent: number | undefined) => ZodTypeAny) | null;

export interface Step<TProps, TInitial> {
  name: string;
  subheader: string;
  component: React.ComponentType<TProps>;
  schema: StepSchema;
  initial: TInitial;
}

export const registrationSteps: [
  Step<React.ComponentProps<typeof Personal_Details>, PersonalDetailsForm>,
  Step<React.ComponentProps<typeof Organization_details>, OrganizationDetailsForm>,
  Step<React.ComponentProps<typeof IdentificationDetails>, IdentificationDetailsForm>,
  Step<React.ComponentProps<typeof PaymentPlanDetails>, PaymentPlanDetailsForm>,
  Step<React.ComponentProps<typeof RegistrationCompleted>, object>
] = [
  {
    name: "Personal Details",
    subheader: "",
    component: Personal_Details,
    schema: personalDetailsSchema,
    initial: {
      plan: "",
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      contactNumber: "",
      department: "",
      designation: "",
      verify: false,
    },
  },

  {
    name: "Organisation details",
    subheader: "",
    component: Organization_details,
    schema: organizationDetailsSchema,
    initial: {
      organizationName: "",
      taxId: "",
      organizationContact: "",
      organizationEmail: "",
      organizationIndustry: "",
      numberOfEmployees: "",
      organizationWebsite: "",
      address: {
        address: "",
        zip: "",
        city: "",
        state: "",
        country: "",
      },
      orgType: "",
      marketingChannel: "",
    },
  },

  {
    name: "Official identification Documentation",
    subheader: "(optional for Free plan)",
    component: IdentificationDetails,
    schema: Iddocumentationschema,
    initial: {
      idType: "",
      idNumber: "",
      issuingAuthority: "",
    },
  },

  {
    name: "Payment Plan Details",
    subheader: "",
    component: PaymentPlanDetails,
    schema: paymentPlanDetailsSchema,
    initial: {
      paymentPlan: "",
      agents: "",
      discountCode: "",
      discountPercent: "",
      discountAmount: "",
      tax: "",
      agreeToTerms: false,
      receiveUpdates: false,
      acceptPolicy: false,
    },
  },

  {
    name: "Registration Completed",
    subheader: "",
    component: RegistrationCompleted,
    schema: null,
    initial: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      contactNumber: "",
      department: "",
      designation: "",
      verify: false,
      organizationName: "",
      taxId: "",
      organizationContact: "",
      organizationEmail: "",
      organizationIndustry: "",
      numberOfEmployees: "",
      organizationWebsite: "",
      address: {
        address: "",
        zip: "",
        city: "",
        state: "",
        country: "",
      },
      idType: "",
      idNumber: "",
      issuingAuthority: "",
      paymentPlan: "",
      agents: "",
      discountCode: "",
      discountPercent: "",
      discountAmount: "",
      tax: "",
    },
  },
]; 