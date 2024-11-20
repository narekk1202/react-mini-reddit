import { Spinner, User } from '@nextui-org/react';
import { FC } from 'react';
import { Tables } from '../../../database.types';
import { useGetPostCommentAuthor } from '../../services/queries/comments.queries';

interface Props {
	comment: Tables<'post_comments'>;
}

const UserComment: FC<Props> = ({ comment }) => {
	const { data: author, isLoading: isAuthorLoading } = useGetPostCommentAuthor(
		comment.user_id as string,
		!!comment.user_id
	);

	return (
		<div className='w-full flex flex-col items-start gap-2 bg-slate-200/50 rounded-xl p-3'>
			{isAuthorLoading ? (
				<Spinner size='sm' />
			) : (
				<User
					name={author?.username || author?.full_name}
					avatarProps={{ src: author?.avatar_url || '' }}
				/>
			)}
			<span className='text-md ml-1'>{comment.comment}</span>
		</div>
	);
};

export default UserComment;
