import { z } from "zod";

const personalDetailsSchema = z.object({
    fullName: z.string()
        .min(1, "Full name is required"),

    email: z.string()
        .min(1, "Email is required")
        .email("Invalid email address"),

    password: z.string()
        .min(6, "Password must be at least 6 characters"),

    confirmPassword: z.string()
        .min(1, "Please confirm your password"),
    
    contactNumber: z.string()
        .min(10, "Contact number must be at least 10 digits").regex(/^\d+$/, "Contact number must be digits only"),
    
    department: z.string()
        .optional(),
    
    designation: z.string()
        .optional(),


}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

export {personalDetailsSchema}