
import { Topic } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TopicCardProps {
  topic: Topic;
}

export function TopicCard({ topic }: TopicCardProps) {
  return (
    <Card className="backdrop-blur-md bg-white/10 border-2 border-white/20 text-white shadow-lg">
      <CardHeader className="pb-2 bg-gradient-to-r from-debate/20 to-transparent">
        <CardTitle className="text-lg font-medium">Debate Topic</CardTitle>
        <CardDescription className="text-white/80">
          <Badge className="bg-debate text-white hover:bg-debate/90">
            {topic.category}
          </Badge>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="font-medium">{topic.title}</p>
        {topic.description && (
          <p className="text-sm text-white/80 mt-2">{topic.description}</p>
        )}
      </CardContent>
    </Card>
  );
}
