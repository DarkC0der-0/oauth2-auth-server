import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography, Button, Select, MenuItem } from '@mui/material';
import userService from '../services/userService';
import roleService from '../services/roleService';

const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const result = await userService.getUsers();
            setUsers(result);
        };
        const fetchRoles = async () => {
            const result = await roleService.getRoles();
            setRoles(result);
        };
        fetchUsers();
        fetchRoles();
    }, []);

    const handleRoleChange = async (userId, roleId) => {
        await userService.updateUserRole(userId, roleId);
        const updatedUsers = users.map(user => user.id === userId ? { ...user, role_id: roleId } : user);
        setUsers(updatedUsers);
    };

    return (
        <Paper>
            <Typography variant="h6" gutterBottom>
                Users
            </Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Username</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Role</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.id}</TableCell>
                            <TableCell>{user.username}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                                <Select
                                    value={user.role_id}
                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                >
                                    {roles.map((role) => (
                                        <MenuItem key={role.id} value={role.id}>
                                            {role.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
};

export default UserTable;