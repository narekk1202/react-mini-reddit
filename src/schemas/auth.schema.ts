import { z } from 'zod';

export const registerValidation = z.object({
	fullName: z
		.string()
		.min(3, { message: 'Full name must be at least 3 characters' }),
	email: z.string().email({ message: 'Invalid email address' }),
	password: z
		.string()
		.min(6, { message: 'Password must be at least 6 characters' }),
});

export const signInValidation = z.object({
	email: z.string().email({ message: 'Invalid email address' }),
	password: z
		.string()
		.min(6, { message: 'Password must be at least 6 characters' }),
});

export type RegisterValidation = z.infer<typeof registerValidation>;
export type SignInValidation = z.infer<typeof signInValidation>;
