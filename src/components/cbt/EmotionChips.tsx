import { Emotion } from '@/types/reflection';
import { cn } from '@/lib/utils';

const EMOTIONS: { value: Emotion; label: string; color: string }[] = [
  { value: 'anxious', label: 'Anxious', color: 'bg-emotion-anxious' },
  { value: 'sad', label: 'Sad', color: 'bg-emotion-sad' },
  { value: 'angry', label: 'Angry', color: 'bg-emotion-angry' },
  { value: 'overwhelmed', label: 'Overwhelmed', color: 'bg-emotion-overwhelmed' },
  { value: 'guilty', label: 'Guilty', color: 'bg-emotion-guilty' },
  { value: 'calm', label: 'Calm', color: 'bg-emotion-calm' },
  { value: 'other', label: 'Other', color: 'bg-muted' },
];

interface EmotionChipsProps {
  selected: Emotion[];
  onChange: (emotions: Emotion[]) => void;
}

export function EmotionChips({ selected, onChange }: EmotionChipsProps) {
  const toggleEmotion = (emotion: Emotion) => {
    if (selected.includes(emotion)) {
      onChange(selected.filter(e => e !== emotion));
    } else {
      onChange([...selected, emotion]);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Select all that apply
      </p>
      <div className="flex flex-wrap gap-3">
        {EMOTIONS.map(({ value, label, color }) => {
          const isSelected = selected.includes(value);
          return (
            <button
              key={value}
              type="button"
              onClick={() => toggleEmotion(value)}
              className={cn(
                "px-5 py-3 rounded-full text-sm font-medium transition-all duration-200",
                "border-2",
                isSelected
                  ? `${color} text-white border-transparent shadow-md scale-105`
                  : "bg-card text-foreground border-border hover:border-primary/30 hover:bg-muted"
              )}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
