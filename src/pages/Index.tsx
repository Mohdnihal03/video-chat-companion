import { useState, useEffect } from "react";
import { VideoInput } from "@/components/VideoInput";
import { VideoPreview } from "@/components/VideoPreview";
import { ChatInterface } from "@/components/ChatInterface";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { VideoLibrary } from "@/components/VideoLibrary";
import { MultiVideoToggle } from "@/components/MultiVideoToggle";
import { processVideo, getVideoList, askQuestion } from "@/lib/api";
import { extractVideoId } from "@/lib/youtube";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { VideoMetadata, Citation } from "@/lib/types";

interface Message {
  role: "user" | "model";
  content: string;
  citations?: Citation[];
}

const Index = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [videos, setVideos] = useState<VideoMetadata[]>([]);
  const [isMultiVideoMode, setIsMultiVideoMode] = useState(false);
  const [showVideoInput, setShowVideoInput] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();

  // Load video list on mount
  useEffect(() => {
    loadVideoList();
  }, []);

  const loadVideoList = async () => {
    try {
      const videoList = await getVideoList();
      console.log('📹 Loaded videos:', videoList);
      console.log('📊 Video count:', videoList.length);
      setVideos(videoList);
    } catch (error) {
      console.error("❌ Failed to load video list:", error);
    }
  };

  const handleVideoSubmit = async (url: string) => {
    setIsProcessing(true);
    try {
      const result = await processVideo(url);
      if (result.success) {
        setVideoUrl(url);
        setVideoId(result.video_id);
        setShowVideoInput(false);

        // Refresh video list
        await loadVideoList();

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
    if (!videoId && !isMultiVideoMode) return;

    const userMessage: Message = { role: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);
    setIsChatLoading(true);

    try {
      // Use null for multi-video mode, specific videoId for single video
      // const targetVideoId = isMultiVideoMode ? null : videoId;

      // Enhanced API Disabled (Coming Soon)
      // const result = await askEnhanced(message, targetVideoId, 5, messages);

      if (isMultiVideoMode) {
        toast({
          title: "Coming Soon",
          description: "Multi-video chat is coming soon!",
        });
        setIsChatLoading(false);
        return;
      }

      // Fallback to standard API
      if (!videoId) return;
      const result = await askQuestion(message, videoId, messages);

      if (result.success) {
        const aiMessage: Message = {
          role: "model",
          content: result.answer,
          // citations: result.citations // Standard API doesn't return full citations yet
        };
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
    setIsMultiVideoMode(false);
    setShowVideoInput(false);
  };

  const handleSelectVideo = (selectedVideoId: string) => {
    console.log('🎬 Selecting video:', selectedVideoId);
    const selectedVideo = videos.find(v => v.video_id === selectedVideoId);
    console.log('📼 Found video:', selectedVideo);

    if (selectedVideo) {
      setVideoId(selectedVideoId);

      // If URL is not provided, construct it from video_id
      const url = selectedVideo.url || `https://www.youtube.com/watch?v=${selectedVideoId}`;
      console.log('🔗 Setting URL:', url);
      setVideoUrl(url);

      setMessages([]);
      setIsMultiVideoMode(false);
    } else {
      console.error('❌ Video not found in library:', selectedVideoId);
    }
  };

  const handleDeleteVideo = async (videoIdToDelete: string) => {
    // TODO: Implement backend delete endpoint
    toast({
      title: "Delete not implemented",
      description: "Video deletion will be available once the backend endpoint is ready.",
      variant: "default",
    });
  };

  const handleAddNewVideo = () => {
    setShowVideoInput(true);
  };

  // Debug: Log current state
  console.log('🎯 Current state:', {
    videoId,
    videosCount: videos.length,
    showVideoInput,
    shouldShowLibrary: !videoId && videos.length > 0 && !showVideoInput
  });

  // Show video library if videos exist but no video is selected
  if (!videoId && videos.length > 0 && !showVideoInput) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <Header />

        {/* Background effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px] animate-pulse-soft" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px] animate-pulse-soft" style={{ animationDelay: "1s" }} />
        </div>

        <div className="relative z-10 w-full max-w-3xl space-y-6 animate-fade-in">
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                Your Video Library
              </span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Select a video to start chatting or add a new one
            </p>
          </div>

          <VideoLibrary
            videos={videos}
            currentVideoId={videoId}
            onSelectVideo={handleSelectVideo}
            onDeleteVideo={handleDeleteVideo}
          />

          <Button
            onClick={handleAddNewVideo}
            className="w-full gap-2"
            size="lg"
          >
            <Plus className="w-5 h-5" />
            Add New Video
          </Button>
        </div>

        <div className="absolute bottom-0 w-full z-20">
          <Footer />
        </div>
      </div>
    );
  }

  // Show video input form
  if (!videoId || showVideoInput) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <Header />

        {/* Background effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px] animate-pulse-soft" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px] animate-pulse-soft" style={{ animationDelay: "1s" }} />

          {/* Animated Logo Background - Multiple instances for better coverage */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.08]">
            <img
              src="/Explainify.png"
              alt=""
              className="w-[600px] h-[600px] object-contain animate-pulse-soft"
            />
          </div>

          {/* Top right corner logo */}
          <div className="absolute top-10 right-10 opacity-[0.06] rotate-12">
            <img
              src="/Explainify.png"
              alt=""
              className="w-32 h-32 object-contain animate-pulse-soft"
              style={{ animationDelay: "0.5s" }}
            />
          </div>

          {/* Bottom left corner logo */}
          <div className="absolute bottom-10 left-10 opacity-[0.06] -rotate-12">
            <img
              src="/Explainify.png"
              alt=""
              className="w-32 h-32 object-contain animate-pulse-soft"
              style={{ animationDelay: "1.5s" }}
            />
          </div>
        </div>

        <div className="relative z-10 w-full max-w-2xl space-y-8 text-center animate-fade-in">
          {videos.length > 0 && (
            <Button
              variant="ghost"
              onClick={() => setShowVideoInput(false)}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Library
            </Button>
          )}

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

  // If we reach here, we should show the chat interface
  console.log('💬 Rendering chat interface with:', { videoId, videoUrl });

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

              {/* Multi-Video Toggle */}
              {videos.length > 1 && (
                <MultiVideoToggle
                  isMultiVideoMode={isMultiVideoMode}
                  onToggle={setIsMultiVideoMode}
                  videoCount={videos.length}
                />
              )}
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
