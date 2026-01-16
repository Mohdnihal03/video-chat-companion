import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            setShowModal(true);
        }
    }, [isLoading, isAuthenticated]);

    const handleLoginRedirect = () => {
        navigate("/auth");
    };

    const handleCancel = () => {
        navigate("/"); // Go back home if they cancel
    };

    if (isLoading) {
        return <div>Loading...</div>; // Or a nice spinner
    }

    if (!isAuthenticated) {
        return (
            <AlertDialog open={showModal} onOpenChange={setShowModal}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Authentication Required</AlertDialogTitle>
                        <AlertDialogDescription>
                            You need to be signed in to access this feature. Please log in or create an account to continue.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleLoginRedirect}>
                            Sign In
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        );
    }

    return <>{children}</>;
}
