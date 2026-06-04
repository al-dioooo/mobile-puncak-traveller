export type MobileHeaderState = {
  title: string;
  description?: string;
  showBack: boolean;
  isTab: boolean;
};

const TAB_ROUTES: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Puncak Traveller',
    description: 'Curated highland stays, routes, and events from trusted local crews.',
  },
  '/explore': {
    title: 'Explore',
    description: 'Browse communities, then jump into their places or events.',
  },
  '/bookings': {
    title: 'My Bookings',
    description: 'Track your current and past Puncak Traveller event bookings.',
  },
  '/profile': {
    title: 'Profile',
    description: 'Manage your traveller account and event history.',
  },
};

const STACK_TITLES: Record<string, string> = {
  '/login': 'Login',
  '/register': 'Register',
  '/auth/google/callback': 'Google Sign-In',
  '/runners': 'Puncak Runners',
  '/stays': 'Puncak Menginap',
  '/camping': 'Puncak In',
  '/events': 'All Events',
  '/account-preferences': 'Account Preferences',
};

function normalizePathname(pathname: string) {
  const [path] = pathname.split('?');
  const normalized = path.replace(/\/+$/, '');

  return normalized === '' ? '/' : normalized;
}

export function resolveMobileHeader(pathname: string): MobileHeaderState {
  const path = normalizePathname(pathname);
  const tabTitle = TAB_ROUTES[path];

  if (tabTitle) {
    return {
      title: tabTitle.title,
      description: tabTitle.description,
      showBack: false,
      isTab: true,
    };
  }

  if (STACK_TITLES[path]) {
    return {
      title: STACK_TITLES[path],
      showBack: true,
      isTab: false,
    };
  }

  if (path.startsWith('/events/')) {
    return {
      title: 'Event Details',
      showBack: true,
      isTab: false,
    };
  }

  if (path.startsWith('/places/')) {
    return {
      title: 'Place Details',
      showBack: true,
      isTab: false,
    };
  }

  if (path.startsWith('/bookings/')) {
    return {
      title: 'Booking Details',
      showBack: true,
      isTab: false,
    };
  }

  return {
    title: 'Puncak Traveller',
    showBack: true,
    isTab: false,
  };
}
