import React, { useEffect, useState } from 'react';
import { Container, Typography } from '@mui/material';
import userService from '../services/userService';
import MfaManagement from './MfaManagement';

const UserProfile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        const result = await userService.getUserProfile();
        setUser(result);
    };

    if (!user) {
        return null;
    }

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                User Profile
            </Typography>
            <Typography variant="body1">Username: {user.username}</Typography>
            <Typography variant="body1">Email: {user.email}</Typography>
            <MfaManagement />
        </Container>
    );
};

export default UserProfile;