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
import type { PaymentPlanDetailsForm, Errors } from "@/lib/types";

interface PaymentPlanDetailsProps {
  form: PaymentPlanDetailsForm;
  errors: Errors;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  plan?: import("@/lib/types").PlanDetails | null;
  durations?: string[];
}

const PaymentPlanDetails: React.FC<PaymentPlanDetailsProps> = ({
  form,
  errors,
  onChange,
  plan,
  durations = [],
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
      target: { name, type: "checkbox", checked, value: checked },
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    onChange(event);
  };

  return (
    <div>
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
              <SelectTrigger
                id="Select a payment cycle"
                className="w-full mb-4 bg-indigo-50"
              >
                <SelectValue placeholder="Select a plan" className="" />
              </SelectTrigger>
              <SelectContent>
                {durations.length > 0
                  ? durations.map((d: string) => (
                      <SelectItem key={d} value={d}>
                        {d.charAt(0).toUpperCase() + d.slice(1)}
                      </SelectItem>
                    ))
                  : plan &&
                    Array.isArray(plan.duration) &&
                    plan.duration.length > 0 &&
                    plan.duration.map((d: string) => (
                      <SelectItem key={d} value={d}>
                        {d.charAt(0).toUpperCase() + d.slice(1)}
                      </SelectItem>
                    ))}
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

        <FormField
          label="Tax"
          readonly={true}
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

        <FormField
          name="agreeToTerms"
          optional={false}
          placeholder=""
          value={form.agreeToTerms ? "true" : "false"}
          onChange={onChange}
          error={errors.agreeToTerms}
          inputComponent={
            <div className="flex items-center">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={form.agreeToTerms}
                onChange={(e) =>
                  handleCheckboxChange("agreeToTerms", e.target.checked)
                }
                className="mr-2"
              />
              <span>
                By signing up you agree to our{" "}
                <Link className="text-blue-500" href={"/"}>
                  Terms and Conditions{" "}
                </Link>{" "}
                and{" "}
                <Link href={"/"} className="text-blue-500">
                  Privacy policy
                </Link>
              </span>
            </div>
          }
        />

        <FormField
          name="acceptPolicy"
          optional={false}
          placeholder=""
          value={form.acceptPolicy ? "true" : "false"}
          onChange={onChange}
          error={errors.acceptPolicy}
          inputComponent={
            <div className="flex items-center">
              <input
                type="checkbox"
                name="acceptPolicy"
                checked={form.acceptPolicy}
                onChange={(e) =>
                  handleCheckboxChange("acceptPolicy", e.target.checked)
                }
                className="mr-2"
              />
              <span>
                I understand that my organisation's and my personal data will be
                processed in accordance with those policies, and I confirm I am
                authorised to bind my organisation to this agreement.
              </span>
            </div>
          }
        />
        <FormField
          name="receiveUpdates"
          placeholder=""
          value={form.receiveUpdates ? "true" : "false"}
          onChange={onChange}
          error={errors.receiveUpdates}
          inputComponent={
            <div className="flex items-center">
              <input
                type="checkbox"
                name="receiveUpdates"
                checked={form.receiveUpdates}
                onChange={(e) =>
                  handleCheckboxChange("receiveUpdates", e.target.checked)
                }
                className="mr-2"
              />
              <span>I want to receive updates</span>
            </div>
          }
        />
      </form>
    </div>
  );
};

export default PaymentPlanDetails;
