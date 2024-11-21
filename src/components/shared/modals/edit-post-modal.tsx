import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@nextui-org/button';
import { Input, Textarea } from '@nextui-org/input';
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Spinner,
} from '@nextui-org/react';
import { FC, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { BiX } from 'react-icons/bi';
import { ImImage } from 'react-icons/im';
import {
	createPostValidation,
	CreatePostValidation,
} from '../../../schemas/posts.schema';
import { usePostQuery } from '../../../services/queries/posts.queries';

interface Props {
	postId: string;
	isOpen: boolean;
	isPending: boolean;
	onOpenChange: (isOpen: boolean) => void;
	handleOnSubmit: (data: CreatePostValidation) => void;
}

const EditPostModal: FC<Props> = ({
	postId,
	isOpen,
	isPending,
	onOpenChange,
	handleOnSubmit,
}) => {
	const [imageInputs, setImageInputs] = useState<string[]>([]);
	const { data: post, isLoading } = usePostQuery(postId, isOpen);

	const {
		handleSubmit,
		formState: { errors },
		setValue,
		control,
	} = useForm<CreatePostValidation>({
		resolver: zodResolver(createPostValidation),
	});

	const handleAddImage = () => {
		setImageInputs([...imageInputs, '']);
	};

	useEffect(() => {
		if (post) {
			setValue('title', post.title || '');
			setValue('description', post.description || '');
			setValue('images', post.images || []);
			setImageInputs(post.images || []);
		}
	}, [post, setValue]);

	useEffect(() => {
		if (imageInputs.length > 0) {
			setValue('images', imageInputs);
		}
	}, [imageInputs, setValue]);

	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
			<ModalContent>
				{onClose => (
					<form onSubmit={handleSubmit(handleOnSubmit)}>
						<ModalHeader className='flex flex-col gap-1'>Edit Post</ModalHeader>
						{isLoading && !post ? (
							<div className='w-full flex items-center justify-center'>
								<Spinner size='lg' />
							</div>
						) : (
							<ModalBody>
								<Controller
									control={control}
									name='title'
									render={({ field }) => (
										<Input
											{...field}
											errorMessage={errors.title?.message}
											isInvalid={!!errors.title}
											label='Title'
											size='sm'
											isRequired
										/>
									)}
								/>
								<Controller
									control={control}
									name='description'
									render={({ field }) => (
										<Textarea
											{...field}
											errorMessage={errors.description?.message}
											isInvalid={!!errors.description}
											label='Description'
											size='sm'
											isRequired
										/>
									)}
								/>
								{imageInputs.map((_, index) => (
									<div key={index} className='flex items-center gap-2'>
										<Controller
											control={control}
											name={`images.${index}`}
											render={({ field }) => (
												<Input
													{...field}
													label={`Image URL ${index + 1}`}
													isInvalid={!!errors.images?.[index]}
													errorMessage={errors.images?.[index]?.message}
													size='sm'
												/>
											)}
										/>
										<Button
											isIconOnly
											color='danger'
											size='lg'
											onPress={() => {
												setImageInputs(
													imageInputs.filter((_, i) => i !== index)
												);
											}}
										>
											<BiX />
										</Button>
									</div>
								))}
								<Button onClick={handleAddImage} color='primary'>
									<ImImage />
									Add image
								</Button>
							</ModalBody>
						)}
						<ModalFooter>
							<Button color='danger' variant='light' onPress={onClose}>
								Close
							</Button>
							<Button
								isDisabled={isLoading}
								isLoading={isPending}
								type='submit'
								color='primary'
							>
								Edit
							</Button>
						</ModalFooter>
					</form>
				)}
			</ModalContent>
		</Modal>
	);
};

export default EditPostModal;
