
import { useState } from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface VoiceControlsProps {
  isActive: boolean;
  isAISpeaking: boolean;
  loadingVoice: boolean;
  isDebateActive: boolean;
  onToggle: () => Promise<void>;
}

export function VoiceControls({
  isActive,
  isAISpeaking,
  loadingVoice,
  isDebateActive,
  onToggle,
}: VoiceControlsProps) {
  return (
    <div className="flex items-center justify-center space-x-4">
      <Button
        size="lg"
        className={`rounded-full p-8 transition-all duration-500 shadow-lg ${
          isActive
            ? "bg-red-500 hover:bg-red-600 shadow-red-500/50 animate-pulse"
            : "bg-gradient-to-r from-debate to-debate-accent hover:shadow-debate/50"
        }`}
        onClick={onToggle}
        disabled={!isDebateActive || loadingVoice}
      >
        {isActive ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
      </Button>
      <div className="text-center">
        <p className="font-medium text-xl">
          {isActive
            ? "You are speaking - Click to mute"
            : isAISpeaking
            ? "AI is speaking... Click to interrupt"
            : loadingVoice
            ? "Generating AI speech..."
            : isDebateActive
            ? "Click to speak"
            : "Debate has ended"}
        </p>
        {isActive && (
          <div className="flex items-center justify-center space-x-1 mt-2">
            <div className="voice-wave" style={{ animationDelay: "0s" }}></div>
            <div className="voice-wave" style={{ animationDelay: "0.1s" }}></div>
            <div className="voice-wave" style={{ animationDelay: "0.2s" }}></div>
            <div className="voice-wave" style={{ animationDelay: "0.3s" }}></div>
            <div className="voice-wave" style={{ animationDelay: "0.4s" }}></div>
          </div>
        )}
        {isAISpeaking && (
          <div className="flex items-center justify-center space-x-1 mt-2">
            <div
              className="voice-wave"
              style={{ animationDelay: "0s", backgroundColor: "#ff6b35" }}
            ></div>
            <div
              className="voice-wave"
              style={{ animationDelay: "0.1s", backgroundColor: "#ff6b35" }}
            ></div>
            <div
              className="voice-wave"
              style={{ animationDelay: "0.2s", backgroundColor: "#ff6b35" }}
            ></div>
            <div
              className="voice-wave"
              style={{ animationDelay: "0.3s", backgroundColor: "#ff6b35" }}
            ></div>
            <div
              className="voice-wave"
              style={{ animationDelay: "0.4s", backgroundColor: "#ff6b35" }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
}
