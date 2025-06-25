import { z } from "zod";

const personalDetailsSchema = z.object({

        
    fullName: z.string()
        .min(1, "Full name is required"),

    email: z.string()
        .min(1, "Email is required")
        .email("Invalid email address"),

    password: z.string()
        .min(6, "Password must be at least 6 characters"),

    confirmPassword: z.string()
        .min(1, "Please confirm your password"),
    
    contactNumber: z.string()
        .min(10, "Contact number must be at least 10 digits")
        .regex(/^\d+$/, "Contact number must be digits only"),
    
    department: z.string()
        .optional(),
    
    designation: z.string()
        .optional(),


}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

const organizationDetailsSchema = z.object({
  organizationName: z.string().min(1, "Organization name is required"),
  taxId: z.string().min(1, "Tax ID is required"),
  organizationContact: z.string().optional(),
  organizationEmail: z.string().email("Invalid email address").optional(),
  organizationIndustry: z.string().min(1, "Industry is required"),
  numberOfEmployees: z.string().min(1, "Number of employees is required").regex(/^\d+$/, "Must be a number"),
  organizationWebsite: z.string().url("Invalid website URL"),
  address: z.object({
    address: z.string().min(1, "Address is required"),
    zip: z.string().min(1, "Zip is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    country: z.string().min(1, "Country is required"),
  }),
});

const Iddocumentationschema = z.object({
  idType: z.string().min(1, "ID Type is required"),
  idNumber: z.string().min(1, "ID Number is required"),
  issuingAuthority: z.string().min(1, "Issuing Authority is required"),
});

const paymentPlanDetailsSchema = z.object({
  paymentPlan: z.string().min(1, "Payment plan is required"),
  agents: z.string().min(1, "Number of agents is required").regex(/^\d+$/, "Must be a number"),
  discountCode: z.string().optional(),
  discountPercent: z.string().optional(),
  discountAmount: z.string().optional(),
  tax: z.string().optional(),
  agreeToTerms: z.literal(true, { message: "You must agree to the terms" }),
  receiveUpdates: z.boolean().optional(),
  acceptPolicy: z.literal(true, { message: "You must accept the policy" }),
});

export { personalDetailsSchema, organizationDetailsSchema, Iddocumentationschema, paymentPlanDetailsSchema };