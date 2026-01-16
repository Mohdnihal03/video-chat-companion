import { Link, useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserMenu } from "@/components/UserMenu";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

export function Header() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-md border-b border-border/40">
            <Link to="/" className="flex items-center gap-2">
                <img
                    src="/Explainify.png"
                    alt="Explainify Logo"
                    className="w-8 h-8 object-contain"
                />
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                    Explainify
                </h1>
            </Link>
            <div className="flex items-center gap-4">
                <ThemeToggle />
                {isAuthenticated ? (
                    <UserMenu />
                ) : (
                    <Button onClick={() => navigate("/auth")}>Sign In</Button>
                )}
            </div>
        </header>
    );
}
