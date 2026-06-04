import { router } from 'expo-router';
import { useState } from 'react';

import {
  AppScreen,
  FormInput,
  PrimaryButton,
  ScreenTitle,
  StateBlock,
  Surface,
} from '@/components/puncak/ui';
import { useAuth } from '@/hooks/use-auth';
import { useMe, useUpdateMe } from '@/hooks/use-puncak-api';
import { ApiError } from '@/lib/api';

export default function AccountPreferencesScreen() {
  const auth = useAuth();
  const me = useMe();
  const update = useUpdateMe();
  const [name, setName] = useState<string | undefined>();
  const [location, setLocation] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);

  if (!auth.isAuthenticated) {
    return (
      <AppScreen>
        <ScreenTitle title="Account Preferences" subtitle="Sign in to edit your account." />
        <PrimaryButton icon="person.fill" onPress={() => router.replace('/login')}>
          Login
        </PrimaryButton>
      </AppScreen>
    );
  }

  if (me.isLoading) {
    return (
      <AppScreen>
        <StateBlock loading title="Loading account" />
      </AppScreen>
    );
  }

  if (me.isError || !me.data) {
    return (
      <AppScreen>
        <StateBlock
          title="Unable to load account"
          message="The profile endpoint did not respond."
          onRetry={() => me.refetch()}
        />
      </AppScreen>
    );
  }

  const profile = me.data;

  async function submit() {
    setError(null);

    try {
      await update.mutateAsync({
        name: name ?? profile.name,
        location: location ?? profile.location ?? '',
      });
      router.back();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to update account.');
    }
  }

  return (
    <AppScreen>
      <ScreenTitle
        title="Account Preferences"
        subtitle="Update the profile fields supported by the Laravel API."
      />
      <Surface className="gap-5">
        <FormInput
          label="Full Name"
          icon="person"
          value={name ?? profile.name ?? ''}
          onChangeText={setName}
        />
        <FormInput
          label="Location"
          icon="mappin"
          value={location ?? profile.location ?? ''}
          onChangeText={setLocation}
        />
        {error ? <StateBlock title="Update failed" message={error} /> : null}
        <PrimaryButton icon="checkmark" disabled={update.isPending} onPress={submit}>
          {update.isPending ? 'Saving...' : 'Save Preferences'}
        </PrimaryButton>
      </Surface>
    </AppScreen>
  );
}
