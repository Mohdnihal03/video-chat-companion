import { LoginCredentials, SignupCredentials, AuthResponse, User } from "@/lib/types";

// Base URL handling - use Vite proxy in development
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export const authApi = {
    async signup(data: SignupCredentials): Promise<AuthResponse> {
        const response = await fetch(`${BASE_URL}/auth/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: "Signup failed" }));
            throw new Error(error.message || "Signup failed");
        }

        return response.json();
    },

    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        try {

            // IMPORTANT: specific requirement for application/x-www-form-urlencoded
            const formData = new URLSearchParams();
            formData.append("username", credentials.email); // Map email to username as required
            formData.append("password", credentials.password);

            const response = await fetch(`${BASE_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: formData,
            });


            if (!response.ok) {
                const error = await response.json().catch(() => ({ message: "Login failed" }));
                throw new Error(error.message || "Login failed");
            }

            return await response.json();
        } catch (error) {
            console.error("Login API error:", error);
            throw error;
        }
    },

    async getMe(token: string): Promise<User> {
        const response = await fetch(`${BASE_URL}/users/me`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch user profile");
        }

        return response.json();
    },
};
