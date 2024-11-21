import { Button, cn, Spinner, useDisclosure, User } from '@nextui-org/react';
import { FC } from 'react';
import { Tables } from '../../../database.types';
import { useAuth } from '../../providers/auth-provider';
import { useDeletePostCommentMutation } from '../../services/mutations/comments.mutations';
import { useGetPostCommentAuthor } from '../../services/queries/comments.queries';
import YouSureModal from './modals/you-sure-modal';

interface Props {
	replyRef: React.RefObject<HTMLTextAreaElement>;
	comment: Tables<'post_comments'>;
	setComment: (val: string) => void;
}

const UserComment: FC<Props> = ({ comment, replyRef, setComment }) => {
	const { data: author, isLoading: isAuthorLoading } = useGetPostCommentAuthor(
		comment.user_id as string,
		!!comment.user_id
	);

	const { user: currentUser } = useAuth();
	const { mutate: deleteComment, isPending } = useDeletePostCommentMutation();

	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const onClickReply = () => {
		replyRef.current?.focus();
		setComment(`@${author?.username} `);
	};

	return (
		<>
			<div className='w-full flex flex-col items-start gap-2 bg-slate-200/50 rounded-xl p-3'>
				{isAuthorLoading ? (
					<Spinner size='sm' />
				) : (
					<User
						name={author?.username || author?.full_name}
						avatarProps={{ src: author?.avatar_url || '' }}
					/>
				)}
				<span className={cn('text-md ml-1')}>
					{comment.comment?.match(/@(\w+)/) ? (
						<span className='font-semibold text-primary'>
							{comment.comment.match(/@(\w+)/)?.[0]}{' '}
						</span>
					) : null}

					{comment.comment?.replace(/@(\w+)/, '')}
				</span>

				<div className='flex items-center gap-2'>
					<span className='text-xs'>
						{new Date(comment.created_at).toLocaleString('hy-AM')}
					</span>
					{currentUser?.id === comment.user_id && (
						<>
							<span className='text-xs'>You</span>
							<Button
								color='danger'
								onClick={onOpen}
								size='sm'
								className='rounded-full'
							>
								Delete
							</Button>
						</>
					)}
					<Button
						color='primary'
						onClick={onClickReply}
						size='sm'
						className='rounded-full'
					>
						Reply
					</Button>
				</div>
			</div>
			<YouSureModal
				body={'Are you sure you want to delete this comment?'}
				title={'Delete Comment'}
				isOpen={isOpen}
				buttonValue={'Delete'}
				onClick={() => deleteComment(comment.id)}
				onOpenChange={onOpenChange}
				loading={isPending}
			/>
		</>
	);
};

export default UserComment;
