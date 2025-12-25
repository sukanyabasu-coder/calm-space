import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Puzzle, RefreshCw, CheckCircle, Save, ArrowRight } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useReflections } from '@/hooks/useReflections';
import { Reflection } from '@/types/reflection';
import { useToast } from '@/hooks/use-toast';

export default function Summary() {
  const navigate = useNavigate();
  const location = useLocation();
  const { getReflection, reflections } = useReflections();
  const { toast } = useToast();
  const [reflection, setReflection] = useState<Reflection | null>(null);

  const reflectionId = location.state?.reflectionId;

  useEffect(() => {
    if (reflectionId) {
      const found = getReflection(reflectionId);
      if (found) {
        setReflection(found);
      }
    } else if (reflections.length > 0) {
      // Show most recent if no ID provided
      setReflection(reflections[0]);
    }
  }, [reflectionId, getReflection, reflections]);

  const handleSave = () => {
    toast({
      title: "Reflection saved",
      description: "Your reflection has been saved successfully.",
    });
    navigate('/home');
  };

  const handleReflectMore = () => {
    navigate('/reflect');
  };

  if (!reflection) {
    return (
      <AppLayout title="Summary">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <p className="text-muted-foreground">No reflection found.</p>
          <Button onClick={() => navigate('/reflect')} className="mt-4">
            Start a Reflection
          </Button>
        </div>
      </AppLayout>
    );
  }

  const summaryCards = [
    {
      icon: Puzzle,
      title: 'Your Thought',
      content: reflection.thought || 'No thought recorded',
      emoji: '🧩',
      color: 'border-l-emotion-sad',
    },
    {
      icon: RefreshCw,
      title: 'Balanced Thought',
      content: reflection.reframe || 'No reframe recorded',
      emoji: '🔄',
      color: 'border-l-primary',
    },
    {
      icon: CheckCircle,
      title: 'Small Action',
      content: reflection.action || 'No action recorded',
      emoji: '✅',
      color: 'border-l-success',
    },
  ];

  return (
    <AppLayout title="Reflection Complete" showNav={false}>
      <div className="space-y-6 animate-fade-in">
        {/* Success message */}
        <div className="text-center space-y-2 pt-4">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground">
            Well done!
          </h2>
          <p className="text-muted-foreground">
            You took a moment to reflect. That's a meaningful step.
          </p>
        </div>

        {/* Summary cards */}
        <div className="space-y-4 pt-4">
          {summaryCards.map((card, index) => (
            <Card 
              key={index} 
              className={`border-l-4 ${card.color} bg-card/50`}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <span>{card.emoji}</span>
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">
                  {card.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Emotions display */}
        {reflection.emotions.length > 0 && (
          <div className="pt-2">
            <p className="text-sm text-muted-foreground mb-2">Feelings identified:</p>
            <div className="flex flex-wrap gap-2">
              {reflection.emotions.map((emotion) => (
                <span 
                  key={emotion}
                  className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm capitalize"
                >
                  {emotion}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col gap-3 pt-6">
          <Button onClick={handleSave} className="w-full gap-2" size="lg">
            <Save className="w-4 h-4" />
            Save & Return Home
          </Button>
          <Button 
            variant="outline" 
            onClick={handleReflectMore} 
            className="w-full gap-2"
            size="lg"
          >
            <ArrowRight className="w-4 h-4" />
            Reflect More
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
