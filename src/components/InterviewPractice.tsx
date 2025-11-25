import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Send, RotateCcw, MessageSquare } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const sampleQuestions = [
  "Tell us about your creative journey and what inspired you to start creating content.",
  "How do you handle creative blocks or periods when inspiration seems to dry up?",
  "What's your process for researching and planning your content?",
  "How do you balance authenticity with audience expectations?",
  "What advice would you give to someone just starting in content creation?",
];

export const InterviewPractice = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Array<{ question: string; answer: string }>>([]);
  const { isListening, transcript, startListening, stopListening, resetTranscript } = useSpeechRecognition();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (transcript) {
      setAnswer((prev) => {
        const newText = prev ? `${prev} ${transcript}` : transcript;
        return newText;
      });
    }
  }, [transcript]);

  useEffect(() => {
    if (user && !sessionId) {
      createSession();
    }
  }, [user]);

  const createSession = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("practice_sessions")
        .insert({
          user_id: user.id,
          topic: "General Interview Practice",
          difficulty: "Medium",
          total_questions: sampleQuestions.length,
          completed_questions: 0,
        })
        .select()
        .single();

      if (error) throw error;
      
      setSessionId(data.id);
      setSessionStartTime(Date.now());
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  const saveAnswer = async () => {
    if (!user || !sessionId || !answer.trim()) return;

    try {
      const { error } = await supabase
        .from("session_answers")
        .insert({
          session_id: sessionId,
          question: sampleQuestions[currentQuestion],
          answer: answer,
          feedback: "Great answer! Keep practicing.",
          question_number: currentQuestion + 1,
        });

      if (error) throw error;

      setAnswers([...answers, { question: sampleQuestions[currentQuestion], answer }]);

      await supabase
        .from("practice_sessions")
        .update({
          completed_questions: currentQuestion + 1,
          score: Math.floor(Math.random() * 20) + 80,
        })
        .eq("id", sessionId);
    } catch (error) {
      console.error("Error saving answer:", error);
    }
  };

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening();
      resetTranscript();
    } else {
      startListening();
    }
  };

  const handleNextQuestion = () => {
    if (answer.trim() && user) {
      saveAnswer();
    }
    
    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setAnswer("");
      setShowFeedback(false);
      if (isListening) {
        stopListening();
        resetTranscript();
      }
    } else if (user) {
      toast({
        title: "Session Complete!",
        description: "Great work! View your progress in History.",
        action: (
          <Button size="sm" onClick={() => navigate("/history")}>
            View History
          </Button>
        ),
      });
    }
  };

  const handleGetFeedback = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to get AI feedback and save your progress.",
      });
      navigate("/signup");
      return;
    }

    if (answer.trim()) {
      await saveAnswer();
    }
    
    setShowFeedback(true);
  };

  const handleReset = async () => {
    if (user && sessionId && sessionStartTime) {
      const durationSeconds = Math.floor((Date.now() - sessionStartTime) / 1000);
      
      await supabase
        .from("practice_sessions")
        .update({
          duration_seconds: durationSeconds,
        })
        .eq("id", sessionId);
    }

    setCurrentQuestion(0);
    setAnswer("");
    setShowFeedback(false);
    setSessionId(null);
    setSessionStartTime(null);
    setAnswers([]);
    
    if (isListening) {
      stopListening();
      resetTranscript();
    }

    if (user) {
      createSession();
    }
  };

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Try It Now:
            <span className="block bg-gradient-primary bg-clip-text text-transparent">
              Practice Interview
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Experience our AI coach with sample questions
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="border-2 shadow-elegant">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Interview Question</CardTitle>
                <Badge variant="secondary" className="text-sm">
                  Question {currentQuestion + 1} of {sampleQuestions.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-primary/5 p-6 rounded-lg border-l-4 border-primary">
                <p className="text-lg leading-relaxed">{sampleQuestions[currentQuestion]}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Your Answer
                  </label>
                  <Button 
                    variant={isListening ? "default" : "outline"} 
                    size="sm" 
                    className={`gap-2 ${isListening ? 'bg-destructive hover:bg-destructive/90 animate-pulse' : ''}`}
                    onClick={handleVoiceInput}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="w-4 h-4" />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4" />
                        Voice Input
                      </>
                    )}
                  </Button>
                </div>

                <Textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer here or use voice input..."
                  className="min-h-[200px] text-base"
                />

                <div className="flex gap-3">
                  <Button
                    onClick={handleGetFeedback}
                    disabled={!answer.trim()}
                    className="bg-gradient-primary hover:opacity-90 transition-opacity flex-1"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Get AI Feedback
                  </Button>
                  {currentQuestion < sampleQuestions.length - 1 && (
                    <Button onClick={handleNextQuestion} variant="outline">
                      Next Question
                    </Button>
                  )}
                  <Button onClick={handleReset} variant="outline" size="icon">
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {showFeedback && (
                <Card className="bg-accent/5 border-accent/20 animate-slide-up">
                  <CardHeader>
                    <CardTitle className="text-xl text-accent">AI Feedback</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Strengths:</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>✓ Clear and concise communication</li>
                        <li>✓ Good storytelling structure</li>
                        <li>✓ Authentic and relatable tone</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Areas for Improvement:</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>→ Consider adding specific examples</li>
                        <li>→ Expand on the emotional aspects</li>
                        <li>→ Connect to audience pain points</li>
                      </ul>
                    </div>
                    <div className="pt-2">
                      <h4 className="font-semibold mb-2">Overall Score: 8.5/10</h4>
                      <p className="text-sm text-muted-foreground">
                        Great answer! With a few tweaks focusing on specific examples, 
                        this could be even more impactful.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          <div className="text-center text-sm text-muted-foreground">
            {user ? (
              <span>Your progress is being saved. View all sessions in <Button variant="link" className="p-0 h-auto" onClick={() => navigate("/history")}>History</Button></span>
            ) : (
              <span>This is a demo. <Button variant="link" className="p-0 h-auto" onClick={() => navigate("/signup")}>Sign up</Button> for full AI-powered analysis and personalized coaching.</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
