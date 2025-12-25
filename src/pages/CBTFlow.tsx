import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { ThemeToggle } from '@/components/ThemeToggle';
import { EmotionChips } from '@/components/cbt/EmotionChips';
import { useReflections } from '@/hooks/useReflections';
import { CBTStep, Emotion, CBTFlowState } from '@/types/reflection';

const STEPS: { key: CBTStep; title: string; prompt: string; placeholder?: string }[] = [
  {
    key: 'situation',
    title: 'Situation',
    prompt: 'What happened?',
    placeholder: 'Describe the situation briefly...',
  },
  {
    key: 'thought',
    title: 'Thought',
    prompt: 'What thought came to your mind?',
    placeholder: 'What were you thinking in that moment?',
  },
  {
    key: 'emotion',
    title: 'Emotion',
    prompt: 'How did it make you feel?',
  },
  {
    key: 'reframe',
    title: 'Reframe',
    prompt: 'Is there another way to look at this?',
    placeholder: 'Try to see it from a different perspective...',
  },
  {
    key: 'action',
    title: 'Action',
    prompt: 'One small thing you can try next time',
    placeholder: 'A gentle step forward...',
  },
];

export default function CBTFlow() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addReflection } = useReflections();
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [flowState, setFlowState] = useState<CBTFlowState>({
    currentStep: 'situation',
    situation: '',
    thought: '',
    emotions: [],
    reframe: '',
    action: '',
  });

  const currentStep = STEPS[currentStepIndex];
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === STEPS.length - 1;

  const updateField = (key: keyof CBTFlowState, value: string | Emotion[]) => {
    setFlowState(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (isLastStep) {
      // Save reflection and go to summary
      const reflection = addReflection({
        situation: flowState.situation,
        thought: flowState.thought,
        emotions: flowState.emotions,
        reframe: flowState.reframe,
        action: flowState.action,
        completed: true,
      });
      navigate('/summary', { state: { reflectionId: reflection.id } });
    } else {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const handleExit = () => {
    navigate('/home');
  };

  const canProceed = () => {
    const step = currentStep.key;
    if (step === 'emotion') {
      return true; // Emotions are optional
    }
    return true; // All steps are optional per spec
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between h-14 px-4 max-w-lg mx-auto">
          <Button variant="ghost" size="icon" onClick={handleExit}>
            <X className="w-5 h-5" />
          </Button>
          <span className="text-sm font-medium text-muted-foreground">
            Step {currentStepIndex + 1} of {STEPS.length}
          </span>
          <ThemeToggle />
        </div>
        {/* Progress bar */}
        <div className="px-4 pb-3 max-w-lg mx-auto">
          <Progress value={progress} className="h-2" />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col px-4 py-8 max-w-lg mx-auto w-full animate-fade-in">
        <div className="flex-1 space-y-6">
          {/* Step title */}
          <div className="space-y-2">
            <span className="text-sm font-medium text-primary uppercase tracking-wide">
              {currentStep.title}
            </span>
            <h2 className="text-2xl font-semibold text-foreground">
              {currentStep.prompt}
            </h2>
          </div>

          {/* Input area */}
          <div className="flex-1">
          {currentStep.key === 'emotion' ? (
              <EmotionChips
                selected={flowState.emotions}
                onChange={(emotions) => updateField('emotions', emotions)}
              />
            ) : (
              <Textarea
                value={flowState[currentStep.key as keyof Omit<CBTFlowState, 'currentStep' | 'emotions'>] as string || ''}
                onChange={(e) => updateField(currentStep.key as keyof CBTFlowState, e.target.value)}
                placeholder={currentStep.placeholder}
                className="min-h-[200px] text-base resize-none bg-card border-border/50 focus:border-primary/50"
              />
            )}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between pt-6 gap-4">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={isFirstStep}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <Button
            variant="ghost"
            onClick={handleSkip}
            className="text-muted-foreground"
          >
            Skip
          </Button>

          <Button
            onClick={handleNext}
            className="gap-2"
          >
            {isLastStep ? 'Finish' : 'Continue'}
            {!isLastStep && <ArrowRight className="w-4 h-4" />}
          </Button>
        </div>
      </main>
    </div>
  );
}
