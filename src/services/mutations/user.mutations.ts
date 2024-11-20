import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ImageListType } from 'react-images-uploading';
import QueryKeys from '../../constants/QueryKeys';
import ServerErrors from '../../constants/ServerErrors';
import { IUpdateUser } from '../../types/user.types';
import supabase from '../../utils/supabase';

export const useUpdateUserMutation = (
	onOpenChange: (isOpen: boolean) => void,
	setImages: (images: ImageListType) => void
) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (sendData: IUpdateUser) => {
			let avatar_url = undefined;

			if (sendData.file && sendData.filePath) {
				const { error: storageError } = await supabase.storage
					.from('avatars')
					.upload(sendData.filePath, sendData.file);

				if (storageError) {
					throw storageError;
				}

				const { data: urlData } = supabase.storage
					.from('avatars')
					.getPublicUrl(sendData.filePath || '');

				avatar_url = urlData.publicUrl;
			}

			const { error } = await supabase
				.from('profiles')
				.update({
					full_name: sendData.full_name,
					username: sendData.username,
					avatar_url,
				})
				.eq('id', sendData.id);

			if (error) {
				if (error.code === ServerErrors.usernameAlreadyTaken) {
					toast.error('Username already taken');
					return;
				}

				toast.error(error.message);
				return;
			}
			await queryClient.invalidateQueries({ queryKey: [QueryKeys.me] });
			toast.success('Successfully updated user');
			onOpenChange(false);
			setImages([]);
		},
	});
};

export const useDeleteProfilePictureMutation = (
	setYouSureButton: (bool: boolean) => void,
	setImages: (images: ImageListType) => void
) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (imageName: string) =>
			supabase.storage.from('avatars').remove([`${imageName.split('?')[0]}`]),
		onSuccess: async data => {
			if (data.error) {
				toast.error(data.error.message);
				return;
			}

			await queryClient.invalidateQueries({ queryKey: [QueryKeys.me] });
			toast.success('Successfully deleted profile picture');
			setYouSureButton(false);
			setImages([]);
		},
	});
};
