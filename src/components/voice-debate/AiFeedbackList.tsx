
import { AIFeedback } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface AiFeedbackListProps {
  feedback: AIFeedback[];
}

export function AiFeedbackList({ feedback }: AiFeedbackListProps) {
  if (feedback.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="w-20 h-20 rounded-full bg-debate/30 flex items-center justify-center mb-4 backdrop-blur-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-10 h-10 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
            />
          </svg>
        </div>
        <p className="text-white/80 text-lg">
          AI feedback will appear here as you participate in the debate.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {feedback.map((item) => (
        <div
          key={item.id}
          className="space-y-3 backdrop-blur-sm bg-black/30 p-4 rounded-lg border-l-4 border-debate"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-2 border-2 border-white/30">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.username}`}
                />
                <AvatarFallback className="bg-debate">
                  {item.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">{item.username}</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm mr-2">Score:</span>
              <Badge
                variant={
                  item.score >= 7
                    ? "default"
                    : item.score >= 5
                    ? "outline"
                    : "destructive"
                }
                className="text-xs bg-gradient-to-r from-debate to-debate-accent"
              >
                {item.score.toFixed(1)}/10
              </Badge>
            </div>
          </div>

          <p className="text-sm">{item.feedback}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            <div className="p-3 bg-debate/10 backdrop-blur-sm rounded">
              <p className="font-semibold text-debate-accent mb-1">Strengths:</p>
              <ul className="list-disc pl-5 space-y-1">
                {item.strengths.map((strength, idx) => (
                  <li key={idx}>{strength}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-black/30 backdrop-blur-sm rounded">
              <p className="font-semibold mb-1">Areas for Improvement:</p>
              <ul className="list-disc pl-5 space-y-1">
                {item.improvements.map((improvement, idx) => (
                  <li key={idx}>{improvement}</li>
                ))}
              </ul>
            </div>
          </div>

          <Separator className="bg-white/10" />
        </div>
      ))}
    </div>
  );
}
