
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { User } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const LeaderboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState<User[]>([]);
  const [weeklyLeaderboard, setWeeklyLeaderboard] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock data for demonstration
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        // In a real implementation, this would fetch leaderboard data from your API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate mock users for the leaderboard
        const generateMockUsers = (count: number, startRank: number = 1) => {
          const users: User[] = [];
          
          for (let i = 0; i < count; i++) {
            const rank = startRank + i;
            const username = `Debater${rank}`;
            users.push({
              id: `user-${rank}`,
              username,
              email: `${username.toLowerCase()}@example.com`,
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
              score: Math.floor(2000 - (i * 25) + Math.random() * 20),
              rank,
              debatesWon: Math.floor(50 - (i * 1.5) + Math.random() * 10),
              debatesParticipated: Math.floor(80 - (i * 0.5) + Math.random() * 20),
            });
          }
          
          return users;
        };
        
        // Generate mock data for all-time leaderboard
        const mockLeaderboard = generateMockUsers(50);
        
        // Insert the current user if they exist
        if (user) {
          const userRank = Math.floor(Math.random() * 20) + 5; // Random rank between 5 and 24
          const userWithRank = {
            ...user,
            rank: userRank,
            score: Math.floor(1800 - ((userRank - 1) * 20) + Math.random() * 15),
            debatesWon: Math.floor(40 - ((userRank - 1) * 1.2)),
            debatesParticipated: Math.floor(70 - ((userRank - 1) * 0.8)),
          };
          
          // Remove the user at the position where the current user will be inserted
          mockLeaderboard.splice(userRank - 1, 1, userWithRank);
        }
        
        // Generate mock data for weekly leaderboard (different ordering)
        const mockWeeklyLeaderboard = [...mockLeaderboard]
          .sort(() => Math.random() - 0.5) // Shuffle
          .slice(0, 20) // Take only top 20
          .map((user, index) => ({
            ...user,
            rank: index + 1,
            score: Math.floor(500 - (index * 15) + Math.random() * 10), // Lower scores for weekly
          }));
        
        // Insert the current user if they exist
        if (user) {
          const userWeeklyRank = Math.floor(Math.random() * 10) + 1; // Random rank between 1 and 10
          const userWithWeeklyRank = {
            ...user,
            rank: userWeeklyRank,
            score: Math.floor(480 - ((userWeeklyRank - 1) * 15) + Math.random() * 10),
          };
          
          // Remove the user at the position where the current user will be inserted
          mockWeeklyLeaderboard.splice(userWeeklyRank - 1, 1, userWithWeeklyRank);
        }
        
        setLeaderboardData(mockLeaderboard);
        setWeeklyLeaderboard(mockWeeklyLeaderboard);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
        setIsLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [user]);

  const filteredLeaderboard = (data: User[]) => {
    if (!searchQuery) return data;
    
    return data.filter(user => 
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getUserRankClass = (rank: number) => {
    if (rank === 1) return "bg-yellow-500";
    if (rank === 2) return "bg-gray-400";
    if (rank === 3) return "bg-amber-700";
    return "bg-muted";
  };

  const renderLeaderboard = (data: User[]) => {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-muted/50">
              <th className="py-3 px-4 text-left">Rank</th>
              <th className="py-3 px-4 text-left">User</th>
              <th className="py-3 px-4 text-left">Score</th>
              <th className="py-3 px-4 text-left hidden sm:table-cell">Debates Won</th>
              <th className="py-3 px-4 text-left hidden md:table-cell">Participation</th>
              <th className="py-3 px-4 text-left hidden lg:table-cell">Win Rate</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeaderboard(data).map((userData) => (
              <tr 
                key={userData.id} 
                className={`border-t border-border hover:bg-muted/20 ${userData.id === user?.id ? 'bg-debate/5' : ''}`}
                onClick={() => navigate(`/profile/${userData.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${getUserRankClass(userData.rank || 0)}`}>
                      {userData.rank}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-3">
                      <AvatarImage src={userData.avatar} />
                      <AvatarFallback>{userData.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{userData.username}</p>
                      {userData.id === user?.id && (
                        <Badge variant="outline" className="text-xs mt-1">You</Badge>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 font-bold">{userData.score}</td>
                <td className="py-3 px-4 hidden sm:table-cell">{userData.debatesWon}</td>
                <td className="py-3 px-4 hidden md:table-cell">{userData.debatesParticipated}</td>
                <td className="py-3 px-4 hidden lg:table-cell">
                  {userData.debatesParticipated 
                    ? `${Math.round((userData.debatesWon || 0) / (userData.debatesParticipated || 1) * 100)}%` 
                    : '0%'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredLeaderboard(data).length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No users match your search criteria.</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
          <p className="text-muted-foreground">
            See how you rank against other debaters
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 w-full md:w-64">
          <Input
            placeholder="Search users"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,543</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Debates This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">248</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,254</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {user ? "Your Rank" : "Top Score"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user ? `#${user.rank || '-'}` : '2,345'}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="w-12 h-12 border-4 border-debate-light border-t-debate rounded-full animate-spin"></div>
        </div>
      ) : (
        <Tabs defaultValue="all-time">
          <TabsList className="mb-6">
            <TabsTrigger value="all-time">All Time</TabsTrigger>
            <TabsTrigger value="weekly">This Week</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all-time" className="bg-card rounded-lg shadow-sm border border-border">
            {renderLeaderboard(leaderboardData)}
          </TabsContent>
          
          <TabsContent value="weekly" className="bg-card rounded-lg shadow-sm border border-border">
            {renderLeaderboard(weeklyLeaderboard)}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default LeaderboardPage;
