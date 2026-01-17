import z from "zod";

// Create User DTO aligned with Flutter request body
export const CreateUserDTO = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Phone must be at least 7 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type CreateUserDTO = z.infer<typeof CreateUserDTO>;

// Login User DTO aligned with Flutter request body
export const LoginUserDTO = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginUserDTO = z.infer<typeof LoginUserDTO>;
