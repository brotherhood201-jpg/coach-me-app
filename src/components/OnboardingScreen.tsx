import React from 'react';
import { FitnessOnboardingFlow } from './onboarding/FitnessOnboardingFlow';
import { UserProfile, WorkoutProgram } from '../types';

interface OnboardingScreenProps {
  userId?: string;
  initialProfile?: Partial<UserProfile>;
  onComplete: (updatedProfile?: UserProfile, recommendedProgram?: WorkoutProgram) => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  userId = 'guest',
  initialProfile,
  onComplete,
}) => {
  return (
    <FitnessOnboardingFlow
      userId={userId}
      initialProfile={initialProfile}
      isEditMode={false}
      onComplete={(updatedProfile, recommendedProgram) => {
        onComplete(updatedProfile, recommendedProgram);
      }}
    />
  );
};
