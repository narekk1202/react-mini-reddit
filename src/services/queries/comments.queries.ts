import { useQuery } from '@tanstack/react-query';
import QueryKeys from '../../constants/QueryKeys';
import supabase from '../../utils/supabase';

export const useGetPostComments = (postId: string) => {
	return useQuery({
		queryKey: [QueryKeys.postComments, postId],
		queryFn: async () => {
			const { data, error } = await supabase
				.from('post_comments')
				.select('*')
				.eq('post_id', postId);

			if (error) throw error;
			return data;
		},
	});
};

export const useGetPostCommentAuthor = (userId: string, enabled: boolean) => {
	return useQuery({
		queryKey: [QueryKeys.postCommentAuthor, userId],
		queryFn: async () => {
			const { data, error } = await supabase
				.from('profiles')
				.select('*')
				.eq('id', userId)
				.single();

			if (error) throw error;
			return data;
		},
		enabled,
	});
};