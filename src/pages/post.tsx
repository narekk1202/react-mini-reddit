import { Button } from '@nextui-org/button';
import { Spinner } from '@nextui-org/react';
import { GoArrowLeft } from 'react-icons/go';
import { useNavigate, useParams } from 'react-router-dom';
import PostCard from '../components/shared/post-card';
import Urls from '../constants/Urls';
import { usePostQuery } from '../services/queries/posts.queries';
import PostCommentsSection from '../components/shared/post-comments-section'

const Post = () => {
	const navigate = useNavigate();
	const params = useParams();
	const { data, isLoading } = usePostQuery(params.id as string, true);

	return (
		<main className='w-full min-h-screen flex flex-col items-center mt-20 p-5'>
			<div className='w-full flex justify-start'>
				<Button
					onClick={() => navigate(Urls.home)}
					isIconOnly
					className='rounded-full'
				>
					<GoArrowLeft className='size-5' />
				</Button>
			</div>

			<div className='w-full h-auto flex flex-col items-center mt-5 px-5'>
				{isLoading || !data ? <Spinner size='lg' /> : <PostCard {...data} />}

				<PostCommentsSection />
			</div>
		</main>
	);
};

export default Post;
