"use client";
import React, { useState, Suspense, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  Errors,
  PersonalDetailsForm,
  OrganizationDetailsForm,
  PaymentPlanDetailsForm,
  IdentificationDetailsForm,
  PlanDetails,
  FullRegistrationForm,
} from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import { useSearchParams } from "next/navigation";
import Personal_Details from "@/components/forms/personal_Details";
import Organization_details from "@/components/forms/organization_details";
import IdentificationDetails from "@/components/forms/official_docs";
import PaymentPlanDetails from "@/components/forms/payment-plan-details";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import RegistrationCompleted from "../components/forms/registration-completed";
import { 
  handleFormChange, 
  handleAddressChange, 
  handleSelectChange,
  handleFileUpload,
  validateStep, 
  fetchPlanDetails,
  fetchPlans,
  fetchDurations,
  fetchIndustryTypes,
  fetchDepartments,
  handleNextStep,
  handlePrevStep,
  parseErrorObject,
  submitRegistration
} from "@/lib/utils";
import { registrationSteps, } from "@/lib/registrationSteps";

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
    const loadPlanDetails = async () => {
      console.log(planId);
      const planDetails = await fetchPlanDetails(planId);
      if (planDetails) {
        setSelectedPlanDetails(planDetails);
        setSelectedPlan(planDetails);
        setMaxagent(planDetails.maxAgent);
        console.log(maxagent);
        // Add a 500ms delay before setting the form's plan and planName fields
        setTimeout(() => {
          setForm((prevForm) => {
            return {
              ...prevForm,
              plan: planDetails.name,
              planName: planDetails.name,
            };
          });
        }, 500);
      }
    };
    loadPlanDetails();
  }, [planId]);





  useEffect(() => {
    const loadPlans = async () => {
      const plansData = await fetchPlans();
      setPlans(plansData);
    };
    loadPlans();
  }, []);




  useEffect(() => {
    const loadDurations = async () => {
      const durationsData = await fetchDurations();
      setDurations(durationsData);
    };
    loadDurations();
  }, []);



  useEffect(() => {
    const loadIndustryTypes = async () => {
      const industryTypesData = await fetchIndustryTypes();
      setIndustryTypes(industryTypesData);
    };
    loadIndustryTypes();
  }, []);



  useEffect(() => {
    const loadDepartments = async () => {
      const departmentsData = await fetchDepartments();
      setDepartments(departmentsData);
    };
    loadDepartments();
  }, []);



  useEffect(() => {
    if (bypassVerification) {
      handleNext();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bypassVerification]);

  const steps = registrationSteps;

  const [form, setForm] = useState<FullRegistrationForm>(steps[0].initial);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void {
    handleFormChange(form, setForm, setErrors, e);
  }

  function handleAddressChangeLocal(e: React.ChangeEvent<HTMLInputElement>): void {
    handleAddressChange(form, setForm, setErrors, e);
  }

  // Handler for ID Type select in IdentificationDetails
  function handleSelectChangeLocal(value: string): void {
    handleSelectChange(form, setForm, setErrors, value);
  }

  // Handler for file upload in IdentificationDetails (placeholder)
  function handleFileUploadLocal(e: React.ChangeEvent<HTMLInputElement>): void {
    handleFileUpload(e);
  }

  // Reusable validation function for current step
  function validateCurrentStep() {
    const schema = steps[step].schema;
    const maxAgent = step === 3 ? selectedPlanDetails?.maxAgent : undefined;
    const { isValid, errors: validationErrors } = validateStep(form, schema, maxAgent);
    
    if (!isValid) {
      setErrors(validationErrors);
    }
    
    return isValid;
  }

  function handleNext() {
    handleNextStep(
      step,
      steps,
      form,
      selectedPlanDetails,
      bypassVerification,
      setStep,
      setForm,
      setShowVerifyDialog,
      setBypassVerification,
      setBackendError,
      validateCurrentStep
    );
  }

  function handlePrev() {
    handlePrevStep(step, setStep);
  }



  // Handler for submitting all data at the last step
  async function handleSubmit() {
    await submitRegistration(
      form,
      planId,
      validateCurrentStep,
      setBackendError,
      setStep,
      steps
    );
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
            const errorObj = parseErrorObject(backendError);
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
            onAddressChange={handleAddressChangeLocal}
            industryTypes={industryTypes}
          />
        )}
        {step === 2 && (
          <IdentificationDetails
            form={form as IdentificationDetailsForm}
            errors={errors}
            onChange={handleChange}
            onSelectChange={handleSelectChangeLocal}
            onFileUpload={handleFileUploadLocal}
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
