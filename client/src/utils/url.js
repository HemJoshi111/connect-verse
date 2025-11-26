export const baseUrl = import.meta.env.MODE === "development"
    ? "/api"
    : "https://connectverse-backend.onrender.com/api";