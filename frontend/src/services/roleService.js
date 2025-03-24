import axiosInstance from './axiosService';

const getRoles = async () => {
    const response = await axiosInstance.get('/roles');
    return response.data;
};

const createRole = async (role) => {
    const response = await axiosInstance.post('/roles', role);
    return response.data;
};

const updateRolePermissions = async (roleId, permissions) => {
    const response = await axiosInstance.put(`/roles/${roleId}/permissions`, { permissions });
    return response.data;
};

const deleteRole = async (roleId) => {
    const response = await axiosInstance.delete(`/roles/${roleId}`);
    return response.data;
};

export default {
    getRoles,
    createRole,
    updateRolePermissions,
    deleteRole,
};