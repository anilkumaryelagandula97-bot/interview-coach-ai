import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Calendar, Target, TrendingUp } from "lucide-react";
import { format } from "date-fns";

interface Session {
  id: string;
  topic: string;
  difficulty: string;
  total_questions: number;
  completed_questions: number;
  score: number | null;
  created_at: string;
}

const History = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchSessions();
  }, [user, navigate]);

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from("practice_sessions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalSessions: sessions.length,
    avgScore: sessions.length > 0 
      ? Math.round(sessions.reduce((acc, s) => acc + (s.score || 0), 0) / sessions.length)
      : 0,
    totalQuestions: sessions.reduce((acc, s) => acc + s.completed_questions, 0),
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-24">
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold">Practice History</h1>
              <p className="text-muted-foreground mt-2">
                Track your progress and review past sessions
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalSessions}</div>
                <p className="text-xs text-muted-foreground mt-1">Practice sessions completed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                <Target className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.avgScore}%</div>
                <p className="text-xs text-muted-foreground mt-1">Across all sessions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Questions Answered</CardTitle>
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalQuestions}</div>
                <p className="text-xs text-muted-foreground mt-1">Total practice questions</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Recent Sessions</h2>
            
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-4 w-64 mt-2" />
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : sessions.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground mb-4">No practice sessions yet</p>
                  <Button onClick={() => navigate("/#practice")}>
                    Start Your First Session
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {sessions.map((session) => (
                  <Card key={session.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <CardTitle className="flex items-center gap-2">
                            {session.topic}
                            <Badge variant="secondary">{session.difficulty}</Badge>
                          </CardTitle>
                          <CardDescription>
                            {format(new Date(session.created_at), "PPP 'at' p")}
                          </CardDescription>
                        </div>
                        {session.score !== null && (
                          <div className="text-right">
                            <div className="text-2xl font-bold">{session.score}%</div>
                            <p className="text-xs text-muted-foreground">Score</p>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <span>
                          {session.completed_questions} / {session.total_questions} questions completed
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default History;
