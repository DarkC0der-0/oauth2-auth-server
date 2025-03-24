import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography } from '@mui/material';
import roleService from '../services/roleService';

const RoleTable = () => {
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        const fetchRoles = async () => {
            const result = await roleService.getRoles();
            setRoles(result.data);
        };
        fetchRoles();
    }, []);

    return (
        <Paper>
            <Typography variant="h6" gutterBottom>
                Roles
            </Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Description</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {roles.map((role) => (
                        <TableRow key={role.id}>
                            <TableCell>{role.id}</TableCell>
                            <TableCell>{role.name}</TableCell>
                            <TableCell>{role.description}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
};

export default RoleTable;