import React from 'react';
import { FitnessOnboardingFlow } from './onboarding/FitnessOnboardingFlow';
import { UserProfile, WorkoutProgram } from '../types';

interface ProfileSetupWizardProps {
  userId: string;
  initialProfile?: Partial<UserProfile>;
  initialName?: string;
  initialEmail?: string;
  onComplete: (updatedProfile: UserProfile, recommendedProgram?: WorkoutProgram) => void;
  onSkip?: () => void;
}

export const ProfileSetupWizard: React.FC<ProfileSetupWizardProps> = ({
  userId,
  initialProfile,
  initialName = 'علیرضا',
  initialEmail = '',
  onComplete,
  onSkip,
}) => {
  return (
    <FitnessOnboardingFlow
      userId={userId}
      initialProfile={{
        name: initialName,
        email: initialEmail,
        ...initialProfile,
      }}
      isEditMode={true}
      onComplete={(updatedProfile, recommendedProgram) => {
        onComplete(updatedProfile, recommendedProgram);
      }}
      onClose={onSkip}
    />
  );
};
