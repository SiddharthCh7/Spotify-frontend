import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const axiosInstance = axios.create({
	baseURL: import.meta.env.MODE === "development" ? "http://localhost:5001/api" : process.env.SERVER_URL,
});
