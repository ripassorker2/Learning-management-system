import { z } from 'zod';

const createUserZodSchema = z.object({
   body: z.object({
      name: z.string({
         required_error: 'Full name is required.',
      }),
      email: z
         .string({
            required_error: 'Email is required',
         })
         .email(),
      password: z.string({
         required_error: 'Password is required',
      }),
      role: z.string().default('user'),
      avatar: z
         .object({
            public_id: z.string(),
            url: z.string(),
         })
         .optional(),
      isVerified: z.boolean().default(false),
      courses: z
         .array(
            z.object({
               courseId: z.string(),
            })
         )
         .optional(),
   }),
});

export const UserValidation = {
   createUserZodSchema,
};
