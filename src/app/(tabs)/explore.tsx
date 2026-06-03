import { CategoryCard } from '@/components/puncak/cards';
import { AppScreen, ScreenTitle, StateBlock } from '@/components/puncak/ui';
import { useEvents, usePlaces } from '@/hooks/use-puncak-api';

export default function ExploreScreen() {
  const places = usePlaces({ per_page: 1 });
  const running = useEvents({ activity: 'trail-run', status: 'upcoming', per_page: 1 });
  const camping = useEvents({ activity: 'camping', status: 'upcoming', per_page: 1 });

  if (places.isLoading || running.isLoading || camping.isLoading) {
    return (
      <AppScreen>
        <StateBlock loading title="Loading Explore Hub" message="Fetching available categories." />
      </AppScreen>
    );
  }

  if (places.isError || running.isError || camping.isError) {
    return (
      <AppScreen>
        <StateBlock
          title="Unable to load Explore"
          message="The backend did not return category resources."
          onRetry={() => {
            places.refetch();
            running.refetch();
            camping.refetch();
          }}
        />
      </AppScreen>
    );
  }

  return (
    <AppScreen contentClassName="items-center px-6 pb-28 pt-[70px]">
      <ScreenTitle title="Explore Hub" subtitle="Choose a supported Puncak Traveller experience." />

      <CategoryCard
        title="Puncak Menginap"
        subtitle={`${places.data?.meta?.total ?? places.data?.data.length ?? 0} places from the backend for mountain stays and regions.`}
        href="/stays"
        icon="house.and.flag"
        action="Browse Places"
      />
      <CategoryCard
        title="Puncak Runners"
        subtitle={`${running.data?.meta?.total ?? running.data?.data.length ?? 0} running events available from the API.`}
        href="/runners"
        icon="figure.run"
        action="Join Events"
      />
      <CategoryCard
        title="Puncak In"
        subtitle={`${camping.data?.meta?.total ?? camping.data?.data.length ?? 0} camping events connected to real tickets and bookings.`}
        href="/camping"
        icon="tent"
        action="Explore Camping"
      />
    </AppScreen>
  );
}
