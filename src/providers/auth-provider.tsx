import { Session, User } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';
import { createContext, useContext, useEffect, useState } from 'react';
import { RegisterValidation, SignInValidation } from '../schemas/auth.schema';
import {
	useSignInMutation,
	useSignOutMutation,
	useSignUpMutation,
} from '../services/mutations/auth.mutations';
import supabase from '../utils/supabase';

interface AuthContextType {
	user: User | null;
	session: Session | null;
	loading: boolean;
	signIn: (data: SignInValidation) => Promise<void>;
	signUp: (data: RegisterValidation) => Promise<void>;
	signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [session, setSession] = useState<Session | null>(null);
	const [loading, setLoading] = useState(true);
	const queryClient = useQueryClient();

	const signUpMutation = useSignUpMutation();
	const signInMutation = useSignInMutation();
	const signOutMutation = useSignOutMutation();

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
			setUser(session?.user ?? null);
			setLoading(false);
		});

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (event, session) => {
			setSession(session);
			setUser(session?.user ?? null);
			setLoading(false);

			if (event === 'SIGNED_OUT') {
				queryClient.clear();
			}
		});

		return () => {
			subscription.unsubscribe();
		};
	}, [queryClient]);

	const signIn = async (data: SignInValidation) => {
		signInMutation.mutate(data);
	};

	const signUp = async (data: RegisterValidation) => {
		signUpMutation.mutate(data);
	};

	const signOut = async () => {
		signOutMutation.mutate();
	};

	const value = {
		user,
		session,
		loading,
		signIn,
		signUp,
		signOut,
	};

	return (
		<AuthContext.Provider value={value}>
			{!loading && children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within AuthProvider');
	}
	return context;
}
