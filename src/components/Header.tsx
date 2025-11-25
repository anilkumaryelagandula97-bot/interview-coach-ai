import { Button } from "@/components/ui/button";
import { Sparkles, History } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">CreatorCoach AI</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
              How It Works
            </a>
            <a href="#practice" className="text-sm font-medium hover:text-primary transition-colors">
              Try Demo
            </a>
            <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
              Pricing
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => navigate("/history")}
                  className="hidden sm:flex"
                >
                  <History className="w-5 h-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={signOut}
                  className="hidden sm:flex"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate("/login")}
                  className="hidden sm:flex"
                >
                  Sign In
                </Button>
                <Button 
                  className="bg-gradient-primary hover:opacity-90 transition-opacity"
                  onClick={() => navigate("/signup")}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
