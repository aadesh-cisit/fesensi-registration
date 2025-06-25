"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Personal_Details from "@/components/forms/personal_Details";
import type { FormData, Errors } from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import { personalDetailsSchema } from "@/lib/zodSchemas";



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
      },
    },
  // 
//  {
//     name: "Official Identification Documents (Optional For FREE Plan))",
//     component: Personal_Details ,
//     schema:personalDetailsSchema,
//     initial: {
//       idType: "",
//       idNumber: "",
//       issuingAuthority: "",
//     },
//   },
  // Add other steps here
];

export default function Page() {
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

  function handleNext() {
    const result = steps[step].schema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Errors = {};
      for (const err of result.error.errors) {
        const field = err.path[0];
        fieldErrors[field as string] = err.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setStep((s) => Math.min(steps.length - 1, s + 1));
  }

  function handlePrev() {
    setStep((s) => Math.max(0, s - 1));
  }

  return (
    <Card className=" w-full   max-w-md mx-auto mt-10">
      <CardHeader>
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
        <StepComponent form={form} errors={errors} onChange={handleChange} />

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
