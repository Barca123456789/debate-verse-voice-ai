
import { AIFeedback } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VoiceControls } from "./VoiceControls";
import { DebateTranscript } from "./DebateTranscript";
import { AiFeedbackList } from "./AiFeedbackList";

interface MainContentProps {
  transcript: string[];
  feedback: AIFeedback[];
  isMicActive: boolean;
  isAISpeaking: boolean;
  loadingVoice: boolean;
  isDebateActive: boolean;
  currentSpeaker: string | null;
  onToggleMic: () => Promise<void>;
}

export function MainContent({
  transcript,
  feedback,
  isMicActive,
  isAISpeaking,
  loadingVoice,
  isDebateActive,
  currentSpeaker,
  onToggleMic,
}: MainContentProps) {
  return (
    <div className="lg:col-span-3 space-y-6">
      {/* Voice Controls */}
      <Card className="backdrop-blur-md bg-white/10 border-2 border-white/20 text-white shadow-lg">
        <CardContent className="py-6">
          <VoiceControls
            isActive={isMicActive}
            isAISpeaking={isAISpeaking}
            loadingVoice={loadingVoice}
            isDebateActive={isDebateActive}
            onToggle={onToggleMic}
          />
        </CardContent>
      </Card>

      <Tabs
        defaultValue="transcript"
        className="backdrop-blur-md bg-white/10 border-2 border-white/20 text-white rounded-md shadow-lg overflow-hidden"
      >
        <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-debate/30 to-transparent border-b border-white/20">
          <TabsTrigger
            value="transcript"
            className="text-white data-[state=active]:text-white data-[state=active]:bg-debate/30"
          >
            Transcript
          </TabsTrigger>
          <TabsTrigger
            value="feedback"
            className="text-white data-[state=active]:text-white data-[state=active]:bg-debate/30"
          >
            AI Feedback
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transcript" className="mt-0">
          <Card className="h-[60vh] bg-transparent border-0 shadow-none">
            <CardContent className="p-6 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              <DebateTranscript transcript={transcript} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="mt-0">
          <Card className="h-[60vh] bg-transparent border-0 shadow-none">
            <CardContent className="p-6 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              <AiFeedbackList feedback={feedback} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
