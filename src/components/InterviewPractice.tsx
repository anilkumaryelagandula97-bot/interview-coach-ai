import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Mic, Send, RotateCcw, MessageSquare } from "lucide-react";

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

  const handleNextQuestion = () => {
    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setAnswer("");
      setShowFeedback(false);
    }
  };

  const handleGetFeedback = () => {
    setShowFeedback(true);
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setAnswer("");
    setShowFeedback(false);
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
                  <Button variant="outline" size="sm" className="gap-2">
                    <Mic className="w-4 h-4" />
                    Voice Input
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
            This is a demo. Sign up for full AI-powered analysis and personalized coaching.
          </div>
        </div>
      </div>
    </section>
  );
};
