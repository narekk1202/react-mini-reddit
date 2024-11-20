import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Keywords from '../../constants/Keywords';
import {
	RegisterValidation,
	SignInValidation,
} from '../../schemas/auth.schema';
import supabase from '../../utils/supabase';

export const useSignUpMutation = () => {
	return useMutation({
		mutationKey: [Keywords.signUp],
		mutationFn: (data: RegisterValidation) =>
			supabase.auth.signUp({
				email: data.email,
				password: data.password,
				options: {
					data: {
						full_name: data.fullName,
						username: data.username,
					},
				},
			}),
		onSuccess: data => {
			if (data.error) {
				toast.error(data.error.message);
				return;
			}

			toast.success('Successfully signed up, redirecting to home page...');
		},
	});
};

export const useSignInMutation = () => {
	return useMutation({
		mutationKey: [Keywords.signIn],
		mutationFn: (data: SignInValidation) =>
			supabase.auth.signInWithPassword(data),
		onSuccess: data => {
			if (data.error) {
				toast.error(data.error.message);
				return;
			}

			toast.success('Successfully signed in, redirecting to home page...');
		},
	});
};

export const useSignOutMutation = () => {
	return useMutation({
		mutationFn: () => supabase.auth.signOut(),
	});
};
