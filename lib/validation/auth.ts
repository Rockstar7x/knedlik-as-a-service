import { z } from "zod";

// Shared between server actions and (optionally) client-side forms.

export const safeRedirectPath = z
  .string()
  .regex(/^\/(?![/\\])/)
  .catch("/");

const email = z
  .string({ error: "Email is required." })
  .trim()
  .toLowerCase()
  .pipe(z.email("Enter a valid email address."));

export const signUpSchema = z
  .object({
    name: z
      .string({ error: "Name is required." })
      .trim()
      .min(1, "Name is required.")
      .max(100, "Name must be at most 100 characters."),
    email,
    password: z
      .string({ error: "Password is required." })
      .min(8, "Password must be at least 8 characters.")
      // bcrypt, used by Supabase Auth, ignores anything past 72 bytes.
      .max(72, "Password must be at most 72 characters."),
    repeatPassword: z.string({ error: "Please repeat your password." }),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords do not match.",
    path: ["repeatPassword"],
  });

export const loginSchema = z.object({
  email,
  next: safeRedirectPath,
  password: z
    .string({ error: "Password is required." })
    .min(1, "Password is required."),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

/** Query string of the link in the confirmation e-mail (/auth/confirm). */
export const confirmParamsSchema = z.object({
  token_hash: z.string().min(1).optional(),
  type: z
    .enum([
      "signup",
      "invite",
      "magiclink",
      "recovery",
      "email_change",
      "email",
    ])
    .optional(),
  code: z.string().min(1).optional(),
  next: safeRedirectPath,
});
