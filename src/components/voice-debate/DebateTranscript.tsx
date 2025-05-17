
import { useEffect, useRef } from "react";

interface DebateTranscriptProps {
  transcript: string[];
}

export function DebateTranscript({ transcript }: DebateTranscriptProps) {
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll effect for transcript
  useEffect(() => {
    if (transcriptEndRef.current) {
      transcriptEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [transcript]);

  return (
    <div className="space-y-4">
      {transcript.map((line, index) => {
        const [speaker, ...contentParts] = line.split(": ");
        const content = contentParts.join(": ");

        return (
          <div
            key={index}
            className="space-y-1 backdrop-blur-sm bg-black/30 p-3 rounded-lg border-l-4 border-transparent transition-all hover:border-l-4 hover:border-debate"
          >
            <div className="flex items-center">
              <span
                className={`font-semibold ${
                  speaker === "AI Moderator"
                    ? "text-debate-accent"
                    : speaker === "AI Opponent"
                    ? "text-blue-400"
                    : "text-green-400"
                }`}
              >
                {speaker}:
              </span>
            </div>
            <p className="pl-4">{content}</p>
          </div>
        );
      })}
      <div ref={transcriptEndRef} />
    </div>
  );
}
