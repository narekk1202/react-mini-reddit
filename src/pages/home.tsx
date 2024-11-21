import { Button } from '@nextui-org/button';
import { Spinner, useDisclosure } from '@nextui-org/react';
import { RiPlayListAddFill } from 'react-icons/ri';
import { TablesInsert } from '../../database.types';
import CreatePostModal from '../components/shared/modals/create-post-modal';
import PostCard from '../components/shared/post-card';
import { useAuth } from '../providers/auth-provider';
import { CreatePostValidation } from '../schemas/posts.schema';
import { useCreatePostMutation } from '../services/mutations/posts.mutations';
import { usePostsQuery } from '../services/queries/posts.queries';

const Home = () => {
	const { user } = useAuth();
	const { data: posts, isLoading } = usePostsQuery();
	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const { mutate, isPending } = useCreatePostMutation(onOpenChange);

	const handleOnSubmit = (data: CreatePostValidation) => {
		const sendData: TablesInsert<'posts'> = {
			created_at: new Date().toISOString(),
			description: data.description,
			images:
				data.images && data.images?.length > 0
					? data.images?.filter(val => val !== '')
					: null,
			title: data.title,
			user_id: user?.id as string,
		};
		mutate(sendData);
	};

	return (
		<main className='w-full min-h-screen flex flex-col items-center p-5 mt-20'>
			<div className='w-full flex justify-between items-center'>
				<p className='font-semibold text-3xl'>Posts</p>

				<Button color='primary' onClick={onOpen}>
					<RiPlayListAddFill size={20} /> Create Post
				</Button>
			</div>

			<div className='w-full flex flex-col items-center mt-5 gap-5'>
				{isLoading ? (
					<Spinner color='primary' size='lg' />
				) : posts && posts.length > 0 ? (
					posts.map(post => <PostCard key={post.id} {...post} />)
				) : (
					<span className='text-2xl font-medium'>
						No posts found, create one 😊
					</span>
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
