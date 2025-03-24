import axiosInstance from './axiosService';

const getUsers = async () => {
    const response = await axiosInstance.get('/users');
    return response.data;
};

const updateUserRole = async (userId, roleId) => {
    const response = await axiosInstance.put(`/users/${userId}/role`, { role_id: roleId });
    return response.data;
};

const resetPassword = async (userId, newPassword) => {
    const response = await axiosInstance.put(`/users/${userId}/password`, { new_password: newPassword });
    return response.data;
};

const deleteUser = async (userId) => {
    const response = await axiosInstance.delete(`/users/${userId}`);
    return response.data;
};

export default {
    getUsers,
    updateUserRole,
    resetPassword,
    deleteUser,
};