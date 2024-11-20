import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from '@nextui-org/react';
import { FC, useEffect, useState } from 'react';
import { ImageListType } from 'react-images-uploading';
import { useAuth } from '../../providers/auth-provider';
import { useUpdateUserMutation } from '../../services/mutations/user.mutations';
import { useAuthMeQuery } from '../../services/queries/user.queries';
import { IUpdateUser } from '../../types/user.types';
import { checkImageAvailability } from '../../utils/check-url';
import ImageUpload from './image-upload';

interface Props {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
}

const UserEditModal: FC<Props> = ({ isOpen, onOpenChange }) => {
	const { user: currentUser } = useAuth();
	const { data: user } = useAuthMeQuery(currentUser?.id || '');
	const [images, setImages] = useState<ImageListType>([]);
	const [fullName, setFullName] = useState('');
	const [username, setUsername] = useState('');

	const { mutate, isPending } = useUpdateUserMutation(onOpenChange, setImages);
	const [isImageAvailable, setIsImageAvailable] = useState(false);

	const handleUpdate = () => {
		const fileExt = images[0] && images[0].file?.name.split('.').pop();
		const fileName = `${user?.id}.${Math.random()}.${fileExt}`;
		const filePath = `${fileName}`;

		const sendData: IUpdateUser = {
			id: user?.id as string,
			username,
			full_name: fullName,
			filePath,
			file: images[0] && images[0].file,
		};

		mutate(sendData);
	};

	useEffect(() => {
		const verifyImage = async () => {
			if (user?.avatar_url) {
				const isAvailable = await checkImageAvailability(user.avatar_url);
				setIsImageAvailable(isAvailable);
			}
		};

		verifyImage();
	}, [user?.avatar_url]);

	useEffect(() => {
		if (user?.avatar_url && isImageAvailable) {
			setImages([{ data_url: user?.avatar_url }]);
			return;
		}

		setImages([]);
	}, [user?.avatar_url, isOpen, isImageAvailable]);

	useEffect(() => {
		if (user) {
			setFullName(user.full_name || '');
			setUsername(user.username || '');
		}
	}, [user]);


	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
			<ModalContent>
				{onClose => (
					<>
						<ModalHeader className='flex flex-col gap-1'>
							Edit Profile
						</ModalHeader>
						<ModalBody>
							<ImageUpload images={images} setImages={setImages} />
							<Input
								label='Name Surname'
								size='sm'
								value={fullName}
								onChange={e => setFullName(e.target.value)}
							/>
							<Input
								label='Username'
								size='sm'
								value={username}
								onChange={e => setUsername(e.target.value)}
							/>
						</ModalBody>
						<ModalFooter>
							<Button color='danger' variant='light' onPress={onClose}>
								Close
							</Button>
							<Button
								isLoading={isPending}
								color='primary'
								onClick={handleUpdate}
							>
								Update
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};

export default UserEditModal;
