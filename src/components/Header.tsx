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
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
                    Explainify
                </h1>
            </Link>

            {/* Centered Navigation */}
            <nav className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <ul className="flex items-center gap-8 bg-background/50 backdrop-blur-lg px-6 py-2 rounded-full border border-border shadow-lg">
                    <li>
                        <Link
                            to="/"
                            className="text-sm font-medium text-foreground/70 hover:text-foreground transition-all hover:scale-105 block"
                        >
                            Home
                        </Link>
                    </li>
                    <li>
                        <div className="w-px h-4 bg-border" />
                    </li>
                    <li>
                        <Link
                            to="/canvas"
                            className="text-sm font-medium text-foreground/70 hover:text-foreground transition-all hover:scale-105 block"
                        >
                            Canvas
                        </Link>
                    </li>
                </ul>
            </nav>

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
