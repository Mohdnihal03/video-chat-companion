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
        "flex gap-4 animate-slide-up group",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-transform group-hover:scale-110",
          isUser
            ? "bg-gradient-to-br from-primary to-purple-600 text-white"
            : "bg-gradient-to-br from-emerald-400 to-cyan-500 text-white"
        )}
      >
        {isUser ? (
          <User className="w-4 h-4" />
        ) : (
          <Sparkles className="w-4 h-4" />
        )}
      </div>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-5 py-3.5 shadow-sm",
          isUser
            ? "bg-gradient-to-br from-primary to-purple-600 text-white rounded-tr-sm"
            : "bg-card border border-border/50 text-card-foreground rounded-tl-sm"
        )}
      >
        <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
};
