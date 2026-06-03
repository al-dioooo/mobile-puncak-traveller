import { useState } from 'react';

import { EventCard } from '@/components/puncak/cards';
import { AppScreen, AppText, ScreenTitle, StateBlock } from '@/components/puncak/ui';
import { useEvents } from '@/hooks/use-puncak-api';
import { Pressable, View } from '@/tw';

type EventStatus = 'upcoming' | 'completed';

export default function RunnersScreen() {
  const [status, setStatus] = useState<EventStatus>('upcoming');
  const events = useEvents({ activity: 'trail-run', status, sort: 'date', per_page: 20 });

  return (
    <AppScreen contentClassName="items-center px-6 pb-10 pt-6">
      <ScreenTitle
        title="Puncak Runners"
        subtitle="Trail runs and highland road events from the Laravel events API."
      />

      <View className="flex-row gap-1 rounded-full bg-puncak-fill p-1">
        {(['upcoming', 'completed'] as const).map((item) => (
          <Pressable
            key={item}
            accessibilityRole="button"
            className={[
              'min-h-[44px] flex-1 items-center justify-center rounded-full px-2',
              status === item ? 'bg-puncak-orange' : 'bg-transparent',
            ].join(' ')}
            onPress={() => setStatus(item)}>
            <AppText
              variant="label"
              className={[
                'text-center text-[12px]',
                status === item ? 'text-white' : 'text-puncak-muted',
              ].join(' ')}>
              {item === 'upcoming' ? 'Upcoming Events' : 'Past Events'}
            </AppText>
          </Pressable>
        ))}
      </View>

      {events.isLoading ? (
        <StateBlock loading title="Loading events" />
      ) : events.isError ? (
        <StateBlock
          title="Unable to load events"
          message="The events endpoint did not respond."
          onRetry={() => events.refetch()}
        />
      ) : events.data?.data.length ? (
        <View className="gap-4">
          {events.data.data.map((event) => (
            <EventCard key={event.slug} event={event} />
          ))}
        </View>
      ) : (
        <StateBlock title="No events returned" message="The backend returned an empty event list." />
      )}
    </AppScreen>
  );
}
