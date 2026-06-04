import { useLocalSearchParams } from 'expo-router';

import { PlaceCard } from '@/components/puncak/cards';
import { AppScreen, ScreenTitle, StateBlock } from '@/components/puncak/ui';
import { usePlaces } from '@/hooks/use-puncak-api';
import { View } from '@/tw';

export default function StaysScreen() {
  const { community } = useLocalSearchParams<{ community?: string }>();
  const places = usePlaces({ community, per_page: 30 });
  const isFiltered = Boolean(community);

  return (
    <AppScreen contentClassName="items-center px-6 pb-10 pt-6">
      <ScreenTitle
        eyebrow="Puncak Menginap"
        title={isFiltered ? 'Community Places' : 'Explore the best places in Bogor'}
        subtitle={
          isFiltered
            ? 'Places filtered by the selected community.'
            : 'Places are read from the backend; booking actions are omitted because the API only books events.'
        }
      />

      {places.isLoading ? (
        <StateBlock loading title="Loading places" />
      ) : places.isError ? (
        <StateBlock
          title="Unable to load places"
          message="The places endpoint did not respond."
          onRetry={() => places.refetch()}
        />
      ) : places.data?.data.length ? (
        <View className="gap-4">
          {places.data.data.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </View>
      ) : (
        <StateBlock title="No places returned" message="The backend returned an empty places list." />
      )}
    </AppScreen>
  );
}
