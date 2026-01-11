import { useState } from "react";
import { VideoInput } from "@/components/VideoInput";
import { VideoPreview } from "@/components/VideoPreview";
import { ChatInterface } from "@/components/ChatInterface";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { processVideo, askQuestion } from "@/lib/api";
import { extractVideoId } from "@/lib/youtube";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface Message {
  role: "user" | "model";
  content: string;
}

const Index = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();

  const handleVideoSubmit = async (url: string) => {
    setIsProcessing(true);
    try {
      const result = await processVideo(url);
      if (result.success) {
        setVideoUrl(url);
        setVideoId(result.video_id);
        toast({
          title: "Video processed!",
          description: "You can now ask questions about the video.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process video. Please check the URL and try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!videoId) return;

    const userMessage: Message = { role: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);
    setIsChatLoading(true);

    try {
      const result = await askQuestion(message, videoId, messages);
      if (result.success) {
        const aiMessage: Message = { role: "model", content: result.answer };
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get answer. Please try again.",
        variant: "destructive",
      });
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleReset = () => {
    setVideoUrl("");
    setVideoId(null);
    setMessages([]);
  };

  if (!videoId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <Header />

        {/* Background effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px] animate-pulse-soft" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px] animate-pulse-soft" style={{ animationDelay: "1s" }} />
        </div>

        <div className="relative z-10 w-full max-w-2xl space-y-8 text-center animate-fade-in">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 animate-text-reveal inline-block">
                EXPLAINIFY AI
              </span>
            </h1>
            <p className="text-2xl md:text-3xl font-medium text-foreground/80 animate-fade-in mb-4">
              Chat with your Videos
            </p>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Transform any YouTube video into an interactive conversation.
              Get summaries, ask questions, and learn faster.
            </p>
          </div>

          <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <VideoInput onSubmit={handleVideoSubmit} isLoading={isProcessing} />
          </div>
        </div>

        <div className="absolute bottom-0 w-full z-20">
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pt-[72px] bg-background">
      <Header />

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Sidebar with video */}
        <aside className="w-full lg:w-[400px] xl:w-[450px] flex-shrink-0 border-b lg:border-b-0 lg:border-r border-border/50 bg-card/30 backdrop-blur-md overflow-y-auto">
          <div className="p-4 lg:p-6 space-y-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="gap-2 hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              New Video
            </Button>

            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                <VideoPreview url={videoUrl} />
              </div>

              <div className="glass-card p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Video ID</p>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <p className="font-mono text-xs truncate opacity-70">{videoId}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Chat area */}
        <section className="flex-1 flex flex-col min-h-0 bg-background/50 relative">
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isChatLoading}
          />
        </section>
      </main>

      <footer className="py-3 text-center border-t border-border/50 bg-card/30 backdrop-blur-md">
        <p className="text-xs text-muted-foreground">
          Founder{" "}
          <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
            @Mohammed Nihal
          </span>
        </p>
      </footer>
    </div>
  );
};

export default Index;
