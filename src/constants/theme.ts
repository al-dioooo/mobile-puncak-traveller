import { Platform } from 'react-native';

export const Palette = {
  ember: '#F37820',
  emberDark: '#C85B0F',
  emberSoft: '#FFF1E8',
  ink: '#0F172A',
  slate: '#334155',
  mist: '#94A3B8',
  line: '#E2E8F0',
  paper: '#FFFFFF',
  sand: '#FFFFFF',
  cloud: '#F8FAFC',
  success: '#16A34A',
  warning: '#F59E0B',
  danger: '#DC2626',
} as const;

export const Colors = {
  light: {
    text: Palette.ink,
    background: Palette.sand,
    surface: Palette.paper,
    surfaceMuted: Palette.cloud,
    backgroundElement: Palette.cloud,
    backgroundSelected: '#E2E8F0',
    border: Palette.line,
    primary: Palette.ember,
    primaryDark: Palette.emberDark,
    primarySoft: 'rgba(243, 120, 32, 0.12)',
    textSecondary: Palette.slate,
    textTertiary: Palette.mist,
    success: Palette.success,
    warning: Palette.warning,
    danger: Palette.danger,
  },
  dark: {
    text: '#F8FAFC',
    background: '#111827',
    surface: '#182033',
    surfaceMuted: '#202A3F',
    backgroundElement: '#202A3F',
    backgroundSelected: '#334155',
    border: '#334155',
    primary: Palette.ember,
    primaryDark: '#FF9A4F',
    primarySoft: '#3A2417',
    textSecondary: '#CBD5E1',
    textTertiary: '#94A3B8',
    success: '#4ADE80',
    warning: '#FBBF24',
    danger: '#F87171',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  web: {
    sans: 'var(--font-display)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
  default: {
    sans: 'sans-serif',
    rounded: 'sans-serif',
    mono: 'monospace',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 12,
  four: 16,
  five: 20,
  six: 24,
  seven: 32,
  eight: 40,
  nine: 56,
} as const;

export const Radius = {
  small: 10,
  medium: 16,
  large: 20,
  pill: 999,
} as const;

export const Shadow = {
  card: '0 1px 8px rgba(15, 23, 42, 0.08)',
  lift: '0 10px 30px rgba(15, 23, 42, 0.12)',
} as const;

export const MaxContentWidth = 402;
