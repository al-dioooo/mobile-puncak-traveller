export type ApiMeta = {
  page: number;
  perPage: number;
  total: number;
};

export type ApiCollection<T> = {
  data: T[];
  meta?: ApiMeta;
};

export type ApiResource<T> = {
  data: T;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  avatarUrl?: string | null;
  location?: string | null;
  crew?: string | null;
};

export type UserProfile = AuthUser & {
  memberSince?: string | null;
  stats?: {
    eventsBooked: number;
    completed: number;
    kilometersLogged: number;
  };
};

export type AuthResponse = {
  user: AuthUser;
  token: string;
  tokenType: 'Bearer' | string;
  message: string;
};

export type Community = {
  id: number;
  parent_id?: number | null;
  name: string;
  slug: string;
  description?: string | null;
  image_path?: string | null;
  image_url?: string | null;
  member_count?: number | null;
  places_count?: number;
  events_count?: number;
  placesCount?: number;
  eventsCount?: number;
  children?: Community[];
};

export type Place = {
  id: number;
  community_id: number;
  name: string;
  lat: number;
  lng: number;
  description?: string | null;
  imageUrl?: string | null;
  image_url?: string | null;
  imageAlt?: string | null;
  community?: Community;
};

export type TicketType = {
  id: string;
  eventId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  stock: number;
  quantity: number;
  sold: number;
  capacityLabel: string;
  maxPerUser?: number;
};

export type Event = {
  id: string;
  slug: string;
  title: string;
  category: string;
  activity: string;
  status: 'upcoming' | 'ongoing' | 'completed' | string;
  statusLabel: string;
  publicationStatus?: string;
  publicationStatusLabel?: string;
  startsAt?: string | null;
  endsAt?: string | null;
  dateLabel?: string | null;
  fullDateLabel?: string | null;
  timeLabel?: string | null;
  location: string;
  region: string;
  priceFrom: number;
  priceLabel: string;
  spotsRemaining: number;
  spotsLabel: string;
  imageUrl?: string | null;
  imageAlt?: string | null;
  detailHref?: string;
  bookingHref?: string;
  recapHref?: string;
  organiser?: {
    id: string;
    name: string;
    description: string;
    eventsHosted: number;
    href: string;
  };
  distanceLabel?: string;
  elevationLabel?: string;
  difficulty?: string;
  venueName?: string;
  venueDescription?: string;
  summary?: string[];
  includes?: string[];
  schedule?: { time: string; title: string }[];
  tickets?: TicketType[];
};

export type GalleryItem = {
  id: string;
  title: string;
  caption: string;
  event: string;
  eventId?: string | number | null;
  category: string;
  year: string;
  imageUrl?: string | null;
  imageAlt?: string | null;
};

export type Landing = {
  hero_stats: { label: string; value: number }[];
  upcoming_events: Event[];
  activities: { activity_type: string; activity_label: string; upcoming_count: number }[];
  live_event: Event | null;
  communities: Community[];
  gallery: GalleryItem[];
};

export type BookingCard = {
  id: string;
  status: string;
  badge: string;
  title: string;
  date?: string | null;
  location: string;
  reference: string;
  ticketLabel: string;
  primaryAction: string;
  primaryHref: string;
  secondaryAction: string;
  secondaryHref: string;
};

export type BookingItem = {
  ticketTierId: string;
  ticketName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type BookingDetail = {
  id: string;
  reference: string;
  status: string;
  paymentStatus: string;
  eventId: string;
  eventSlug?: string | null;
  attendeeName?: string | null;
  attendeeEmail?: string | null;
  items?: BookingItem[];
  subtotal: number;
  bookingFee: number;
  total: number;
  currency: string;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type ValidationErrors = Record<string, string[]>;
