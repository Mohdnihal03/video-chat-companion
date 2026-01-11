import { Mail } from "lucide-react";

export function Footer() {
    return (
        <footer className="w-full py-6 mt-auto border-t border-border/40 bg-background/50 backdrop-blur-sm">
            <div className="container flex flex-col items-center justify-center gap-2 text-center">
                <p className="text-sm font-medium text-foreground/80">
                    Founder : Mohammed Nihal
                </p>
                <a
                    href="mailto:mohd.nihalll03@gmail.com"
                    className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                    <Mail className="w-3 h-3" />
                    mohd.nihalll03@gmail.com
                </a>
            </div>
        </footer>
    );
}
