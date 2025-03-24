import axiosInstance from './axiosService';

const getPermissions = async () => {
    const response = await axiosInstance.get('/permissions');
    return response.data;
};

export default {
    getPermissions,
};