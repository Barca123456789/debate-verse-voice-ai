
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface TimerCardProps {
  timeLeft: number;
  isDebateActive: boolean;
  onTimeEnd: () => void;
}

export function TimerCard({
  timeLeft,
  isDebateActive,
  onTimeEnd,
}: TimerCardProps) {
  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Timer effect
  useEffect(() => {
    if (!isDebateActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      if (timeLeft <= 1) {
        clearInterval(timer);
        onTimeEnd();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isDebateActive, timeLeft, onTimeEnd]);

  return (
    <Card className="backdrop-blur-md bg-white/10 border-2 border-white/20 text-white shadow-lg">
      <CardHeader className="pb-2 bg-gradient-to-r from-debate/20 to-transparent">
        <CardTitle className="text-lg font-medium">Time Remaining</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <span className="text-3xl font-bold">{formatTime(timeLeft)}</span>
          <Progress
            value={(timeLeft / 300) * 100}
            className={`h-2 mt-2 bg-white/30 ${
              timeLeft < 60
                ? "[&>div]:bg-red-500"
                : "[&>div]:bg-debate"
            }`}
          />
        </div>
      </CardContent>
    </Card>
  );
}
