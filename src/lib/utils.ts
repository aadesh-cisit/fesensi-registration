import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ZodTypeAny } from "zod"
import type { FullRegistrationForm, Errors, PlanDetails, PersonalDetailsForm } from "./types"
import apiCall from "@/api/call"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function savetimer() {
  const time = Date.now();
  sessionStorage.setItem('otp_request', time.toString());
}

// Generic form change handler
export function handleFormChange<T extends Record<string, any>>(
  form: T,
  setForm: React.Dispatch<React.SetStateAction<T>>,
  setErrors: React.Dispatch<React.SetStateAction<Errors>>,
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
): void {
  let value: string | boolean = e.target.value;
  if (e.target.type === "checkbox") {
    value = e.target.checked;
  }
  setForm({ ...form, [e.target.name]: value });
  setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
}

// Generic address change handler
export function handleAddressChange<T extends Record<string, any>>(
  form: T,
  setForm: React.Dispatch<React.SetStateAction<T>>,
  setErrors: React.Dispatch<React.SetStateAction<Errors>>,
  e: React.ChangeEvent<HTMLInputElement>
): void {
  const prevAddress =
    "address" in form
      ? form.address
      : {
          address: "",
          zip: "",
          city: "",
          state: "",
          country: "",
        };
  setForm({
    ...form,
    address: {
      ...prevAddress,
      [e.target.name]: e.target.value,
    },
  });
  setErrors((prev) => ({ ...prev, ["address." + e.target.name]: "" }));
}

// Generic select change handler
export function handleSelectChange<T extends Record<string, any>>(
  form: T,
  setForm: React.Dispatch<React.SetStateAction<T>>,
  setErrors: React.Dispatch<React.SetStateAction<Errors>>,
  value: string,
  fieldName: string = "idType"
): void {
  setForm({ ...form, [fieldName]: value });
  setErrors((prev) => ({ ...prev, [fieldName]: "" }));
}

// Generic file upload handler
export function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>): void {
  console.log(e);
}

// Generic validation function
export function validateStep<T>(
  form: T,
  schema: ZodTypeAny | ((maxAgent?: number) => ZodTypeAny) | null,
  maxAgent?: number
): { isValid: boolean; errors: Errors } {
  if (!schema) return { isValid: true, errors: {} };

  let actualSchema = schema;
  if (typeof schema === "function") {
    actualSchema = schema(maxAgent);
  }

  if (typeof actualSchema === "function" || typeof actualSchema.safeParse !== "function") {
    return { isValid: true, errors: {} };
  }

  const result = actualSchema.safeParse(form);
  if (!result.success) {
    const fieldErrors: Errors = {};
    for (const err of result.error.errors) {
      const field = err.path[0];
      fieldErrors[field as string] = err.message;
    }
    return { isValid: false, errors: fieldErrors };
  }
  return { isValid: true, errors: {} };
}

// Map form data to backend format
export function mapFormDataToBackendFormat(
  form: FullRegistrationForm,
  planId: string | null
): Record<string, unknown> {
  const backendData: Record<string, unknown> = {
    organizationName: form.organizationName,
    orgType: form.orgType,
    orgAddress: form.address?.address,
    city: form.address?.city,
    state: form.address?.state,
    country: form.address?.country,
    zipCode: form.address?.zip,
    taxId: form.taxId,
    marketingChannel: form.marketingChannel,
    idProof: {
      idType: form.idType,
      idNumber: form.idNumber,
      issuingAuthority: form.issuingAuthority,
      uploadIdProof: form.uploadIdProof,
    },
    planCommitment: {
      planId: planId,
      planName: form.plan,
      planDuration: form.paymentPlan,
      noOfAgent: form.agents,
    },
    orgWebsite: form.organizationWebsite,
    fullName: form.fullName,
    email: form.email,
    contact: form.contactNumber,
    password: form.password,
    confirmPassword: form.confirmPassword,
    department: form.department,
    designation: form.designation,
  };

  if (form.organizationEmail) {
    backendData["orgEmail"] = form.organizationEmail;
  }
  if (form.organizationContact) {
    backendData["orgContact"] = Number(form.organizationContact);
  }
  
  return backendData;
}

