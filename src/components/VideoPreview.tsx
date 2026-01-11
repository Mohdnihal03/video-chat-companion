import { extractVideoId } from "@/lib/youtube";

interface VideoPreviewProps {
  url: string;
}

export const VideoPreview = ({ url }: VideoPreviewProps) => {
  const videoId = extractVideoId(url);

  if (!videoId) return null;

  return (
    <div className="glass-card overflow-hidden animate-fade-in">
      <div className="aspect-video">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    </div>
  );
};
