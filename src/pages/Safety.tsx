import { Heart, ExternalLink } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Safety() {
  return (
    <AppLayout title="Safety & Support">
      <div className="space-y-6 animate-fade-in">
        {/* Main message */}
        <div className="text-center space-y-4 pt-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              Your wellbeing matters
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
              This app is designed to support reflection and self-awareness. It is not a replacement for professional mental health care.
            </p>
          </div>
        </div>

        {/* Guidance cards */}
        <div className="space-y-4">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">When to seek support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                If you're feeling overwhelmed, it's okay to reach out for help. Consider talking to:
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li>A trusted friend or family member</li>
                <li>A counselor or therapist</li>
                <li>Your healthcare provider</li>
                <li>A local mental health helpline</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Remember</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                It's normal to have difficult thoughts and feelings sometimes. Taking time to reflect is a positive step.
              </p>
              <p>
                If your feelings are persistent or overwhelming, professional support can make a real difference.
              </p>
            </CardContent>
          </Card>

          <Card className="border-accent/30 bg-accent/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Finding local resources</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>
                Search for "mental health helpline" along with your country or region to find local support services available to you.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer note */}
        <div className="text-center pt-4 pb-8">
          <p className="text-xs text-muted-foreground">
            You deserve support. There's no shame in asking for help.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
