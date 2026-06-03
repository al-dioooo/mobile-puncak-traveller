import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

import { AppScreen, StateBlock } from '@/components/puncak/ui';
import { useAuth } from '@/hooks/use-auth';
import { ApiError } from '@/lib/api';

export default function GoogleCallbackScreen() {
  const { code } = useLocalSearchParams<{ code?: string }>();
  const auth = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function exchange() {
      if (!code) {
        setError('Google sign-in did not include a code.');
        return;
      }

      try {
        await auth.exchangeGoogleCode(code);
        router.replace('/');
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'Google sign-in failed.');
      }
    }

    exchange();
  }, [auth, code]);

  return (
    <AppScreen>
      {error ? (
        <StateBlock title="Google sign-in failed" message={error} onRetry={() => router.replace('/login')} />
      ) : (
        <StateBlock loading title="Completing Google sign-in" />
      )}
    </AppScreen>
  );
}
