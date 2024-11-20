import { useMutation, useQueryClient } from '@tanstack/react-query';
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
