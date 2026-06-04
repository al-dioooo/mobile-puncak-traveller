import { router } from 'expo-router';

import {
  AppScreen,
  AppText,
  Icon,
  MetricPill,
  PrimaryButton,
  ScreenTitle,
  StateBlock,
  Surface,
} from '@/components/puncak/ui';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { useMe } from '@/hooks/use-puncak-api';
import { View } from '@/tw';

export default function ProfileScreen() {
  const auth = useAuth();
  const me = useMe();

  if (!auth.isAuthenticated) {
    return (
      <AppScreen contentClassName="items-center px-6 pb-28 pt-4">
        <ScreenTitle title="Profile" subtitle="Sign in to manage your traveller profile." />
        <PrimaryButton icon="person.fill" onPress={() => router.push('/login')}>
          Login
        </PrimaryButton>
      </AppScreen>
    );
  }

  if (me.isLoading) {
    return (
      <AppScreen>
        <StateBlock loading title="Loading profile" />
      </AppScreen>
    );
  }

  if (me.isError || !me.data) {
    return (
      <AppScreen>
        <StateBlock
          title="Unable to load profile"
          message="The profile endpoint did not respond."
          onRetry={() => me.refetch()}
        />
      </AppScreen>
    );
  }

  return (
    <AppScreen contentClassName="items-center px-6 pb-28 pt-4">
      <Surface className="items-center">
        <View className="h-24 w-24 items-center justify-center rounded-full bg-puncak-orange-soft">
          <Icon name="person.fill" color={Colors.light.primary} size={38} />
        </View>
        <AppText variant="hero" className="text-center">
          {me.data.name}
        </AppText>
        <AppText variant="bodyMuted" className="text-center">
          {me.data.email}
        </AppText>
        <View className="flex-row flex-wrap justify-center gap-2">
          <MetricPill icon="ticket">{me.data.stats?.eventsBooked ?? 0} booked</MetricPill>
          <MetricPill icon="checkmark.seal">{me.data.stats?.completed ?? 0} completed</MetricPill>
          <MetricPill icon="figure.run">{me.data.stats?.kilometersLogged ?? 0} km</MetricPill>
        </View>
      </Surface>

      <Surface>
        <AppText variant="title">Settings</AppText>
        <PrimaryButton
          variant="secondary"
          icon="person.crop.circle"
          onPress={() => router.push('/account-preferences')}>
          Account Preferences
        </PrimaryButton>
        <PrimaryButton variant="danger" icon="rectangle.portrait.and.arrow.right" onPress={auth.logout}>
          Logout
        </PrimaryButton>
      </Surface>
    </AppScreen>
  );
}
