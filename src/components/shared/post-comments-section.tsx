import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Button } from '@nextui-org/button';
import { Textarea } from '@nextui-org/input';
import { Spinner } from '@nextui-org/react';
import { useRef, useState } from 'react';
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
	const replyRef = useRef<HTMLTextAreaElement>(null);

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
					ref={replyRef}
					color='primary'
					placeholder='Add a comment'
					className='rounded-full min-h-[10px]'
					onKeyDown={e => {
						if (
							e.key === 'Backspace' &&
							comment.startsWith('@') &&
							comment.endsWith(' ')
						) {
							setComment('');
						}
					}}
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
					<div className='w-full items-center justify-center mt-2'>
						<Spinner size='lg' />
					</div>
				) : comments?.length === 0 ? (
					<p className='text-md font-medium'>
						No comments yet, be the first 😎
					</p>
				) : (
					comments?.map(comment => (
						<UserComment
							key={comment.id}
							comment={comment}
							replyRef={replyRef}
							setComment={setComment}
						/>
					))
				)}
			</div>
		</div>
	);
};

export default PostCommentsSection;
