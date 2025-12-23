import { z } from 'zod';

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'L\'email est requis')
        .email('Format d\'email invalide'),
    password: z
        .string()
        .min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

export const registerSchema = loginSchema.extend({
    name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
