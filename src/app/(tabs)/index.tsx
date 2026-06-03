import { Link } from 'expo-router';

import { EventCard, HorizontalEventRail, PlaceCard } from '@/components/puncak/cards';
import {
  AppScreen,
  AppText,
  Icon,
  ImagePanel,
  MetricPill,
  SectionHeader,
  StateBlock,
  Surface,
} from '@/components/puncak/ui';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { useEvents, useLanding, usePlaces } from '@/hooks/use-puncak-api';
import { Pressable, View } from '@/tw';

export default function HomeScreen() {
  const { user } = useAuth();
  const landing = useLanding();
  const places = usePlaces({ per_page: 3 });
  const events = useEvents({ status: 'upcoming', sort: 'date', per_page: 4 });

  if (landing.isLoading || places.isLoading || events.isLoading) {
    return (
      <AppScreen>
        <StateBlock loading title="Loading Puncak Traveller" message="Fetching live trips and events." />
      </AppScreen>
    );
  }

  if (landing.isError || places.isError || events.isError) {
    return (
      <AppScreen>
        <StateBlock
          title="Unable to load Home"
          message="The API did not return the latest Puncak Traveller data."
          onRetry={() => {
            landing.refetch();
            places.refetch();
            events.refetch();
          }}
        />
      </AppScreen>
    );
  }

  const upcomingEvents = events.data?.data ?? landing.data?.upcoming_events ?? [];
  const recommendedPlaces = places.data?.data ?? [];

  return (
    <AppScreen contentClassName="items-center px-6 pb-28 pt-[70px]">
      <Surface className="flex-row items-center gap-4 p-4 shadow-none">
        <ImagePanel
          className="h-12 w-12 min-h-0 rounded-full border-2 border-puncak-orange"
          fallbackLabel={user?.name?.slice(0, 1) ?? 'P'}
          imageAlt={user?.name ?? 'Traveller'}
          imageUrl={user?.avatarUrl}>
          {!user?.avatarUrl ? (
            <View className="absolute inset-0 items-center justify-center bg-puncak-orange-soft">
              <Icon name="person.fill" color={Colors.light.primary} size={22} />
            </View>
          ) : null}
        </ImagePanel>
        <View className="min-w-0 flex-1">
          <AppText variant="caption" className="font-medium text-puncak-orange">
            Welcome back,
          </AppText>
          <AppText variant="title" className="text-[18px] leading-[22.5px]" numberOfLines={1}>
            Halo, {user?.name ?? 'Traveller'}
          </AppText>
        </View>
        <View className="h-10 w-10 items-center justify-center rounded-full bg-puncak-fill">
          <Icon name="bell" color={Colors.light.text} size={20} />
        </View>
      </Surface>

      <Link href="/explore" asChild>
        <Pressable accessibilityRole="link" style={({ pressed }) => ({ opacity: pressed ? 0.82 : 1 })}>
          <Surface className="min-h-[56px] flex-row items-center gap-3 rounded-full bg-puncak-fill p-4 shadow-none">
            <Icon name="magnifyingglass" color={Colors.light.primary} size={20} />
            <AppText variant="bodyMuted" className="text-[16px] text-puncak-subtle">
              Search villas, trails, or events
            </AppText>
          </Surface>
        </Pressable>
      </Link>

      <View className="gap-4">
        <SectionHeader title="Recommended Villas" action={{ label: 'See all', href: '/stays' }} />
        {recommendedPlaces.length > 0 ? (
          <View className="gap-4">
            {recommendedPlaces.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </View>
        ) : (
          <StateBlock title="No places available" message="The backend returned an empty places list." />
        )}
      </View>

      <View className="gap-4">
        <SectionHeader title="Upcoming Runs" action={{ label: 'See all', href: '/runners' }} />
        {upcomingEvents.length > 0 ? (
          <HorizontalEventRail events={upcomingEvents} />
        ) : (
          <StateBlock title="No upcoming events" message="The backend returned no upcoming events." />
        )}
      </View>

      {landing.data?.live_event ? (
        <View className="gap-4">
          <SectionHeader title="Live Now" />
          <EventCard event={landing.data.live_event} />
        </View>
      ) : null}

      <Surface className="flex-row items-center bg-puncak-orange-soft">
        <View className="min-w-0 flex-1 gap-2">
          <AppText variant="title">Explore Map</AppText>
          <AppText variant="bodyMuted">
            {landing.data?.hero_stats?.[2]?.value ?? 0} mountain regions connected to community
            routes.
          </AppText>
        </View>
        <MetricPill icon="map">Explore</MetricPill>
      </Surface>
    </AppScreen>
  );
}
