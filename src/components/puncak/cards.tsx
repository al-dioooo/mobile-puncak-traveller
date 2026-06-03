import { Link } from 'expo-router';

import { Colors } from '@/constants/theme';
import type { BookingCard, Event, Place } from '@/lib/types';
import { Pressable, ScrollView, View } from '@/tw';

import { AppText, Icon, ImagePanel, MetricPill, PrimaryButton, Surface } from './ui';

export function EventCard({ event, compact }: { event: Event; compact?: boolean }) {
  return (
    <Link href={`/events/${event.slug}`} asChild>
      <Pressable
        accessibilityRole="link"
        style={({ pressed }) => ({ opacity: pressed ? 0.78 : 1 })}>
        <Surface className={compact ? 'min-h-[272px] p-3' : 'p-3'}>
          <ImagePanel
            className="aspect-[16/10] min-h-0 rounded-[16px]"
            fallbackLabel={event.category}
            imageAlt={event.imageAlt}
            imageUrl={event.imageUrl}>
            <View className="absolute right-2 top-2 flex-row items-center gap-1 rounded-full bg-white/95 px-2 py-1">
              <Icon name="star.fill" color={Colors.light.primary} size={12} />
              <AppText variant="caption" className="font-bold text-puncak-ink">
                {event.statusLabel}
              </AppText>
            </View>
          </ImagePanel>
          <View className="gap-2">
            <AppText variant="label" className="font-bold text-puncak-ink" numberOfLines={2}>
              {event.title}
            </AppText>
            <View className="flex-row items-center gap-1">
              <Icon name="mappin" color={Colors.light.textTertiary} size={13} />
              <AppText variant="caption" numberOfLines={1}>
                {event.location}
              </AppText>
            </View>
            <View className="flex-row items-center gap-1">
              <Icon name="calendar" color={Colors.light.textTertiary} size={13} />
              <AppText variant="caption" numberOfLines={1}>
                {event.dateLabel ?? event.fullDateLabel}
              </AppText>
            </View>
            <View className="flex-row items-center justify-between gap-3 pt-2">
              <AppText variant="price">{event.priceLabel}</AppText>
              <MetricPill icon="figure.run">{event.distanceLabel ?? event.category}</MetricPill>
            </View>
          </View>
        </Surface>
      </Pressable>
    </Link>
  );
}

export function HorizontalEventRail({ events }: { events: Event[] }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-4 pr-6">
      {events.map((event) => (
        <View key={event.slug} className="w-[280px]">
          <EventCard event={event} compact />
        </View>
      ))}
    </ScrollView>
  );
}

export function PlaceCard({ place }: { place: Place }) {
  const imageUrl = place.imageUrl ?? place.image_url ?? place.community?.image_url ?? null;

  return (
    <Link href={`/places/${place.id}`} asChild>
      <Pressable
        accessibilityRole="link"
        style={({ pressed }) => ({ opacity: pressed ? 0.78 : 1 })}>
        <Surface className="p-3">
          <ImagePanel
            className="aspect-[16/9] min-h-0 rounded-[16px]"
            fallbackLabel={place.community?.name ?? 'Puncak Place'}
            imageAlt={place.imageAlt ?? place.name}
            imageUrl={imageUrl}
          />
          <View className="flex-row items-start gap-3">
            <View className="h-12 w-12 items-center justify-center rounded-[16px] bg-puncak-orange-soft">
              <Icon name="mountain.2" color={Colors.light.primary} size={22} />
            </View>
            <View className="min-w-0 flex-1 gap-1">
              <AppText variant="label" className="font-bold text-puncak-ink" numberOfLines={2}>
                {place.name}
              </AppText>
              <AppText variant="caption" numberOfLines={1}>
                {place.community?.name ?? 'Puncak Travellers'} • {place.lat.toFixed(2)},{' '}
                {place.lng.toFixed(2)}
              </AppText>
              {place.description ? (
                <AppText variant="bodyMuted" numberOfLines={2}>
                  {place.description}
                </AppText>
              ) : null}
            </View>
            <Icon name="chevron.right" color={Colors.light.textTertiary} size={16} />
          </View>
        </Surface>
      </Pressable>
    </Link>
  );
}

export function BookingItemCard({ booking }: { booking: BookingCard }) {
  return (
    <Link href={`/bookings/${booking.reference}`} asChild>
      <Pressable
        accessibilityRole="link"
        style={({ pressed }) => ({ opacity: pressed ? 0.78 : 1 })}>
        <Surface className="gap-3">
          <View className="flex-row items-center justify-between">
            <MetricPill icon={booking.status === 'past' ? 'checkmark.seal' : 'ticket'}>
              {booking.badge}
            </MetricPill>
            <Icon name="chevron.right" color={Colors.light.textTertiary} size={16} />
          </View>
          <AppText variant="title" className="text-[18px] leading-[22.5px]" numberOfLines={2}>
            {booking.title}
          </AppText>
          <View className="flex-row items-center gap-1">
            <Icon name="calendar" color={Colors.light.textTertiary} size={13} />
            <AppText variant="caption">{booking.date}</AppText>
          </View>
          <View className="flex-row items-center gap-1">
            <Icon name="mappin" color={Colors.light.textTertiary} size={13} />
            <AppText variant="caption">{booking.location}</AppText>
          </View>
          <AppText variant="bodyMuted">{booking.ticketLabel}</AppText>
        </Surface>
      </Pressable>
    </Link>
  );
}

export function CategoryCard({
  title,
  subtitle,
  href,
  icon,
  action,
}: {
  title: string;
  subtitle: string;
  href: '/runners' | '/stays' | '/camping';
  icon: 'figure.run' | 'house.and.flag' | 'tent';
  action: string;
}) {
  return (
    <Link href={href} asChild>
      <Pressable
        accessibilityRole="link"
        style={({ pressed }) => ({ opacity: pressed ? 0.78 : 1 })}>
        <Surface className="min-h-[156px] flex-row items-start gap-4">
          <View className="h-[60px] w-[60px] items-center justify-center rounded-puncak-card bg-puncak-orange">
            <Icon name={icon} color="#FFFFFF" size={26} />
          </View>
          <View className="min-w-0 flex-1 gap-2">
            <AppText variant="title" className="text-[18px] leading-[22.5px]">
              {title}
            </AppText>
            <AppText variant="bodyMuted" numberOfLines={3}>
              {subtitle}
            </AppText>
            <PrimaryButton variant="secondary" className="mt-1 min-h-[44px] self-start px-4">
              {action}
            </PrimaryButton>
          </View>
        </Surface>
      </Pressable>
    </Link>
  );
}
