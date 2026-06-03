import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { useAuth } from '@/hooks/use-auth';

export function useLanding() {
  return useQuery({
    queryKey: ['landing'],
    queryFn: async () => (await api.landing()).data,
  });
}

export function useEvents(params?: {
  q?: string;
  status?: 'all' | 'upcoming' | 'ongoing' | 'completed';
  activity?: string;
  sort?: 'date' | 'price' | 'spots';
  per_page?: number;
}) {
  return useQuery({
    queryKey: ['events', params],
    queryFn: async () => await api.events(params),
  });
}

export function useEvent(slug: string) {
  return useQuery({
    queryKey: ['event', slug],
    queryFn: async () => (await api.event(slug)).data,
    enabled: Boolean(slug),
  });
}

export function usePlaces(params?: { community?: string; per_page?: number }) {
  return useQuery({
    queryKey: ['places', params],
    queryFn: async () => await api.places(params),
  });
}

export function usePlace(id: string) {
  return useQuery({
    queryKey: ['place', id],
    queryFn: async () => (await api.place(id)).data,
    enabled: Boolean(id),
  });
}

export function useGalleries() {
  return useQuery({
    queryKey: ['galleries'],
    queryFn: async () => await api.galleries(),
  });
}

export function useMe() {
  const { token } = useAuth();

  return useQuery({
    queryKey: ['me'],
    queryFn: async () => (await api.me(token as string)).data,
    enabled: Boolean(token),
  });
}

export function useBookings(status: string) {
  const { token } = useAuth();

  return useQuery({
    queryKey: ['bookings', status],
    queryFn: async () => await api.bookings(token as string, status),
    enabled: Boolean(token),
  });
}

export function useBooking(reference: string) {
  const { token } = useAuth();

  return useQuery({
    queryKey: ['booking', reference],
    queryFn: async () => (await api.booking(token as string, reference)).data,
    enabled: Boolean(token && reference),
  });
}

export function useCancelBooking(reference: string) {
  const { token } = useAuth();
  const client = useQueryClient();

  return useMutation({
    mutationFn: async (reason: string) => {
      if (!token) {
        throw new Error('You need to sign in first.');
      }

      return await api.cancelBooking(token, reference, reason);
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['bookings'] });
      client.invalidateQueries({ queryKey: ['booking', reference] });
    },
  });
}

export function useCreateBooking() {
  const { token } = useAuth();
  const client = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      eventSlug: string;
      items: { ticketTierId: string; quantity: number }[];
    }) => {
      if (!token) {
        throw new Error('You need to sign in first.');
      }

      return await api.createBooking(token, payload);
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

export function useUpdateMe() {
  const { token } = useAuth();
  const client = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { name?: string; location?: string; crew?: string }) => {
      if (!token) {
        throw new Error('You need to sign in first.');
      }

      return await api.updateMe(token, payload);
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['me'] });
    },
  });
}
