import { useQuery } from '@tanstack/react-query';
import QueryKeys from '../../constants/QueryKeys';
import supabase from '../../utils/supabase';
import { IPost } from '../../types/post.types'

export const usePostsQuery = () => {
	return useQuery({
		queryKey: [QueryKeys.posts],
		queryFn: async () => {
			const { data: posts, error } = await supabase.from('posts').select('*');
			const { data: users, error: usersError } = await supabase
				.from('profiles')
				.select('*');

			if (error || usersError) {
				throw error;
			}

			if (posts && users) {
				return posts.map(post => {
					const user = users.find(user => user.id === post.user_id);
					return { ...post, user } as IPost;
				});
			}

			return [];
		},
	});
};
