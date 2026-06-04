import { Link, router } from 'expo-router';
import { useState } from 'react';

import {
  AppScreen,
  AppText,
  FormInput,
  Icon,
  PrimaryButton,
  StateBlock,
  Surface,
} from '@/components/puncak/ui';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { ApiError } from '@/lib/api';
import { Pressable, View } from '@/tw';

export default function LoginScreen() {
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setSubmitting(true);
    setError(null);

    try {
      await auth.login({ email, password });
      router.replace('/');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to sign in.');
    } finally {
      setSubmitting(false);
    }
  }

  async function google() {
    setSubmitting(true);
    setError(null);

    try {
      await auth.startGoogleSignIn();
      router.replace('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AppScreen contentClassName="items-center px-5 pb-10 pt-4">
      <Surface className="min-h-[753px] p-8">
        <View className="items-center gap-4 pb-6">
          <View className="h-[108px] w-[220px] items-center justify-center">
            <View className="h-16 w-16 items-center justify-center rounded-puncak-card bg-puncak-orange">
              <Icon name="mountain.2" color="#FFFFFF" size={30} />
            </View>
            <AppText variant="title" className="mt-3 text-center text-[20px] leading-[24px]">
              Puncak Traveller
            </AppText>
          </View>
          <AppText variant="bodyMuted" className="text-center">
            Your next high-altitude adventure starts{'\n'}here.
          </AppText>
        </View>

        <View className="gap-5">
          <FormInput
            label="Email Address"
            icon="envelope"
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            placeholder="name@example.com"
            value={email}
            onChangeText={setEmail}
          />
          <View className="gap-2">
            <View className="flex-row items-center justify-between">
              <AppText variant="label" className="px-1">
                Password
              </AppText>
              <AppText variant="caption" className="font-semibold text-puncak-orange">
                Forgot password?
              </AppText>
            </View>
            <FormInput
              label=""
              icon="lock"
              secureTextEntry
              textContentType="password"
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              className="-mt-2"
            />
          </View>

          {error ? <StateBlock title="Sign-in failed" message={error} /> : null}

          <PrimaryButton onPress={submit} disabled={submitting} className="min-h-[56px]">
            {submitting ? 'Signing in...' : 'Login'}
          </PrimaryButton>

          <View className="min-h-12 flex-row items-center gap-4">
            <View className="h-px flex-1 bg-puncak-line" />
            <AppText variant="caption" className="text-puncak-subtle">
              Or continue with
            </AppText>
            <View className="h-px flex-1 bg-puncak-line" />
          </View>

          <PrimaryButton
            onPress={google}
            disabled={submitting}
            variant="secondary"
            icon="globe"
            className="min-h-[58px]">
            Sign in with Google
          </PrimaryButton>

          <View className="flex-row flex-wrap justify-center gap-1 pt-4">
            <AppText variant="bodyMuted">Don&apos;t have an account?</AppText>
            <Link href="/register" asChild>
              <Pressable>
                <AppText variant="label" className="font-bold text-puncak-teal">
                  Register Now
                </AppText>
              </Pressable>
            </Link>
          </View>
        </View>

        <View className="mt-auto min-h-[69px] flex-row items-center justify-center gap-8 border-t border-puncak-line bg-puncak-fill">
          {(['paperplane', 'camera', 'link'] as const).map((name) => (
            <Icon key={name} name={name} color={Colors.light.textTertiary} size={18} />
          ))}
        </View>
      </Surface>
    </AppScreen>
  );
}
