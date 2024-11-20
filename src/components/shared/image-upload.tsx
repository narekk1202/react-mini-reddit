import { Button } from '@nextui-org/button';
import { Image } from '@nextui-org/image';
import { FC, useState } from 'react';
import { BiTrash } from 'react-icons/bi';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import { maxImagesNumber } from '../../constants/Configs';
import { useDeleteProfilePictureMutation } from '../../services/mutations/user.mutations';

interface Props {
	images: ImageListType;
	setImages: (images: ImageListType) => void;
}

const ImageUpload: FC<Props> = ({ images, setImages }) => {
	const [youSureButton, setYouSureButton] = useState(false);
	const { mutate, isPending } = useDeleteProfilePictureMutation(
		setYouSureButton,
		setImages
	);

	const onChange = (imageList: ImageListType) => {
		setImages(imageList);
	};

	const onClickDelete = () => {
		const imageName = images[0].data_url.split('/').pop();
		mutate(imageName);
	};

	return (
		<div className='App'>
			<ImageUploading
				value={images}
				onChange={onChange}
				maxNumber={maxImagesNumber}
				dataURLKey='data_url'
				acceptType={['jpg', 'png', 'jpeg']}
			>
				{({ imageList, onImageUpload, isDragging, dragProps }) => (
					<div className='upload__image-wrapper'>
						{imageList.length === 0 && (
							<Button
								style={isDragging ? { color: 'red' } : undefined}
								onClick={onImageUpload}
								variant='bordered'
								size='lg'
								className='w-full border-dashed'
								{...dragProps}
							>
								Click or Drop here{' '}
								<span className='text-sm text-gray-500 font-light'>
									( jpg, png, jpeg )
								</span>
							</Button>
						)}

						{imageList.map((image, index) => (
							<div key={index} className='image-item'>
								<Image width={'100%'} height={'auto'} src={image.data_url} />
							</div>
						))}
						{imageList.length > 0 && !youSureButton && (
							<Button
								color='danger'
								onClick={() => {
									setYouSureButton(true);
								}}
								className='mt-2'
							>
								<BiTrash /> Remove
							</Button>
						)}
						{youSureButton && (
							<div className='flex items-center gap-2 mt-2'>
								<span>Are you sure?</span>
								<Button
									isLoading={isPending}
									color='danger'
									onClick={onClickDelete}
								>
									Delete
								</Button>
								<Button color='warning' onClick={() => setYouSureButton(false)}>
									Cancel
								</Button>
							</div>
						)}
					</div>
				)}
			</ImageUploading>
		</div>
	);
};

export default ImageUpload;
