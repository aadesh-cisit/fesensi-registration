"use client";
import React, { useState, Suspense, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Personal_Details from "@/components/forms/personal_Details";
import type {
  Errors,
  PersonalDetailsForm,
  OrganizationDetailsForm,
  PaymentPlanDetailsForm,
  IdentificationDetailsForm,
  PlanDurationsResponse,
  PlanDetails,
  FullRegistrationForm,
} from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import {
  Iddocumentationschema,
  organizationDetailsSchema,
  personalDetailsSchema,
} from "@/lib/zodSchemas";
import Organization_details from "@/components/forms/organization_details";
import { useSearchParams } from "next/navigation";
import IdentificationDetails from "@/components/forms/official_docs";
import PaymentPlanDetails from "@/components/forms/payment-plan-details";
import { paymentPlanDetailsSchema } from "@/lib/zodSchemas";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import RegistrationCompleted from "../components/forms/registration-completed";
import apiCall from "@/api/call";
import { getMaxAge } from "next/dist/server/image-optimizer";

function PageContent(): React.ReactElement {
  const params = useSearchParams();

  const planId = params.get("plan");
  const [step, setStep] = useState(0);
  const [maxagent,setMaxagent]= useState<number>();

  const [errors, setErrors] = useState<Errors>({});
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [bypassVerification, setBypassVerification] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanDetails | null>(null);
  const [plans, setPlans] = useState<PlanDetails[]>([]);
  const [selectedPlanDetails, setSelectedPlanDetails] = useState<PlanDetails | null>(null);
  const [durations, setDurations] = useState<string[]>([]);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [industryTypes, setIndustryTypes] = useState<{ _id: string; name: string }[]>([]);
  const [departments, setDepartments] = useState<{ _id: string; name: string }[]>([]);

  useEffect(() => {
    if (!planId) return;
    const fetchPlanDetails = async () => {
      console.log(planId)
      try {
        const response = await apiCall<{
          data: PlanDetails
        }>({
          url: `plans/get/plans/${planId}`,
          method: "GET",
        });
        setSelectedPlanDetails(response.data);
        setSelectedPlan(response.data);
        setMaxagent(response.data.maxAgent)
        console.log(maxagent)
        // Add a 500ms delay before setting the form's plan and planName fields
        setTimeout(() => {
          setForm((prevForm) => {
            return {
              ...prevForm,
              plan: response.data.name,
              planName: response.data.name,
            };
          });
        }, 500);
      } catch (error) {
        console.error("Failed to fetch plan details:", error);
      }
    };
    fetchPlanDetails();
  }, [planId]);





  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await apiCall<{
          data: PlanDetails[]
        }>({
          url: `/plans/list`,
          method: "GET",
        });
        setPlans(response.data);
      } catch (error) {
        console.error("Failed to fetch plans:", error);
      }
    };
    fetchPlans();
  }, []);




  useEffect(() => {
    const fetchDurations = async () => {
      try {
        const response = await apiCall<{
          data: PlanDurationsResponse
        }>({
          url: "/plans/get/plans/duration",
          method: "GET",
        });
        // Map the response object to an array of values
        const data: PlanDurationsResponse = response.data;
        setDurations(Object.values(data));
      } catch (error) {
        console.error("Failed to fetch durations:", error);
      }
    };
    fetchDurations();
  }, []);

  useEffect(() => {
    const fetchIndustryTypes = async () => {
      try {
        const response = await apiCall<{ data: { _id: string; name: string }[] }>({
          url: "/industryType/getAll",
          method: "GET",
        });
        setIndustryTypes(response.data);
      } catch (error) {
        console.error("Failed to fetch industry types:", error);
      }
    };
    fetchIndustryTypes();
  }, []);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await apiCall<{ data: { _id: string; name: string }[] }>({
          url: "/department/getAll",
          method: "GET",
        });
        setDepartments(response.data);
      } catch (error) {
        console.error("Failed to fetch departments:", error);
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    
    console.log("Updated plans:", plans);
  }, [plans]);

  useEffect(() => {
    if (bypassVerification) {
      handleNext();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bypassVerification]);

  const steps: any[] = [
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

  const [form, setForm] = useState<FullRegistrationForm>(steps[0].initial);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void {
    let value: string | boolean = e.target.value;
    if (e.target.type === "checkbox") {
      value = e.target.checked;
    }
    setForm({ ...form, [e.target.name]: value });
    setErrors({ ...errors, [e.target.name]: "" });
  }

  function handleAddressChange(e: React.ChangeEvent<HTMLInputElement>): void {
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
    setErrors({ ...errors, ["address." + e.target.name]: "" });
  }

  // Handler for ID Type select in IdentificationDetails
  function handleSelectChange(value: string): void {
    setForm({ ...form, idType: value });
    setErrors({ ...errors, idType: "" });
  }

  // Handler for file upload in IdentificationDetails (placeholder)
  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>): void {
    console.log(e);
  }

  // Reusable validation function for current step
  function validateCurrentStep() {
    const schema = steps[step].schema;
    if (!schema) return true;

    let actualSchema = schema;
    // Only call schema as a function for Payment Plan Details step
    if (step === 3 && typeof schema === "function") {
      actualSchema = schema(selectedPlanDetails?.maxAgent);
    }
    // If actualSchema is still a function, skip validation (should not happen)
    if (typeof actualSchema === "function" || typeof actualSchema.safeParse !== "function") {
      return true;
    }

    const result = actualSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Errors = {};
      for (const err of result.error.errors) {
        const field = err.path[0];
        fieldErrors[field as string] = err.message;
      }
      setErrors(fieldErrors);
      return false;
    }
    return true;
  }

  function handleNext() {
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
        setForm((prevForm) => ({
          ...steps[nextStep].initial,
          ...prevForm,
        }));
      }
      // Reset bypassVerification when moving to next step
      setBypassVerification(false);
      return nextStep;
    });
  }

  function handlePrev() {
    setStep((s) => Math.max(0, s - 1));
  }

  // Add this function to map form state to backend format
  function mapFormDataToBackendFormat(form: FullRegistrationForm) {
    const backendData: Record<string, unknown> = {
      organizationName: form.organizationName,
      orgType: form.orgType, // TODO: Add to form if not present
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
        uploadIdProof: form.uploadIdProof, // TODO: Add to form if not present
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

  // Handler for submitting all data at the last step
  async function handleSubmit() {
    if (!validateCurrentStep()) {
      return;
    }
    const backendData = mapFormDataToBackendFormat(form);
    console.log(backendData)
    try {
      await apiCall({
        url: "organization/onboard/organization",
        method: "POST",
        body: backendData,
      });
      setBackendError(null); // Clear error on success
      setStep(steps.length - 1);
    } catch (error: unknown) {
      // Show the full error object for debugging
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
      setBackendError(errorDetails);
      console.error("Registration failed:", error);
    }
  }

  return (
    <Card className=" w-[90%] mt-10">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          <Progress
            value={((step + 1) / steps.length) * 100}
            className="mb-4"
          />
          <div className="flex flex-row gaap-4">
            Organization Onboarding
            {step !== 0 && (
              <div
                className="text-blue-500
          "
              >
                {selectedPlan && typeof selectedPlan === "object" && (selectedPlan as { name?: string }).name
                  ? `(${(selectedPlan as { name: string }).name} plan)`
                  : ""}
              </div>
            )}
          </div>
          <div className="text-gray-500 font-medium text-sm mt-1">
            step {step + 1} of {steps.length} - {steps[step].name}
            <div className="text-black">{steps[step].subheader}</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Display backend error if present */}
        {backendError && (
          (() => {
            let errorObj: { message?: string; errors?: { msg: string }[] } | string = backendError;
            // Try to parse if it's a JSON string
            if (typeof backendError === 'string') {
              try {
                errorObj = JSON.parse(backendError);
              } catch {
                // Not JSON, fallback to string
                errorObj = { message: backendError };
              }
            }
            return (
              <div className="mb-4 p-2 bg-red-100 text-red-700 rounded border border-red-300">
                <div><b>{typeof errorObj === 'string' ? errorObj : errorObj.message || 'Registration failed.'}</b></div>
                {typeof errorObj !== 'string' && Array.isArray(errorObj.errors) && errorObj.errors.length > 0 && (
                  <ul className="mt-2 list-disc list-inside">
                    {errorObj.errors.map((err, idx) => (
                      <li key={idx}>{err.msg}</li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })()
        )}
        {/* Email not verified dialog */}
        <Dialog
          open={showVerifyDialog}
          onOpenChange={(open) => {
            setShowVerifyDialog(open);
            if (!open) setBypassVerification(false); // Reset bypass if dialog closes
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Your email is not verified</DialogTitle>
            </DialogHeader>
            <p>Please verify your email before proceeding to the next step.</p>
            <DialogFooter className="flex flex-col gap-2">
              <Button
                className="w-1/3"
                onClick={() => setShowVerifyDialog(false)}
              >
                Verify
              </Button>
              <Button
                className="w-2/3"
                variant="outline"
                onClick={() => {
                  setShowVerifyDialog(false);
                  setBypassVerification(true);
                }}
              >
                Continue without verification
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {step === 0 && (
          <Personal_Details
            form={form as PersonalDetailsForm}
            errors={errors}
            onChange={handleChange}
            onAddressChange={handleChange}
            plans={plans}
            setSelectedPlan={(plan: PlanDetails) => setSelectedPlan(plan)}
            selectedPlan={selectedPlan}
            departments={departments}
          />
        )}
        {step === 1 && (
          <Organization_details
            form={form as OrganizationDetailsForm}
            errors={errors}
            onChange={handleChange}
            onAddressChange={handleAddressChange}
            industryTypes={industryTypes}
          />
        )}
        {step === 2 && (
          <IdentificationDetails
            form={form as IdentificationDetailsForm}
            errors={errors}
            onChange={handleChange}
            onSelectChange={handleSelectChange}
            onFileUpload={handleFileUpload}
          />
        )}
        {step === 3 && (
          <PaymentPlanDetails
            form={form as PaymentPlanDetailsForm}
            errors={errors}
            onChange={handleChange}
            plan={selectedPlanDetails}
            durations={durations}
          />
        )}
        {step === 4 && <RegistrationCompleted />}
        <div className="flex justify-between mt-6">
          {step < 4 && (
            <>
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={step === 0}
              >
                Back
              </Button>
              <Button
                className=""
                onClick={step === steps.length - 2 ? handleSubmit : handleNext}
              >
                {step === steps.length - 2 ? "Submit" : "Next"}
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent />
    </Suspense>
  );
}
