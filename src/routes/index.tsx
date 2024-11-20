import { createBrowserRouter } from 'react-router-dom';
import PrivateRoute from '../components/shared/private-route';
import Urls from '../constants/Urls';
import RootLayout from '../layout';
import Home from '../pages/home';
import SignIn from '../pages/sign-in';
import SignUp from '../pages/sign-up';

export const router = createBrowserRouter([
	{
		path: Urls.signIn,
		element: <SignIn />,
	},
	{
		path: Urls.signUp,
		element: <SignUp />,
	},
	{
		element: <RootLayout />,
		children: [
			{
				path: Urls.home,
				element: (
					<PrivateRoute>
						<Home />
					</PrivateRoute>
				),
			},
		],
	},
]);
