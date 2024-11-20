import { z } from 'zod';

export const createPostValidation = z.object({
	title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
	description: z
		.string()
		.min(10, { message: 'Description must be at least 10 characters' }),
	images: z.array(z.string()).optional(),
});

export type CreatePostValidation = z.infer<typeof createPostValidation>;
