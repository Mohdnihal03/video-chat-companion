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
    <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto w-full">
      <div className="relative flex items-end gap-2 p-2 bg-background/80 backdrop-blur-xl border border-border/50 rounded-3xl shadow-lg transition-all duration-300 focus-within:shadow-xl focus-within:border-primary/20 focus-within:ring-1 focus-within:ring-primary/20">
        <Textarea
          placeholder="Ask anything about the video..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || isLoading}
          className="min-h-[48px] max-h-32 resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base placeholder:text-muted-foreground/50 py-3 px-4 rounded-2xl"
          rows={1}
        />
        <Button
          type="submit"
          size="icon"
          disabled={!message.trim() || isLoading || disabled}
          className="h-10 w-10 rounded-full shrink-0 transition-all duration-300 bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 [&_svg]:size-5 shadow-md hover:shadow-lg"
        >
          {isLoading ? (
            <Loader2 className="animate-spin text-white" />
          ) : (
            <Send className="text-white" />
          )}
        </Button>
      </div>
    </form>
  );
};
