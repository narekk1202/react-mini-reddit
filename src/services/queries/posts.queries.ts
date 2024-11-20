import { useQuery } from '@tanstack/react-query';
import QueryKeys from '../../constants/QueryKeys';
import ServerErrors from '../../constants/ServerErrors';
import { useAuth } from '../../providers/auth-provider';
import { IPost } from '../../types/post.types';
import supabase from '../../utils/supabase';

interface Reactions {
	likes: number;
	dislikes: number;
}

export const usePostQuery = (postId: string, enabled: boolean) => {
	return useQuery({
		queryKey: [QueryKeys.post, postId],
		queryFn: async () => {
			const { data, error } = await supabase.from('posts').select('*').match({
				id: postId,
			});

			if (error) {
				throw error;
			}

			return data[0];
		},
		enabled,
	});
};

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

export const usePostReactions = (postId: string) => {
	return useQuery({
		queryKey: [QueryKeys.postsReactions, postId],
		queryFn: async (): Promise<Reactions> => {
			const { data, error } = await supabase.rpc('get_post_reactions', {
				post_id_param: postId,
			});

			if (error) throw error;
			return data as unknown as Reactions;
		},
	});
};

export const usePostUserReaction = (postId: string) => {
	const { user } = useAuth();

	return useQuery({
		queryKey: [QueryKeys.postUserReaction, postId],
		queryFn: async () => {
			const { data, error } = await supabase
				.from('post_reactions')
				.select('reaction_type')
				.match({ post_id: postId, user_id: user?.id })
				.single();

			if (error) {
				if (error.code === ServerErrors.pgrst116) {
					return null;
				}
				throw error;
			}
			return data?.reaction_type || null;
		},
	});
};
