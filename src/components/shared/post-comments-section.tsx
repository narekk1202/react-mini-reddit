import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Button } from '@nextui-org/button';
import { Textarea } from '@nextui-org/input';
import { Spinner } from '@nextui-org/react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../providers/auth-provider';
import { useCreatePostCommentMutation } from '../../services/mutations/comments.mutations';
import { useGetPostComments } from '../../services/queries/comments.queries';
import UserComment from './user-comment';

const PostCommentsSection = () => {
	const [comment, setComment] = useState('');

	const params = useParams();
	const { data: comments, isLoading } = useGetPostComments(params.id as string);
	const { mutate: addComment, isPending } =
		useCreatePostCommentMutation(setComment);
	const { user } = useAuth();

	const [parent] = useAutoAnimate();

	const handleAddComment = () => {
		addComment({
			comment,
			post_id: params.id as string,
			user_id: user?.id,
		});
	};

	return (
		<div className='mt-5 w-full h-auto flex flex-col items-start gap-3 bg-slate-50 p-3 rounded-xl'>
			<div className='w-full flex items-center gap-2'>
				<Textarea
					color='primary'
					placeholder='Add a comment'
					className='rounded-full min-h-[10px]'
					disableAutosize
					value={comment}
					onChange={e => setComment(e.target.value)}
				/>
				<Button
					isDisabled={!comment}
					onClick={handleAddComment}
					isLoading={isPending}
					color='primary'
					className='rounded-full'
					size='lg'
				>
					Post
				</Button>
			</div>

			<div
				ref={parent}
				className='w-full h-auto flex flex-col items-start gap-5 mt-5'
			>
				{isLoading ? (
					<Spinner size='lg' />
				) : comments?.length === 0 ? (
					<p className='text-md font-medium'>No comments yet, be the first 😎</p>
				) : (
					comments?.map(comment => (
						<UserComment key={comment.id} comment={comment} />
					))
				)}
			</div>
		</div>
	);
};

export default PostCommentsSection;
