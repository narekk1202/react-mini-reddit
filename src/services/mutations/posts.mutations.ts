import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { TablesInsert } from '../../../database.types';
import Keywords from '../../constants/Keywords';
import QueryKeys from '../../constants/QueryKeys';
import { useAuth } from '../../providers/auth-provider';
import supabase from '../../utils/supabase';

export const useCreatePostMutation = (
	onOpenChange: (isOpen: boolean) => void
) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: TablesInsert<'posts'>) =>
			await supabase.from('posts').insert(data),
		onSuccess: async data => {
			if (data.error) {
				toast.error(data.error.message);
				return;
			}

			await queryClient.invalidateQueries({ queryKey: [QueryKeys.posts] });
			toast.success('Successfully created post');
			onOpenChange(false);
		},
	});
};

export const useAddPostReactionMutation = (postId: string) => {
	const { user } = useAuth();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (
			reactionType: typeof Keywords.like | typeof Keywords.dislike
		) => {
			const { error } = await supabase.from('post_reactions').upsert(
				{
					post_id: postId,
					user_id: user?.id,
					reaction_type: reactionType,
				},
				{
					onConflict: 'post_id,user_id',
				}
			);

			if (error) throw error;
			return reactionType;
		},
		onSuccess: newReactionType => {
			queryClient.setQueryData(
				[QueryKeys.postUserReaction, postId],
				newReactionType
			);
			queryClient.invalidateQueries({
				queryKey: [QueryKeys.postsReactions, postId],
			});
		},
	});
};

export const useRemovePostReactionMutation = (postId: string) => {
	const { user } = useAuth();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			const { error } = await supabase.from('post_reactions').delete().match({
				post_id: postId,
				user_id: user?.id,
			});

			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.setQueryData([QueryKeys.postUserReaction, postId], null);
			queryClient.invalidateQueries({
				queryKey: [QueryKeys.postsReactions, postId],
			});
		},
	});
};
