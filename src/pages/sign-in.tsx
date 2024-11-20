import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';
import { Link, Navigate } from 'react-router-dom';
import Keywords from '../constants/Keywords';
import Urls from '../constants/Urls';
import { useAuth } from '../providers/auth-provider';
import { signInValidation, SignInValidation } from '../schemas/auth.schema';
import supabase from '../utils/supabase';
import { Image } from '@nextui-org/react'

const SignIn = () => {
	const { signIn, user } = useAuth();
	const queryClient = useQueryClient();
	const isPending = queryClient.isMutating({ mutationKey: [Keywords.signIn] });

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignInValidation>({
		resolver: zodResolver(signInValidation),
	});

	const onSubmit = useCallback(
		(data: SignInValidation) => {
			signIn(data);
		},
		[signIn]
	);

	const signInWithGoogle = () => {
		supabase.auth.signInWithOAuth({
			provider: 'google',
		});
	};

	if (user) {
		return <Navigate to={Urls.home} replace />;
	}

	return (
		<main className='container-main flex-col'>
			<span className='text-3xl font-semibold mb-4'>Sign In</span>
			<form onSubmit={handleSubmit(onSubmit)} className='auth-container'>
				<Image className='size-20 bg-white rounded-full' src='/logo.png' alt='logo' />

				<div className='w-full flex flex-col gap-2 items-center mt-5'>
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
					Sign In
				</Button>

				<Button
					onClick={signInWithGoogle}
					variant='bordered'
					className='w-full mt-3'
				>
					<FcGoogle className='size-5' />
					Google
				</Button>

				<span className='mt-3 text-gray-500 text-sm'>
					Don't have an account?{' '}
					<Link to={Urls.signUp} className='text-primary'>
						Sign Up
					</Link>
				</span>
			</form>
		</main>
	);
};

export default SignIn;
