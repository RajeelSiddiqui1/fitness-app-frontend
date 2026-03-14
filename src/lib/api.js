import { axiosInstance } from "./axios.js";

export const register = async (registerData) => {
    const response = await axiosInstance.post("/auth/resgiter", registerData)
    return response.data
}