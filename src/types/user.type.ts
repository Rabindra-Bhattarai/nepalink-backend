import z from "zod";

export const UserSchema = z.object({
  name: z.string().min(1),              // full name
  email: z.string().email(),            // required email
  phone: z.string().min(7),             // basic phone validation
  password: z.string().min(6),          // required password
  //imageUrl: z.string().url().optional(),  // optional profile image URL
});

export type UserType = z.infer<typeof UserSchema>;