import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useHistory } from 'react-router-dom';

const Navbar = () => {
    const history = useHistory();

    const handleLogout = () => {
        // Handle logout logic here
        history.push('/login');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    User Management System
                </Typography>
                <Button color="inherit" onClick={handleLogout}>
                    Logout
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;