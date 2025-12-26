import { useState, useEffect, useRef, useCallback } from 'react';
import Vapi from '@vapi-ai/web';

const VAPI_PUBLIC_KEY = '966ce954-7e2a-40c4-aabc-963e5adeb15f';
const VAPI_ASSISTANT_ID = '9fbe50ce-44d9-41d6-a1cb-18fd98d66620';

export type CallStatus = 'idle' | 'connecting' | 'connected';
export type SpeakingState = 'listening' | 'speaking';

export interface VapiTranscript {
  role: 'user' | 'assistant';
  text: string;
}

export function useVapi() {
  const vapiRef = useRef<Vapi | null>(null);
  const [callStatus, setCallStatus] = useState<CallStatus>('idle');
  const [speakingState, setSpeakingState] = useState<SpeakingState>('listening');
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [transcripts, setTranscripts] = useState<VapiTranscript[]>([]);

  useEffect(() => {
    const vapi = new Vapi(VAPI_PUBLIC_KEY);
    vapiRef.current = vapi;

    vapi.on('call-start', () => {
      setCallStatus('connected');
      setSpeakingState('listening');
    });

    vapi.on('call-end', () => {
      setCallStatus('idle');
      setSpeakingState('listening');
      setVolumeLevel(0);
    });

    vapi.on('speech-start', () => {
      setSpeakingState('speaking');
    });

    vapi.on('speech-end', () => {
      setSpeakingState('listening');
    });

    vapi.on('volume-level', (level: number) => {
      setVolumeLevel(level);
    });

    vapi.on('message', (message: any) => {
      if (message.type === 'transcript') {
        const transcript: VapiTranscript = {
          role: message.role,
          text: message.transcript,
        };
        if (message.transcriptType === 'final') {
          setTranscripts(prev => [...prev, transcript]);
        }
      }
    });

    vapi.on('error', (error: any) => {
      console.error('Vapi error:', error);
      setCallStatus('idle');
    });

    return () => {
      vapi.stop();
    };
  }, []);

  const startCall = useCallback(async () => {
    if (!vapiRef.current || callStatus !== 'idle') return;
    
    setCallStatus('connecting');
    setTranscripts([]);
    
    try {
      await vapiRef.current.start(VAPI_ASSISTANT_ID);
    } catch (error) {
      console.error('Failed to start call:', error);
      setCallStatus('idle');
    }
  }, [callStatus]);

  const stopCall = useCallback(() => {
    if (!vapiRef.current) return;
    vapiRef.current.stop();
    setCallStatus('idle');
  }, []);

  const toggleMute = useCallback(() => {
    if (!vapiRef.current) return;
    const newMuted = !isMuted;
    vapiRef.current.setMuted(newMuted);
    setIsMuted(newMuted);
  }, [isMuted]);

  const toggleCall = useCallback(() => {
    if (callStatus === 'idle') {
      startCall();
    } else {
      stopCall();
    }
  }, [callStatus, startCall, stopCall]);

  return {
    callStatus,
    speakingState,
    volumeLevel,
    isMuted,
    transcripts,
    startCall,
    stopCall,
    toggleCall,
    toggleMute,
  };
}
