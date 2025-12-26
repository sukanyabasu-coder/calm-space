import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreathingExerciseProps {
  onComplete: () => void;
  onSkip: () => void;
}

type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'rest';

const PHASES: { phase: BreathPhase; duration: number; instruction: string }[] = [
  { phase: 'inhale', duration: 4, instruction: 'Breathe in...' },
  { phase: 'hold', duration: 4, instruction: 'Hold...' },
  { phase: 'exhale', duration: 4, instruction: 'Breathe out...' },
  { phase: 'rest', duration: 2, instruction: 'Rest...' },
];

const TOTAL_CYCLES = 3; // ~3 cycles for about 42 seconds

export function BreathingExercise({ onComplete, onSkip }: BreathingExerciseProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [countdown, setCountdown] = useState(PHASES[0].duration);

  const currentPhase = PHASES[currentPhaseIndex];

  const startExercise = useCallback(() => {
    setIsActive(true);
    setCurrentPhaseIndex(0);
    setCycleCount(0);
    setCountdown(PHASES[0].duration);
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          // Move to next phase
          const nextPhaseIndex = (currentPhaseIndex + 1) % PHASES.length;
          setCurrentPhaseIndex(nextPhaseIndex);
          
          if (nextPhaseIndex === 0) {
            // Completed a full cycle
            const newCycleCount = cycleCount + 1;
            setCycleCount(newCycleCount);
            
            if (newCycleCount >= TOTAL_CYCLES) {
              setIsActive(false);
              onComplete();
              return PHASES[0].duration;
            }
          }
          
          return PHASES[nextPhaseIndex].duration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, currentPhaseIndex, cycleCount, onComplete]);

  const getCircleScale = () => {
    if (!isActive) return 1;
    
    switch (currentPhase.phase) {
      case 'inhale':
        return 1.5;
      case 'hold':
        return 1.5;
      case 'exhale':
        return 1;
      case 'rest':
        return 1;
      default:
        return 1;
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 py-8 animate-fade-in">
      {/* Skip button */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-4 right-4 text-muted-foreground"
        onClick={onSkip}
      >
        <X className="w-4 h-4 mr-1" />
        Skip
      </Button>

      {/* Title */}
      <div className="text-center space-y-1">
        <h3 className="text-xl font-semibold text-foreground">Take a Moment</h3>
        <p className="text-sm text-muted-foreground">A brief breathing exercise to center yourself</p>
      </div>

      {/* Breathing circle */}
      <div className="relative flex items-center justify-center h-48 w-48">
        {/* Outer ring */}
        <div 
          className={cn(
            "absolute w-40 h-40 rounded-full border-2 border-primary/30",
            "transition-transform duration-1000 ease-in-out"
          )}
          style={{ transform: `scale(${getCircleScale()})` }}
        />
        
        {/* Main breathing circle */}
        <div 
          className={cn(
            "w-32 h-32 rounded-full",
            "bg-gradient-to-br from-primary/40 to-accent/40",
            "flex items-center justify-center",
            "transition-transform duration-1000 ease-in-out",
            "shadow-lg"
          )}
          style={{ 
            transform: `scale(${getCircleScale()})`,
            boxShadow: isActive ? '0 0 40px hsl(var(--primary) / 0.3)' : undefined
          }}
        >
          {isActive ? (
            <span className="text-3xl font-bold text-primary">{countdown}</span>
          ) : (
            <span className="text-sm text-muted-foreground text-center px-4">
              Tap to begin
            </span>
          )}
        </div>
      </div>

      {/* Instruction text */}
      <div className="h-8 flex items-center">
        {isActive ? (
          <p className="text-lg font-medium text-foreground animate-fade-in">
            {currentPhase.instruction}
          </p>
        ) : null}
      </div>

      {/* Progress indicator */}
      {isActive && (
        <div className="flex gap-2">
          {Array.from({ length: TOTAL_CYCLES }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                i < cycleCount ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>
      )}

      {/* Start button */}
      {!isActive && (
        <Button onClick={startExercise} className="mt-4">
          Start Breathing Exercise
        </Button>
      )}
    </div>
  );
}
