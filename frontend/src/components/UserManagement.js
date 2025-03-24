import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem } from '@mui/material';
import userService from '../services/userService';
import roleService from '../services/roleService';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [openEdit, setOpenEdit] = useState(false);
    const [openReset, setOpenReset] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newRoleId, setNewRoleId] = useState('');
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, []);

    const fetchUsers = async () => {
        const result = await userService.getUsers();
        setUsers(result);
    };

    const fetchRoles = async () => {
        const result = await roleService.getRoles();
        setRoles(result);
    };

    const handleOpenEdit = (user) => {
        setSelectedUser(user);
        setNewRoleId(user.role_id);
        setOpenEdit(true);
    };

    const handleCloseEdit = () => {
        setOpenEdit(false);
        setSelectedUser(null);
    };

    const handleOpenReset = (user) => {
        setSelectedUser(user);
        setOpenReset(true);
    };

    const handleCloseReset = () => {
        setOpenReset(false);
        setSelectedUser(null);
    };

    const handleSaveRole = async () => {
        await userService.updateUserRole(selectedUser.id, newRoleId);
        fetchUsers();
        handleCloseEdit();
    };

    const handleResetPassword = async () => {
        await userService.resetPassword(selectedUser.id, newPassword);
        handleCloseReset();
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            await userService.deleteUser(userId);
            fetchUsers();
        }
    };

    return (
        <Container>
            <Typography variant="h6" gutterBottom>
                User Management
            </Typography>
            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="primary" onClick={() => handleOpenEdit(user)}>
                                        Edit Role
                                    </Button>
                                    <Button variant="contained" color="secondary" onClick={() => handleOpenReset(user)}>
                                        Reset Password
                                    </Button>
                                    <Button variant="contained" color="error" onClick={() => handleDeleteUser(user.id)}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
            <Dialog open={openEdit} onClose={handleCloseEdit}>
                <DialogTitle>Edit User Role</DialogTitle>
                <DialogContent>
                    <Select
                        value={newRoleId}
                        onChange={(e) => setNewRoleId(e.target.value)}
                        fullWidth
                    >
                        {roles.map((role) => (
                            <MenuItem key={role.id} value={role.id}>
                                {role.name}
                            </MenuItem>
                        ))}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEdit} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSaveRole} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openReset} onClose={handleCloseReset}>
                <DialogTitle>Reset User Password</DialogTitle>
                <DialogContent>
                    <TextField
                        label="New Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseReset} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleResetPassword} color="primary">
                        Reset
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default UserManagement;