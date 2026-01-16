import { Header } from "@/components/Header";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen w-full bg-background">
            <Header />
            <main className="flex-1 pt-20 overflow-hidden">
                {children}
            </main>
            <Toaster />
            <Sonner />
        </div>
    );
}
