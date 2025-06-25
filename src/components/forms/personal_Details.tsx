"use client";

import React from "react";
import FormField from "../ui/form_field";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";

interface PersonalDetailsProps {
  form: {
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
}

const Personal_Details: React.FC<PersonalDetailsProps> = ({
  form,
  errors,
  onChange,
}) => {
  // Handler for department change
  const handlePLanchange = (value: string) => {
    // Create a synthetic event to match the onChange signature
    const event = {
      target: { name: "department", value },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(event);
  };




  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <FormField
        label="Payment Plan"
        name="plan"
        optional={false}
        placeholder="Select a plan"
        value={form.department}
        onChange={onChange}
        error={errors.department}
        inputComponent={
          <Select
            value={form.department}
            onValueChange={handlePLanchange}
          >
            <SelectTrigger id="Plans" className="w-full mb-4">
              <SelectValue placeholder="Select a plan" className=""/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Free">Free</SelectItem>
              <SelectItem value="Starter">Starter</SelectItem>
              <SelectItem value="Business">Business</SelectItem>
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
        label="Email"
        name="email"
        type="email"
        placeholder="Enter your email"
        value={form.email}
        onChange={onChange}
        error={errors.email}
        verify={true}

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
        name="Department"
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
