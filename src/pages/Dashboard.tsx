
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { DebateRoom, Topic } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label"; // Import Label from shadcn/ui
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("rooms");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVoiceDebate, setIsVoiceDebate] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Politics");
  const [generatingTopic, setGeneratingTopic] = useState(false);
  const [suggestedTopics, setSuggestedTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [debateRooms, setDebateRooms] = useState<DebateRoom[]>([]);
  const [myDebates, setMyDebates] = useState<DebateRoom[]>([]);

  // Mock data for demonstration
  useEffect(() => {
    // Mock debate rooms
    const mockDebateRooms: DebateRoom[] = [
      {
        id: "1",
        name: "Climate Change Debate",
        topic: {
          id: "101",
          title: "Should governments prioritize climate policies over economic growth?",
          category: "Politics"
        },
        createdBy: "user123",
        participants: [
          {
            id: "user123",
            username: "DebateMaster",
            email: "debatemaster@example.com",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=DebateMaster"
          }
        ],
        isVoice: false,
        maxParticipants: 2,
        status: "waiting",
        createdAt: new Date().toISOString()
      },
      {
        id: "2",
        name: "AI Ethics Discussion",
        topic: {
          id: "102",
          title: "Should AI development be regulated by international law?",
          category: "Tech"
        },
        createdBy: "user456",
        participants: [
          {
            id: "user456",
            username: "TechDebater",
            email: "techdebater@example.com",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=TechDebater"
          }
        ],
        isVoice: true,
        maxParticipants: 2,
        status: "waiting",
        createdAt: new Date().toISOString()
      },
      {
        id: "3",
        name: "Universal Basic Income",
        topic: {
          id: "103",
          title: "Is Universal Basic Income a viable solution to poverty?",
          category: "Society"
        },
        createdBy: "user789",
        participants: [
          {
            id: "user789",
            username: "EconomicsThinker",
            email: "economics@example.com",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=EconomicsThinker"
          }
        ],
        isVoice: false,
        maxParticipants: 2,
        status: "waiting",
        createdAt: new Date().toISOString()
      }
    ];
    
    // Mock my debates (assuming current user created some)
    const mockMyDebates: DebateRoom[] = [
      {
        id: "4",
        name: "Space Exploration Priorities",
        topic: {
          id: "104",
          title: "Should we prioritize Mars colonization over solving Earth's problems?",
          category: "Science"
        },
        createdBy: user?.id || "",
        participants: [
          {
            id: user?.id || "",
            username: user?.username || "",
            email: user?.email || "",
            avatar: user?.avatar
          }
        ],
        isVoice: false,
        maxParticipants: 2,
        status: "waiting",
        createdAt: new Date().toISOString()
      }
    ];
    
    setDebateRooms(mockDebateRooms);
    setMyDebates(mockMyDebates);
  }, [user]);

  const handleGenerateTopics = async () => {
    setGeneratingTopic(true);
    
    try {
      // In a real implementation, this would call your backend to get GPT-4 generated topics
      // For now, we'll use mock data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockTopics: Topic[] = [
        {
          id: Math.random().toString(),
          title: `Should ${selectedCategory === "Politics" ? "voting be mandatory" : 
                   selectedCategory === "Tech" ? "social media platforms be regulated" :
                   selectedCategory === "Ethics" ? "euthanasia be legalized" : 
                   "education be free at all levels"}?`,
          category: selectedCategory as "Politics" | "Tech" | "Ethics" | "Society" | "Science" | "Other"
        },
        {
          id: Math.random().toString(),
          title: `Is ${selectedCategory === "Politics" ? "democracy the best form of government" : 
                   selectedCategory === "Tech" ? "AI development beneficial for humanity" :
                   selectedCategory === "Ethics" ? "capital punishment justified" : 
                   "veganism the future of food"}?`,
          category: selectedCategory as "Politics" | "Tech" | "Ethics" | "Society" | "Science" | "Other"
        },
        {
          id: Math.random().toString(),
          title: `Do ${selectedCategory === "Politics" ? "term limits improve governance" : 
                   selectedCategory === "Tech" ? "cryptocurrencies need government oversight" :
                   selectedCategory === "Ethics" ? "corporations have moral responsibilities" : 
                   "standardized tests measure student ability effectively"}?`,
          category: selectedCategory as "Politics" | "Tech" | "Ethics" | "Society" | "Science" | "Other"
        }
      ];
      
      setSuggestedTopics(mockTopics);
      setSelectedTopic(mockTopics[0]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate topics. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGeneratingTopic(false);
    }
  };

  const handleCreateRoom = async () => {
    if (!roomName || !selectedTopic) {
      toast({
        title: "Incomplete Form",
        description: "Please provide a room name and select a topic.",
        variant: "destructive",
      });
      return;
    }
    
    setCreatingRoom(true);
    
    try {
      // In a real implementation, this would call your backend to create a room
      // For now, we'll simulate it with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newRoom: DebateRoom = {
        id: Math.random().toString(),
        name: roomName,
        topic: selectedTopic,
        createdBy: user?.id || "",
        participants: [
          {
            id: user?.id || "",
            username: user?.username || "",
            email: user?.email || "",
            avatar: user?.avatar
          }
        ],
        isVoice: isVoiceDebate,
        maxParticipants: 2,
        status: "waiting",
        createdAt: new Date().toISOString()
      };
      
      // In a real app, the server would create the room and return it
      // Here we're just updating the local state
      setMyDebates(prev => [newRoom, ...prev]);
      
      toast({
        title: "Success!",
        description: `Your ${isVoiceDebate ? "voice" : "text"} debate room has been created.`,
      });
      
      setIsModalOpen(false);
      
      // Navigate to the newly created room
      if (isVoiceDebate) {
        navigate(`/voice-debate/${newRoom.id}`);
      } else {
        navigate(`/debate/${newRoom.id}`);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create room. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCreatingRoom(false);
    }
  };

  const handleJoinRoom = (room: DebateRoom) => {
    if (room.isVoice) {
      navigate(`/voice-debate/${room.id}`);
    } else {
      navigate(`/debate/${room.id}`);
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Create or join debates and improve your skills
          </p>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 md:mt-0 debate-button">
              Create New Debate Room
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Create a New Debate Room</DialogTitle>
              <DialogDescription>
                Set up your debate room and generate a topic for discussion.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="room-name" className="text-right col-span-1">
                  Room Name
                </Label>
                <Input
                  id="room-name"
                  placeholder="My Debate Room"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="room-type" className="text-right col-span-1">
                  Room Type
                </Label>
                <div className="col-span-3 flex gap-4">
                  <Button
                    type="button"
                    variant={isVoiceDebate ? "outline" : "default"}
                    onClick={() => setIsVoiceDebate(false)}
                    className={`flex-1 ${!isVoiceDebate ? "bg-debate" : ""}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                    </svg>
                    Text Debate
                  </Button>
                  <Button
                    type="button"
                    variant={isVoiceDebate ? "default" : "outline"}
                    onClick={() => setIsVoiceDebate(true)}
                    className={`flex-1 ${isVoiceDebate ? "bg-debate" : ""}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                    </svg>
                    Voice Debate
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right col-span-1">
                  Category
                </Label>
                <Select
                  defaultValue="Politics"
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Politics">Politics</SelectItem>
                    <SelectItem value="Tech">Technology</SelectItem>
                    <SelectItem value="Ethics">Ethics</SelectItem>
                    <SelectItem value="Society">Society</SelectItem>
                    <SelectItem value="Science">Science</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2 col-span-1">
                  Topic
                </Label>
                <div className="col-span-3 space-y-4">
                  {suggestedTopics.length > 0 ? (
                    <div className="space-y-3">
                      {suggestedTopics.map((topic) => (
                        <div 
                          key={topic.id} 
                          className={`p-3 border rounded-md cursor-pointer ${selectedTopic?.id === topic.id ? 'border-debate bg-debate/5' : 'border-border'}`}
                          onClick={() => setSelectedTopic(topic)}
                        >
                          <div className="flex items-center">
                            <div className="flex-1">
                              <p>{topic.title}</p>
                              <Badge variant="outline" className="mt-1">
                                {topic.category}
                              </Badge>
                            </div>
                            {selectedTopic?.id === topic.id && (
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-debate">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Button 
                      onClick={handleGenerateTopics} 
                      disabled={generatingTopic}
                      className="w-full debate-button"
                    >
                      {generatingTopic ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Generating Topics...
                        </>
                      ) : (
                        <>Generate Topics</>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateRoom} 
                disabled={creatingRoom || !roomName || !selectedTopic}
                className="debate-button"
              >
                {creatingRoom ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>Create Room</>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* User stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Debates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user?.debatesParticipated || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Debates Won
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user?.debatesWon || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user?.score || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Global Rank
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#{user?.rank || '-'}</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="rooms" className="mb-8" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="rooms">Available Debates</TabsTrigger>
          <TabsTrigger value="my-debates">My Debates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="rooms" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {debateRooms.length > 0 ? (
              debateRooms.map((room) => (
                <Card key={room.id} className="overflow-hidden hover:shadow-debate transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{room.name}</CardTitle>
                      {room.isVoice ? (
                        <Badge variant="outline" className="bg-debate text-white">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                          </svg>
                          Voice
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-accent text-white">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                          </svg>
                          Text
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="flex items-center text-xs mt-1">
                      <Badge variant="outline" className="mr-2">
                        {room.topic.category}
                      </Badge>
                      {new Date(room.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="text-sm">{room.topic.title}</p>
                    <div className="flex items-center mt-4">
                      <div className="flex -space-x-2">
                        {room.participants.map((participant) => (
                          <div key={participant.id} className="w-8 h-8 rounded-full overflow-hidden border-2 border-background">
                            <img 
                              src={participant.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${participant.username}`} 
                              alt={participant.username} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                        <div className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center">
                          <span className="text-xs font-medium">{room.participants.length}/{room.maxParticipants}</span>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground ml-2">
                        Created by <span className="font-medium">{room.participants[0].username}</span>
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button
                      className="w-full debate-button"
                      onClick={() => handleJoinRoom(room)}
                    >
                      Join Debate
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center py-12 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-muted-foreground">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                </div>
                <p className="text-muted-foreground">No debates available at the moment.</p>
                <Button className="mt-4 debate-button" onClick={() => setIsModalOpen(true)}>
                  Create a Debate Room
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="my-debates" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myDebates.length > 0 ? (
              myDebates.map((room) => (
                <Card key={room.id} className="overflow-hidden hover:shadow-debate transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{room.name}</CardTitle>
                      {room.isVoice ? (
                        <Badge variant="outline" className="bg-debate text-white">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                          </svg>
                          Voice
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-accent text-white">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                          </svg>
                          Text
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="flex items-center text-xs mt-1">
                      <Badge variant="outline" className="mr-2">
                        {room.topic.category}
                      </Badge>
                      {new Date(room.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="text-sm">{room.topic.title}</p>
                    <div className="flex items-center mt-4">
                      <div className="flex -space-x-2">
                        {room.participants.map((participant) => (
                          <div key={participant.id} className="w-8 h-8 rounded-full overflow-hidden border-2 border-background">
                            <img 
                              src={participant.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${participant.username}`} 
                              alt={participant.username} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                        <div className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center">
                          <span className="text-xs font-medium">{room.participants.length}/{room.maxParticipants}</span>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground ml-2">
                        Created by you
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button
                      className="w-full debate-button"
                      onClick={() => handleJoinRoom(room)}
                    >
                      Continue Debate
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center py-12 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-muted-foreground">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <p className="text-muted-foreground">You haven't created any debates yet.</p>
                <Button className="mt-4 debate-button" onClick={() => setIsModalOpen(true)}>
                  Create Your First Debate
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
