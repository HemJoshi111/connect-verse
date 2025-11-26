import { createContext, useContext, useState, useEffect } from 'react';

// 1. Create the Context (The empty box)
export const AuthContext = createContext();

// 2. Create a Custom Hook (The Receiver)
// This makes it easy for components to "tune in" to the data
export const useAuthContext = () => {
    return useContext(AuthContext);
};

// 3. Create the Provider (The Broadcasting Station)
export const AuthContextProvider = ({ children }) => {
    // State to hold the current logged-in user
    // We initialize it by checking localStorage immediately
    const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem('user')) || null);


    return (
        // We wrap "children" (the whole app) with this Provider.
        // "value" is the data we are broadcasting.
        <AuthContext.Provider value={{ authUser, setAuthUser }}>
            {children}
        </AuthContext.Provider>
    );
};