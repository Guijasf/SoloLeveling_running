import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

function PrivateRoute({ children }) {
  const authContext = React.useContext(AuthContext);

  if (!authContext) {
    return <Navigate to="/" />;
  }

  const { token } = authContext;

  if (!token) {
    return <Navigate to="/" />;
  }

  return children;
}

export default PrivateRoute;
