
import { User } from "@/types";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trophy } from "lucide-react";

interface DebateResultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  finalScore: {
    userScore: number;
    aiScore: number;
    winner: string;
  } | null;
  currentUser: User | null;
  opponent: User | null;
  onReturnToDashboard: () => void;
}

export function DebateResultDialog({
  open,
  onOpenChange,
  finalScore,
  currentUser,
  opponent,
  onReturnToDashboard,
}: DebateResultDialogProps) {
  if (!finalScore) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md backdrop-blur-lg bg-white/10 border-2 border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center text-2xl">
            <Trophy className="h-6 w-6 text-yellow-500 mr-2" />
            Debate Results
          </DialogTitle>
          <DialogDescription className="text-center text-white/80">
            {finalScore &&
            finalScore.winner === (currentUser?.username || "You")
              ? "Congratulations on your victory!"
              : "Great effort! Keep improving your debate skills."}
          </DialogDescription>
        </DialogHeader>

        {finalScore && (
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div
                className={`p-4 rounded-lg backdrop-blur-md ${
                  finalScore.userScore >= finalScore.aiScore
                    ? "bg-gradient-to-b from-amber-500/30 to-yellow-600/20 border-2 border-yellow-500/50"
                    : "bg-black/30 border-2 border-white/20"
                }`}
              >
                <Avatar className="h-16 w-16 mx-auto mb-2 border-2 border-white/50">
                  <AvatarImage src={currentUser?.avatar} />
                  <AvatarFallback className="bg-debate">
                    {currentUser?.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <p className="font-bold">{currentUser?.username || "You"}</p>
                <div className="mt-2 text-3xl font-bold text-white">
                  {finalScore.userScore.toFixed(1)}
                  <span className="text-sm text-white/70">/10</span>
                </div>
                {finalScore.userScore >= finalScore.aiScore && (
                  <Badge className="mt-2 bg-yellow-500 text-black">
                    Winner
                  </Badge>
                )}
              </div>

              <div
                className={`p-4 rounded-lg backdrop-blur-md ${
                  finalScore.aiScore > finalScore.userScore
                    ? "bg-gradient-to-b from-amber-500/30 to-yellow-600/20 border-2 border-yellow-500/50"
                    : "bg-black/30 border-2 border-white/20"
                }`}
              >
                <Avatar className="h-16 w-16 mx-auto mb-2 border-2 border-white/50">
                  <AvatarImage src={opponent?.avatar} />
                  <AvatarFallback className="bg-debate-accent">
                    {opponent?.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <p className="font-bold">{opponent?.username || "AI Opponent"}</p>
                <div className="mt-2 text-3xl font-bold text-white">
                  {finalScore.aiScore.toFixed(1)}
                  <span className="text-sm text-white/70">/10</span>
                </div>
                {finalScore.aiScore > finalScore.userScore && (
                  <Badge className="mt-2 bg-yellow-500 text-black">
                    Winner
                  </Badge>
                )}
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-white/80">
                This result has been saved to your debate history
              </p>
            </div>
          </div>
        )}

        <DialogFooter className="flex sm:justify-center">
          <Button
            type="button"
            onClick={onReturnToDashboard}
            className="bg-gradient-to-r from-debate to-debate-accent hover:from-debate-accent hover:to-debate text-white px-6"
          >
            Return to Dashboard
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
