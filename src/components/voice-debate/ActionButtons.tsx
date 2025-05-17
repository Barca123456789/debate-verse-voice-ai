
import { Button } from "@/components/ui/button";
import { StopCircle, Volume2 } from "lucide-react";

interface ActionButtonsProps {
  isDebateActive: boolean;
  onEndDebate: () => void;
  onVoiceSettings: () => void;
}

export function ActionButtons({
  isDebateActive,
  onEndDebate,
  onVoiceSettings,
}: ActionButtonsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Button
        variant="outline"
        className="backdrop-blur-md bg-red-500/20 border-2 border-red-500/50 text-white hover:bg-red-500/40"
        onClick={onEndDebate}
        disabled={!isDebateActive}
      >
        <StopCircle className="mr-2 h-4 w-4" />
        End Debate
      </Button>

      <Button
        variant="outline"
        className="backdrop-blur-md bg-debate/20 border-2 border-debate/50 text-white hover:bg-debate/40"
        onClick={onVoiceSettings}
      >
        <Volume2 className="mr-2 h-4 w-4" />
        Voice Settings
      </Button>
    </div>
  );
}
