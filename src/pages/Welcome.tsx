import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Theme toggle in corner */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {/* Main content - centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center animate-fade-in">
        {/* Logo/Icon */}
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-8">
          <Heart className="w-10 h-10 text-primary" />
        </div>

        {/* App name */}
        <h1 className="text-4xl font-bold text-foreground mb-3">
          CalmMind
        </h1>

        {/* Tagline */}
        <p className="text-xl text-muted-foreground mb-12 max-w-xs leading-relaxed">
          A safe space to reflect and reset.
        </p>

        {/* CTA Button */}
        <Button 
          size="lg"
          onClick={() => navigate('/home')}
          className="px-10 py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Get Started
        </Button>
      </div>

      {/* Disclaimer */}
      <div className="px-6 pb-8 text-center">
        <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
          This app supports reflection. It is not a substitute for therapy or professional mental health care.
        </p>
      </div>
    </div>
  );
}
