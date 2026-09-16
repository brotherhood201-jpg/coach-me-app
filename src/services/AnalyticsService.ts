/**
 * Analytics Service abstraction for tracking fitness events
 */
export class AnalyticsService {
  static logEvent(eventName: string, params?: Record<string, any>) {
    try {
      console.log(`[Analytics Event] ${eventName}`, params || {});
      // In production with Firebase Analytics, this routes to logEvent(analytics, eventName, params)
    } catch (e) {
      console.warn('Analytics logging error:', e);
    }
  }

  static trackWorkoutStart(workoutId: string, title: string) {
    this.logEvent('workout_started', { workoutId, title, timestamp: new Date().toISOString() });
  }

  static trackWorkoutFinish(workoutId: string, durationSeconds: number, totalVolumeKg: number, prCount: number) {
    this.logEvent('workout_completed', { workoutId, durationSeconds, totalVolumeKg, prCount });
  }

  static trackPR(exerciseId: string, weightKg: number, reps: number) {
    this.logEvent('pr_achieved', { exerciseId, weightKg, reps });
  }

  static trackLogin(method: 'email' | 'google' | 'apple') {
    this.logEvent('user_login', { method });
  }

  static trackSignUp(method: 'email' | 'google' | 'apple') {
    this.logEvent('user_signup', { method });
  }
}
