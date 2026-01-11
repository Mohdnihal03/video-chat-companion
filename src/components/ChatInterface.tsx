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
    <div className="flex flex-col h-full bg-background/30 backdrop-blur-sm relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[100px] animate-pulse-soft" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/5 blur-[100px] animate-pulse-soft" style={{ animationDelay: "1s" }} />
      </div>

      <ScrollArea className="flex-1 relative z-10" ref={scrollRef}>
        <div className="p-4 md:p-8 lg:p-10">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-10 animate-fade-in max-w-2xl mx-auto">
              <div className="space-y-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse-soft" />
                  <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-gradient-to-br from-primary via-primary to-purple-600 flex items-center justify-center mx-auto shadow-2xl ring-1 ring-white/20 animate-float">
                    <MessageSquare className="w-10 h-10 md:w-12 md:h-12 text-white" />
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
                    How can I help you?
                  </h3>
                  <p className="text-muted-foreground text-lg md:text-xl max-w-md mx-auto leading-relaxed">
                    Ask anything about the video content. I'll analyze it and provide precise answers.
                  </p>
                </div>
              </div>

              <div className="w-full max-w-lg space-y-4">
                <div className="flex items-center gap-3 px-2">
                  <div className="h-px flex-1 bg-border/50" />
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                    Quick Suggestions
                  </p>
                  <div className="h-px flex-1 bg-border/50" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SUGGESTED_QUESTIONS.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => onSendMessage(question)}
                      className="text-left px-5 py-4 rounded-2xl bg-card/40 hover:bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 text-sm font-medium text-foreground/70 hover:text-primary flex items-center justify-between group shadow-sm hover:shadow-md hover:-translate-y-0.5"
                    >
                      <span className="line-clamp-1">{question}</span>
                      <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 text-primary scale-75 group-hover:scale-100" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8 max-w-4xl mx-auto pb-10">
              {messages.map((message, index) => (
                <ChatMessage key={index} role={message.role} content={message.content} />
              ))}
              {isLoading && (
                <div className="flex gap-4 animate-fade-in">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg ring-2 ring-emerald-400/20">
                    <Sparkles className="w-5 h-5 text-white animate-pulse" />
                  </div>
                  <div className="bg-card/50 backdrop-blur-md border border-border/50 rounded-2xl rounded-tl-none px-6 py-4 shadow-sm flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 md:p-8 lg:p-10 pt-2 bg-gradient-to-t from-background via-background/80 to-transparent relative z-20">
        <ChatInput onSend={onSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};
