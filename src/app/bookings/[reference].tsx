import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import {
  AppScreen,
  AppText,
  MetricPill,
  PrimaryButton,
  ScreenTitle,
  StateBlock,
  Surface,
} from '@/components/puncak/ui';
import { useAuth } from '@/hooks/use-auth';
import { useBooking, useCancelBooking } from '@/hooks/use-puncak-api';
import { ApiError } from '@/lib/api';
import { View } from '@/tw';

export default function BookingDetailScreen() {
  const { reference } = useLocalSearchParams<{ reference: string }>();
  const auth = useAuth();
  const booking = useBooking(reference);
  const cancel = useCancelBooking(reference);
  const [cancelError, setCancelError] = useState<string | null>(null);

  if (!auth.isAuthenticated) {
    return (
      <AppScreen>
        <ScreenTitle title="Booking Details" subtitle="Sign in to view this booking." />
        <PrimaryButton icon="person.fill" onPress={() => router.replace('/login')}>
          Login
        </PrimaryButton>
      </AppScreen>
    );
  }

  if (booking.isLoading) {
    return (
      <AppScreen>
        <StateBlock loading title="Loading booking" />
      </AppScreen>
    );
  }

  if (booking.isError || !booking.data) {
    return (
      <AppScreen>
        <StateBlock
          title="Booking not available"
          message="The backend did not return this booking."
          onRetry={() => booking.refetch()}
        />
      </AppScreen>
    );
  }

  async function cancelBooking() {
    setCancelError(null);

    try {
      await cancel.mutateAsync('Cancelled from mobile app.');
      router.back();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Unable to cancel booking.';
      setCancelError(message);
    }
  }

  return (
    <AppScreen contentClassName="items-center px-6 pb-10 pt-6">
      <ScreenTitle
        eyebrow={booking.data.status}
        title={booking.data.reference}
        subtitle={`Payment status: ${booking.data.paymentStatus}`}
      />

      <Surface>
        <MetricPill icon="ticket">{booking.data.eventSlug ?? booking.data.eventId}</MetricPill>
        <AppText variant="price">
          {booking.data.currency} {booking.data.total.toLocaleString('id-ID')}
        </AppText>
        <AppText variant="bodyMuted">
          Attendee: {booking.data.attendeeName} • {booking.data.attendeeEmail}
        </AppText>
      </Surface>

      <Surface>
        <AppText variant="title">Tickets</AppText>
        {booking.data.items?.length ? (
          booking.data.items.map((item) => (
            <View key={item.ticketTierId} className="flex-row items-center justify-between gap-4">
              <View className="min-w-0 flex-1">
                <AppText variant="label" numberOfLines={1}>
                  {item.ticketName}
                </AppText>
                <AppText variant="caption">Quantity {item.quantity}</AppText>
              </View>
              <AppText variant="price">Rp {item.lineTotal.toLocaleString('id-ID')}</AppText>
            </View>
          ))
        ) : (
          <AppText variant="bodyMuted">No booking items returned by the backend.</AppText>
        )}
      </Surface>

      {cancelError ? <StateBlock title="Cancel failed" message={cancelError} /> : null}

      {booking.data.status !== 'cancelled' && booking.data.status !== 'completed' ? (
        <PrimaryButton
          variant="danger"
          icon="xmark.circle"
          disabled={cancel.isPending}
          onPress={cancelBooking}>
          {cancel.isPending ? 'Cancelling...' : 'Cancel Booking'}
        </PrimaryButton>
      ) : null}
    </AppScreen>
  );
}
