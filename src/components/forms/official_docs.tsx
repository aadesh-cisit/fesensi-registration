"use client";

import React from "react";
import FormField from "../ui/form_field";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface IdentificationDetailsProps {
  form: {
    idType: string;
    idNumber: string;
    issuingAuthority: string;
  };
  errors: { [key: string]: string };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (value: string) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const IdentificationDetails: React.FC<IdentificationDetailsProps> = ({
  form,
  errors,
  onChange,
  onSelectChange,
  onFileUpload,
}) => {
  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      {/* ID Type - Select from shadcn */}
      <div className="mb-4">
   
        <FormField
          label="ID Type"
          name="idType"
          optional={false}
          placeholder="Select ID Type"
          value={form.idType}
          onChange={onChange}
          error={errors.idType}
          inputComponent={
            <Select onValueChange={onSelectChange} defaultValue={form.idType}>
              <SelectTrigger className=" w-full bg-indigo-50 text-gray-800">
                <SelectValue placeholder="Select ID Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Aadhaar Card">Aadhaar Card</SelectItem>
                <SelectItem value="PAN">PAN</SelectItem>
                <SelectItem value="Passport">Passport</SelectItem>
              </SelectContent>
            </Select>
          }
        />
      </div>

      {/* Identification Number */}
      <FormField
        label="Identification Number"
        name="idNumber"
        placeholder="Enter your identification number"
        value={form.idNumber}
        onChange={onChange}
        error={errors.idNumber}
      />

      {/* Issuing Authority */}
      <FormField
        label="Issuing Authority"
        name="issuingAuthority"
        placeholder="Enter the issuing authority's name"
        value={form.issuingAuthority}
        onChange={onChange}
        error={errors.issuingAuthority}
      />

      {/* File Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Upload the document{" "}
          <span title="Optional" className="text-gray-400">
            ℹ️
          </span>
        </label>
        <input
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={onFileUpload}
          className="block w-full text-sm text-gray-700 bg-white border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
        />
      </div>
    </form>
  );
};

export default IdentificationDetails;
