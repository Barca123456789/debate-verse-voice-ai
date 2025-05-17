
import { DebateRoom as DebateRoomType, Topic, User } from "@/types";
import { TopicCard } from "./TopicCard";
import { TimerCard } from "./TimerCard";
import { ParticipantsCard } from "./ParticipantsCard";
import { ActionButtons } from "./ActionButtons";
import { ApiKeyModal } from "./ApiKeyModal";

interface SidebarProps {
  room: DebateRoomType;
  opponent: User | null;
  currentUser: User | null;
  currentSpeaker: string | null;
  timeLeft: number;
  isDebateActive: boolean;
  apiKeyModalOpen: boolean;
  elevenlabsApiKey: string;
  onTimeEnd: () => void;
  onEndDebate: () => void;
  onVoiceSettings: () => void;
  onApiKeyChange: (key: string) => void;
  onApiKeySave: () => void;
  onApiKeyModalClose: () => void;
}

export function Sidebar({
  room,
  opponent,
  currentUser,
  currentSpeaker,
  timeLeft,
  isDebateActive,
  apiKeyModalOpen,
  elevenlabsApiKey,
  onTimeEnd,
  onEndDebate,
  onVoiceSettings,
  onApiKeyChange,
  onApiKeySave,
  onApiKeyModalClose,
}: SidebarProps) {
  return (
    <div className="lg:col-span-1 space-y-6">
      {/* Topic Card */}
      <TopicCard topic={room.topic} />

      {/* Timer Card */}
      <TimerCard
        timeLeft={timeLeft}
        isDebateActive={isDebateActive}
        onTimeEnd={onTimeEnd}
      />

      {/* Participants */}
      <ParticipantsCard
        currentUser={currentUser}
        opponent={opponent}
        currentSpeaker={currentSpeaker}
      />

      {/* Action Buttons */}
      <ActionButtons
        isDebateActive={isDebateActive}
        onEndDebate={onEndDebate}
        onVoiceSettings={onVoiceSettings}
      />

      {/* ElevenLabs API Key Dialog */}
      {apiKeyModalOpen && (
        <ApiKeyModal
          apiKey={elevenlabsApiKey}
          onApiKeyChange={onApiKeyChange}
          onSave={onApiKeySave}
          onCancel={onApiKeyModalClose}
        />
      )}
    </div>
  );
}
