import { z } from "zod";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Register schema
export const registerSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(2, "Must have morethan 2 characters")
      .email("Invalid email")
      .refine((val) => emailRegex.test(val), "Email is required"),
    password: z.string().min(6, "Password must be morethan 6 characters"),
    confirmPassword: z.string().min(2, "Confirm password is required"),
  })
  .refine((inp) => inp.password === inp.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"],
  })


//Login schema
export const loginSchema = z
  .object({
    email: z
      .string()
      .min(2, "Email is required")
      .refine((val) => emailRegex.test(val), {
        message: "Email invalid",
      }),
    password: z.string().min(6, "Password must be least 6 characters"),
    rememberMe: z.boolean().optional()
  })

export const addProfile = z.object({
  username: z
    .string()
    .trim()
    .min(4, "Username must be at least 4 characters"),
  firstName: z
    .string()
    .trim()
    .min(3, "Firstname must be at least 3 characters"),
  lastName: z
    .string()
    .trim()
    .min(3, "Lastname must be at least 3 characters"),
  gender: z
    .enum(["MALE", "FEMALE", "OTHER"], {
      errorMap: () => ({ message: "Please select your gender" }),
    }),
  bio: z
    .string()
    .max(200, "Bio must not exceed 200 characters")
    .optional(),
})
