import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { api, API_BASE_URL, ApiError } from '@/lib/api';
import { clearStoredToken, getStoredToken, setStoredToken } from '@/lib/auth-storage';
import type { AuthUser } from '@/lib/types';

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  booting: boolean;
  isAuthenticated: boolean;
  login: (payload: { email: string; password: string }) => Promise<void>;
  register: (payload: { name: string; email: string; password: string }) => Promise<void>;
  startGoogleSignIn: () => Promise<void>;
  exchangeGoogleCode: (code: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
    },
  },
});

function AuthProviderInner({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [booting, setBooting] = useState(true);
  const client = useQueryClient();

  const applySession = useCallback(async (nextToken: string, nextUser: AuthUser) => {
    await setStoredToken(nextToken);
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function restore() {
      try {
        const storedToken = await getStoredToken();
        if (!storedToken) {
          return;
        }

        const response = await api.me(storedToken);
        if (mounted) {
          setToken(storedToken);
          setUser(response.data);
        }
      } catch {
        await clearStoredToken();
      } finally {
        if (mounted) {
          setBooting(false);
        }
      }
    }

    restore();

    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(
    async (payload: { email: string; password: string }) => {
      const response = await api.login(payload);
      await applySession(response.token, response.user);
    },
    [applySession]
  );

  const register = useCallback(
    async (payload: { name: string; email: string; password: string }) => {
      const response = await api.register(payload);
      await applySession(response.token, response.user);
    },
    [applySession]
  );

  const exchangeGoogleCode = useCallback(
    async (code: string) => {
      const response = await api.exchangeGoogleCode(code);
      await applySession(response.token, response.user);
    },
    [applySession]
  );

  const startGoogleSignIn = useCallback(async () => {
    const callbackUrl = Linking.createURL('/auth/google/callback');
    const redirectUrl = `${API_BASE_URL}/auth/google/redirect?return_to=${encodeURIComponent(
      callbackUrl
    )}`;
    const result = await WebBrowser.openAuthSessionAsync(redirectUrl, callbackUrl);

    if (result.type === 'success') {
      const parsed = Linking.parse(result.url);
      const code = typeof parsed.queryParams?.code === 'string' ? parsed.queryParams.code : null;

      if (!code) {
        throw new ApiError('Google sign-in did not return an exchange code.', 422);
      }

      await exchangeGoogleCode(code);
    }
  }, [exchangeGoogleCode]);

  const logout = useCallback(async () => {
    const staleToken = token;
    setToken(null);
    setUser(null);
    await clearStoredToken();
    client.clear();

    if (staleToken) {
      try {
        await api.logout(staleToken);
      } catch {
        // Local logout still succeeds if the server is unreachable.
      }
    }
  }, [client, token]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      booting,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      startGoogleSignIn,
      exchangeGoogleCode,
      logout,
    }),
    [booting, exchangeGoogleCode, login, logout, register, startGoogleSignIn, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProviderInner>{children}</AuthProviderInner>
    </QueryClientProvider>
  );
}
