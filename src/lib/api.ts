import type { ApiCollection, ApiResource, AuthResponse, BookingCard, BookingDetail, Community, Event, GalleryItem, Landing, Place, UserProfile, ValidationErrors } from "./types";

const DEFAULT_API_URL = "https://squire-evacuee-granny.ngrok-free.dev/api/v1";

const SEEDED_MEDIA_FALLBACKS: Record<string, string> = {
  "/events/puncak-trail-run-2026.jpg": "/storage/gallery/demo/tea-plantation-switchbacks.jpg",
  "/events/sunrise-healthy-walk.jpg": "/storage/gallery/demo/walking-crew.jpg",
  "/events/highland-camp-bonfire.jpg": "/storage/gallery/demo/bonfire-stargazing.jpg",
  "/events/forest-fun-run.jpg": "/storage/gallery/demo/meadow-rest-stop.jpg",
  "/events/misty-ridge-hike.jpg": "/storage/gallery/demo/summit-push-at-dawn.jpg",
  "/events/mindful-mountain-yoga.jpg": "/storage/gallery/demo/sunrise-yoga.jpg",
  "/events/puncak-pass-half-marathon.jpg": "/storage/gallery/demo/pack-rolls-out.jpg",
  "/events/lakeside-camp-weekend.jpg": "/storage/gallery/demo/lakeside-camp-morning.jpg",
  "/landing/community-runners.jpg": "/storage/gallery/demo/tea-plantation-switchbacks.jpg",
};

export const API_BASE_URL = (process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "") || DEFAULT_API_URL).replace(/\/$/, "");

const LOCAL_MEDIA_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "0.0.0.0"]);
const STORAGE_MEDIA_PATTERN = /^\/?(public\/)?(events|gallery|communities|avatars|places)\//;

function applyApiOrigin(url: URL, api: URL) {
  url.protocol = api.protocol;
  url.hostname = api.hostname;
  url.port = api.port;
}

type ApiRequestOptions = RequestInit & {
  token?: string | null;
};

export class ApiError extends Error {
  status: number;
  errors?: ValidationErrors;

