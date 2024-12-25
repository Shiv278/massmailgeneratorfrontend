import axios from 'axios';

const API_URL = 'http://localhost:8080/send-email';

export const sendEmail = async (emailData) => {
    try {
        const response = await axios.post(API_URL, emailData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};