import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { TablesInsert } from '../../../database.types';
import QueryKeys from '../../constants/QueryKeys';
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
