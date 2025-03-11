import { z } from "zod";

const userNameValidation = z
  .string()
  .min(2, "Username must be atleast 2 characters")
  .max(20, "Username must not be more than 20 characters")
  .regex(/^[a-zA-Z0-9]*$/, "Username cannot contain special characters");

const emailValidation = z.string().email({ message: "Invalid Email adress" });
const passwordValidation = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(12, "Password must be no longer than 12 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(
    /[^a-zA-Z0-9]/,
    "Password must contain at least one special character"
  );

export const signUpSchema = z.object({
  username: userNameValidation,
  email: emailValidation,
  password: passwordValidation,
});

// Sign-in schema
export const signInSchema = z.object({
  email: emailValidation,
  password: passwordValidation,
});

export type AuthFormData =
  | z.infer<typeof signUpSchema>
  | z.infer<typeof signInSchema>;
