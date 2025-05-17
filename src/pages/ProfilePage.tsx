
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { User, DebateRoom } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pastDebates, setPastDebates] = useState<DebateRoom[]>([]);
  const [statistics, setStatistics] = useState<{
    totalDebates: number;
    winRate: number;
    avgScore: number;
    topicsDebated: { name: string; count: number }[];
    scoreHistory: { date: string; score: number }[];
  } | null>(null);
  
  const isOwnProfile = currentUser?.id === userId;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // In a real implementation, this would fetch user data from your API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // If looking at own profile, use current user data
        if (isOwnProfile && currentUser) {
          setProfileUser(currentUser);
        } else {
          // Mock user data for demonstration
          const mockUser: User = {
            id: userId || "user-1",
            username: "DebateMaster",
            email: "debatemaster@example.com",
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId || "DebateMaster"}`,
            score: 1830,
            rank: 3,
            debatesWon: 45,
            debatesParticipated: 67,
          };
          
          setProfileUser(mockUser);
        }

        // Mock past debates data
        const mockPastDebates: DebateRoom[] = [
          {
            id: "debate-1",
            name: "AI Ethics Debate",
            topic: {
              id: "topic-1",
              title: "Should AI development be regulated by international law?",
              category: "Tech"
            },
            createdBy: "user-2",
            participants: [
              {
                id: userId || "user-1",
                username: isOwnProfile ? (currentUser?.username || "You") : "DebateMaster",
                email: isOwnProfile ? (currentUser?.email || "") : "debatemaster@example.com",
                avatar: isOwnProfile ? currentUser?.avatar : undefined,
              },
              {
                id: "user-2",
                username: "TechExpert",
                email: "techexpert@example.com",
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=TechExpert`,
              }
            ],
            isVoice: false,
            maxParticipants: 2,
            status: "completed",
            createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
          },
          {
            id: "debate-2",
            name: "Free Speech Limits",
            topic: {
              id: "topic-2",
              title: "Should there be limits to free speech online?",
              category: "Society"
            },
            createdBy: userId || "user-1",
            participants: [
              {
                id: userId || "user-1",
                username: isOwnProfile ? (currentUser?.username || "You") : "DebateMaster",
                email: isOwnProfile ? (currentUser?.email || "") : "debatemaster@example.com",
                avatar: isOwnProfile ? currentUser?.avatar : undefined,
              },
              {
                id: "user-3",
                username: "FreeSpeechAdvocate",
                email: "advocate@example.com",
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=FreeSpeechAdvocate`,
              }
            ],
            isVoice: true,
            maxParticipants: 2,
            status: "completed",
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
          },
          {
            id: "debate-3",
            name: "Space Exploration Priorities",
            topic: {
              id: "topic-3",
              title: "Should we prioritize Mars colonization over deep space exploration?",
              category: "Science"
            },
            createdBy: "user-4",
            participants: [
              {
                id: userId || "user-1",
                username: isOwnProfile ? (currentUser?.username || "You") : "DebateMaster",
                email: isOwnProfile ? (currentUser?.email || "") : "debatemaster@example.com",
                avatar: isOwnProfile ? currentUser?.avatar : undefined,
              },
              {
                id: "user-4",
                username: "SpaceEnthusiast",
                email: "space@example.com",
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=SpaceEnthusiast`,
              }
            ],
            isVoice: false,
            maxParticipants: 2,
            status: "completed",
            createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
          },
        ];
        
        // Mock statistics data
        const mockStatistics = {
          totalDebates: 67,
          winRate: 67, // percentage
          avgScore: 7.8,
          topicsDebated: [
            { name: "Technology", count: 24 },
            { name: "Politics", count: 19 },
            { name: "Ethics", count: 12 },
            { name: "Society", count: 8 },
            { name: "Science", count: 4 },
          ],
          scoreHistory: [
            { date: "Jan", score: 1400 },
            { date: "Feb", score: 1450 },
            { date: "Mar", score: 1520 },
            { date: "Apr", score: 1580 },
            { date: "May", score: 1650 },
            { date: "Jun", score: 1720 },
            { date: "Jul", score: 1750 },
            { date: "Aug", score: 1830 },
          ],
        };
        
        setPastDebates(mockPastDebates);
        setStatistics(mockStatistics);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId, currentUser, isOwnProfile]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-debate-light border-t-debate rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">User Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The user profile you're looking for doesn't exist.
          </p>
          <Button className="debate-button" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Profile Header */}
      <Card className="mb-8">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start">
            <div className="mb-4 sm:mb-0 sm:mr-8">
              <Avatar className="h-24 w-24 sm:h-32 sm:w-32 rounded-full">
                <AvatarImage src={profileUser.avatar} />
                <AvatarFallback className="text-3xl">{profileUser.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
            
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    {profileUser.username}
                    {isOwnProfile && (
                      <Badge variant="outline" className="ml-2 text-sm">You</Badge>
                    )}
                  </h1>
                  <p className="text-muted-foreground mb-4">
                    Joined {new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                  </p>
                </div>
                
                <div className="mt-4 sm:mt-0">
                  {isOwnProfile ? (
                    <Button variant="outline" onClick={() => navigate('/settings')}>
                      Edit Profile
                    </Button>
                  ) : (
                    <Button className="debate-button" onClick={() => navigate('/dashboard')}>
                      Challenge to Debate
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-card p-4 rounded-lg border border-border text-center">
                  <p className="text-muted-foreground text-sm">Rank</p>
                  <p className="text-2xl font-bold">#{profileUser.rank}</p>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border text-center">
                  <p className="text-muted-foreground text-sm">Score</p>
                  <p className="text-2xl font-bold">{profileUser.score}</p>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border text-center">
                  <p className="text-muted-foreground text-sm">Debates Won</p>
                  <p className="text-2xl font-bold">{profileUser.debatesWon}</p>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border text-center">
                  <p className="text-muted-foreground text-sm">Win Rate</p>
                  <p className="text-2xl font-bold">
                    {profileUser.debatesParticipated 
                      ? `${Math.round((profileUser.debatesWon || 0) / (profileUser.debatesParticipated || 1) * 100)}%` 
                      : '0%'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="debates" className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="debates">Past Debates</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="badges">Badges & Achievements</TabsTrigger>
        </TabsList>
        
        <TabsContent value="debates">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastDebates.length > 0 ? (
              pastDebates.map((debate) => (
                <Card key={debate.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{debate.name}</CardTitle>
                      {debate.isVoice ? (
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
                        {debate.topic.category}
                      </Badge>
                      {new Date(debate.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">{debate.topic.title}</p>
                    <div className="flex items-center">
                      <div className="flex -space-x-2">
                        {debate.participants.map((participant) => (
                          <div key={participant.id} className="w-8 h-8 rounded-full overflow-hidden border-2 border-background">
                            <img 
                              src={participant.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${participant.username}`} 
                              alt={participant.username} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground ml-2">
                        vs <span className="font-medium">
                          {debate.participants.find(p => p.id !== profileUser.id)?.username || "Unknown"}
                        </span>
                      </span>
                      <div className="ml-auto">
                        <Badge>{debate.status === "completed" ? "Completed" : debate.status}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center py-12 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-muted-foreground">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <p className="text-muted-foreground">No past debates found.</p>
                {isOwnProfile && (
                  <Button className="mt-4 debate-button" onClick={() => navigate('/dashboard')}>
                    Start Your First Debate
                  </Button>
                )}
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="stats">
          {statistics && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Debate Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-card p-4 rounded-lg border border-border text-center">
                        <p className="text-muted-foreground text-sm">Total Debates</p>
                        <p className="text-2xl font-bold">{statistics.totalDebates}</p>
                      </div>
                      <div className="bg-card p-4 rounded-lg border border-border text-center">
                        <p className="text-muted-foreground text-sm">Win Rate</p>
                        <p className="text-2xl font-bold">{statistics.winRate}%</p>
                      </div>
                      <div className="bg-card p-4 rounded-lg border border-border text-center">
                        <p className="text-muted-foreground text-sm">Avg. Score</p>
                        <p className="text-2xl font-bold">{statistics.avgScore}/10</p>
                      </div>
                      <div className="bg-card p-4 rounded-lg border border-border text-center">
                        <p className="text-muted-foreground text-sm">Categories</p>
                        <p className="text-2xl font-bold">{statistics.topicsDebated.length}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3">Most Debated Topics</h4>
                      <div className="space-y-3">
                        {statistics.topicsDebated.map((topic, index) => (
                          <div key={index} className="flex items-center">
                            <span className="text-sm">{topic.name}</span>
                            <div className="flex-1 mx-3">
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-debate" 
                                  style={{ width: `${(topic.count / statistics.totalDebates) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                            <span className="text-sm font-medium">{topic.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Score History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-end space-x-2">
                    {statistics.scoreHistory.map((item, index) => {
                      // Calculate height percentage based on min/max scores
                      const minScore = Math.min(...statistics.scoreHistory.map(i => i.score));
                      const maxScore = Math.max(...statistics.scoreHistory.map(i => i.score));
                      const range = maxScore - minScore;
                      const heightPercentage = range > 0 
                        ? ((item.score - minScore) / range) * 80 + 10 // 10-90% height range
                        : 50; // Default if all scores are the same
                      
                      return (
                        <div key={index} className="flex flex-col items-center flex-1">
                          <div 
                            className={`w-full bg-debate rounded-t-sm ${index === statistics.scoreHistory.length - 1 ? 'animate-pulse' : ''}`}
                            style={{ height: `${heightPercentage}%` }}
                          ></div>
                          <div className="mt-2 text-xs text-muted-foreground">{item.date}</div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="badges">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="mb-4 w-16 h-16 bg-debate/10 rounded-full mx-auto flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-debate">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-1">Top 10</h3>
                <p className="text-xs text-muted-foreground">Reached the top 10 ranks</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="mb-4 w-16 h-16 bg-accent/10 rounded-full mx-auto flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-accent">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-1">Sharp Mind</h3>
                <p className="text-xs text-muted-foreground">Won 10 debates in a row</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="mb-4 w-16 h-16 bg-muted rounded-full mx-auto flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-muted-foreground">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-1">Well-read</h3>
                <p className="text-xs text-muted-foreground">Debated in 5 different categories</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="mb-4 w-16 h-16 bg-muted rounded-full mx-auto flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-muted-foreground">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-1">Voice Master</h3>
                <p className="text-xs text-muted-foreground">Completed 10 voice debates</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
