import { Button } from '@nextui-org/button';
import { Image, User } from '@nextui-org/react';
import { FC } from 'react';
import { MdDelete, MdEdit } from 'react-icons/md';
import { SlDislike, SlLike } from 'react-icons/sl';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { useAuth } from '../../providers/auth-provider';
import { IPost } from '../../types/post.types';
import 'react-photo-view/dist/react-photo-view.css';

const Post: FC<IPost> = ({
	title,
	description,
	likes,
	dislikes,
	images,
	user,
}) => {
	const { user: currentUser } = useAuth();

	return (
		<div className='w-full flex flex-col items-start gap-3'>
			<User
				name={user.username}
				description={user.full_name}
				avatarProps={{
					src: user.avatar_url || '',
				}}
			/>
			<div className='w-full h-auto rounded-xl border-2 p-5 flex flex-col items-start transition hover:bg-gray-50'>
				<span className='text-xl font-semibold'>{title}</span>
				{description && <p className='text-sm text-gray-500'>{description}</p>}
				<div className='w-full mt-3 flex flex-wrap  gap-3'>
					<PhotoProvider>
						{images?.map(imageUrl => (
							<PhotoView key={imageUrl + Math.random() * 100000} src={imageUrl}>
								<Image
									className='object-cover rounded-xl size-40 cursor-pointer'
									fallbackSrc='https://via.placeholder.com/150'
									src={imageUrl}
								/>
							</PhotoView>
						))}
					</PhotoProvider>
				</div>
			</div>
			<div className='flex items-center '>
				<Button variant='light' color='primary'>
					<SlLike className='size-5' /> {likes}
				</Button>
				<Button variant='light' color='danger'>
					<SlDislike className='size-5' /> {dislikes}
				</Button>
				{currentUser?.id === user.id && (
					<Button variant='light' color='danger'>
						<MdDelete className='size-5' /> Delete
					</Button>
				)}
				{currentUser?.id === user.id && (
					<Button variant='light' color='warning'>
						<MdEdit className='size-5' /> Edit
					</Button>
				)}
			</div>
		</div>
	);
};

export default Post;
