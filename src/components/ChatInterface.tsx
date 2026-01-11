import { useRef, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "model";
  content: string;
}

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const SUGGESTED_QUESTIONS = [
  "Summarize the main points",
  "What is the conclusion?",
  "Explain the key concepts",
  "List the action items",
];

export const ChatInterface = ({
  messages,
  onSendMessage,
  isLoading,
}: ChatInterfaceProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-background/50 backdrop-blur-sm">
      <ScrollArea className="flex-1 p-4 md:p-6" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-fade-in">
            <div className="space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center mx-auto mb-6 shadow-inner ring-1 ring-white/10">
                <MessageSquare className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                Start a conversation
              </h3>
              <p className="text-muted-foreground text-base leading-relaxed">
                Ask questions about the video content. The AI will find relevant
                information and provide accurate answers.
              </p>
            </div>

            <div className="w-full max-w-md space-y-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Suggested Questions
              </p>
              <div className="grid grid-cols-1 gap-2">
                {SUGGESTED_QUESTIONS.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => onSendMessage(question)}
                    className="text-left px-4 py-3 rounded-xl bg-secondary/50 hover:bg-secondary border border-transparent hover:border-primary/20 transition-all duration-200 text-sm text-foreground/80 hover:text-foreground flex items-center justify-between group"
                  >
                    {question}
                    <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto pb-4">
            {messages.map((message, index) => (
              <ChatMessage key={index} role={message.role} content={message.content} />
            ))}
            {isLoading && (
              <div className="flex gap-4 animate-fade-in">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-sm">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="bg-card border border-border/50 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" />
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>
      <div className="p-4 md:p-6 pt-2 bg-gradient-to-t from-background via-background to-transparent">
        <ChatInput onSend={onSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};
