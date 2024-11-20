import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@nextui-org/button';
import {
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from '@nextui-org/react';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BiX } from 'react-icons/bi';
import { ImImage } from 'react-icons/im';
import {
	createPostValidation,
	CreatePostValidation,
} from '../../schemas/posts.schema';

interface Props {
	isOpen: boolean;
	isPending: boolean;
	onOpenChange: (isOpen: boolean) => void;
	handleOnSubmit: (data: CreatePostValidation) => void;
}

const CreatePostModal: FC<Props> = ({
	isOpen,
	isPending,
	onOpenChange,
	handleOnSubmit,
}) => {
	const [imageInputs, setImageInputs] = useState<string[]>([]);
	const {
		register,
		handleSubmit,
		formState: { errors },
		setFocus,
		reset,
	} = useForm<CreatePostValidation>({
		resolver: zodResolver(createPostValidation),
	});

	const handleAddImage = () => {
		const lastInput = imageInputs[imageInputs.length - 1];
		setFocus(`images.${imageInputs.length - 1}`);
		if (lastInput !== '') {
			setImageInputs([...imageInputs, '']);
		}
	};

	const handleOnSubmitModified = (data: CreatePostValidation) => {
		handleOnSubmit(data);
		reset();
	};

	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
			<ModalContent>
				{onClose => (
					<form onSubmit={handleSubmit(handleOnSubmitModified)}>
						<ModalHeader className='flex flex-col gap-1'>
							Create Post
						</ModalHeader>
						<ModalBody>
							<Input
								{...register('title')}
								errorMessage={errors.title?.message}
								isInvalid={!!errors.title}
								label='Title'
								size='sm'
								isRequired
							/>
							<Input
								{...register('description')}
								isInvalid={!!errors.description}
								errorMessage={errors.description?.message}
								label='Description'
								size='sm'
								isRequired
							/>
							{imageInputs.map((input, index) => (
								<div key={index} className='flex items-center gap-2'>
									<Input
										{...register(`images.${index}`)}
										label={`Image URL ${index + 1}`}
										isInvalid={!!errors.images?.[index]}
										errorMessage={errors.images?.[index]?.message}
										size='sm'
										value={input}
										onChange={e => {
											const newImageInputs = [...imageInputs];
											newImageInputs[index] = e.target.value;
											setImageInputs(newImageInputs);
										}}
									/>
									<Button
										isIconOnly
										color='danger'
										onPress={() => {
											setImageInputs(imageInputs.filter((_, i) => i !== index));
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
						<ModalFooter>
							<Button color='danger' variant='light' onPress={onClose}>
								Close
							</Button>
							<Button isLoading={isPending} type='submit' color='primary'>
								Create
							</Button>
						</ModalFooter>
					</form>
				)}
			</ModalContent>
		</Modal>
	);
};

export default CreatePostModal;
