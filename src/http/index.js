import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  //   baseURL: "http://localhost:5500",
  //   withCredentials: true,
  headers: {
    "content-type": "application/json",
    Accept: "application/json",
  },
});

// Listing all of the endpoints
// data contains only the phone
export const sendOtp = (data) => {
  return api.post("/api/send-otp", data);
};

// The data in verifyOtp request contain the phone, otp and hash
export const verifyOtp = (data) => {
  return api.post("/api/verify-otp", data);
};

export default api;

// A error can come with saying that cors not accessible something this is a standard error so add cors in the backend or use proxy in the frontend whatever  of your choice

// one error is coming because of my nodemon server is creshed so it take my time
// one more error of can't set headers is coming because i did not return from the function i simply write the res.send or res.json which is wrong so use the return res.json or return res.send

// .env file written also did not work out so i have to restart my react APP
