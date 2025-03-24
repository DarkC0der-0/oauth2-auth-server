import axiosInstance from './axiosService';

const getMfaStatus = async () => {
    const response = await axiosInstance.get('/mfa/status');
    return response.data;
};

const enableMfa = async () => {
    const response = await axiosInstance.post('/mfa/enable');
    return response.data;
};

const verifyOtp = async (otp) => {
    const response = await axiosInstance.post('/mfa/verify', { otp });
    return response.data;
};

const disableMfa = async () => {
    const response = await axiosInstance.post('/mfa/disable');
    return response.data;
};

export default {
    getMfaStatus,
    enableMfa,
    verifyOtp,
    disableMfa,
};