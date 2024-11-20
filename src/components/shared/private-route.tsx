import React from 'react';
import { Navigate } from 'react-router-dom';
import Urls from '../../constants/Urls';
import { useAuth } from '../../providers/auth-provider';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
	const { session } = useAuth();

	if (!session) {
		return <Navigate to={Urls.signIn} replace />;
	}

	return children;
};

export default PrivateRoute;
