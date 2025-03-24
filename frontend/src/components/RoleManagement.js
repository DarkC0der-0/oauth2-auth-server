import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Select, MenuItem } from '@mui/material';
import roleService from '../services/roleService';
import permissionService from '../services/permissionService';

const RoleManagement = () => {
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [editingRole, setEditingRole] = useState(null);

    useEffect(() => {
        fetchRoles();
        fetchPermissions();
    }, []);

    const fetchRoles = async () => {
        const result = await roleService.getRoles();
        setRoles(result);
    };

    const fetchPermissions = async () => {
        const result = await permissionService.getPermissions();
        setPermissions(result);
    };

    const handleOpen = (role = null) => {
        setEditingRole(role);
        if (role) {
            setName(role.name);
            setDescription(role.description);
            setSelectedPermissions(role.permissions.map(p => p.id));
        } else {
            setName('');
            setDescription('');
            setSelectedPermissions([]);
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = async () => {
        if (editingRole) {
            await roleService.updateRolePermissions(editingRole.id, selectedPermissions);
            await fetchRoles();
        } else {
            await roleService.createRole({ name, description, permissions: selectedPermissions });
            await fetchRoles();
        }
        handleClose();
    };

    const handleDelete = async (roleId) => {
        await roleService.deleteRole(roleId);
        await fetchRoles();
    };

    return (
        <Container>
            <Typography variant="h6" gutterBottom>
                Role Management
            </Typography>
            <Button variant="contained" color="primary" onClick={() => handleOpen()}>
                Add Role
            </Button>
            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Permissions</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {roles.map((role) => (
                            <TableRow key={role.id}>
                                <TableCell>{role.id}</TableCell>
                                <TableCell>{role.name}</TableCell>
                                <TableCell>{role.description}</TableCell>
                                <TableCell>{role.permissions.map(p => p.name).join(', ')}</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="primary" onClick={() => handleOpen(role)}>
                                        Edit
                                    </Button>
                                    <Button variant="contained" color="secondary" onClick={() => handleDelete(role.id)}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{editingRole ? 'Edit Role' : 'Add Role'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Name"
                        fullWidth
                        margin="normal"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        label="Description"
                        fullWidth
                        margin="normal"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <Select
                        multiple
                        value={selectedPermissions}
                        onChange={(e) => setSelectedPermissions(e.target.value)}
                        fullWidth
                    >
                        {permissions.map((permission) => (
                            <MenuItem key={permission.id} value={permission.id}>
                                {permission.name}
                            </MenuItem>
                        ))}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default RoleManagement;