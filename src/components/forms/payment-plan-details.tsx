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
import NumberInput from "../ui/number-input";
import Link from "next/link";

interface PaymentPlanDetailsProps {
  form: {
    paymentPlan: string;
    agents: string;
    discountCode: string;
    discountPercent: string;
    discountAmount: string;
    tax: string;
    agreeToTerms: boolean;
    receiveUpdates: boolean;
    acceptPolicy: boolean;
    // ...other fields if needed
  };
  errors: { [key: string]: string };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PaymentPlanDetails: React.FC<PaymentPlanDetailsProps> = ({
  form,
  errors,
  onChange,
}) => {
  // Handler for payment plan change
  const handlePlanChange = (value: string) => {
    const event = {
      target: { name: "paymentPlan", value },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(event);
  };

  // Handler for checkbox changes
  const handleCheckboxChange = (name: string, checked: boolean) => {
    const event = {
      target: { name, value: checked ? "true" : "false" },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(event);
  };

  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <FormField
        label="Payment Commitment"
        name="paymentPlan"
        optional={false}
        placeholder="Select a payment cycle"
        value={form.paymentPlan}
        onChange={onChange}
        error={errors.paymentPlan}
        inputComponent={
          <Select value={form.paymentPlan} onValueChange={handlePlanChange}>
            <SelectTrigger id="Select a payment cycle" className="w-full mb-4">
              <SelectValue placeholder="Select a plan" className="" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="half-yearly">Half-yearly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      <FormField
        label="Number of agents/seats required"
        name="agents"
        optional={false}
        placeholder="Number of agents/seats"
        value={form.agents}
        onChange={onChange}
        error={errors.agents}
        inputComponent={
          <NumberInput
            value={Number(form.agents) || 0}
            onChange={(value) => {
              const event = {
                target: { name: "agents", value: String(value) },
              } as React.ChangeEvent<HTMLInputElement>;
              onChange(event);
            }}
          />
        }
      />

      <div className="space-y-2">
        <FormField
          label="Discount Code"
          name="discountCode"
          optional={true}
          placeholder="Enter Discount code"
          value={form.discountCode}
          onChange={onChange}
          error={errors.discountCode}
        />
        <div className="flex flex-row gap-2">
          <FormField
            label="Discount %"
            name="discountPercent"
            readonly={true}
            placeholder="Discount %"
            value={form.discountPercent}
            onChange={onChange}
            error={errors.discountPercent}
          />
          <FormField
            readonly={true}
            label="Discount Amount"
            name="discountAmount"
            placeholder="Discount Amount"
            value={form.discountAmount}
            onChange={onChange}
            error={errors.discountAmount}
          />
        </div>
      </div>

      {/* Checkboxes Section */}

      <FormField
        label="Tax"
        name="tax"
        type="text"
        placeholder="Tax to be calculated"
        value={form.tax}
        onChange={onChange}
        error={errors.tax}
      />
      <FormField
        readonly={true}
        label="Total amount payable"
        name="total_amount"
        type="text"
        placeholder="Total amount payable"
        value={form.tax}
        onChange={onChange}
        error={errors.tax}
      />
      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={form.agreeToTerms}
            onChange={(e) =>
              handleCheckboxChange("agreeToTerms", e.target.checked)
            }
          />
          By signing up you agree to our{" "}
          <Link href={"#"}>Terms and conditions</Link> and{" "}
          <Link href={"#"}>Privacy policy</Link>
        </label>
        {errors.agreeToTerms && (
          <p className="text-destructive text-sm">{errors.agreeToTerms}</p>
        )}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="receiveUpdates"
            checked={form.receiveUpdates}
            onChange={(e) =>
              handleCheckboxChange("receiveUpdates", e.target.checked)
            }
          />
          i understand that my organisation's and my peronal data will be
          processed in accordance with those policies, and I confirm I am
          authothised to bind my organisation to this agreement.
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="acceptPolicy"
            checked={form.acceptPolicy}
            onChange={(e) =>
              handleCheckboxChange("acceptPolicy", e.target.checked)
            }
          />
          Send me product updates and tips (you can opt out anytime)
        </label>
        {errors.acceptPolicy && (
          <p className="text-destructive text-sm">{errors.acceptPolicy}</p>
        )}
      </div>
    </form>
  );
};

export default PaymentPlanDetails;
