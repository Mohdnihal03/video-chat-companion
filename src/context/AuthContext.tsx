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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize auth state
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                const userData = await authApi.getMe(token);
                setUser(userData);
            } catch (error) {
                console.error("Auth check failed:", error);
                localStorage.removeItem("accessToken");
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (credentials: LoginCredentials) => {
        try {
            const response = await authApi.login(credentials);
            localStorage.setItem("accessToken", response.access_token);

            // Fetch user profile immediately after login
            const userData = await authApi.getMe(response.access_token);
            setUser(userData);

            toast.success("Welcome back!", {
                description: "You have successfully logged in.",
            });
        } catch (error) {
            console.error("Login error:", error);
            toast.error("Login failed", {
                description: error instanceof Error ? error.message : "Please check your credentials",
            });
            throw error;
        }
    };

    const signup = async (data: SignupCredentials) => {
        try {
            await authApi.signup(data);
            // Auto-login or just notify? Requirement says "Success toast". 
            // Usually signup doesn't return token immediately in some APIs, but often it does. 
            // The prompt description implies we might just notify or we might need to login.
            // Since the prompt description for Signup endpoint doesn't explicitly say it returns a token (unlike Login),
            // we'll assume we need to redirect to login or auto-login if possible. 
            // However, usually flows redirect to login. Let's just notify for now.

            toast.success("Account created successfully", {
                description: "You can now log in with your credentials.",
            });

        } catch (error) {
            console.error("Signup error:", error);
            toast.error("Signup failed", {
                description: error instanceof Error ? error.message : "Could not create account",
            });
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        setUser(null);
        toast.message("Logged out", {
            description: "Come back soon!",
        });
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
