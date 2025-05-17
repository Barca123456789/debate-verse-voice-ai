import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { DebateRoom as DebateRoomType, Topic, User, AIFeedback } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mic, MicOff, Volume2, StopCircle, Trophy } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";

const VoiceDebateRoom = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Room state
  const [room, setRoom] = useState<DebateRoomType | null>(null);
  const [opponent, setOpponent] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Voice debate state
  const [isMicActive, setIsMicActive] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [currentSpeaker, setCurrentSpeaker] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [elevenlabsApiKey, setElevenlabsApiKey] = useState<string>("");
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [loadingVoice, setLoadingVoice] = useState(false);
  const [interruptAI, setInterruptAI] = useState(false);
  
  // Debate state
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isDebateActive, setIsDebateActive] = useState(true);
  const [feedback, setFeedback] = useState<AIFeedback[]>([]);
  const [endDialogOpen, setEndDialogOpen] = useState(false);
  const [debateResultOpen, setDebateResultOpen] = useState(false);
  const [finalScore, setFinalScore] = useState<{userScore: number, aiScore: number, winner: string} | null>(null);
  
  // Audio elements
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  
  // Speech recognition
  const [recognition, setRecognition] = useState<any | null>(null);

  // Mock data for demonstration
  useEffect(() => {
    const fetchDebateRoom = async () => {
      try {
        // In a real implementation, this would fetch room data from your API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const currentTime = new Date();
        const endsAt = new Date(currentTime.getTime() + 5 * 60000); // 5 minutes from now
        
        // Mock opponent user
        const mockOpponent: User = {
          id: "opponent-id",
          username: "VoiceDebater",
          email: "voice@example.com",
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=VoiceDebater`,
          score: 1450,
        };

        // Mock room data
        const mockRoom: DebateRoomType = {
          id: roomId || "1",
          name: "Voice Debate on Technology Ethics",
          topic: {
            id: "topic-1",
            title: "Should facial recognition technology be banned in public spaces?",
            category: "Tech",
            description: "Discuss the ethical implications of widespread facial recognition in public areas."
          },
          createdBy: "opponent-id",
          participants: [
            mockOpponent,
            {
              id: user?.id || "current-user",
              username: user?.username || "CurrentUser",
              email: user?.email || "current@example.com",
              avatar: user?.avatar || undefined,
            }
          ],
          isVoice: true,
          maxParticipants: 2,
          status: "active",
          createdAt: new Date().toISOString(),
          endsAt: endsAt.toISOString(),
        };
        
        // Initialize transcript with intro
        const initialTranscript = [
          "AI Moderator: Welcome to this voice debate. Today's topic is: Should facial recognition technology be banned in public spaces?",
          "AI Moderator: I'll be moderating this discussion and providing feedback. Let's begin with opening statements."
        ];
        
        setRoom(mockRoom);
        setOpponent(mockOpponent);
        setTranscript(initialTranscript);
        
        // Calculate time left
        if (mockRoom.endsAt) {
          const endsAtTime = new Date(mockRoom.endsAt).getTime();
          const currentTime = new Date().getTime();
          const timeRemaining = Math.max(0, Math.floor((endsAtTime - currentTime) / 1000));
          setTimeLeft(timeRemaining);
        }
        
        // Set up audio element
        if (!audioRef.current) {
          const audioElement = new Audio();
          audioElement.addEventListener('ended', () => {
            setIsAISpeaking(false);
            setCurrentSpeaker(null);
            setInterruptAI(false);
          });
          audioRef.current = audioElement;
        }
        
        // Mock AI speech after a delay
        setTimeout(() => {
          handleAISpeech("Let me begin with my opening statement. Facial recognition in public spaces threatens privacy rights. While it may offer security benefits, the risk of mass surveillance and potential discrimination outweigh these advantages.", true);
        }, 2000);
        
      } catch (error) {
        console.error("Error fetching debate room:", error);
        toast({
          title: "Error",
          description: "Failed to load debate room. Please try again.",
          variant: "destructive",
        });
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDebateRoom();

    // Initialize Web Speech API if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      // @ts-ignore
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      
      recognitionInstance.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
          
        if (event.results[0].isFinal && transcript.trim().length > 0) {
          // In a real implementation, send this transcript to your backend for processing
          console.log("Final transcript:", transcript);
          
          // Update the displayed transcript
          setTranscript(prev => [...prev, `${user?.username || "You"}: ${transcript}`]);
          
          // Simulate AI moderator evaluation after user speaks
          if (Math.random() > 0.7) {
            setTimeout(() => {
              const aiEvaluation = "AI Moderator: That's an interesting point. Remember to provide evidence to support your claims.";
              setTranscript(prev => [...prev, aiEvaluation]);
              
              // Create a feedback item
              const newFeedback: AIFeedback = {
                id: `feedback-${Date.now()}`,
                userId: user?.id || "current-user",
                username: user?.username || "You",
                score: 7.2,
                feedback: "Good articulation of points with clear structure.",
                strengths: ["Eloquent delivery", "Logical flow", "Clear stance"],
                improvements: ["Add more supporting evidence", "Address counterarguments more directly"],
                timestamp: new Date().toISOString()
              };
              
              setFeedback(prev => [...prev, newFeedback]);
            }, 800);
          }
          
          // Simulate opponent response after the user speaks
          setTimeout(() => {
            handleOpponentResponse();
          }, 1500);
        }
      };
      
      recognitionInstance.onerror = (event) => {
        console.error("Speech recognition error", event);
        if (isMicActive) {
          toast({
            title: "Speech Recognition Error",
            description: "There was a problem with the speech recognition. Please try again.",
            variant: "destructive",
          });
          setIsMicActive(false);
        }
      };
      
      setRecognition(recognitionInstance);
    } else {
      toast({
        title: "Browser Not Supported",
        description: "Your browser doesn't support speech recognition. Please try a different browser.",
        variant: "destructive",
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (recognition) {
        recognition.stop();
      }
    };
  }, [roomId, user, navigate, toast]);

  // Timer effect
  useEffect(() => {
    if (!isDebateActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          clearInterval(timer);
          handleDebateEnd();
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isDebateActive, timeLeft]);

  // Auto-scroll effect for transcript
  useEffect(() => {
    if (transcriptEndRef.current) {
      transcriptEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [transcript]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const toggleMicrophone = async () => {
    if (!recognition) return;
    
    if (!isMicActive) {
      try {
        // Request microphone permission
        await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // If AI is speaking, interrupt
        if (isAISpeaking) {
          setInterruptAI(true);
          if (audioRef.current) {
            audioRef.current.pause();
            setIsAISpeaking(false);
            setCurrentSpeaker(null);
            setLoadingVoice(false);
          }
        }
        
        // Start speech recognition
        recognition.start();
        setIsMicActive(true);
        setCurrentSpeaker(user?.id || "user");
        
        toast({
          title: "Microphone Activated",
          description: "You are now speaking. Your voice will be transcribed.",
        });
      } catch (error) {
        console.error("Error accessing microphone:", error);
        toast({
          title: "Microphone Access Denied",
          description: "Please allow microphone access to participate in the debate.",
          variant: "destructive",
        });
      }
    } else {
      // Stop speech recognition
      recognition.stop();
      setIsMicActive(false);
      setCurrentSpeaker(null);
      
      toast({
        title: "Microphone Deactivated",
        description: "You have stopped speaking.",
      });
    }
  };

  const handleAISpeech = async (text: string, isOpening = false) => {
    if (!audioRef.current || interruptAI) return;
    
    setLoadingVoice(true);
    setIsAISpeaking(true);
    setCurrentSpeaker("ai");
    
    try {
      // In a real implementation, this would use the ElevenLabs API to generate speech
      // For demonstration, we'll use the Web Speech API
      const apiKey = elevenlabsApiKey || localStorage.getItem("elevenlabsApiKey");
      
      if (!apiKey) {
        // If no API key, use browser's speech synthesis
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.1; // Slightly faster for more interactive debate
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        
        // Add the AI's speech to the transcript
        setTranscript(prev => [...prev, `AI Opponent: ${text}`]);
        
        window.speechSynthesis.speak(utterance);
        
        utterance.onend = () => {
          setIsAISpeaking(false);
          setCurrentSpeaker(null);
          setLoadingVoice(false);
          
          // If this was the opening statement, add an AI moderator prompt after a delay
          if (isOpening) {
            setTimeout(() => {
              setTranscript(prev => [...prev, "AI Moderator: Now it's your turn. Click the microphone button to respond."]);
            }, 500);
          }
        };
      } else {
        // With a real ElevenLabs implementation, we would:
        // 1. Send the text to ElevenLabs API
        // 2. Get back the audio file
        // 3. Play it through audioRef.current
        
        // For now, we'll simulate this with a timeout and browser TTS
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Add the AI's speech to the transcript
        setTranscript(prev => [...prev, `AI Opponent: ${text}`]);
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.1; // Slightly faster for more interactive debate
        window.speechSynthesis.speak(utterance);
        
        utterance.onend = () => {
          setIsAISpeaking(false);
          setCurrentSpeaker(null);
          setLoadingVoice(false);
          
          // If this was the opening statement, add an AI moderator prompt after a delay
          if (isOpening) {
            setTimeout(() => {
              setTranscript(prev => [...prev, "AI Moderator: Now it's your turn. Click the microphone button to respond."]);
            }, 500);
          }
        };
      }
    } catch (error) {
      console.error("Error generating AI speech:", error);
      toast({
        title: "Speech Generation Error",
        description: "There was a problem generating the AI speech. Please check your API key.",
        variant: "destructive",
      });
      setIsAISpeaking(false);
      setCurrentSpeaker(null);
      setLoadingVoice(false);
    }
  };

  const handleOpponentResponse = () => {
    // Shorter, more focused responses for better interaction
    const responses = [
      "I understand privacy concerns, but facial recognition helps identify criminals and missing persons. With proper regulation, we can maintain security while addressing potential bias.",
      "The key is regulation, not prohibition. These systems can solve crimes and prevent terrorism while respecting privacy through transparent oversight.",
      "Complete bans would deprive society of security benefits. The technology itself isn't problematic, it's how we implement and regulate it.",
      "We need balance, not bans. With public consent and oversight, facial recognition can enhance safety while protecting civil liberties."
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    handleAISpeech(randomResponse);
    
    // Generate AI feedback for opponent
    const newFeedback: AIFeedback = {
      id: `feedback-${Date.now()}`,
      userId: opponent?.id || "opponent",
      username: opponent?.username || "Opponent",
      score: Math.floor(Math.random() * 2) + 7, // Score between 7-8.9
      feedback: "Strong counterargument that addresses the core concerns.",
      strengths: ["Balanced perspective", "Clear argumentation", "Practical solutions"],
      improvements: ["Could be more empathetic to privacy concerns", "More specific examples needed"],
      timestamp: new Date().toISOString()
    };
    
    setFeedback(prev => [...prev, newFeedback]);
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
  
  const handleDebateEnd = () => {
    // Stop ongoing activities
    setIsDebateActive(false);
    
    if (isMicActive && recognition) {
      recognition.stop();
      setIsMicActive(false);
    }
    
    if (isAISpeaking && audioRef.current) {
      audioRef.current.pause();
      setIsAISpeaking(false);
    }
    
    setCurrentSpeaker(null);
    
    // Add debate ended transcript
    setTranscript(prev => [...prev, "AI Moderator: The debate has ended. The AI moderator is now evaluating the arguments..."]);
    
    // Generate final evaluation
    setTimeout(() => {
      // Calculate final scores
      const userScores = feedback.filter(f => f.userId === user?.id || f.userId === "current-user").map(f => f.score);
      const opponentScores = feedback.filter(f => f.userId === opponent?.id || f.userId === "opponent").map(f => f.score);
      
      const userAvg = userScores.length > 0 
        ? (userScores.reduce((sum, score) => sum + score, 0) / userScores.length).toFixed(1) 
        : "7.8";
      const aiAvg = opponentScores.length > 0 
        ? (opponentScores.reduce((sum, score) => sum + score, 0) / opponentScores.length).toFixed(1) 
        : "7.6";
      
      const winner = parseFloat(userAvg) >= parseFloat(aiAvg) ? user?.username || "You" : opponent?.username || "AI Opponent";
      
      // Set final score for results display
      setFinalScore({
        userScore: parseFloat(userAvg),
        aiScore: parseFloat(aiAvg),
        winner: winner
      });
      
      // Add final evaluation message
      setTranscript(prev => [
        ...prev, 
        `AI Moderator: Debate evaluation: Both participants made compelling arguments. ${user?.username || "You"} provided strong evidence and logical reasoning. ${opponent?.username || "AI Opponent"} demonstrated excellent counterarguments and rebuttals. Overall score: ${user?.username || "You"}: ${userAvg}/10, ${opponent?.username || "AI Opponent"}: ${aiAvg}/10. ${winner} is the winner of this debate!`
      ]);
      
      // Show debate result dialog
      setTimeout(() => {
        setDebateResultOpen(true);
        
        // In a real application, here we would save the debate result to the user's history
        console.log("Saving debate result:", {
          topic: room?.topic.title,
          userScore: parseFloat(userAvg),
          opponentScore: parseFloat(aiAvg),
          winner,
          date: new Date().toISOString()
        });
      }, 2000);
    }, 2000);
  };
  
  const confirmEndDebate = () => {
    setEndDialogOpen(false);
    handleDebateEnd();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-debate-light border-t-debate rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground">Loading voice debate room...</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Room Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The debate room you're looking for doesn't exist or has ended.
          </p>
          <Button className="debate-button" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Topic Card */}
          <Card className="border-2 border-debate/20 shadow-md">
            <CardHeader className="pb-2 bg-gradient-to-r from-debate/10 to-transparent">
              <CardTitle className="text-lg font-medium">Debate Topic</CardTitle>
              <CardDescription>
                <Badge className="bg-debate text-white hover:bg-debate/90">{room.topic.category}</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{room.topic.title}</p>
              {room.topic.description && (
                <p className="text-sm text-muted-foreground mt-2">{room.topic.description}</p>
              )}
            </CardContent>
          </Card>
          
          {/* Timer Card */}
          <Card className="border-2 border-debate/20 shadow-md">
            <CardHeader className="pb-2 bg-gradient-to-r from-debate/10 to-transparent">
              <CardTitle className="text-lg font-medium">Time Remaining</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <span className="text-3xl font-bold">{formatTime(timeLeft)}</span>
                <Progress 
                  value={(timeLeft / 300) * 100} 
                  className={`h-2 mt-2 ${timeLeft < 60 ? "bg-secondary [&>div]:bg-red-500" : ""}`}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Participants */}
          <Card className="border-2 border-debate/20 shadow-md">
            <CardHeader className="pb-2 bg-gradient-to-r from-debate/10 to-transparent">
              <CardTitle className="text-lg font-medium">Participants</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current user */}
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-4 relative">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>{user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                  {currentSpeaker === (user?.id || "user") && (
                    <span className="absolute -bottom-1 -right-1 bg-debate text-white rounded-full p-1">
                      <Mic className="h-3 w-3" />
                    </span>
                  )}
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{user?.username}</p>
                  <p className="text-xs text-muted-foreground">Score: {user?.score}</p>
                </div>
                <Badge variant="outline">You</Badge>
              </div>
              
              {/* AI Opponent */}
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-4 relative">
                  <AvatarImage src={opponent?.avatar} />
                  <AvatarFallback>{opponent?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                  {currentSpeaker === "ai" && (
                    <span className="absolute -bottom-1 -right-1 bg-debate text-white rounded-full p-1">
                      <Volume2 className="h-3 w-3" />
                    </span>
                  )}
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{opponent?.username}</p>
                  <p className="text-xs text-muted-foreground">Score: {opponent?.score}</p>
                </div>
                <Badge variant="outline">Opponent</Badge>
              </div>
            </CardContent>
          </Card>
          
          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="border-2 border-red-500/50 hover:bg-red-500/10 hover:text-red-600"
              onClick={() => setEndDialogOpen(true)}
              disabled={!isDebateActive}
            >
              <StopCircle className="mr-2 h-4 w-4" />
              End Debate
            </Button>
            
            <Button
              variant="outline" 
              className="border-2 border-debate/50 hover:bg-debate/10 hover:text-debate"
              onClick={() => setApiKeyModalOpen(!apiKeyModalOpen)}
            >
              <Volume2 className="mr-2 h-4 w-4" />
              Voice Settings
            </Button>
          </div>
          
          {/* ElevenLabs API Key Dialog */}
          {apiKeyModalOpen && (
            <Card className="mt-4 border-2 border-debate/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">ElevenLabs API Settings</CardTitle>
                <CardDescription>Enter your API key for more natural AI voice</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key">ElevenLabs API Key</Label>
                  <div className="flex gap-2">
                    <input
                      id="api-key"
                      type="password"
                      className="w-full p-2 border rounded-md"
                      value={elevenlabsApiKey}
                      onChange={(e) => setElevenlabsApiKey(e.target.value)}
                      placeholder="Enter your API key"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Get your API key from <a href="https://elevenlabs.io/speech-synthesis" target="_blank" rel="noopener noreferrer" className="text-debate hover:underline">ElevenLabs</a>
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setApiKeyModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="debate-button flex-1"
                    size="sm"
                    onClick={saveElevenlabsApiKey}
                    disabled={!elevenlabsApiKey}
                  >
                    Save API Key
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Voice Controls */}
          <Card className="border-2 border-debate/20 shadow-lg">
            <CardContent className="py-6">
              <div className="flex items-center justify-center space-x-4">
                <Button
                  size="lg"
                  className={`rounded-full p-6 transition-all duration-300 shadow-md ${isMicActive 
                    ? 'bg-red-500 hover:bg-red-600 shadow-red-200' 
                    : 'bg-gradient-to-r from-debate to-debate-light hover:from-debate-light hover:to-debate'}`}
                  onClick={toggleMicrophone}
                  disabled={!isDebateActive || loadingVoice}
                >
                  {isMicActive ? (
                    <MicOff className="h-6 w-6" />
                  ) : (
                    <Mic className="h-6 w-6" />
                  )}
                </Button>
                <div className="text-center">
                  <p className="font-medium">
                    {isMicActive 
                      ? "You are speaking - Click to mute" 
                      : isAISpeaking 
                        ? "AI is speaking... Click to interrupt" 
                        : loadingVoice
                          ? "Generating AI speech..."
                          : isDebateActive
                            ? "Click to speak"
                            : "Debate has ended"}
                  </p>
                  {isMicActive && (
                    <div className="flex items-center justify-center space-x-1 mt-2">
                      <div className="voice-wave" style={{ animationDelay: '0s' }}></div>
                      <div className="voice-wave" style={{ animationDelay: '0.1s' }}></div>
                      <div className="voice-wave" style={{ animationDelay: '0.2s' }}></div>
                      <div className="voice-wave" style={{ animationDelay: '0.3s' }}></div>
                      <div className="voice-wave" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  )}
                  {isAISpeaking && (
                    <div className="flex items-center justify-center space-x-1 mt-2">
                      <div className="voice-wave" style={{ animationDelay: '0s', backgroundColor: '#ff6b35' }}></div>
                      <div className="voice-wave" style={{ animationDelay: '0.1s', backgroundColor: '#ff6b35' }}></div>
                      <div className="voice-wave" style={{ animationDelay: '0.2s', backgroundColor: '#ff6b35' }}></div>
                      <div className="voice-wave" style={{ animationDelay: '0.3s', backgroundColor: '#ff6b35' }}></div>
                      <div className="voice-wave" style={{ animationDelay: '0.4s', backgroundColor: '#ff6b35' }}></div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="transcript" className="border-2 border-debate/20 rounded-md shadow-md">
            <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-debate/10 to-transparent">
              <TabsTrigger value="transcript">Transcript</TabsTrigger>
              <TabsTrigger value="feedback">AI Feedback</TabsTrigger>
            </TabsList>
            
            <TabsContent value="transcript" className="mt-0">
              <Card className="h-[60vh] border-0 shadow-none">
                <CardContent className="p-6 h-full overflow-y-auto">
                  <div className="space-y-4">
                    {transcript.map((line, index) => {
                      const [speaker, ...contentParts] = line.split(': ');
                      const content = contentParts.join(': ');
                      
                      return (
                        <div key={index} className="space-y-1">
                          <div className="flex items-center">
                            <span className={`font-semibold ${
                              speaker === 'AI Moderator' 
                                ? 'text-debate' 
                                : speaker === 'AI Opponent'
                                  ? 'text-blue-600'
                                  : 'text-emerald-600'
                            }`}>
                              {speaker}:
                            </span>
                          </div>
                          <p className="pl-4">{content}</p>
                        </div>
                      );
                    })}
                    <div ref={transcriptEndRef} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="feedback" className="mt-0">
              <Card className="h-[60vh] border-0 shadow-none">
                <CardContent className="p-6 h-full overflow-y-auto">
                  {feedback.length > 0 ? (
                    <div className="space-y-6">
                      {feedback.map((item) => (
                        <div key={item.id} className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-2">
                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.username}`} />
                                <AvatarFallback>{item.username.charAt(0).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{item.username}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-sm mr-2">Score:</span>
                              <Badge variant={item.score >= 7 ? "default" : item.score >= 5 ? "outline" : "destructive"} className="text-xs">
                                {item.score.toFixed(1)}/10
                              </Badge>
                            </div>
                          </div>
                          
                          <p className="text-sm">{item.feedback}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                            <div className="p-2 bg-debate/10 rounded">
                              <p className="font-semibold text-debate mb-1">Strengths:</p>
                              <ul className="list-disc pl-5 space-y-1">
                                {item.strengths.map((strength, idx) => (
                                  <li key={idx}>{strength}</li>
                                ))}
                              </ul>
                            </div>
                            
                            <div className="p-2 bg-muted rounded">
                              <p className="font-semibold mb-1">Areas for Improvement:</p>
                              <ul className="list-disc pl-5 space-y-1">
                                {item.improvements.map((improvement, idx) => (
                                  <li key={idx}>{improvement}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          
                          <Separator />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-muted-foreground">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                        </svg>
                      </div>
                      <p className="text-muted-foreground">
                        AI feedback will appear here as you participate in the debate.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* End Debate Confirmation Dialog */}
      <AlertDialog open={endDialogOpen} onOpenChange={setEndDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>End Debate?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to end this debate? The AI moderator will provide final scores and determine a winner based on the arguments presented so far.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmEndDebate}>End Debate</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Debate Results Dialog */}
      <Dialog open={debateResultOpen} onOpenChange={setDebateResultOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center text-2xl">
              <Trophy className="h-6 w-6 text-yellow-500 mr-2" />
              Debate Results
            </DialogTitle>
            <DialogDescription className="text-center">
              {finalScore && finalScore.winner === (user?.username || "You")
                ? "Congratulations on your victory!"
                : "Great effort! Keep improving your debate skills."
              }
            </DialogDescription>
          </DialogHeader>
          
          {finalScore && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className={`p-4 rounded-lg ${finalScore.userScore >= finalScore.aiScore ? 'bg-gradient-to-b from-amber-100 to-yellow-50 border-2 border-yellow-300' : 'bg-gray-50 border-2 border-gray-200'}`}>
                  <Avatar className="h-16 w-16 mx-auto mb-2">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback>{user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <p className="font-bold">{user?.username || "You"}</p>
                  <div className="mt-2 text-3xl font-bold text-debate">
                    {finalScore.userScore.toFixed(1)}
                    <span className="text-sm text-muted-foreground">/10</span>
                  </div>
                  {finalScore.userScore >= finalScore.aiScore && (
                    <Badge className="mt-2 bg-yellow-500">Winner</Badge>
                  )}
                </div>
                
                <div className={`p-4 rounded-lg ${finalScore.aiScore > finalScore.userScore ? 'bg-gradient-to-b from-amber-100 to-yellow-50 border-2 border-yellow-300' : 'bg-gray-50 border-2 border-gray-200'}`}>
                  <Avatar className="h-16 w-16 mx-auto mb-2">
                    <AvatarImage src={opponent?.avatar} />
                    <AvatarFallback>{opponent?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <p className="font-bold">{opponent?.username || "AI Opponent"}</p>
                  <div className="mt-2 text-3xl font-bold text-debate">
                    {finalScore.aiScore.toFixed(1)}
                    <span className="text-sm text-muted-foreground">/10</span>
                  </div>
                  {finalScore.aiScore > finalScore.userScore && (
                    <Badge className="mt-2 bg-yellow-500">Winner</Badge>
                  )}
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground">This result has been saved to your debate history</p>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex sm:justify-center">
            <Button
              type="button"
              onClick={() => {
                setDebateResultOpen(false);
                navigate('/dashboard');
              }}
              className="debate-button"
            >
              Return to Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <style>
        {`
        .voice-wave {
          width: 4px;
          height: 15px;
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
        `}
      </style>
    </div>
  );
};

export default VoiceDebateRoom;
