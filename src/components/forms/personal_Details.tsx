"use client";

import React, { useRef } from "react";
import FormField, { FormFieldRef } from "../ui/form_field";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { SendOtpRequest, VerifyOtpRequest } from "@/lib/types";
import apiCall from "@/api/call";
import { useRouter, useSearchParams } from "next/navigation";

interface PersonalDetailsProps {
  form: {
    plan: string;
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    contactNumber: string;
    department: string;
    designation: string;
    verify: boolean; // <-- Added verify attribute
  };
  errors: { [key: string]: string };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddressChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  plans: any[]; // <-- Add this prop
  setSelectedPlan: (plan: any) => void;
  selectedPlan: any;
}

const Personal_Details: React.FC<PersonalDetailsProps> = ({
  form,
  errors,
  onChange,
  plans,
  setSelectedPlan,
  selectedPlan,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Handler for department change
  const handlePLanchange = (value: string) => {
    const event = {
      target: { name: "plan", value },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(event);
    // Find the selected plan object to get its id
    const selectedPlanObj = plans.find((plan) => plan.name === value);
    if (selectedPlanObj) {
      setSelectedPlan(selectedPlanObj);
      if (selectedPlanObj.id) {
        const params = new URLSearchParams(Array.from(searchParams.entries()));
        params.set("planId", selectedPlanObj.id);
        router.replace(`?${params.toString()}`);
      }
    }
  };

  // Ref to access FormField methods
  const emailFieldRef = useRef<FormFieldRef>(null);

  // Function to send OTP (no argument, uses form.email)
  const sendOtp = async () => {
    console.log("Sending OTP to:", form.email);
    const body: SendOtpRequest = { email: form.email, userName: form.fullName };
    return apiCall({
      url: "organization/send/email/otp",
      method: "POST",
      body,
    });
  };

  // Function to verify OTP
  const verifyOtp = async (otp: string) => {
    console.log({ email: form.email, otp });
    const body: VerifyOtpRequest = { email: form.email, otp };
    return apiCall({
      url: "organization/verify/email/otp",
      method: "POST",
      body,
    });
  };

  // Handler for Continue button
  const handleContinue = () => {
    if (emailFieldRef.current && !emailFieldRef.current.isVerified) {
      if (emailFieldRef.current.showEmailNotVerifiedDialog) {
        emailFieldRef.current.showEmailNotVerifiedDialog();
      }
      return;
    }
    // Proceed with next step or submission
    // ...
  };

  // Handler to sync verification status to parent form state
  const handleVerifiedChange = (verified: boolean) => {
    onChange({
      target: { name: "verify", value: verified },
    } as unknown as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <FormField
        label="Payment Plan"
        name="plan"
        optional={false}
        placeholder="Select a plan"
        value={form.plan}
        onChange={onChange}
        error={errors.plan}
        inputComponent={
          <Select value={form.plan} onValueChange={handlePLanchange}>
            <SelectTrigger
              id="Plans"
              className="w-full mb-4 bg-indigo-50 active:border-[1px] active:border-[#2141BB] focus-visible:border-[#2141BB] focus-visible:border-[1px] focus-visible:ring-[#2141BB]  focus-visible:ring-[1px]"
            >
              <SelectValue placeholder="Select a plan" className="" />
            </SelectTrigger>
            <SelectContent>
              {plans.map((plan) => (
                <SelectItem key={plan._id || plan.id} value={plan.name}>
                  {plan.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />
      <FormField
        label="Full Name"
        name="fullName"
        placeholder="Enter your full name"
        value={form.fullName}
        onChange={onChange}
        error={errors.fullName}
      />
      <FormField
        ref={emailFieldRef}
        label="Email"
        name="email"
        type="email"
        placeholder="Enter your email"
        value={form.email}
        onChange={onChange}
        error={errors.email}
        verify={true}
        sendotp={sendOtp}
        onVerifyOtp={verifyOtp}
        fullForm={{ fullName: form.fullName, email: form.email }}
        onVerifiedChange={handleVerifiedChange}
      />
      <FormField
        label="Create Password"
        name="password"
        type="password"
        placeholder="Create a password"
        value={form.password}
        onChange={onChange}
        error={errors.password}
      />
      <FormField
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        placeholder="Confirm your password"
        value={form.confirmPassword}
        onChange={onChange}
        error={errors.confirmPassword}
      />
      <FormField
        label="Contact Number"
        name="contactNumber"
        placeholder="Enter your contact number"
        value={form.contactNumber}
        onChange={onChange}
        error={errors.contactNumber}
      />
      <FormField
        label="Department"
        name="department"
        optional={true}
        placeholder="Enter your Department"
        value={form.department}
        onChange={onChange}
        error={errors.department}
      />
      <FormField
        label="Designation"
        name="designation"
        optional={true}
        placeholder="Enter your designation"
        value={form.designation}
        onChange={onChange}
        error={errors.designation}
      />
    </form>
  );
};

export default Personal_Details;
