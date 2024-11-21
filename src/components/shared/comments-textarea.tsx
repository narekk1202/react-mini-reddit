import { Button } from '@nextui-org/button';
import { Textarea } from '@nextui-org/input';
import { FC } from 'react';

interface Props {
	comment: string;
	isPending: boolean;
	setComment: (val: string) => void;
	handleAddComment: () => void;
	replyRef: React.RefObject<HTMLTextAreaElement>;
}

const CommentsTextArea: FC<Props> = ({
	replyRef,
	comment,
	setComment,
	handleAddComment,
	isPending,
}) => {
	return (
		<div className='w-full flex items-center gap-2 max-[550px]:flex-col'>
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
				className='rounded-full max-[550px]:w-full'
				size='lg'
			>
				Post
			</Button>
		</div>
	);
};

export default CommentsTextArea;
