import { z } from "zod";


export const FormValidator = z.object({
    name: z.string()
        .trim()
        .min(2, { message: 'Enter your name' })
        .max(50, { message: 'Name must be at most 50 characters long' }),
    email: z.string().email({ message: 'Enter a valid email address' }),
    phone: z.string().max(30, { message: 'Phone number is too long' }),
    message: z.string()
        .trim()
        .min(10, { message: 'Add a sentence or two about your project' })
        .max(2000, { message: 'Message must be at most 2000 characters long' }),
});

export type FormValues = z.infer<typeof FormValidator>;
