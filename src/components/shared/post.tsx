import { Button } from '@nextui-org/button';
import { Image, User } from '@nextui-org/react';
import { FC } from 'react';
import { MdDelete, MdEdit } from 'react-icons/md';
import { SlDislike, SlLike } from 'react-icons/sl';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import Keywords from '../../constants/Keywords';
import { useAuth } from '../../providers/auth-provider';
import {
	useAddPostReactionMutation,
	useRemovePostReactionMutation,
} from '../../services/mutations/posts.mutations';
import {
	usePostReactions,
	usePostUserReaction,
} from '../../services/queries/posts.queries';
import { IPost } from '../../types/post.types';

const Post: FC<IPost> = ({ id, title, description, images, user }) => {
	const { user: currentUser } = useAuth();
	const { data: reactions } = usePostReactions(id);
	const { data: userReaction } = usePostUserReaction(id);
	const { mutate: addReaction } = useAddPostReactionMutation(id);
	const { mutate: removeReaction } = useRemovePostReactionMutation(id);

	const handleLike = () => {
		if (userReaction === Keywords.like) {
			removeReaction();
		} else {
			addReaction(Keywords.like);
		}
	};

	const handleDislike = () => {
		if (userReaction === Keywords.dislike) {
			removeReaction();
		} else {
			addReaction(Keywords.dislike);
		}
	};

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
			<div className='flex items-center gap-2'>
				<Button
					onClick={handleLike}
					variant={userReaction === Keywords.like ? 'flat' : 'light'}
					color='primary'
				>
					<SlLike className='size-5' /> {reactions?.likes || 0}
				</Button>
				<Button
					onClick={handleDislike}
					variant={userReaction === Keywords.dislike ? 'flat' : 'light'}
					color='danger'
				>
					<SlDislike className='size-5' /> {reactions?.dislikes || 0}
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
