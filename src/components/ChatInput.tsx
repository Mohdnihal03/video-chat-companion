import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const ChatInput = ({ onSend, isLoading, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSend(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto w-full group">
      <div className="relative flex items-end gap-2 p-2 bg-card/40 backdrop-blur-2xl border border-border/50 rounded-[2rem] shadow-2xl transition-all duration-500 focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/10 group-hover:border-border/80">
        <Textarea
          placeholder="Ask anything about the video..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || isLoading}
          className="min-h-[56px] max-h-40 resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base md:text-lg placeholder:text-muted-foreground/40 py-4 px-6 rounded-2xl transition-all duration-300"
          rows={1}
        />
        <Button
          type="submit"
          size="icon"
          disabled={!message.trim() || isLoading || disabled}
          className="h-12 w-12 rounded-2xl shrink-0 transition-all duration-500 bg-gradient-to-br from-primary via-primary to-purple-600 hover:shadow-[0_0_20px_rgba(var(--primary),0.4)] hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 [&_svg]:size-6 shadow-xl relative overflow-hidden group/btn"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
          {isLoading ? (
            <Loader2 className="animate-spin text-white relative z-10" />
          ) : (
            <Send className="text-white relative z-10 group-hover/btn:rotate-12 transition-transform duration-300" />
          )}
        </Button>
      </div>
    </form>
  );
};
