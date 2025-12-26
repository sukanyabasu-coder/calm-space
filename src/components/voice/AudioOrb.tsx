import { cn } from '@/lib/utils';
import { SpeakingState } from '@/hooks/useVapi';

interface AudioOrbProps {
  volumeLevel: number;
  speakingState: SpeakingState;
  isConnected: boolean;
}

export function AudioOrb({ volumeLevel, speakingState, isConnected }: AudioOrbProps) {
  // Scale based on volume level (0-1 range from Vapi)
  const scale = isConnected ? 1 + volumeLevel * 0.5 : 1;
  const isSpeaking = speakingState === 'speaking';

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow rings */}
      <div
        className={cn(
          "absolute w-40 h-40 rounded-full transition-all duration-300",
          "bg-gradient-to-br from-primary/20 to-accent/20",
          isConnected && "animate-pulse-glow"
        )}
        style={{
          transform: `scale(${scale * 1.2})`,
          opacity: isConnected ? 0.6 : 0.3,
        }}
      />
      <div
        className={cn(
          "absolute w-32 h-32 rounded-full transition-all duration-200",
          "bg-gradient-to-br from-primary/30 to-accent/30",
          isConnected && "animate-pulse-glow"
        )}
        style={{
          transform: `scale(${scale * 1.1})`,
          opacity: isConnected ? 0.7 : 0.4,
          animationDelay: '0.1s',
        }}
      />
      
      {/* Main orb */}
      <div
        className={cn(
          "relative w-24 h-24 rounded-full transition-all duration-150",
          "bg-gradient-to-br from-primary to-accent",
          "shadow-lg",
          isSpeaking && "shadow-primary/50 shadow-xl"
        )}
        style={{
          transform: `scale(${scale})`,
          boxShadow: isConnected 
            ? `0 0 ${30 + volumeLevel * 40}px hsl(var(--primary) / ${0.3 + volumeLevel * 0.3})`
            : undefined,
        }}
      >
        {/* Inner highlight */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/30 to-transparent" />
        
        {/* Center dot */}
        <div 
          className={cn(
            "absolute inset-0 m-auto w-4 h-4 rounded-full bg-white/60",
            "transition-transform duration-150"
          )}
          style={{
            transform: `scale(${1 + volumeLevel * 0.3})`,
          }}
        />
      </div>
    </div>
  );
}
