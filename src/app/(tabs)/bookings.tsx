import { router } from 'expo-router';
import { useState } from 'react';

import { BookingItemCard } from '@/components/puncak/cards';
import { AppScreen, AppText, PrimaryButton, ScreenTitle, StateBlock } from '@/components/puncak/ui';
import { useAuth } from '@/hooks/use-auth';
import { useBookings } from '@/hooks/use-puncak-api';
import { Pressable, View } from '@/tw';

export default function BookingsScreen() {
  const [status, setStatus] = useState<'upcoming' | 'past'>('upcoming');
  const auth = useAuth();
  const bookings = useBookings(status);

  if (!auth.isAuthenticated) {
    return (
      <AppScreen contentClassName="items-center px-6 pb-28 pt-[70px]">
        <ScreenTitle title="My Bookings" subtitle="Sign in to view your event bookings." />
        <PrimaryButton icon="person.fill" onPress={() => router.push('/login')}>
          Login
        </PrimaryButton>
      </AppScreen>
    );
  }

  return (
    <AppScreen contentClassName="items-center px-6 pb-28 pt-[70px]">
      <ScreenTitle title="My Bookings" subtitle="Current and past event bookings from the API." />

      <View className="flex-row gap-1 rounded-full bg-puncak-fill p-1">
        {(['upcoming', 'past'] as const).map((item) => (
          <Pressable
            key={item}
            accessibilityRole="button"
            className={[
              'min-h-[44px] flex-1 items-center justify-center rounded-full',
              status === item ? 'bg-puncak-orange' : 'bg-transparent',
            ].join(' ')}
            onPress={() => setStatus(item)}>
            <AppText
              variant="label"
              className={status === item ? 'font-bold text-white' : 'font-semibold text-puncak-muted'}>
              {item === 'upcoming' ? 'Current' : 'Past'}
            </AppText>
          </Pressable>
        ))}
      </View>

      {bookings.isLoading ? (
        <StateBlock loading title="Loading bookings" />
      ) : bookings.isError ? (
        <StateBlock
          title="Unable to load bookings"
          message="The bookings endpoint did not respond."
          onRetry={() => bookings.refetch()}
        />
      ) : bookings.data?.data.length ? (
        <View className="gap-4">
          {bookings.data.data.map((booking) => (
            <BookingItemCard key={booking.id} booking={booking} />
          ))}
        </View>
      ) : (
        <StateBlock title="No bookings returned" message="The backend returned an empty list." />
      )}
    </AppScreen>
  );
}
