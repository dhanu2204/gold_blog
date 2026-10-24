import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
    const token = localStorage.getItem('jwttoken');
    const role = localStorage.getItem('userRole');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (role !== 'ROLE_ADMIN') {
        return <Navigate to="/home" replace />;
    }

    return children;
};

export default AdminRoute;
