import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Youtube, Loader2, Sparkles, Zap, Brain, MessageSquare } from "lucide-react";

interface VideoInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export const VideoInput = ({ onSubmit, isLoading }: VideoInputProps) => {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
        <div className="relative flex items-center gap-2 p-2 bg-background/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl">
          <div className="pl-4 text-muted-foreground">
            <Youtube className="w-5 h-5" />
          </div>
          <Input
            type="url"
            placeholder="Paste a YouTube URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-lg placeholder:text-muted-foreground/50 h-14"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={!url.trim() || isLoading}
            size="lg"
            className="h-12 px-8 font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all duration-300"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Analyze
              </>
            )}
          </Button>
        </div>
      </form>

      <div className="mt-8 flex justify-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-500" />
          <span>Instant Analysis</span>
        </div>
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-purple-500" />
          <span>Smart Summaries</span>
        </div>
      </div>
    </div>
  );
};
