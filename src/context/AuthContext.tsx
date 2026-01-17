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
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const userData = await authApi.getMe(token);
                    setUser(userData);
                } catch (error) {
                    localStorage.removeItem("token");
                }
            }
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (credentials: LoginCredentials) => {
        try {
            const response = await authApi.login(credentials);
            localStorage.setItem("token", response.access_token);
            const userData = await authApi.getMe(response.access_token);
            setUser(userData);
            toast.success("Logged in successfully!");
        } catch (error: any) {
            toast.error(error.message || "Login failed");
            throw error;
        }
    };

    const signup = async (data: SignupCredentials) => {
        try {
            const response = await authApi.signup(data);
            localStorage.setItem("token", response.access_token);
            const userData = await authApi.getMe(response.access_token);
            setUser(userData);
            toast.success("Account created successfully!");
        } catch (error: any) {
            toast.error(error.message || "Signup failed");
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        toast.success("Logged out successfully");
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
