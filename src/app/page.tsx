"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Personal_Details from "@/components/forms/personal_Details";
import type { FormData, Errors } from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import { organizationDetailsSchema, personalDetailsSchema } from "@/lib/zodSchemas";
import Organization_details from "@/components/forms/organization_details";
import { useParams } from "next/navigation";
const steps = [
  {
    name: "Personal Details",
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
    component: Organization_details,
    schema:organizationDetailsSchema,
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
];

export default function Page() {
  const params =useParams()

  console.log(params.plan)
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(steps[0].initial);
  const [errors, setErrors] = useState<Errors>({});

  const StepComponent = steps[step].component;

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  }

  function handleAddressChange(
    e: React.ChangeEvent<HTMLInputElement>
  ): void {
    const prevAddress = 'address' in form ? form.address : {
      address: '',
      zip: '',
      city: '',
      state: '',
      country: ''
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

  function handleNext() {
    const result = steps[step].schema.safeParse(form);
    if (!result.success) {
      console.log("Validation errors:", result.error.errors);
      const fieldErrors: Errors = {};
      for (const err of result.error.errors) {
        const field = err.path[0];
        fieldErrors[field as string] = err.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setStep((s) => {
      const nextStep = Math.min(steps.length - 1, s + 1);
      console.log("Advancing to step:", nextStep);
      setForm((prevForm) => ({
        ...steps[nextStep].initial,
        ...prevForm,
      }));
      return nextStep;
    });
  }

  function handlePrev() {
    setStep((s) => Math.max(0, s - 1));
  }

  return (
    <Card className=" w-[90%] mt-10">
      <CardHeader>

        {params.plan}
        <CardTitle className="text-2xl font-bold">
          <Progress value={
            ((step + 1) / steps.length) * 100
          } className="mb-4" />

          Organization Onboarding
          <div className="text-gray-500 font-medium text-sm mt-1">
            step {step + 1} of {steps.length} - {steps[step].name}
          </div>
        </CardTitle>

      </CardHeader>
      <CardContent>
        {step === 1 ? (
          <StepComponent
            form={form as any /* as OrganizationDetailsForm */}
            errors={errors}
            onChange={handleChange}
            onAddressChange={handleAddressChange}
          />
        ) : (
          <StepComponent
              form={form as any /* as PersonalDetailsForm */}
              errors={errors}
              onChange={handleChange}
              onAddressChange={handleChange}
            />
        )}

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handlePrev}
            disabled={step === 0}>
            Previous
          </Button>
          <Button className="" onClick={handleNext}>Next</Button>

        </div>

      </CardContent>
    </Card>
  );
}
