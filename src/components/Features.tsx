import { Mic, MessageSquare, TrendingUp, Zap, Target, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Mic,
    title: "AI Interview Practice",
    description: "Practice with realistic AI-generated interview questions tailored to your niche and experience level.",
  },
  {
    icon: MessageSquare,
    title: "Instant Feedback",
    description: "Get real-time constructive feedback on your answers, tone, pacing, and delivery style.",
  },
  {
    icon: TrendingUp,
    title: "Track Progress",
    description: "Monitor your improvement over time with detailed analytics and performance insights.",
  },
  {
    icon: Zap,
    title: "Content Coaching",
    description: "Submit your content and receive AI-powered suggestions to enhance quality and engagement.",
  },
  {
    icon: Target,
    title: "Personalized Training",
    description: "Customized coaching plans based on your goals, whether podcast, video, or written content.",
  },
  {
    icon: Users,
    title: "Multiple Scenarios",
    description: "Practice various interview formats: podcasts, panels, video interviews, and press interactions.",
  },
];

export const Features = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Everything You Need to
            <span className="block bg-gradient-accent bg-clip-text text-transparent">
              Shine in Every Interview
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Comprehensive AI-powered tools designed specifically for content creators
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="border-2 hover:border-primary transition-all duration-300 hover:shadow-elegant animate-fade-in group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
