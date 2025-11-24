import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Choose Your Focus",
    description: "Select interview type or content format you want to practice - podcast, video, written, or panel discussions.",
  },
  {
    number: "02",
    title: "Practice with AI",
    description: "Our AI generates realistic questions and scenarios. Respond naturally as if in a real interview.",
  },
  {
    number: "03",
    title: "Get Instant Feedback",
    description: "Receive detailed analysis on your performance, including strengths and areas for improvement.",
  },
  {
    number: "04",
    title: "Improve & Repeat",
    description: "Apply feedback, track your progress, and practice until you feel confident and ready.",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Simple Process,
            <span className="block bg-gradient-primary bg-clip-text text-transparent">
              Powerful Results
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Get started in minutes and see improvement in your first session
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative animate-fade-in" style={{ animationDelay: `${index * 0.15}s` }}>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-primary to-transparent -translate-x-4"></div>
              )}
              
              <Card className="border-2 hover:border-primary transition-all duration-300 hover:shadow-elegant h-full">
                <CardContent className="p-6">
                  <div className="text-6xl font-bold text-primary/20 mb-4">{step.number}</div>
                  <CheckCircle2 className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
