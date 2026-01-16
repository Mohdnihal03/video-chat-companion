import React, { createContext, useContext, useState, useEffect } from "react";
import { User, LoginCredentials, SignupCredentials } from "@/lib/types";
import { authApi } from "@/lib/auth-api";
import { toast } from "sonner";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    signup: (data: SignupCredentials) => Promise<void>;
    logout: () => void;
    updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize auth state
    useEffect(() => {
        const checkAuth = async () => {
            // ... existing code ...
        };

        checkAuth();
    }, []);

    const login = async (credentials: LoginCredentials) => {
        // ... existing code ...
    };

    const signup = async (data: SignupCredentials) => {
        // ... existing code ...
    };

    const logout = () => {
        // ... existing code ...
    };

    const updateUser = (updates: Partial<User>) => {
        if (user) {
            setUser({ ...user, ...updates });
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                signup,
                logout,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
