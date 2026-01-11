import { User, Sparkles, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  role: "user" | "model";
  content: string;
}

export const ChatMessage = ({ role, content }: ChatMessageProps) => {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 md:gap-4 animate-slide-up group",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3",
          isUser
            ? "bg-gradient-to-br from-primary via-primary to-purple-600 text-white ring-2 ring-primary/20"
            : "bg-gradient-to-br from-emerald-400 to-cyan-500 text-white ring-2 ring-emerald-400/20"
        )}
      >
        {isUser ? (
          <User className="w-4 h-4 md:w-5 md:h-5" />
        ) : (
          <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
        )}
      </div>
      <div
        className={cn(
          "max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 md:px-6 md:py-4 shadow-sm transition-all duration-300",
          isUser
            ? "bg-gradient-to-br from-primary to-purple-600 text-white rounded-tr-none shadow-primary/10 hover:shadow-primary/20"
            : "bg-card/50 backdrop-blur-md border border-border/50 text-card-foreground rounded-tl-none hover:border-primary/30 hover:shadow-md"
        )}
      >
        <p className="text-sm md:text-[15px] leading-relaxed whitespace-pre-wrap font-medium">
          {content}
        </p>
      </div>
    </div>
  );
};
