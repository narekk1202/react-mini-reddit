import { useQuery } from '@tanstack/react-query';
import QueryKeys from '../../constants/QueryKeys';
import supabase from '../../utils/supabase';

export const useAuthMeQuery = (userId: string) => {
	return useQuery({
		queryKey: [QueryKeys.me],
		queryFn: async () => {
			const { data, error } = await supabase
				.from('profiles')
				.select('*')
				.eq('id', userId)
				.single();
			if (error) {
				throw error;
			}
			return {
				...data,
				avatar_url: data.avatar_url
					? `${data.avatar_url}?v=${Date.now()}`
					: undefined,
			};
		},
	});
};
