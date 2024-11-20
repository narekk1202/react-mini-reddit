import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate } from 'react-router-dom';
import Keywords from '../constants/Keywords';
import Urls from '../constants/Urls';
import { useAuth } from '../providers/auth-provider';
import { registerValidation, RegisterValidation } from '../schemas/auth.schema';
import supabase from '../utils/supabase';

const SignUp = () => {
	const { signUp, user } = useAuth();
	const queryClient = useQueryClient();
	const isPending = queryClient.isMutating({ mutationKey: [Keywords.signUp] });

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterValidation>({
		resolver: zodResolver(registerValidation),
	});

	const onSubmit = useCallback(
		(data: RegisterValidation) => {
			signUp(data);
		},
		[signUp]
	);

	const signUpWithGoogle = () => {
		supabase.auth.signInWithOAuth({
			provider: 'google',
		});
	};

	if (user) {
		return <Navigate to={Urls.home} replace />;
	}

	return (
		<main className='container-main flex-col'>
			<span className='text-3xl font-semibold mb-4'>Sign Up</span>
			<form onSubmit={handleSubmit(onSubmit)} className='auth-container'>
				<img className='size-16' src='/logo.png' alt='logo' />

				<div className='w-full flex flex-col gap-2 items-center mt-5'>
					<Input
						{...register('fullName')}
						isInvalid={!!errors.fullName}
						errorMessage={errors.fullName?.message}
						type='text'
						label='Name Surname'
						size='sm'
					/>
					<Input
						{...register('username')}
						isInvalid={!!errors.username}
						errorMessage={errors.username?.message}
						type='text'
						label='Username'
						size='sm'
					/>
					<Input
						{...register('email')}
						isInvalid={!!errors.email}
						errorMessage={errors.email?.message}
						type='email'
						label='Email'
						size='sm'
					/>
					<Input
						{...register('password')}
						isInvalid={!!errors.password}
						errorMessage={errors.password?.message}
						type='password'
						label='Password'
						size='sm'
					/>
				</div>

				<Button
					isLoading={!!isPending}
					type='submit'
					className='w-full mt-5'
					color='primary'
				>
					Sign Up
				</Button>

				<Button
					onClick={signUpWithGoogle}
					variant='bordered'
					className='w-full mt-3'
				>
					<img src='/google.png' alt='google' className='size-5' />
					Google
				</Button>

				<span className='mt-3 text-gray-500 text-sm'>
					Already have an account?{' '}
					<Link to={Urls.signIn} className='text-primary'>
						Sign In
					</Link>
				</span>
			</form>
		</main>
	);
};

export default SignUp;
