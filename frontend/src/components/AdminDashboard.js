import React from 'react';
import { Container, Typography } from '@mui/material';
import UserManagement from './UserManagement';
import RoleManagement from './RoleManagement';
import UserProfile from './UserProfile';
import Navbar from './Navbar';

const AdminDashboard = () => {
    return (
        <div>
            <Navbar />
            <Container>
                <Typography variant="h3" gutterBottom>
                    Admin Dashboard
                </Typography>
                <UserProfile />
                <UserManagement />
                <RoleManagement />
            </Container>
        </div>
    );
};

export default AdminDashboard;