  constructor(message: string, status: number, errors?: ValidationErrors) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

function apiUrl(path: string, params?: Record<string, string | number | undefined | null>) {
  const url = new URL(`${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`);

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

async function parseResponse(response: Response) {
  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new ApiError("The server returned an unreadable response.", response.status);
  }
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { token, headers, body, ...requestOptions } = options;

  try {
    const response = await fetch(apiUrl(path), {
      ...requestOptions,
      headers: {
        Accept: "application/json",
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body,
    });

    const payload = await parseResponse(response);

    if (!response.ok) {
      throw new ApiError(payload?.message ?? `Request failed with status ${response.status}.`, response.status, payload?.errors);
    }

    return payload as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError("Network error. Check the API server and try again.", 0);
  }
}

function stripApiBasePath(pathname: string, apiBasePath: string) {
  if (apiBasePath && pathname.startsWith(`${apiBasePath}/storage/`)) {
    return pathname.replace(apiBasePath, "");
  }

  return pathname;
}

function normalizeMediaPath(pathname: string, apiBasePath: string) {
  let normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;

  normalizedPath = stripApiBasePath(normalizedPath, apiBasePath);
  normalizedPath = normalizedPath.replace(/^\/public\/storage\//, "/storage/");
  normalizedPath = SEEDED_MEDIA_FALLBACKS[normalizedPath] ?? normalizedPath;

  if (!normalizedPath.startsWith("/storage/") && STORAGE_MEDIA_PATTERN.test(normalizedPath)) {
    normalizedPath = `/storage/${normalizedPath.replace(/^\/?public\//, "").replace(/^\//, "")}`;
  }

  return normalizedPath;
}

export function assetUrl(path?: string | null) {
  if (!path) {
    return null;
  }

  const value = path.trim();

  if (!value) {
    return null;
  }

  const api = new URL(API_BASE_URL);
  const apiBasePath = api.pathname.replace(/\/$/, "");

  if (/^https?:\/\//i.test(value)) {
    try {
      const url = new URL(value);
      url.pathname = normalizeMediaPath(url.pathname, apiBasePath);

      if (LOCAL_MEDIA_HOSTS.has(url.hostname) && url.pathname.startsWith("/storage/")) {
        applyApiOrigin(url, api);
      }

      return url.toString();
    } catch {
      return null;
    }
  }

  if (value.startsWith("//")) {
    try {
      const url = new URL(`${api.protocol}${value}`);
      url.pathname = normalizeMediaPath(url.pathname, apiBasePath);

      if (LOCAL_MEDIA_HOSTS.has(url.hostname) && url.pathname.startsWith("/storage/")) {
        applyApiOrigin(url, api);
      }

      return url.toString();
    } catch {
      return null;
    }
  }

  const pathname = normalizeMediaPath(value, apiBasePath);

  return new URL(pathname, api.origin).toString();
}

export const api = {
  health: () => apiRequest<{ status: string }>("/health"),
  landing: () => apiRequest<ApiResource<Landing>>("/landing"),
  login: (payload: { email: string; password: string; remember?: boolean }) =>
    apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  register: (payload: { name: string; email: string; password: string }) =>
    apiRequest<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  exchangeGoogleCode: (code: string) =>
    apiRequest<AuthResponse>("/auth/google/exchange", {
      method: "POST",
      body: JSON.stringify({ code }),
    }),
  logout: (token: string | null) =>
    apiRequest<null>("/auth/logout", {
      method: "POST",
      token,
    }),
  me: (token: string) => apiRequest<ApiResource<UserProfile>>("/me", { token }),
  updateMe: (token: string, payload: { name?: string; location?: string; crew?: string }) =>
    apiRequest<ApiResource<UserProfile>>("/me", {
      method: "PATCH",
      token,
      body: JSON.stringify(payload),
    }),
  events: (params?: { q?: string; status?: "all" | "upcoming" | "ongoing" | "completed"; activity?: string; community?: string; sort?: "date" | "price" | "spots"; per_page?: number; page?: number }) => apiRequest<ApiCollection<Event>>(apiUrl("/events", params).replace(API_BASE_URL, "")),
  event: (slug: string) => apiRequest<ApiResource<Event>>(`/events/${slug}`),
  places: (params?: { community?: string; per_page?: number; page?: number }) => apiRequest<ApiCollection<Place>>(apiUrl("/places", params).replace(API_BASE_URL, "")),
  place: (id: string | number) => apiRequest<ApiResource<Place>>(`/places/${id}`),
  communities: (params?: { per_page?: number; page?: number }) => apiRequest<ApiCollection<Community>>(apiUrl("/communities", params).replace(API_BASE_URL, "")),
  galleries: () => apiRequest<ApiCollection<GalleryItem>>("/galleries"),
  bookings: (token: string, status: string) =>
    apiRequest<ApiCollection<BookingCard>>(`/bookings?status=${encodeURIComponent(status)}`, {
      token,
    }),
  booking: (token: string, reference: string) => apiRequest<ApiResource<BookingDetail>>(`/bookings/${reference}`, { token }),
  createBooking: (token: string, payload: { eventSlug: string; items: { ticketTierId: string; quantity: number }[] }) =>
    apiRequest<ApiResource<BookingDetail>>("/bookings", {
      method: "POST",
      token,
      body: JSON.stringify({ ...payload, termsAccepted: true }),
    }),
  cancelBooking: (token: string, reference: string, reason: string) =>
    apiRequest<ApiResource<{ reference: string; status: string }>>(`/bookings/${reference}/cancel`, {
      method: "POST",
      token,
      body: JSON.stringify({ reason }),
    }),
  savedEvents: (token: string) => apiRequest<ApiCollection<BookingCard>>("/me/saved-events", { token }),
};
