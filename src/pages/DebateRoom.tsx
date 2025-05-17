
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Message, DebateRoom as DebateRoomType, AIFeedback, Topic, User } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const DebateRoom = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Room state
  const [room, setRoom] = useState<DebateRoomType | null>(null);
  const [opponent, setOpponent] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Debate state
  const [feedback, setFeedback] = useState<AIFeedback[]>([]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isDebateActive, setIsDebateActive] = useState(true);

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
          username: "DebateChampion",
          email: "champion@example.com",
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=DebateChampion`,
          score: 1350,
        };

        // Mock room data
        const mockRoom: DebateRoomType = {
          id: roomId || "1",
          name: "AI Ethics Debate",
          topic: {
            id: "topic-1",
            title: "Should AI development prioritize safety over innovation speed?",
            category: "Tech",
            description: "Discuss the balance between rapid AI advancement and ensuring adequate safety measures."
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
          isVoice: false,
          maxParticipants: 2,
          status: "active",
          createdAt: new Date().toISOString(),
          endsAt: endsAt.toISOString(),
        };
        
        // Mock initial messages
        const mockMessages: Message[] = [
          {
            id: "msg-1",
            content: "Welcome to the debate room! Today's topic is: Should AI development prioritize safety over innovation speed?",
            senderId: "system",
            senderName: "AI Moderator",
            senderAvatar: undefined,
            timestamp: new Date(Date.now() - 300000).toISOString(),
            isAI: true
          },
          {
            id: "msg-2",
            content: "I'll open by arguing that safety must be our top priority. The potential risks of unaligned AI systems could be catastrophic, and we can't afford to create technology that we can't control.",
            senderId: mockOpponent.id,
            senderName: mockOpponent.username,
            senderAvatar: mockOpponent.avatar,
            timestamp: new Date(Date.now() - 240000).toISOString()
          },
          {
            id: "msg-3",
            content: "Remember: be respectful, back your claims with evidence, and try to address your opponent's points directly.",
            senderId: "system",
            senderName: "AI Moderator",
            senderAvatar: undefined,
            timestamp: new Date(Date.now() - 180000).toISOString(),
            isAI: true
          }
        ];
        
        // Mock AI feedback
        const mockFeedback: AIFeedback[] = [
          {
            id: "feedback-1",
            userId: mockOpponent.id,
            username: mockOpponent.username,
            score: 7.5,
            feedback: "Strong opening argument that establishes a clear position.",
            strengths: ["Clear position", "Identifies stakes", "Concise delivery"],
            improvements: ["Could provide more specific examples", "Consider addressing counterarguments"],
            timestamp: new Date(Date.now() - 120000).toISOString()
          }
        ];
        
        setRoom(mockRoom);
        setOpponent(mockOpponent);
        setMessages(mockMessages);
        setFeedback(mockFeedback);
        
        // Calculate time left
        if (mockRoom.endsAt) {
          const endsAtTime = new Date(mockRoom.endsAt).getTime();
          const currentTime = new Date().getTime();
          const timeRemaining = Math.max(0, Math.floor((endsAtTime - currentTime) / 1000));
          setTimeLeft(timeRemaining);
        }
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
  }, [roomId, user, navigate, toast]);

  // Timer effect
  useEffect(() => {
    if (!isDebateActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          clearInterval(timer);
          setIsDebateActive(false);
          
          // Add debate ended message
          setMessages(prev => [
            ...prev, 
            {
              id: `msg-end-${Date.now()}`,
              content: "The debate has ended. The AI moderator is now evaluating the arguments...",
              senderId: "system",
              senderName: "AI Moderator",
              senderAvatar: undefined,
              timestamp: new Date().toISOString(),
              isAI: true
            }
          ]);
          
          // In a real implementation, trigger the AI to evaluate the debate
          setTimeout(() => {
            // Add final evaluation message
            setMessages(prev => [
              ...prev, 
              {
                id: `msg-evaluation-${Date.now()}`,
                content: `Debate evaluation: Both participants made compelling arguments. ${user?.username} provided strong evidence and logical reasoning. ${opponent?.username} demonstrated excellent counterarguments and rebuttals. Overall score: ${user?.username}: 8.2/10, ${opponent?.username}: 7.8/10. ${user?.username} is the winner of this debate!`,
                senderId: "system",
                senderName: "AI Moderator",
                senderAvatar: undefined,
                timestamp: new Date().toISOString(),
                isAI: true
              }
            ]);
          }, 3000);
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isDebateActive, timeLeft, user, opponent]);

  // Auto-scroll effect
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !isDebateActive) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      content: messageInput.trim(),
      senderId: user?.id || "current-user",
      senderName: user?.username || "You",
      senderAvatar: user?.avatar,
      timestamp: new Date().toISOString()
    };

    setIsSending(true);
    setMessageInput("");

    try {
      // In a real implementation, this would send the message to your backend
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Add user message to chat
      setMessages(prev => [...prev, newMessage]);

      // Simulate opponent response after a delay
      setTimeout(() => {
        // AI moderator message
        if (messages.length % 4 === 0) {
          const aiMessage: Message = {
            id: `msg-ai-${Date.now()}`,
            content: "I'm noticing some good points being made. Remember to address your opponent's arguments directly and provide evidence for your claims.",
            senderId: "system",
            senderName: "AI Moderator",
            senderAvatar: undefined,
            timestamp: new Date().toISOString(),
            isAI: true
          };
          setMessages(prev => [...prev, aiMessage]);
          
          // Generate AI feedback
          const newFeedback: AIFeedback = {
            id: `feedback-${Date.now()}`,
            userId: user?.id || "current-user",
            username: user?.username || "You",
            score: 6.8,
            feedback: "Good argumentation, but could use more supporting evidence.",
            strengths: ["Clear communication", "Logical structure", "Engaging tone"],
            improvements: ["Add more supporting evidence", "Address opponent's points more directly"],
            timestamp: new Date().toISOString()
          };
          
          setFeedback(prev => [...prev, newFeedback]);
        }
        
        // Opponent response
        setTimeout(() => {
          const opponentResponses = [
            "I see your point, but I have to disagree. Innovation without proper safety measures could lead to unintended consequences that might be impossible to reverse.",
            "That's an interesting perspective, but historical evidence shows that rushing technology development often leads to serious problems that could have been prevented.",
            "I understand the drive for innovation, but we must consider the long-term implications. Safety protocols are essential, not optional.",
            "While I value the importance of progress, we cannot sacrifice safety. A balanced approach is necessary, with safety as the foundation."
          ];
          
          const randomResponse = opponentResponses[Math.floor(Math.random() * opponentResponses.length)];
          
          const opponentMessage: Message = {
            id: `msg-opponent-${Date.now()}`,
            content: randomResponse,
            senderId: opponent?.id || "opponent",
            senderName: opponent?.username || "Opponent",
            senderAvatar: opponent?.avatar,
            timestamp: new Date().toISOString()
          };
          
          setMessages(prev => [...prev, opponentMessage]);
        }, 2000);
      }, 1500);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-debate-light border-t-debate rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground">Loading debate room...</p>
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
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Debate Topic</CardTitle>
              <CardDescription>
                <Badge>{room.topic.category}</Badge>
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
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Time Remaining</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <span className="text-3xl font-bold">{formatTime(timeLeft)}</span>
                <Progress 
                  value={(timeLeft / 300) * 100} 
                  className="h-2 mt-2"
                  indicatorClassName={timeLeft < 60 ? "bg-red-500" : undefined}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Participants */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Participants</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current user */}
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-4">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>{user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{user?.username}</p>
                  <p className="text-xs text-muted-foreground">Score: {user?.score}</p>
                </div>
                <Badge variant="outline">You</Badge>
              </div>
              
              {/* Opponent */}
              {opponent && (
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-4">
                    <AvatarImage src={opponent.avatar} />
                    <AvatarFallback>{opponent.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{opponent.username}</p>
                    <p className="text-xs text-muted-foreground">Score: {opponent.score}</p>
                  </div>
                  <Badge variant="outline">Opponent</Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content - Chat and Feedback */}
        <div className="lg:col-span-3 space-y-6">
          {/* Chat */}
          <Card className="flex flex-col h-[60vh]">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Debate</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto mb-4 space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`flex max-w-[80%] ${
                      message.isAI 
                        ? 'bg-debate/10 p-3 rounded-lg w-full' 
                        : message.senderId === user?.id 
                          ? 'bg-debate text-white p-3 rounded-lg'
                          : 'bg-muted p-3 rounded-lg'
                    }`}
                  >
                    {(message.senderId !== user?.id || message.isAI) && (
                      <Avatar className="h-8 w-8 mr-2 mt-1">
                        <AvatarImage src={message.senderAvatar} />
                        <AvatarFallback>{message.senderName.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <p className={`text-xs font-medium ${message.isAI ? 'text-debate' : ''}`}>
                          {message.senderId === user?.id ? 'You' : message.senderName}
                        </p>
                        <p className="text-xs opacity-70">
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <p className={`mt-1 text-sm whitespace-pre-wrap ${message.isAI ? 'text-foreground' : ''}`}>
                        {message.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </CardContent>
            <div className="p-4 border-t">
              <div className="flex items-center gap-2">
                <Input
                  placeholder={isDebateActive ? "Type your argument here..." : "The debate has ended"}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  disabled={!isDebateActive || isSending}
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={!messageInput.trim() || !isDebateActive || isSending}
                  className="debate-button"
                >
                  {isSending ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>Send</>
                  )}
                </Button>
              </div>
              {!isDebateActive && (
                <p className="text-xs text-muted-foreground mt-2">
                  The debate has ended. You can no longer send messages.
                </p>
              )}
            </div>
          </Card>
          
          {/* AI Feedback */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">AI Moderator Feedback</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[300px] overflow-y-auto">
              {feedback.length > 0 ? (
                feedback.map((item) => (
                  <div key={item.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.username}`} />
                          <AvatarFallback>{item.username.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{item.username}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm mr-2">Score:</span>
                        <Badge variant={item.score >= 7 ? "default" : item.score >= 5 ? "outline" : "destructive"}>
                          {item.score}/10
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
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">
                    AI moderator feedback will appear here as the debate progresses.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DebateRoom;
