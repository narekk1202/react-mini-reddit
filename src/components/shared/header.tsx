import { Button, Image, Spinner, useDisclosure, User } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { CiSettings } from 'react-icons/ci';
import { LuLogOut } from 'react-icons/lu';
import { Link } from 'react-router-dom';
import Urls from '../../constants/Urls';
import { useAuth } from '../../providers/auth-provider';
import { useAuthMeQuery } from '../../services/queries/user.queries';
import { checkImageAvailability } from '../../utils/check-url';
import YouSureModal from './modals/you-sure-modal';
import UserEditModal from './modals/user-edit-modal';

const Header = () => {
	const { user: currentUser } = useAuth();
	const { data: user, isLoading } = useAuthMeQuery(currentUser?.id || '');
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const {
		isOpen: isLogoutOpen,
		onOpen: onLogoutOpen,
		onOpenChange: onLogoutOpenChange,
	} = useDisclosure();
	const { signOut } = useAuth();

	const [isImageAvailable, setIsImageAvailable] = useState(false);

	useEffect(() => {
		const verifyImage = async () => {
			if (user?.avatar_url) {
				const isAvailable = await checkImageAvailability(user.avatar_url);
				setIsImageAvailable(isAvailable);
			}
		};

		verifyImage();
	}, [user?.avatar_url]);

	return (
		<>
			<header className='w-full h-auto flex items-center justify-between fixed top-0 z-[50] border-b p-3 bg-white'>
				<Link to={Urls.home} className='w-auto h-auto flex items-center gap-2'>
					<Image className='size-16' src='/logo.png' alt='logo' />
					<span className='font-semibold text-xl'>RedditC</span>
				</Link>

				<div className='w-auto flex items-center gap-3'>
					{!isLoading ? (
						<User
							name={user?.full_name}
							description={user?.username}
							avatarProps={{
								src: isImageAvailable ? user?.avatar_url : undefined,
							}}
						/>
					) : (
						<Spinner />
					)}
					<CiSettings
						onClick={onOpen}
						className='size-6 transition hover:text-primary cursor-pointer'
					/>

					<Button
						isIconOnly
						variant='bordered'
						color='primary'
						onClick={onLogoutOpen}
					>
						<LuLogOut />
					</Button>
				</div>
			</header>
			<UserEditModal isOpen={isOpen} onOpenChange={onOpenChange} />
			<YouSureModal
				title='Sign Out'
				buttonValue='Sign Out'
				body='Are you sure you want to sign out?'
				onClick={signOut}
				isOpen={isLogoutOpen}
				onOpenChange={onLogoutOpenChange}
			/>
		</>
	);
};

export default Header;
