import { useLocalSearchParams } from 'expo-router';

import {
  AppScreen,
  AppText,
  Icon,
  ImagePanel,
  MetricPill,
  ScreenTitle,
  StateBlock,
  Surface,
} from '@/components/puncak/ui';
import { usePlace } from '@/hooks/use-puncak-api';

export default function PlaceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const place = usePlace(id);

  if (place.isLoading) {
    return (
      <AppScreen>
        <StateBlock loading title="Loading place" />
      </AppScreen>
    );
  }

  if (place.isError || !place.data) {
    return (
      <AppScreen>
        <StateBlock
          title="Place not available"
          message="The backend did not return this place."
          onRetry={() => place.refetch()}
        />
      </AppScreen>
    );
  }

  const imageUrl = place.data.imageUrl ?? place.data.image_url ?? place.data.community?.image_url ?? null;

  return (
    <AppScreen contentClassName="items-center px-6 pb-10 pt-6">
      <ImagePanel
        className="min-h-[220px] rounded-puncak-card"
        fallbackLabel={place.data.community?.name ?? 'Puncak Place'}
        imageAlt={place.data.imageAlt ?? place.data.name}
        imageUrl={imageUrl}
      />
      <ScreenTitle
        eyebrow="Puncak Menginap"
        title={place.data.name}
        subtitle={place.data.description ?? 'A Puncak Traveller place from the backend.'}
      />

      <Surface>
        <MetricPill icon="building.2">{place.data.community?.name ?? 'Community'}</MetricPill>
        <MetricPill icon="location">
          {place.data.lat.toFixed(5)}, {place.data.lng.toFixed(5)}
        </MetricPill>
      </Surface>

      <Surface>
        <Icon name="info.circle" size={24} />
        <AppText variant="label">Booking unavailable for places</AppText>
        <AppText variant="bodyMuted">
          This backend currently creates bookings for events only, so this place page is read-only.
        </AppText>
      </Surface>
    </AppScreen>
  );
}
