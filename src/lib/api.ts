import { EnhancedAnswerResponse, VideoMetadata, ChatMessage } from "./types";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

interface TranscriptResponse {
  success: boolean;
  video_id: string;
  transcript: string;
  title?: string;
}

interface AskResponse {
  success: boolean;
  answer: string;
  context: Array<{
    text: string;
    metadata: { chunk_id: number };
  }>;
}

export const processVideo = async (url: string): Promise<TranscriptResponse> => {
  const response = await fetch(`${API_BASE}/transcript`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    throw new Error("Failed to process video");
  }

  return response.json();
};

export const askQuestion = async (
  question: string,
  videoId: string,
  chatHistory: ChatMessage[]
): Promise<AskResponse> => {
  const response = await fetch(`${API_BASE}/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question,
      video_id: videoId,
      n_results: 5,
      chat_history: chatHistory,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to get answer");
  }

  return response.json();
};

export const getTranscript = async (videoId: string): Promise<TranscriptResponse> => {
  const response = await fetch(`${API_BASE}/transcript/${videoId}`);

  if (!response.ok) {
    throw new Error("Failed to get transcript");
  }

  return response.json();
};

/**
 * Enhanced ask function with citations and multi-video support
 * @param question - User's question
 * @param videoId - Specific video ID or null for multi-video search
 * @param nResults - Number of results to return (default: 5)
 * @param chatHistory - Previous chat messages for context
 * @returns Enhanced answer with citations
 */
// export const askEnhanced = async (
//   question: string,
//   videoId: string | null = null,
//   nResults: number = 5,
//   chatHistory: ChatMessage[] = []
// ): Promise<EnhancedAnswerResponse> => {
//   const response = await fetch(`${API_BASE}/ask/enhanced`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       question,
//       video_id: videoId,
//       n_results: nResults,
//       chat_history: chatHistory,
//     }),
//   });

//   if (!response.ok) {
//     throw new Error("Failed to get enhanced answer");
//   }

//   return response.json();
// };

/**
 * Get list of all processed videos
 * @returns Array of video metadata
 */
export const getVideoList = async (): Promise<VideoMetadata[]> => {
  const response = await fetch(`${API_BASE}/videos`);

  if (!response.ok) {
    throw new Error("Failed to get video list");
  }

  const data = await response.json();
  return data.videos || [];
};
