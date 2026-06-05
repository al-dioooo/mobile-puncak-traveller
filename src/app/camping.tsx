import { EventCard } from '@/components/puncak/cards';
import {
  AppScreen,
  AppText,
  ImagePanel,
  ScreenTitle,
  SectionHeader,
  StateBlock,
} from '@/components/puncak/ui';
import { useEvents, useGalleries } from '@/hooks/use-puncak-api';
import { View } from '@/tw';

export default function CampingScreen() {
  const events = useEvents({ activity: 'camping', status: 'all', sort: 'date', per_page: 20 });
  const galleries = useGalleries();

  if (events.isLoading || galleries.isLoading) {
    return (
      <AppScreen>
        <StateBlock loading title="Loading camping catalog" />
      </AppScreen>
    );
  }

  if (events.isError || galleries.isError) {
    return (
      <AppScreen>
        <StateBlock
          title="Unable to load camping"
          message="The events or galleries endpoint did not respond."
          onRetry={() => {
            events.refetch();
            galleries.refetch();
          }}
        />
      </AppScreen>
    );
  }

  const campingEvents = events.data?.data ?? [];
  const campingGallery = (galleries.data?.data ?? []).filter((item) => item.category === 'camping');

  return (
    <AppScreen contentClassName="items-center px-6 pb-10 pt-6">
      <ScreenTitle
        eyebrow="Puncak In"
        title="Travellers Catalog"
        subtitle="Camping events and highland moments from backend resources."
      />

      <View className="gap-4">
        <SectionHeader title="Recommended Camping" />
        {campingEvents.length ? (
          <View className="gap-4">
            {campingEvents.map((event) => (
              <EventCard key={event.slug} event={event} />
            ))}
          </View>
        ) : (
          <StateBlock title="No camping events" message="The backend returned no camping events." />
        )}
      </View>

      {campingGallery.length ? (
        <View className="gap-4">
          <SectionHeader title="Gallery" />
          <View className="gap-4">
            {campingGallery.slice(0, 3).map((item) => (
              <ImagePanel
                key={item.id}
                className="min-h-[190px] rounded-puncak-card"
                fallbackLabel={item.category}
                imageAlt={item.imageAlt}
                imageUrl={item.imageUrl ?? item.image_url ?? item.image_path}>
                <View className="absolute bottom-4 left-4 right-4 rounded-[18px] bg-puncak-ink/70 p-4">
                  <AppText variant="label" className="text-white">
                    {item.title}
                  </AppText>
                </View>
              </ImagePanel>
            ))}
          </View>
        </View>
      ) : null}
    </AppScreen>
  );
}
