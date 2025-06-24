"use client"

import React from "react"
import { z } from "zod"
import FormField from "../ui/form_field"




interface PersonalDetailsProps {
    form: {
        fullName: string;
        email: string;
        password: string;
        confirmPassword: string;
        contactNumber: string;
        department: string;
        designation: string;
    };
    errors: { [key: string]: string };
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Personal_Details: React.FC<PersonalDetailsProps> = ({ form, errors, onChange }) => {
    return (

        <form className="space-y-4" onSubmit={e => e.preventDefault()}>
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
                placeholder="Enter your department"
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
    )
}

export default Personal_Details