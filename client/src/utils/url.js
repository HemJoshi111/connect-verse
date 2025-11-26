export const baseUrl = import.meta.env.MODE === "development"
    ? "/api"
    : "https://connect-verse-agkg.onrender.com/api";