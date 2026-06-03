import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import {
  AppScreen,
  AppText,
  ImagePanel,
  MetricPill,
  PrimaryButton,
  ScreenTitle,
  StateBlock,
  Surface,
} from '@/components/puncak/ui';
import { useAuth } from '@/hooks/use-auth';
import { useCreateBooking, useEvent } from '@/hooks/use-puncak-api';
import { ApiError } from '@/lib/api';
import { View } from '@/tw';

export default function EventDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const event = useEvent(slug);
  const auth = useAuth();
  const createBooking = useCreateBooking();
  const [bookingError, setBookingError] = useState<string | null>(null);

  if (event.isLoading) {
    return (
      <AppScreen>
        <StateBlock loading title="Loading event" />
      </AppScreen>
    );
  }

  if (event.isError || !event.data) {
    return (
      <AppScreen>
        <StateBlock
          title="Event not available"
          message="The backend did not return this event."
          onRetry={() => event.refetch()}
        />
      </AppScreen>
    );
  }

  const eventData = event.data;
  const availableTicket = eventData.tickets?.find((ticket) => ticket.stock > 0);

  async function bookEvent() {
    setBookingError(null);

    if (!auth.isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!availableTicket) {
      setBookingError('No available ticket tiers were returned for this event.');
      return;
    }

    try {
      const response = await createBooking.mutateAsync({
        eventSlug: eventData.slug,
        items: [{ ticketTierId: availableTicket.id, quantity: 1 }],
      });
      router.push(`/bookings/${response.data.reference}`);
    } catch (err) {
      setBookingError(err instanceof ApiError ? err.message : 'Unable to create booking.');
    }
  }

  return (
    <AppScreen contentClassName="items-center px-6 pb-10 pt-6">
      <ImagePanel
        className="min-h-[240px] rounded-puncak-card"
        fallbackLabel={eventData.category}
        imageAlt={eventData.imageAlt}
        imageUrl={eventData.imageUrl}
      />
      <ScreenTitle
        eyebrow={eventData.category}
        title={eventData.title}
        subtitle={eventData.venueDescription ?? eventData.location}
      />

      <View className="flex-row flex-wrap gap-2">
        <MetricPill icon="calendar">{eventData.fullDateLabel ?? eventData.dateLabel}</MetricPill>
        <MetricPill icon="mappin">{eventData.location}</MetricPill>
        <MetricPill icon="figure.run">{eventData.distanceLabel ?? eventData.difficulty}</MetricPill>
      </View>

      <Surface>
        <AppText variant="title">Tickets</AppText>
        {eventData.tickets?.length ? (
          eventData.tickets.map((ticket) => (
            <View key={ticket.id} className="flex-row items-center justify-between gap-4">
              <View className="min-w-0 flex-1">
                <AppText variant="label" numberOfLines={1}>
                  {ticket.name}
                </AppText>
                <AppText variant="caption">{ticket.capacityLabel}</AppText>
              </View>
              <AppText variant="price">Rp {ticket.price.toLocaleString('id-ID')}</AppText>
            </View>
          ))
        ) : (
          <AppText variant="bodyMuted">No tickets returned by the backend.</AppText>
        )}
      </Surface>

      {eventData.summary?.length ? (
        <Surface>
          <AppText variant="title">Overview</AppText>
          {eventData.summary.map((paragraph) => (
            <AppText key={paragraph} variant="bodyMuted">
              {paragraph}
            </AppText>
          ))}
        </Surface>
      ) : null}

      {bookingError ? <StateBlock title="Booking failed" message={bookingError} /> : null}

      <PrimaryButton icon="ticket" disabled={createBooking.isPending} onPress={bookEvent}>
        {auth.isAuthenticated
          ? createBooking.isPending
            ? 'Creating booking...'
            : 'Book First Available Ticket'
          : 'Sign in to Book Event'}
      </PrimaryButton>
    </AppScreen>
  );
}
