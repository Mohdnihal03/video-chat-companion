// Timestamp range for video citations
export interface TimestampRange {
    start: number;
    end: number;
    formatted: string; // "MM:SS – MM:SS"
}

// Citation with video source and timestamp
export interface Citation {
    video_id: string;
    video_title: string;
    text: string;
    timestamp_range: TimestampRange;
    relevance_score: number;
}

// Enhanced answer response from /ask/enhanced
export interface EnhancedAnswerResponse {
    success: boolean;
    answer: string;
    citations: Citation[];
    error?: string;
}

// Video metadata for library management
export interface VideoMetadata {
    video_id: string;
    title: string;
    url: string;
    thumbnail?: string;
    duration?: number;
    processed_at: string;
}

// Chat message interface
export interface ChatMessage {
    role: "user" | "model";
    content: string;
    citations?: Citation[];
}

// Auth Types
export interface User {
    id: number;
    email: string;
    full_name: string;
    created_at: string;
    avatar?: string;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
}

export interface LoginCredentials {
    email: string; // Used as username in form data
    password: string;
}

export interface SignupCredentials {
    email: string;
    password: string;
    full_name: string;
}
