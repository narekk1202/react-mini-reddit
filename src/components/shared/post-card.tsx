import { Button } from '@nextui-org/button';
import { Badge, useDisclosure, User } from '@nextui-org/react';
import { FC } from 'react';
import { FaRegComments } from 'react-icons/fa';
import { MdDelete, MdEdit } from 'react-icons/md';
import { SlDislike, SlLike } from 'react-icons/sl';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import { useLocation, useNavigate } from 'react-router-dom';
import Keywords from '../../constants/Keywords';
import Urls from '../../constants/Urls';
import { useAuth } from '../../providers/auth-provider';
import { CreatePostValidation } from '../../schemas/posts.schema';
import {
	useAddPostReactionMutation,
	useDeletePostMutation,
	useRemovePostReactionMutation,
	useUpdatePostMutation,
} from '../../services/mutations/posts.mutations';
import {
	usePostReactions,
	usePostUserReaction,
} from '../../services/queries/posts.queries';
import { IPost } from '../../types/post.types';
import EditPostModal from './modals/edit-post-modal';
import YouSureModal from './modals/you-sure-modal';

const PostCard: FC<IPost> = ({
	id,
	title,
	description,
	images,
	user,
	total_comments,
}) => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const {
		isOpen: isOpenEdit,
		onOpen: onOpenEdit,
		onOpenChange: onOpenChangeEdit,
	} = useDisclosure();

	const { user: currentUser } = useAuth();
	const { data: reactions } = usePostReactions(id as string);
	const { data: userReaction } = usePostUserReaction(id as string);
	const { mutate: addReaction } = useAddPostReactionMutation(id as string);
	const { mutate: removeReaction } = useRemovePostReactionMutation(
		id as string
	);
	const { mutate: deletePost, isPending } = useDeletePostMutation(onOpenChange);
	const { mutate: updatePost, isPending: isPendingUpdate } =
		useUpdatePostMutation(onOpenChangeEdit);

	const navigate = useNavigate();
	const location = useLocation();

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

	const handleOnUpdate = (data: CreatePostValidation) => {
		updatePost({
			...data,
			user_id: currentUser?.id as string,
			id: id as string,
		});
	};

	return (
		<>
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
					{description && (
						<p className='text-sm text-gray-500'>{description}</p>
					)}
					<div className='w-full mt-3 flex flex-wrap gap-3'>
						<PhotoProvider>
							{images?.map(imageUrl => (
								<PhotoView
									key={imageUrl + Math.random() * 100000}
									src={imageUrl}
								>
									<img
										className='object-cover rounded-xl size-40 cursor-pointer'
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
					{location.pathname === Urls.home && (
						<Badge content={total_comments} shape='circle' color='danger'>
							<Button
								onClick={() => navigate(Urls.post.replace(':id', id as string))}
								radius='full'
								isIconOnly
								aria-label={`more than ${total_comments} comments`}
								variant='light'
							>
								<FaRegComments className='size-5 text-slate-500' />
							</Button>
						</Badge>
					)}

					{currentUser?.id === user.id && (
						<Button
							isIconOnly
							radius='full'
							onClick={onOpen}
							variant='light'
							color='danger'
							className='ml-2'
						>
							<MdDelete className='size-5' />
						</Button>
					)}
					{currentUser?.id === user.id && (
						<Button
							isIconOnly
							radius='full'
							onClick={onOpenEdit}
							variant='light'
							color='warning'
						>
							<MdEdit className='size-5' />
						</Button>
					)}
				</div>
			</div>
			<YouSureModal
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				onClick={() => deletePost(id as string)}
				loading={isPending}
				title='Delete post'
				body='Are you sure you want to delete this post? This action cannot be undone.'
				buttonValue='Delete'
			/>
			<EditPostModal
				isPending={isPendingUpdate}
				handleOnSubmit={handleOnUpdate}
				postId={id as string}
				isOpen={isOpenEdit}
				onOpenChange={onOpenChangeEdit}
			/>
		</>
	);
};

export default PostCard;
