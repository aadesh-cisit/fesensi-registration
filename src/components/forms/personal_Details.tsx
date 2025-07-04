"use client";

import React, { useRef  } from "react";
import FormField, { FormFieldRef } from "../ui/form_field";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { SendOtpRequest, VerifyOtpRequest, PlanDetails } from "@/lib/types";
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
    verify: boolean;
  };
  errors: { [key: string]: string };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddressChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  plans: PlanDetails[];
  setSelectedPlan: (plan: PlanDetails) => void;
  selectedPlan: PlanDetails | null;
  departments: { _id: string; name: string }[];
}

const Personal_Details: React.FC<PersonalDetailsProps> = ({
  form,
  errors,
  onChange,
  plans,
  setSelectedPlan,
  departments,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Handler for department change
  const handlePLanchange = (value: string) => {
    const event = {
      target: { name: "plan", value },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(event);
    const selectedPlanObj = plans.find((plan) => plan.name === value);
    if (selectedPlanObj) {
      setSelectedPlan(selectedPlanObj);
      if (selectedPlanObj.id) {
        const params = new URLSearchParams(Array.from(searchParams.entries()));
        params.set("plan", selectedPlanObj.id);
        router.replace(`?${params.toString()}`);
      }
    }
  };

  // Ref to access FormField methods
  const emailFieldRef = useRef<FormFieldRef>(null);

  // Function to send OTP (no argument, uses form.email)
  const sendOtp = async (): Promise<void> => {
    console.log("Sending OTP to:", form.email);
    const body: SendOtpRequest = { email: form.email, userName: form.fullName };
    await apiCall({
      url: "organization/send/email/otp",
      method: "POST",
      body,
    });
  };

  // Function to verify OTP
  const verifyOtp = async (otp: string): Promise<void> => {
    console.log({ email: form.email, otp });
    const body: VerifyOtpRequest = { email: form.email, otp };
    await apiCall({
      url: "organization/verify/email/otp",
      method: "POST",
      body,
    });
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
                <SelectItem key={plan.id} value={plan.name}>
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
        placeholder="Select your Department"
        value={form.department}
        onChange={onChange}
        error={errors.department}
        inputComponent={
          <select
            name="department"
            value={form.department}
            onChange={(e) => {
              const syntheticEvent = {
                target: {
                  name: "department",
                  value: e.target.value,
                },
              } as React.ChangeEvent<HTMLInputElement>;
              onChange(syntheticEvent);
            }}
            className="w-full p-2 border rounded bg-indigo-50 focus-visible:border-[#] "
          >
            <option value="">Select your Department</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>{dept.name}</option>
            ))}
          </select>
        }
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
