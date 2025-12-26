import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, X, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { ThemeToggle } from '@/components/ThemeToggle';
import { EmotionChips } from '@/components/cbt/EmotionChips';
import { BreathingExercise } from '@/components/cbt/BreathingExercise';
import { InsightCard } from '@/components/cbt/InsightCard';
import { VoiceInterface } from '@/components/voice/VoiceInterface';
import { useReflections } from '@/hooks/useReflections';
import { CBTStep, Emotion, CBTFlowState } from '@/types/reflection';
import { getInsightForEmotions } from '@/lib/supportiveInsights';

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
    key: 'breathe',
    title: 'Breathe',
    prompt: 'Take a moment to center yourself',
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
  const { addReflection } = useReflections();
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showVoiceInterface, setShowVoiceInterface] = useState(false);
  const [flowState, setFlowState] = useState<CBTFlowState>({
    currentStep: 'situation',
    situation: '',
    thought: '',
    emotions: [],
    reframe: '',
    action: '',
    breathingCompleted: false,
    voiceUsed: false,
  });

  const currentStep = STEPS[currentStepIndex];
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === STEPS.length - 1;

  const insights = getInsightForEmotions(flowState.emotions);

  const updateField = (key: keyof CBTFlowState, value: string | Emotion[] | boolean) => {
    setFlowState(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (isLastStep) {
      const reflection = addReflection({
        situation: flowState.situation,
        thought: flowState.thought,
        emotions: flowState.emotions,
        reframe: flowState.reframe,
        action: flowState.action,
        completed: true,
        aiInsight: insights.validation,
        aiAffirmation: insights.actionAffirmation,
        voiceUsed: flowState.voiceUsed,
        breathingCompleted: flowState.breathingCompleted,
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

  const handleBreathingComplete = () => {
    updateField('breathingCompleted', true);
    handleNext();
  };

  const handleBreathingSkip = () => {
    handleNext();
  };

  const handleVoiceUsed = () => {
    updateField('voiceUsed', true);
  };

  const renderStepContent = () => {
    if (currentStep.key === 'breathe') {
      return (
        <div className="flex-1 flex flex-col">
          {/* Insight card before breathing */}
          <InsightCard 
            message={insights.validation}
            className="mb-6"
          />
          
          <BreathingExercise 
            onComplete={handleBreathingComplete}
            onSkip={handleBreathingSkip}
          />
        </div>
      );
    }

    if (currentStep.key === 'emotion') {
      return (
        <EmotionChips
          selected={flowState.emotions}
          onChange={(emotions) => updateField('emotions', emotions)}
        />
      );
    }

    if (currentStep.key === 'reframe') {
      return (
        <div className="space-y-4">
          {/* Reframe prompt insight */}
          <InsightCard 
            title="Something to consider"
            message={insights.reframePrompt}
            className="mb-4"
          />
          
          <Textarea
            value={flowState.reframe}
            onChange={(e) => updateField('reframe', e.target.value)}
            placeholder={currentStep.placeholder}
            className="min-h-[150px] text-base resize-none bg-card border-border/50 focus:border-primary/50"
          />
        </div>
      );
    }

    if (currentStep.key === 'action') {
      return (
        <div className="space-y-4">
          {/* Action affirmation insight */}
          <InsightCard 
            title="You're doing great"
            message={insights.actionAffirmation}
            variant="affirmation"
            className="mb-4"
          />
          
          <Textarea
            value={flowState.action}
            onChange={(e) => updateField('action', e.target.value)}
            placeholder={currentStep.placeholder}
            className="min-h-[150px] text-base resize-none bg-card border-border/50 focus:border-primary/50"
          />
        </div>
      );
    }

    // Default text input for situation/thought
    return (
      <Textarea
        value={flowState[currentStep.key as keyof Omit<CBTFlowState, 'currentStep' | 'emotions' | 'breathingCompleted' | 'voiceUsed' | 'aiInsight' | 'aiAffirmation'>] as string || ''}
        onChange={(e) => updateField(currentStep.key as keyof CBTFlowState, e.target.value)}
        placeholder={currentStep.placeholder}
        className="min-h-[200px] text-base resize-none bg-card border-border/50 focus:border-primary/50"
      />
    );
  };

  const showVoiceButton = currentStep.key === 'reframe' || currentStep.key === 'action';

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
          {currentStep.key !== 'breathe' && (
            <div className="space-y-2">
              <span className="text-sm font-medium text-primary uppercase tracking-wide">
                {currentStep.title}
              </span>
              <h2 className="text-2xl font-semibold text-foreground">
                {currentStep.prompt}
              </h2>
            </div>
          )}

          {/* Input area */}
          <div className="flex-1">
            {renderStepContent()}
          </div>
        </div>

        {/* Navigation buttons */}
        {currentStep.key !== 'breathe' && (
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

            {/* Voice button for reframe/action steps */}
            {showVoiceButton && (
              <Button
                variant="outline"
                onClick={() => {
                  handleVoiceUsed();
                  setShowVoiceInterface(true);
                }}
                className="gap-2"
              >
                <Phone className="w-4 h-4" />
                Talk
              </Button>
            )}

            {!showVoiceButton && (
              <Button
                variant="ghost"
                onClick={handleSkip}
                className="text-muted-foreground"
              >
                Skip
              </Button>
            )}

            <Button
              onClick={handleNext}
              className="gap-2"
            >
              {isLastStep ? 'Finish' : 'Continue'}
              {!isLastStep && <ArrowRight className="w-4 h-4" />}
            </Button>
          </div>
        )}
      </main>

      {/* Voice Interface Overlay */}
      {showVoiceInterface && (
        <VoiceInterface onClose={() => setShowVoiceInterface(false)} />
      )}
    </div>
  );
}
