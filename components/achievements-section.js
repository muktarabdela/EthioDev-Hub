import { Trophy, Award, Heart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AchievementsSection({ user }) {
  // Map badge icons to Lucide components
  const getIconComponent = (iconName) => {
    switch (iconName) {
      case "trophy":
        return <Trophy className="h-5 w-5" />;
      case "award":
        return <Award className="h-5 w-5" />;
      case "heart":
        return <Heart className="h-5 w-5" />;
      default:
        return <Award className="h-5 w-5" />;
    }
  }

  return (
    (<Card>
      <CardHeader>
        <CardTitle>Achievements & Badges</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {user.badges.map((badge) => (
            <div key={badge.id} className="flex items-center gap-3 rounded-lg border p-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                {getIconComponent(badge.icon)}
              </div>
              <div>
                <p className="font-medium">{badge.name}</p>
                <p className="text-xs text-muted-foreground">Earned on March 15, 2023</p>
              </div>
            </div>
          ))}

          <div className="mt-2 text-center">
            <p className="text-sm text-muted-foreground">3 badges earned out of 10 available</p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-[30%] rounded-full bg-primary"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>)
  );
}

