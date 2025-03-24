import axiosInstance from './axiosService';

const login = async (email, password) => {
    const response = await axiosInstance.post('/token', { email, password });
    if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
    }
    return response.data;
};

const logout = () => {
    localStorage.removeItem('token');
};

export default {
    login,
    logout,
};