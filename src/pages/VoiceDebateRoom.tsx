
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { User } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

// Custom Hooks
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import { useAudioSpeech } from "@/hooks/useAudioSpeech";
import { useDebateManager } from "@/hooks/useDebateManager";

// UI Components
import { Sidebar } from "@/components/voice-debate/Sidebar";
import { MainContent } from "@/components/voice-debate/MainContent";
import { ConfirmDialog } from "@/components/voice-debate/ConfirmDialog";
import { DebateResultDialog } from "@/components/voice-debate/DebateResultDialog";

const VoiceDebateRoom = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // State for voice settings
  const [elevenlabsApiKey, setElevenlabsApiKey] = useState<string>("");
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  
  // State for dialogs
  const [endDialogOpen, setEndDialogOpen] = useState(false);
  const [debateResultOpen, setDebateResultOpen] = useState(false);
  const [leaveConfirmOpen, setLeaveConfirmOpen] = useState(false);
  
  // Current speaker tracking
  const [currentSpeaker, setCurrentSpeaker] = useState<string | null>(null);
  
  // Initialize custom hooks
  const debate = useDebateManager(roomId, user as User);
  
  const speech = useAudioSpeech({
    onSpeechEnd: () => {
      setCurrentSpeaker(null);
    }
  });
  
  const voice = useVoiceRecognition({
    onFinalTranscript: (transcript) => {
      // Update the displayed transcript
      debate.addTranscript(user?.username || "You", transcript);
      
      // Simulate AI moderator evaluation after user speaks
      if (Math.random() > 0.7) {
        setTimeout(() => {
          const aiEvaluation = "That's an interesting point. Remember to provide evidence to support your claims.";
          debate.addTranscript("AI Moderator", aiEvaluation);
          
          // Create a feedback item for the user
          debate.addFeedback({
            id: `feedback-${Date.now()}`,
            userId: user?.id || "current-user",
            username: user?.username || "You",
            score: 7.2,
            feedback: "Good articulation of points with clear structure.",
            strengths: ["Eloquent delivery", "Logical flow", "Clear stance"],
            improvements: ["Add more supporting evidence", "Address counterarguments more directly"],
            timestamp: new Date().toISOString()
          });
        }, 800);
      }
      
      // Simulate opponent response after the user speaks
      setTimeout(() => {
        handleOpponentResponse();
      }, 1500);
    },
    onError: (error) => {
      console.error("Speech recognition error", error);
    }
  });

  // Start AI with opening statement
  useEffect(() => {
    if (!debate.isLoading && debate.room && debate.isDebateActive) {
      // Mock AI speech after a delay
      const openingTimeout = setTimeout(() => {
        handleAISpeech(debate.getOpponentOpeningStatement(), true);
      }, 2000);
      
      return () => clearTimeout(openingTimeout);
    }
  }, [debate.isLoading, debate.room]);

  const toggleMicrophone = async () => {
    if (!voice.recognition) return;
    
    if (!voice.isMicActive) {
      // If AI is speaking, interrupt
      if (speech.isAISpeaking) {
        speech.stopSpeech();
      }
      
      const success = await voice.toggleMicrophone();
      if (success) {
        setCurrentSpeaker(user?.id || "user");
      }
    } else {
      voice.toggleMicrophone();
      setCurrentSpeaker(null);
    }
  };

  const handleAISpeech = async (text: string, isOpening = false) => {
    setCurrentSpeaker("ai");
    speech.setIsAISpeaking(true);
    speech.setLoadingVoice(true);
    
    // Add the AI's speech to the transcript
    debate.addTranscript("AI Opponent", text);
    
    const apiKey = elevenlabsApiKey || localStorage.getItem("elevenlabsApiKey");
    await speech.handleSpeech(text, apiKey || undefined);
    
    // If this was the opening statement, add an AI moderator prompt after a delay
    if (isOpening) {
      setTimeout(() => {
        debate.addTranscript("AI Moderator", "Now it's your turn. Click the microphone button to respond.");
      }, 500);
    }
  };

  const handleOpponentResponse = () => {
    const randomResponse = debate.getOpponentResponse();
    handleAISpeech(randomResponse);
    
    // Generate AI feedback for opponent
    if (debate.opponent) {
      debate.generateAIFeedback(
        debate.opponent.id || "opponent", 
        debate.opponent.username || "Opponent"
      );
    }
  };

  const saveElevenlabsApiKey = () => {
    if (elevenlabsApiKey) {
      localStorage.setItem("elevenlabsApiKey", elevenlabsApiKey);
      setApiKeyModalOpen(false);
      toast({
        title: "API Key Saved",
        description: "Your ElevenLabs API key has been saved.",
      });
    }
  };
  
  const confirmEndDebate = () => {
    setEndDialogOpen(false);
    
    if (voice.isMicActive) {
      voice.recognition.stop();
      voice.setIsMicActive(false);
    }
    
    if (speech.isAISpeaking) {
      speech.stopSpeech();
    }
    
    setCurrentSpeaker(null);
    debate.handleDebateEnd();
    
    // Show debate result dialog after delay
    setTimeout(() => {
      setDebateResultOpen(true);
    }, 2000);
  };

  const handleLeaveRoom = () => {
    if (debate.isDebateActive) {
      setLeaveConfirmOpen(true);
    } else {
      navigate('/dashboard');
    }
  };

  const confirmLeave = () => {
    setLeaveConfirmOpen(false);
    navigate('/dashboard');
  };

  if (debate.isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]" 
           style={{
             backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${debate.backgroundImage})`,
             backgroundSize: 'cover',
             backgroundPosition: 'center'
           }}>
        <div className="flex flex-col items-center bg-white/10 backdrop-blur-lg p-10 rounded-xl">
          <div className="w-16 h-16 border-4 border-debate-light border-t-debate rounded-full animate-spin"></div>
          <p className="mt-4 text-white font-medium text-xl">Loading voice debate room...</p>
        </div>
      </div>
    );
  }

  if (!debate.room) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]"
           style={{
             backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${debate.backgroundImage})`,
             backgroundSize: 'cover',
             backgroundPosition: 'center'
           }}>
        <div className="text-center bg-white/10 backdrop-blur-lg p-10 rounded-xl">
          <h2 className="text-3xl font-bold mb-2 text-white">Room Not Found</h2>
          <p className="text-white/80 mb-8 text-lg">
            The debate room you're looking for doesn't exist or has ended.
          </p>
          <Button className="debate-button text-lg px-6 py-3" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="py-6 px-4 min-h-[90vh]"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65)), url(${debate.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Voice Debate Room</h1>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              className="border-2 border-white/30 text-white hover:bg-white/20 hover:text-white"
              onClick={handleLeaveRoom}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Leave Room
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <Sidebar
            room={debate.room}
            opponent={debate.opponent}
            currentUser={user as User}
            currentSpeaker={currentSpeaker}
            timeLeft={debate.timeLeft}
            isDebateActive={debate.isDebateActive}
            apiKeyModalOpen={apiKeyModalOpen}
            elevenlabsApiKey={elevenlabsApiKey}
            onTimeEnd={debate.handleDebateEnd}
            onEndDebate={() => setEndDialogOpen(true)} 
            onVoiceSettings={() => setApiKeyModalOpen(!apiKeyModalOpen)}
            onApiKeyChange={(key) => setElevenlabsApiKey(key)}
            onApiKeySave={saveElevenlabsApiKey}
            onApiKeyModalClose={() => setApiKeyModalOpen(false)}
          />
          
          {/* Main Content */}
          <MainContent
            transcript={debate.transcript}
            feedback={debate.feedback}
            isMicActive={voice.isMicActive}
            isAISpeaking={speech.isAISpeaking}
            loadingVoice={speech.loadingVoice}
            isDebateActive={debate.isDebateActive}
            currentSpeaker={currentSpeaker}
            onToggleMic={toggleMicrophone}
          />
        </div>
      </div>
      
      {/* End Debate Confirmation Dialog */}
      <ConfirmDialog
        open={endDialogOpen}
        onOpenChange={setEndDialogOpen}
        title="End Debate?"
        description="Are you sure you want to end this debate? The AI moderator will provide final scores and determine a winner based on the arguments presented so far."
        cancelText="Cancel"
        confirmText="End Debate"
        onConfirm={confirmEndDebate}
      />

      {/* Leave Room Confirmation Dialog */}
      <ConfirmDialog
        open={leaveConfirmOpen}
        onOpenChange={setLeaveConfirmOpen}
        title="Leave Debate?"
        description="Are you sure you want to leave this debate? Your progress will not be saved, and you'll need to start a new debate session."
        cancelText="Stay"
        confirmText="Leave Debate"
        confirmClass="bg-red-500 hover:bg-red-600"
        onConfirm={confirmLeave}
      />
      
      {/* Debate Results Dialog */}
      <DebateResultDialog
        open={debateResultOpen}
        onOpenChange={setDebateResultOpen}
        finalScore={debate.finalScore}
        currentUser={user as User}
        opponent={debate.opponent}
        onReturnToDashboard={() => {
          setDebateResultOpen(false);
          navigate('/dashboard');
        }}
      />
      
      <style>{`
        .voice-wave {
          width: 4px;
          height: 20px;
          background-color: #ff6b35;
          border-radius: 2px;
          animation: wave 1s infinite ease-in-out;
          transform-origin: bottom;
        }
        
        @keyframes wave {
          0%, 100% {
            transform: scaleY(0.5);
          }
          50% {
            transform: scaleY(1);
          }
        }
        
        .debate-button {
          background-color: #ff6b35;
          color: white;
        }
        
        .debate-button:hover {
          background-color: #e85a2a;
        }

        /* Custom Scrollbar */
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.4);
        }

        .backdrop-blur-md {
          backdrop-filter: blur(12px);
        }

        .bg-gradient-overlay {
          background: linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%);
        }
      `}</style>
    </div>
  );
};

export default VoiceDebateRoom;
