import { useMemo } from 'react';
import { TrendingUp, Tag, CheckCircle } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useReflections } from '@/hooks/useReflections';
import { Emotion } from '@/types/reflection';

export default function Progress() {
  const { reflections } = useReflections();

  // Calculate mood trends (last 7 days)
  const moodTrend = useMemo(() => {
    const last7Days = [...Array(7)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const dayReflections = reflections.filter(r => 
        r.createdAt.startsWith(date)
      );
      const emotionCount = dayReflections.reduce((acc, r) => acc + r.emotions.length, 0);
      return {
        date,
        day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        count: dayReflections.length,
        intensity: Math.min(emotionCount, 5),
      };
    });
  }, [reflections]);

  // Calculate common patterns
  const patterns = useMemo(() => {
    const emotionCounts: Record<Emotion, number> = {
      anxious: 0, sad: 0, angry: 0, overwhelmed: 0, guilty: 0, calm: 0, other: 0
    };
    
    reflections.forEach(r => {
      r.emotions.forEach(e => {
        emotionCounts[e]++;
      });
    });

    return Object.entries(emotionCounts)
      .filter(([_, count]) => count > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([emotion, count]) => ({
        emotion: emotion as Emotion,
        count,
        label: emotion === 'overwhelmed' ? 'Feeling overwhelmed' : 
               emotion === 'anxious' ? 'Overthinking' :
               emotion === 'guilty' ? 'Self-blame' :
               emotion.charAt(0).toUpperCase() + emotion.slice(1),
      }));
  }, [reflections]);

  // Recent actions
  const recentActions = useMemo(() => {
    return reflections
      .filter(r => r.action && r.action.trim() !== '')
      .slice(0, 5)
      .map(r => ({
        id: r.id,
        action: r.action,
        date: new Date(r.createdAt).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        }),
      }));
  }, [reflections]);

  const hasData = reflections.length > 0;

  return (
    <AppLayout title="Progress">
      <div className="space-y-6 animate-fade-in">
        {!hasData ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              No reflections yet
            </h2>
            <p className="text-muted-foreground max-w-xs mx-auto">
              Complete a reflection to start seeing your patterns and progress.
            </p>
          </div>
        ) : (
          <>
            {/* Mood Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Weekly Mood Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between gap-2 h-24">
                  {moodTrend.map((day, i) => (
                    <div key={i} className="flex flex-col items-center gap-1 flex-1">
                      <div 
                        className="w-full bg-primary/20 rounded-t-md transition-all duration-300"
                        style={{ 
                          height: `${Math.max(day.count * 20, 8)}px`,
                          opacity: day.count > 0 ? 1 : 0.3,
                        }}
                      />
                      <span className="text-xs text-muted-foreground">
                        {day.day}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground text-center mt-4">
                  {reflections.length} reflection{reflections.length !== 1 ? 's' : ''} total
                </p>
              </CardContent>
            </Card>

            {/* Common Patterns */}
            {patterns.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Tag className="w-5 h-5 text-accent-foreground" />
                    Common Patterns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {patterns.map(({ emotion, label, count }) => (
                      <span 
                        key={emotion}
                        className="px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm"
                      >
                        {label} ({count})
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Actions */}
            {recentActions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <CheckCircle className="w-5 h-5 text-success" />
                    Actions Identified
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {recentActions.map(({ id, action, date }) => (
                      <li key={id} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle className="w-3 h-3 text-success" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground leading-relaxed">
                            {action}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {date}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
