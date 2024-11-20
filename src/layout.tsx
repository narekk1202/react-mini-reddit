import { Outlet } from 'react-router-dom';
import Header from './components/shared/header';

const RootLayout = () => {
	return (
		<main className='w-full min-h-screen flex items-center flex-col'>
			<Header />
			<Outlet />
		</main>
	);
};

export default RootLayout;
