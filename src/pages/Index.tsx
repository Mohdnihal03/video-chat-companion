import { useState } from "react";
import { VideoInput } from "@/components/VideoInput";
import { VideoPreview } from "@/components/VideoPreview";
import { ChatInterface } from "@/components/ChatInterface";
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
      <div className="min-h-screen flex items-center justify-center p-6">
        <VideoInput onSubmit={handleVideoSubmit} isLoading={isProcessing} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar with video */}
      <div className="lg:w-[400px] xl:w-[480px] flex-shrink-0 p-4 lg:p-6 border-b lg:border-b-0 lg:border-r border-border">
        <div className="space-y-4">
          <Button variant="ghost" size="sm" onClick={handleReset} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            New Video
          </Button>
          <VideoPreview url={videoUrl} />
          <div className="glass-card p-4">
            <p className="text-xs text-muted-foreground mb-1">Video ID</p>
            <p className="font-mono text-sm truncate">{videoId}</p>
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-h-0 lg:min-h-screen">
        <ChatInterface
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isChatLoading}
        />
      </div>
    </div>
  );
};

export default Index;
