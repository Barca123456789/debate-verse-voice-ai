
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface ApiKeyModalProps {
  apiKey: string;
  onApiKeyChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function ApiKeyModal({
  apiKey,
  onApiKeyChange,
  onSave,
  onCancel,
}: ApiKeyModalProps) {
  return (
    <Card className="mt-4 backdrop-blur-md bg-white/10 border-2 border-white/20 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">
          ElevenLabs API Settings
        </CardTitle>
        <CardDescription className="text-white/80">
          Enter your API key for more natural AI voice
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="api-key" className="text-white">
            ElevenLabs API Key
          </Label>
          <div className="flex gap-2">
            <input
              id="api-key"
              type="password"
              className="w-full p-2 border bg-black/30 border-white/30 rounded-md text-white"
              value={apiKey}
              onChange={(e) => onApiKeyChange(e.target.value)}
              placeholder="Enter your API key"
            />
          </div>
          <p className="text-xs text-white/70">
            Get your API key from{" "}
            <a
              href="https://elevenlabs.io/speech-synthesis"
              target="_blank"
              rel="noopener noreferrer"
              className="text-debate-accent hover:underline"
            >
              ElevenLabs
            </a>
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-white/30 text-white hover:bg-white/20"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-debate hover:bg-debate/90"
            size="sm"
            onClick={onSave}
            disabled={!apiKey}
          >
            Save API Key
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
