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
import { useAuth } from '@/hooks/use-auth';
import { ApiError } from '@/lib/api';
import { Pressable, View } from '@/tw';

export default function RegisterScreen() {
  const auth = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setError(null);

    if (password !== confirm) {
      setError('Password confirmation does not match.');
      return;
    }

    setSubmitting(true);

    try {
      await auth.register({ name, email, password });
      router.replace('/');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to create account.');
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
    <AppScreen contentClassName="items-center px-5 pb-10 pt-[70px]">
      <Surface className="min-h-[965px] p-0">
        <View className="min-h-[72px] flex-row items-center border-b border-puncak-line px-4">
          <Pressable
            accessibilityRole="button"
            className="h-10 w-10 items-center justify-center"
            onPress={() => router.back()}>
            <Icon name="chevron.left" size={18} />
          </Pressable>
        </View>

        <View className="gap-8 p-8">
          <View className="items-center gap-2">
            <AppText variant="hero" className="text-center">
              Create Account
            </AppText>
            <AppText variant="bodyMuted" className="text-center">
              Join our community of explorers today
            </AppText>
          </View>

          <View className="gap-5">
            <FormInput
              label="Name"
              icon="person"
              textContentType="name"
              placeholder="Alice Evergarden"
              value={name}
              onChangeText={setName}
            />
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
            <FormInput
              label="Password"
              icon="lock"
              secureTextEntry
              textContentType="newPassword"
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
            />
            <FormInput
              label="Confirm"
              icon="lock"
              secureTextEntry
              textContentType="newPassword"
              placeholder="Confirm password"
              value={confirm}
              onChangeText={setConfirm}
            />

            {error ? <StateBlock title="Registration failed" message={error} /> : null}

            <PrimaryButton onPress={submit} disabled={submitting}>
              {submitting ? 'Creating account...' : 'Register'}
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
          </View>

          <View className="flex-row flex-wrap justify-center gap-1">
            <AppText variant="bodyMuted">Already have an account?</AppText>
            <Link href="/login" asChild>
              <Pressable>
                <AppText variant="label" className="font-bold text-puncak-teal">
                  Login
                </AppText>
              </Pressable>
            </Link>
          </View>
        </View>
      </Surface>
    </AppScreen>
  );
}
