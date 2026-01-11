const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

interface TranscriptResponse {
  success: boolean;
  video_id: string;
  transcript: string;
}

interface ChatMessage {
  role: "user" | "model";
  content: string;
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
