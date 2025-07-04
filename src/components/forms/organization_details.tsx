"use client";

import React from "react";
import FormField from "../ui/form_field";

interface OrganizationDetailsForm {
  organizationName: string;
  taxId: string;
  organizationContact?: string;
  organizationEmail?: string;
  organizationIndustry: string;
  numberOfEmployees: string;
  organizationWebsite: string;
  address: {
    address: string;
    zip: string;
    city: string;
    state: string;
    country: string;
  };
  orgType: string;
  marketingChannel: string;
}

interface OrganizationDetailsProps {
  form: OrganizationDetailsForm;
  errors: { [key: string]: string };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  industryTypes: { _id: string; name: string }[];
}

const Organization_details: React.FC<OrganizationDetailsProps> = ({
  form,
  errors,
  onChange,
  onAddressChange,
  industryTypes,
}) => {
  // Handler for department change
 

  // Handler for orgType select
  const handleOrgTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const syntheticEvent = {
      target: {
        name: "orgType",
        value: e.target.value,
      },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);
  };

  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <FormField
        label="Organisation Name"
        name="organizationName"
        placeholder="Enter organisation name"
        value={form.organizationName}
        onChange={onChange}
        error={errors.organizationName}
      />
      <FormField
        label="Tax ID"
        name="taxId"
        placeholder="Enter tax ID"
        value={form.taxId}
        onChange={onChange}
        error={errors.taxId}
      />
      <FormField
        label="Organisation Contact"
        name="organizationContact"
        optional={true}
        placeholder="Enter contact number"
        value={form.organizationContact || ""}
        onChange={onChange}
        error={errors.organizationContact}
      />
      <FormField
        label="Organisation Email"
        name="organizationEmail"
        type="email"
        optional={true}
        placeholder="Enter email"
        value={form.organizationEmail || ""}
        onChange={onChange}
        error={errors.organizationEmail}
      />
      <FormField
        label="Organisation Industry"
        name="organizationIndustry"
        placeholder="Select industry"
        value={form.organizationIndustry}
        onChange={onChange}
        error={errors.organizationIndustry}
        inputComponent={
          <select
            name="organizationIndustry"
            value={form.organizationIndustry}
            onChange={(e) => {
              const syntheticEvent = {
                target: {
                  name: "organizationIndustry",
                  value: e.target.value,
                },
              } as React.ChangeEvent<HTMLInputElement>;
              onChange(syntheticEvent);
            }}
            className="w-full p-2 border rounded bg-indigo-50 focus-visible:border-[#] "
            required
          >
            <option value="">Select industry</option>
            {industryTypes.map((type) => (
              <option key={type._id} value={type._id}>{type.name}</option>
            ))}
          </select>
        }
      />
      <FormField
        label="Number of Employees"
        name="numberOfEmployees"
        placeholder="Enter number of employees"
        value={form.numberOfEmployees}
        onChange={onChange}
        error={errors.numberOfEmployees}
      />
      <FormField
        label="Organisation Details"
        name="organizationDetails"
        optional={false}
        placeholder=""
        value=""
        onChange={() => {}}
        error=""
      >
        <div className="flex flex-row gap-2">
          <FormField
            width="w-2/3"
            name="address"
            placeholder="Enter address"
            value={form.address.address}
            onChange={onAddressChange}
            error={errors["address.address"]}
          />
          <FormField
            width="w-1/3"
            name="zip"
            placeholder="Enter zip code"
            value={form.address.zip}
            onChange={onAddressChange}
            error={errors["address.zip"]}
          />
        </div>
        <div className="flex flex-row gap-2">
          <FormField
            width="w-1/3"
            name="city"
            placeholder="Enter city"
            value={form.address.city}
            onChange={onAddressChange}
            error={errors["address.city"]}
          />
          <FormField
            width="w-1/3"
            name="state"
            placeholder="Enter state"
            value={form.address.state}
            onChange={onAddressChange}
            error={errors["address.state"]}
          />
          <FormField
            width="w-1/3"
            name="country"
            placeholder="Enter country"
            value={form.address.country}
            onChange={onAddressChange}
            error={errors["address.country"]}
          />
        </div>
      </FormField>
      <FormField
        label="Organisation Website"
        name="organizationWebsite"
        placeholder="Enter website URL"
        value={form.organizationWebsite}
        onChange={onChange}
        error={errors.organizationWebsite}
      />
      
      <FormField
        label="Organization Type"
        name="orgType"
        placeholder="Select organization type"
        value={form.orgType}
        onChange={onChange}
        error={errors.orgType}
        inputComponent={
          <select
            name="orgType"
            value={form.orgType}
            onChange={handleOrgTypeChange}
            className="w-full p-2 border rounded bg-indigo-50 focus-visible:border-[#] "
            required
          >
            <option value="">Select type</option>
            <option value="Private">Private</option>
            <option value="Public">Public</option>
            <option value="Non-profit">Non-profit</option>
            <option value="Government">Government</option>
          </select>
        }

      />
      <FormField
        label="Marketing Channel"
        name="marketingChannel"
        placeholder="How did you hear about us?"
        value={form.marketingChannel}
        onChange={onChange}
        error={errors.marketingChannel}
      />
    </form>
  );
};

export default Organization_details;
