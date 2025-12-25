import { useNavigate } from 'react-router-dom';
import { Sparkles, Sun, Moon } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const quickActions = [
  {
    id: 'stress',
    title: 'Stress Check-In',
    description: 'Quick check when feeling overwhelmed',
    icon: '🌤️',
    type: 'stress',
  },
  {
    id: 'daily',
    title: 'Daily Reflection',
    description: 'Process your day mindfully',
    icon: '📝',
    type: 'daily',
  },
  {
    id: 'night',
    title: 'Night Reflection',
    description: 'Wind down before sleep',
    icon: '🌙',
    type: 'night',
  },
];

export default function Home() {
  const navigate = useNavigate();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleStartReflection = (type?: string) => {
    navigate('/reflect', { state: { type } });
  };

  return (
    <AppLayout title="CalmMind">
      <div className="space-y-8 animate-fade-in">
        {/* Greeting section */}
        <div className="text-center space-y-2 pt-4">
          <h2 className="text-2xl font-semibold text-foreground">
            {getGreeting()}
          </h2>
          <p className="text-muted-foreground text-lg">
            How are you feeling today?
          </p>
        </div>

        {/* Primary CTA */}
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={() => handleStartReflection()}
            className="px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Start Reflection
          </Button>
        </div>

        {/* Quick action cards */}
        <div className="space-y-3 pt-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide px-1">
            Quick Actions
          </h3>
          <div className="space-y-3">
            {quickActions.map((action) => (
              <Card 
                key={action.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors duration-200 border-border/50"
                onClick={() => handleStartReflection(action.type)}
              >
                <CardContent className="flex items-center gap-4 p-4">
                  <span className="text-2xl">{action.icon}</span>
                  <div className="flex-1">
                    <CardTitle className="text-base font-medium">
                      {action.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {action.description}
                    </CardDescription>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
