import { useAuthQuery } from "@/services/auth.service";
import { createContext, useContext, useMemo, useState } from "react";


export const AuthContext = createContext();

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return ctx
}


export const AuthProvider = ({ children }) => {
    const { data: auth, ...rest } = useAuthQuery();

    const value = useMemo(() => ({ auth, ...rest }), [auth, rest]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};