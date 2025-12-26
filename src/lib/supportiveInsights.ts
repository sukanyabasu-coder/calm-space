import { Emotion } from '@/types/reflection';

interface InsightSet {
  validation: string;
  reframePrompt: string;
  actionAffirmation: string;
}

const emotionInsights: Record<Emotion, InsightSet> = {
  anxious: {
    validation: "It's okay to feel anxious. This feeling often shows up when we care deeply about something. Your awareness of this feeling is already a powerful first step.",
    reframePrompt: "Anxiety sometimes gives us a narrow view. What would you tell a close friend in this same situation?",
    actionAffirmation: "Small, gentle steps forward are still progress. You're doing great by being here.",
  },
  sad: {
    validation: "Sadness is a natural part of being human. It often helps us understand what truly matters to us. It's okay to feel this way.",
    reframePrompt: "When sadness visits, it can color our thoughts. What's one small thing that brought you comfort recently?",
    actionAffirmation: "Healing isn't linear. Every gentle step counts, even the smallest ones.",
  },
  angry: {
    validation: "Anger often protects something we value – boundaries, fairness, or something we love. It's a valid feeling that deserves to be understood.",
    reframePrompt: "Beneath anger, there's often another feeling. What might your anger be trying to protect or express?",
    actionAffirmation: "Finding healthy ways to express and understand anger takes courage. You're on the right path.",
  },
  overwhelmed: {
    validation: "Feeling overwhelmed means you're carrying a lot right now. That takes real strength. It's okay to pause and breathe.",
    reframePrompt: "When everything feels like too much, what's just one small thing you could focus on right now?",
    actionAffirmation: "You don't have to solve everything at once. One tiny step is enough.",
  },
  guilty: {
    validation: "Guilt often comes from caring about doing the right thing. It shows you have values and empathy. That's a good thing.",
    reframePrompt: "Sometimes we're harder on ourselves than we would be on others. What would self-compassion look like here?",
    actionAffirmation: "Learning from our experiences is how we grow. You're already doing that.",
  },
  calm: {
    validation: "It's wonderful that you're feeling calm. This is a great time to reflect with clarity and self-compassion.",
    reframePrompt: "From this place of calm, what new perspective might emerge about your situation?",
    actionAffirmation: "Maintain this peaceful energy as you move forward. You've got this.",
  },
  other: {
    validation: "Your feelings are valid, whatever they may be. There's no right or wrong way to feel in any situation.",
    reframePrompt: "Sometimes our feelings are complex and hard to name. What do you notice when you sit with this feeling?",
    actionAffirmation: "Every step toward understanding yourself better is valuable. Keep going.",
  },
};

const generalInsights = {
  validation: "Your feelings are completely valid. Taking time to reflect like this shows real self-awareness and courage.",
  reframePrompt: "Sometimes our first thought isn't the whole picture. What else might be true about this situation?",
  actionAffirmation: "Small steps lead to meaningful changes. You're already making progress by being here.",
};

export function getInsightForEmotions(emotions: Emotion[]): InsightSet {
  if (emotions.length === 0) {
    return generalInsights;
  }
  
  // Prioritize the first emotion, but could be enhanced to blend multiple
  const primaryEmotion = emotions[0];
  return emotionInsights[primaryEmotion] || generalInsights;
}

export function getRandomVariation(baseMessage: string): string {
  // For now, return the base message
  // Could add variations in the future
  return baseMessage;
}
