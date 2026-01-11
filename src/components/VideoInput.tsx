import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Youtube, Loader2, Sparkles } from "lucide-react";

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
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6 glow-effect">
          <Youtube className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-3 tracking-tight">
          <span className="gradient-text">Talk to</span> Your Videos
        </h1>
        <p className="text-muted-foreground text-lg">
          Paste a YouTube URL and start asking questions
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="glass-card p-2 flex gap-2">
          <Input
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base placeholder:text-muted-foreground/50"
            disabled={isLoading}
          />
          <Button type="submit" disabled={!url.trim() || isLoading} size="lg">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Analyze
              </>
            )}
          </Button>
        </div>
      </form>

      <div className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary/50" />
          <span>AI-Powered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary/50" />
          <span>Instant Answers</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary/50" />
          <span>Context Aware</span>
        </div>
      </div>
    </div>
  );
};
