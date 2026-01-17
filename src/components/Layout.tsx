import { Header } from "@/components/Header";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <main className="min-h-screen w-full bg-background">
                {children}
            </main>
            <Toaster />
            <Sonner />
        </>
    );
}
