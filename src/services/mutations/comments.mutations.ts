import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { TablesInsert } from '../../../database.types';
import QueryKeys from '../../constants/QueryKeys';
import supabase from '../../utils/supabase';

export const useCreatePostCommentMutation = (
	setComment: (val: string) => void
) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (sendData: TablesInsert<'post_comments'>) => {
			const { data, error } = await supabase
				.from('post_comments')
				.insert({
					user_id: sendData.user_id,
					post_id: sendData.post_id,
					comment: sendData.comment,
				})
				.select();

			if (error) throw error;
			return data;
		},
		onSuccess: async data => {
			if (data) {
				await queryClient.invalidateQueries({
					queryKey: [QueryKeys.postComments],
				});
				setComment('');
			}
		},
	});
};

export const useDeletePostCommentMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (commentId: number) =>
			supabase.from('post_comments').delete().match({
				id: commentId,
			}),
		onSuccess: async data => {
			if (data.error) {
				toast.error(data.error.message);
				return;
			}

			await queryClient.invalidateQueries({
				queryKey: [QueryKeys.postComments],
			});

			toast.success('Successfully deleted comment');
		},
	});
};
