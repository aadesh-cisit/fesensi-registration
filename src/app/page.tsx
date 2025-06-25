"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Personal_Details from "@/components/forms/personal_Details";
import type {
  FormData,
  Errors,
  PersonalDetailsForm,
  OrganizationDetailsForm,
  PaymentPlanDetailsForm,
} from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import {
  Iddocumentationschema,
  organizationDetailsSchema,
  personalDetailsSchema,
} from "@/lib/zodSchemas";
import Organization_details from "@/components/forms/organization_details";
import { useParams, useSearchParams } from "next/navigation";
import IdentificationDetails from "@/components/forms/official_docs";
import PaymentPlanDetails from "@/components/forms/payment-plan-details";
import { paymentPlanDetailsSchema } from "@/lib/zodSchemas";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import RegistrationCompleted from "../components/forms/registration-completed";

const steps = [
  {
    name: "Personal Details",
    subheader: "",
    component: Personal_Details,
    schema: personalDetailsSchema,
    initial: {
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

export default function Page() {
  const params = useSearchParams();

  const plan = params.get("plan");
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(steps[0].initial);
  const [errors, setErrors] = useState<Errors>({});
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void {
    setForm({ ...form, [e.target.name]: e.target.value });
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
    // You can implement file upload logic here if needed
    // For now, do nothing
  }

  // Reusable validation function for current step
  function validateCurrentStep() {
    const schema = steps[step].schema;
    if (!schema) return true;
    const result = schema.safeParse(form);
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
    // If on the first step and email is not verified, show dialog
    if (step === 0 && !(form as PersonalDetailsForm).verify) {
      setShowVerifyDialog(true);
      return;
    }
    if (!validateCurrentStep()) {
      return;
    }
    setStep((s) => {
      const nextStep = Math.min(steps.length - 1, s + 1);
      // Only update form if not on the last step
      if (nextStep < steps.length - 1) {
        setForm((prevForm) => ({
          ...steps[nextStep].initial,
          ...prevForm,
        }));
      }
      return nextStep;
    });
  }

  function handlePrev() {
    setStep((s) => Math.max(0, s - 1));
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
              ({plan} plan) 
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
        {/* Email not verified dialog */}
        <Dialog open={showVerifyDialog} onOpenChange={setShowVerifyDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Your email is not verified</DialogTitle>
            </DialogHeader>
            <p>Do you wish to continue without verifying your email.</p>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  className="w-1/3"
                  onClick={() => setShowVerifyDialog(false)}
                >
                  verify
                </Button>
              </DialogClose>
              <Button
                className="
              w-2/3"
                variant="outline"
                onClick={() => {
                  // Validate before skipping
                  if (!validateCurrentStep()) {
                    setShowVerifyDialog(false); // Optionally close dialog on error
                    return;
                  }
                  setShowVerifyDialog(false);
                  // Skip verification and proceed to next step
                  setStep((s) => {
                    const nextStep = Math.min(steps.length - 1, s + 1);
                    setForm((prevForm) => ({
                      ...steps[nextStep].initial,
                      ...prevForm,
                    }));
                    return nextStep;
                  });
                }}
              >
                conitune without verifying
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
          />
        )}
        {step === 1 && (
          <Organization_details
            form={form as OrganizationDetailsForm}
            errors={errors}
            onChange={handleChange}
            onAddressChange={handleAddressChange}
          />
        )}
        {step === 2 && (
          <IdentificationDetails
            form={form as any}
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
          />
        )}
        {step === 4 && <RegistrationCompleted />}
        <div className="flex justify-between mt-6">
          {step < 4 && (
            <>
              <Button variant="outline" onClick={handlePrev} disabled={step === 0}>
                Back
              </Button>
              <Button className="" onClick={handleNext}>
                Next
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
