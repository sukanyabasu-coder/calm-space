import { Phone, PhoneOff, Mic, MicOff, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AudioOrb } from './AudioOrb';
import { useVapi, CallStatus, SpeakingState, VapiTranscript } from '@/hooks/useVapi';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface VoiceInterfaceProps {
  onClose: () => void;
}

function StatusBar({ callStatus, speakingState }: { callStatus: CallStatus; speakingState: SpeakingState }) {
  const getStatusText = () => {
    if (callStatus === 'connecting') return 'Connecting...';
    if (callStatus === 'connected') {
      return speakingState === 'speaking' ? 'Speaking...' : 'Listening...';
    }
    return 'Ready to talk';
  };

  const getStatusColor = () => {
    if (callStatus === 'connecting') return 'text-yellow-500';
    if (callStatus === 'connected') {
      return speakingState === 'speaking' ? 'text-primary' : 'text-success';
    }
    return 'text-muted-foreground';
  };

  return (
    <div className={cn("text-sm font-medium transition-colors", getStatusColor())}>
      <span className="flex items-center gap-2">
        {callStatus === 'connecting' && (
          <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
        )}
        {callStatus === 'connected' && (
          <span className={cn(
            "w-2 h-2 rounded-full",
            speakingState === 'speaking' ? "bg-primary animate-pulse" : "bg-success"
          )} />
        )}
        {getStatusText()}
      </span>
    </div>
  );
}

function TranscriptArea({ transcripts }: { transcripts: VapiTranscript[] }) {
  if (transcripts.length === 0) {
    return (
      <div className="text-center text-muted-foreground text-sm py-4">
        Your conversation will appear here...
      </div>
    );
  }

  return (
    <ScrollArea className="h-32 w-full">
      <div className="space-y-2 p-2">
        {transcripts.map((t, i) => (
          <div
            key={i}
            className={cn(
              "text-sm p-2 rounded-lg",
              t.role === 'user' 
                ? "bg-primary/10 text-foreground ml-8" 
                : "bg-secondary text-secondary-foreground mr-8"
            )}
          >
            <span className="font-medium text-xs text-muted-foreground block mb-1">
              {t.role === 'user' ? 'You' : 'Counselor'}
            </span>
            {t.text}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

export function VoiceInterface({ onClose }: VoiceInterfaceProps) {
  const {
    callStatus,
    speakingState,
    volumeLevel,
    isMuted,
    transcripts,
    toggleCall,
    toggleMute,
  } = useVapi();

  const isConnected = callStatus === 'connected';
  const isConnecting = callStatus === 'connecting';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md mx-4 flex flex-col items-center gap-6 p-6">
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-0 right-0"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </Button>

        {/* Title */}
        <div className="text-center space-y-1">
          <h3 className="text-xl font-semibold text-foreground">Voice Counselor</h3>
          <p className="text-sm text-muted-foreground">Talk through your thoughts</p>
        </div>

        {/* Audio Orb */}
        <div className="py-8">
          <AudioOrb 
            volumeLevel={volumeLevel} 
            speakingState={speakingState}
            isConnected={isConnected}
          />
        </div>

        {/* Status Bar */}
        <StatusBar callStatus={callStatus} speakingState={speakingState} />

        {/* Control Buttons */}
        <div className="flex items-center gap-4">
          {/* Mute Button */}
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "w-12 h-12 rounded-full",
              isMuted && "bg-destructive/10 border-destructive text-destructive"
            )}
            onClick={toggleMute}
            disabled={!isConnected}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </Button>

          {/* Main Talk Button */}
          <Button
            size="lg"
            className={cn(
              "w-20 h-20 rounded-full transition-all",
              isConnected 
                ? "bg-destructive hover:bg-destructive/90" 
                : "bg-primary hover:bg-primary/90",
              isConnecting && "animate-pulse"
            )}
            onClick={toggleCall}
            disabled={isConnecting}
          >
            {isConnected ? (
              <PhoneOff className="w-8 h-8" />
            ) : (
              <Phone className="w-8 h-8" />
            )}
          </Button>

          {/* Spacer for symmetry */}
          <div className="w-12 h-12" />
        </div>

        {/* Transcript Area */}
        <div className="w-full mt-4 bg-card rounded-lg border border-border">
          <TranscriptArea transcripts={transcripts} />
        </div>

        {/* Tip */}
        <p className="text-xs text-muted-foreground text-center">
          {isMuted ? "You're muted - the AI can't hear you" : "Tap the phone to start/end the call"}
        </p>
      </div>
    </div>
  );
}
