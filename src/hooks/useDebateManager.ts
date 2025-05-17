
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DebateRoom, User, AIFeedback, Topic } from "@/types";

export function useDebateManager(roomId: string | undefined, currentUser: User | null) {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Room state
  const [room, setRoom] = useState<DebateRoom | null>(null);
  const [opponent, setOpponent] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Debate state 
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isDebateActive, setIsDebateActive] = useState(true);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<AIFeedback[]>([]);
  const [finalScore, setFinalScore] = useState<{userScore: number, aiScore: number, winner: string} | null>(null);
  
  // Background image state
  const [backgroundImage, setBackgroundImage] = useState<string>("https://images.unsplash.com/photo-1589329482108-e115c1e62d04?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80");
 
  // Initialize the debate room
  useEffect(() => {
    const fetchDebateRoom = async () => {
      try {
        // In a real implementation, this would fetch room data from your API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const currentTime = new Date();
        const endsAt = new Date(currentTime.getTime() + 5 * 60000); // 5 minutes from now
        
        // Choose a themed background based on topic category
        const backgroundImages = {
          "Tech": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80",
          "Politics": "https://images.unsplash.com/photo-1575517111839-3a3843ee7f5d?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80",
          "Ethics": "https://images.unsplash.com/photo-1589329482108-e115c1e62d04?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80",
          "Society": "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80",
          "Science": "https://images.unsplash.com/photo-1507413245164-6160d8298b31?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80"
        };
        
        // Mock opponent user
        const mockOpponent: User = {
          id: "opponent-id",
          username: "VoiceDebater",
          email: "voice@example.com",
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=VoiceDebater`,
          score: 1450,
        };

        // Mock room data with the topic and select appropriate background image
        const topicCategory = "Tech";
        const mockTopic: Topic = {
          id: "topic-1",
          title: "Should facial recognition technology be banned in public spaces?",
          category: "Tech",
          description: "Discuss the ethical implications of widespread facial recognition in public areas."
        };
        
        const mockRoom: DebateRoom = {
          id: roomId || "1",
          name: "Voice Debate on Technology Ethics",
          topic: mockTopic,
          createdBy: "opponent-id",
          participants: [
            mockOpponent,
            {
              id: currentUser?.id || "current-user",
              username: currentUser?.username || "CurrentUser",
              email: currentUser?.email || "current@example.com",
              avatar: currentUser?.avatar || undefined,
            }
          ],
          isVoice: true,
          maxParticipants: 2,
          status: "active",
          createdAt: new Date().toISOString(),
          endsAt: endsAt.toISOString(),
        };
        
        // Set background based on topic category
        setBackgroundImage(backgroundImages[mockRoom.topic.category as keyof typeof backgroundImages] || backgroundImages.Ethics);
        
        // Initialize transcript with intro
        const initialTranscript = [
          `AI Moderator: Welcome to this voice debate. Today's topic is: ${mockTopic.title}`,
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
  }, [roomId, currentUser, navigate, toast]);

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
  
  // Add a transcript entry
  const addTranscript = (speaker: string, text: string) => {
    setTranscript(prev => [...prev, `${speaker}: ${text}`]);
  };
  
  // Add feedback for a user
  const addFeedback = (feedback: AIFeedback) => {
    setFeedback(prev => [...prev, feedback]);
  };

  // Generate AI feedback for the opponent 
  const generateAIFeedback = (userId: string, username: string) => {
    const newFeedback: AIFeedback = {
      id: `feedback-${Date.now()}`,
      userId: userId,
      username: username,
      score: Math.floor(Math.random() * 2) + 7, // Score between 7-8.9
      feedback: "Strong counterargument that addresses the core concerns.",
      strengths: ["Balanced perspective", "Clear argumentation", "Practical solutions"],
      improvements: ["Could be more empathetic to privacy concerns", "More specific examples needed"],
      timestamp: new Date().toISOString()
    };
    
    addFeedback(newFeedback);
  };
  
  // Get the opening statement from the AI
  const getOpponentOpeningStatement = () => {
    return "Let me begin with my opening statement. Facial recognition in public spaces threatens privacy rights. While it may offer security benefits, the risk of mass surveillance and potential discrimination outweigh these advantages.";
  };
  
  // Get a random opponent response 
  const getOpponentResponse = () => {
    const responses = [
      "I understand privacy concerns, but facial recognition helps identify criminals and missing persons. With proper regulation, we can maintain security while addressing potential bias.",
      "The key is regulation, not prohibition. These systems can solve crimes and prevent terrorism while respecting privacy through transparent oversight.",
      "Complete bans would deprive society of security benefits. The technology itself isn't problematic, it's how we implement and regulate it.",
      "We need balance, not bans. With public consent and oversight, facial recognition can enhance safety while protecting civil liberties."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };
  
  // Handle debate end
  const handleDebateEnd = async () => {
    // Stop ongoing activities
    setIsDebateActive(false);
    
    // Add debate ended transcript
    addTranscript("AI Moderator", "The debate has ended. The AI moderator is now evaluating the arguments...");
    
    // Calculate final scores
    const userScores = feedback.filter(f => f.userId === currentUser?.id || f.userId === "current-user").map(f => f.score);
    const opponentScores = feedback.filter(f => f.userId === opponent?.id || f.userId === "opponent").map(f => f.score);
    
    const userAvg = userScores.length > 0 
      ? (userScores.reduce((sum, score) => sum + score, 0) / userScores.length).toFixed(1) 
      : "7.8";
    const aiAvg = opponentScores.length > 0 
      ? (opponentScores.reduce((sum, score) => sum + score, 0) / opponentScores.length).toFixed(1) 
      : "7.6";
    
    const winner = parseFloat(userAvg) >= parseFloat(aiAvg) ? currentUser?.username || "You" : opponent?.username || "AI Opponent";
    
    // Set final score for results display
    setFinalScore({
      userScore: parseFloat(userAvg),
      aiScore: parseFloat(aiAvg),
      winner: winner
    });
    
    // Add final evaluation message
    addTranscript(
      "AI Moderator", 
      `Debate evaluation: Both participants made compelling arguments. ${currentUser?.username || "You"} provided strong evidence and logical reasoning. ${opponent?.username || "AI Opponent"} demonstrated excellent counterarguments and rebuttals. Overall score: ${currentUser?.username || "You"}: ${userAvg}/10, ${opponent?.username || "AI Opponent"}: ${aiAvg}/10. ${winner} is the winner of this debate!`
    );
    
    // Save to Supabase if user is authenticated
    if (currentUser?.id && room?.topic) {
      const saveDebateResult = async () => {
        try {
          const { error } = await supabase
            .from('debate_history')
            .insert({
              user_id: currentUser.id,
              topic_title: room.topic.title,
              topic_category: room.topic.category,
              opponent_name: opponent?.username || "AI Opponent",
              user_score: parseFloat(userAvg),
              opponent_score: parseFloat(aiAvg),
              winner: winner,
              is_voice: true
            });
            
          if (error) {
            console.error("Error saving debate result to database:", error);
            toast({
              title: "Error Saving Result",
              description: "Your debate result couldn't be saved. Please try again later.",
              variant: "destructive",
            });
          } else {
            console.log("Debate result saved successfully");
            toast({
              title: "Result Saved",
              description: "Your debate result has been saved to your history.",
            });
          }
        } catch (error) {
          console.error("Exception saving debate result:", error);
        }
      };
      
      // Execute the database save
      saveDebateResult();
    }
  };

  return {
    room,
    opponent,
    isLoading,
    timeLeft,
    isDebateActive,
    transcript,
    feedback,
    finalScore,
    backgroundImage,
    setTimeLeft,
    setIsDebateActive,
    addTranscript,
    addFeedback,
    generateAIFeedback,
    getOpponentOpeningStatement,
    getOpponentResponse,
    handleDebateEnd,
    setFinalScore,
  };
}
