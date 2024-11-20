import { Button } from '@nextui-org/button';
import { Spinner, useDisclosure } from '@nextui-org/react';
import { RiPlayListAddFill } from 'react-icons/ri';
import { TablesInsert } from '../../database.types';
import CreatePostModal from '../components/shared/create-post-modal';
import Post from '../components/shared/post';
import { useAuth } from '../providers/auth-provider';
import { CreatePostValidation } from '../schemas/posts.schema';
import { useCreatePostMutation } from '../services/mutations/posts.mutations';
import { usePostsQuery } from '../services/queries/posts.queries';

const Home = () => {
	const { data: posts, isLoading } = usePostsQuery();
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const { user } = useAuth();

	const { mutate, isPending } = useCreatePostMutation(onOpenChange);

	const handleOnSubmit = (data: CreatePostValidation) => {
		const sendData: TablesInsert<'posts'> = {
			created_at: new Date().toISOString(),
			description: data.description,
			images: data.images || null,
			title: data.title,
			user_id: user?.id as string,
		};
		mutate(sendData);
	};

	return (
		<main className='w-full min-h-screen flex flex-col items-center p-5 mt-16'>
			<div className='w-full flex justify-between items-center'>
				<p className='font-semibold text-3xl'>Posts</p>

				<Button color='primary' onClick={onOpen}>
					<RiPlayListAddFill size={20} /> Create Post
				</Button>
			</div>

			<div className='w-full flex flex-col items-center mt-5 gap-5'>
				{isLoading ? (
					<Spinner color='primary' size='lg' />
				) : (
					posts?.map(post => <Post key={post.id} {...post} />)
				)}
			</div>

			<CreatePostModal
				isOpen={isOpen}
				isPending={isPending}
				onOpenChange={onOpenChange}
				handleOnSubmit={handleOnSubmit}
			/>
		</main>
	);
};

export default Home;
