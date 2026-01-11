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
      {/* Hero Section */}
      <div className="text-center mb-10">
        {/* Animated Logo */}
        <div className="relative inline-flex items-center justify-center mb-8">
          <div className="absolute inset-0 w-20 h-20 rounded-2xl bg-primary/20 animate-glow-pulse blur-xl" />
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center animate-float shadow-2xl">
            <Youtube className="w-10 h-10 text-primary-foreground" />
          </div>
        </div>

        {/* Brand Name with Reveal Animation */}
        <div className="overflow-hidden mb-4">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight animate-text-reveal">
            <span className="inline-block bg-gradient-to-r from-primary via-red-400 to-primary bg-[length:200%_auto] animate-shimmer bg-clip-text text-transparent">
              EXPLAINIFY
            </span>
            <span className="text-foreground ml-2">AI</span>
          </h1>
        </div>

        {/* Tagline */}
        <p className="text-xl text-muted-foreground animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'backwards' }}>
          Talk to your videos. Get instant answers.
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4 animate-slide-up" style={{ animationDelay: '0.4s', animationFillMode: 'backwards' }}>
        <div className="glass-card p-2 flex gap-2 transition-all duration-300 hover:border-primary/30 focus-within:border-primary/50 focus-within:shadow-lg focus-within:shadow-primary/10">
          <Input
            type="url"
            placeholder="Paste a YouTube URL to get started..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base placeholder:text-muted-foreground/50 h-12"
            disabled={isLoading}
          />
          <Button type="submit" disabled={!url.trim() || isLoading} size="lg" className="h-12 px-6 font-semibold">
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

      {/* Feature Pills */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'backwards' }}>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 text-sm text-muted-foreground transition-all duration-300 hover:bg-secondary hover:text-foreground hover:border-primary/30 animate-bounce-subtle" style={{ animationDelay: '0s' }}>
          <Brain className="w-4 h-4 text-primary" />
          <span>AI-Powered Analysis</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 text-sm text-muted-foreground transition-all duration-300 hover:bg-secondary hover:text-foreground hover:border-primary/30 animate-bounce-subtle" style={{ animationDelay: '0.2s' }}>
          <Zap className="w-4 h-4 text-primary" />
          <span>Instant Answers</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 text-sm text-muted-foreground transition-all duration-300 hover:bg-secondary hover:text-foreground hover:border-primary/30 animate-bounce-subtle" style={{ animationDelay: '0.4s' }}>
          <MessageSquare className="w-4 h-4 text-primary" />
          <span>Conversational</span>
        </div>
      </div>
    </div>
  );
};