// API call functions
export async function fetchPlanDetails(planId: string): Promise<PlanDetails | null> {
  try {
    const response = await apiCall<{ data: PlanDetails }>({
      url: `plans/get/plans/${planId}`,
      method: "GET",
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch plan details:", error);
    return null;
  }
}

export async function fetchPlans(): Promise<PlanDetails[]> {
  try {
    const response = await apiCall<{ data: PlanDetails[] }>({
      url: `/plans/list`,
      method: "GET",
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch plans:", error);
    return [];
  }
}

export async function fetchDurations(): Promise<string[]> {
  try {
    const response = await apiCall<{ data: Record<string, string> }>({
      url: "/plans/get/plans/duration",
      method: "GET",
    });
    return Object.values(response.data);
  } catch (error) {
    console.error("Failed to fetch durations:", error);
    return [];
  }
}

export async function fetchIndustryTypes(): Promise<{ _id: string; name: string }[]> {
  try {
    const response = await apiCall<{ data: { _id: string; name: string }[] }>({
      url: "/industryType/getAll",
      method: "GET",
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch industry types:", error);
    return [];
  }
}

export async function fetchDepartments(): Promise<{ _id: string; name: string }[]> {
  try {
    const response = await apiCall<{ data: { _id: string; name: string }[] }>({
      url: "/department/getAll",
      method: "GET",
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch departments:", error);
    return [];
  }
}

// Step navigation functions
export function handleNextStep(
  step: number,
  steps: any[],
  form: any,
  selectedPlanDetails: any,
  bypassVerification: boolean,
  setStep: React.Dispatch<React.SetStateAction<number>>,
  setForm: React.Dispatch<React.SetStateAction<any>>,
  setShowVerifyDialog: React.Dispatch<React.SetStateAction<boolean>>,
  setBypassVerification: React.Dispatch<React.SetStateAction<boolean>>,
  setBackendError: React.Dispatch<React.SetStateAction<string | null>>,
  validateCurrentStep: () => boolean
): void {
  // If on the first step and email is not verified and not bypassing, show dialog
  if (
    step === 0 &&
    !(form as PersonalDetailsForm).verify &&
    !bypassVerification
  ) {
    setShowVerifyDialog(true);
    return;
  }
  
  if (!validateCurrentStep()) {
    return;
  }
  
  setBackendError(null); // Clear backend error when moving steps
  setStep((s) => {
    const nextStep = Math.min(steps.length - 1, s + 1);
    // Only update form if not on the last step
    if (nextStep < steps.length - 1) {
      setForm((prevForm: any) => ({
        ...steps[nextStep].initial,
        ...prevForm,
      }));
    }
    // Reset bypassVerification when moving to next step
    setBypassVerification(false);
    return nextStep;
  });
}

export function handlePrevStep(
  step: number,
  setStep: React.Dispatch<React.SetStateAction<number>>
): void {
  setStep((s) => Math.max(0, s - 1));
}

// Error handling functions
export function formatErrorDetails(error: unknown): string {
  let errorDetails = "Registration failed.";
  if (error) {
    if (typeof error === "object") {
      try {
        errorDetails = JSON.stringify(error, null, 2);
      } catch {
        errorDetails = String(error);
      }
    } else {
      errorDetails = String(error);
    }
  }
  return errorDetails;
}

export function parseErrorObject(errorString: string): { message?: string; errors?: { msg: string }[] } | string {
  let errorObj: { message?: string; errors?: { msg: string }[] } | string = errorString;
  // Try to parse if it's a JSON string
  if (typeof errorString === 'string') {
    try {
      errorObj = JSON.parse(errorString);
    } catch {
      // Not JSON, fallback to string
      errorObj = { message: errorString };
    }
  }
  return errorObj;
}

// Form submission function
export async function submitRegistration(
  form: FullRegistrationForm,
  planId: string | null,
  validateCurrentStep: () => boolean,
  setBackendError: React.Dispatch<React.SetStateAction<string | null>>,
  setStep: React.Dispatch<React.SetStateAction<number>>,
  steps: any[]
): Promise<boolean> {
  if (!validateCurrentStep()) {
    return false;
  }
  
  const backendData = mapFormDataToBackendFormat(form, planId);
  console.log(backendData);
  
  try {
    await apiCall({
      url: "organization/onboard/organization",
      method: "POST",
      body: backendData,
    });
    setBackendError(null); // Clear error on success
    setStep(steps.length - 1);
    return true;
  } catch (error: unknown) {
    const errorDetails = formatErrorDetails(error);
    setBackendError(errorDetails);
    console.error("Registration failed:", error);
    return false;
  }
}