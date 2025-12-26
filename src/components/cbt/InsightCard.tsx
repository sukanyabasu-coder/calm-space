import { Heart, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InsightCardProps {
  title?: string;
  message: string;
  variant?: 'supportive' | 'affirmation';
  className?: string;
}

export function InsightCard({ 
  title = "A gentle perspective", 
  message, 
  variant = 'supportive',
  className 
}: InsightCardProps) {
  const Icon = variant === 'affirmation' ? Sparkles : Heart;
  
  return (
    <div 
      className={cn(
        "relative p-5 rounded-2xl animate-fade-in overflow-hidden",
        "bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10",
        "border border-primary/20",
        className
      )}
    >
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50" />
      
      <div className="relative flex gap-3">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary" />
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 space-y-1">
          <p className="text-xs font-medium text-primary uppercase tracking-wide">
            {title}
          </p>
          <p className="text-foreground leading-relaxed">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
