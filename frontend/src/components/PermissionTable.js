import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography } from '@mui/material';
import permissionService from '../services/permissionService';

const PermissionTable = () => {
    const [permissions, setPermissions] = useState([]);

    useEffect(() => {
        const fetchPermissions = async () => {
            const result = await permissionService.getPermissions();
            setPermissions(result.data);
        };
        fetchPermissions();
    }, []);

    return (
        <Paper>
            <Typography variant="h6" gutterBottom>
                Permissions
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
                    {permissions.map((permission) => (
                        <TableRow key={permission.id}>
                            <TableCell>{permission.id}</TableCell>
                            <TableCell>{permission.name}</TableCell>
                            <TableCell>{permission.description}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
};

export default PermissionTable;