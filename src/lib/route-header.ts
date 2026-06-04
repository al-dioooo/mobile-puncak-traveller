export type MobileHeaderState = {
  title: string;
  showBack: boolean;
};

const TAB_ROUTES: Record<string, string> = {
  '/': 'Home',
  '/explore': 'Explore',
  '/bookings': 'My Bookings',
  '/profile': 'Profile',
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
      title: tabTitle,
      showBack: false,
    };
  }

  if (STACK_TITLES[path]) {
    return {
      title: STACK_TITLES[path],
      showBack: true,
    };
  }

  if (path.startsWith('/events/')) {
    return {
      title: 'Event Details',
      showBack: true,
    };
  }

  if (path.startsWith('/places/')) {
    return {
      title: 'Place Details',
      showBack: true,
    };
  }

  if (path.startsWith('/bookings/')) {
    return {
      title: 'Booking Details',
      showBack: true,
    };
  }

  return {
    title: 'Puncak Traveller',
    showBack: true,
  };
}
