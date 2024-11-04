import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../UserContext';

const ProtectedRoute = ({ children }) => {
  const { userProfile } = useUser();
  return userProfile ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
