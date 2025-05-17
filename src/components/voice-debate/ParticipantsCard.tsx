
import { User } from "@/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mic, Volume2 } from "lucide-react";

interface ParticipantsCardProps {
  currentUser: User | null;
  opponent: User | null;
  currentSpeaker: string | null;
}

export function ParticipantsCard({
  currentUser,
  opponent,
  currentSpeaker,
}: ParticipantsCardProps) {
  return (
    <Card className="backdrop-blur-md bg-white/10 border-2 border-white/20 text-white shadow-lg">
      <CardHeader className="pb-2 bg-gradient-to-r from-debate/20 to-transparent">
        <CardTitle className="text-lg font-medium">Participants</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current user */}
        <div className="flex items-center">
          <Avatar className="h-12 w-12 mr-4 relative border-2 border-white/50">
            <AvatarImage src={currentUser?.avatar} />
            <AvatarFallback className="bg-debate text-white">
              {currentUser?.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
            {currentSpeaker === (currentUser?.id || "user") && (
              <span className="absolute -bottom-1 -right-1 bg-debate text-white rounded-full p-1">
                <Mic className="h-3 w-3" />
              </span>
            )}
          </Avatar>
          <div className="flex-1">
            <p className="font-medium">{currentUser?.username}</p>
            <p className="text-xs text-white/70">Score: {currentUser?.score}</p>
          </div>
          <Badge variant="outline" className="border-white/50 text-white">
            You
          </Badge>
        </div>

        {/* AI Opponent */}
        <div className="flex items-center">
          <Avatar className="h-12 w-12 mr-4 relative border-2 border-white/50">
            <AvatarImage src={opponent?.avatar} />
            <AvatarFallback className="bg-debate-accent text-white">
              {opponent?.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
            {currentSpeaker === "ai" && (
              <span className="absolute -bottom-1 -right-1 bg-debate-accent text-white rounded-full p-1">
                <Volume2 className="h-3 w-3" />
              </span>
            )}
          </Avatar>
          <div className="flex-1">
            <p className="font-medium">{opponent?.username}</p>
            <p className="text-xs text-white/70">Score: {opponent?.score}</p>
          </div>
          <Badge variant="outline" className="border-white/50 text-white">
            Opponent
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
