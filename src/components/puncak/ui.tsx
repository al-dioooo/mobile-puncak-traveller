import { Link, router, usePathname } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import type { ComponentProps, ReactNode } from 'react';
import { useState } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { ActivityIndicator } from 'react-native';

import { Colors } from '@/constants/theme';
import { cn } from '@/lib/cn';
import { assetUrl } from '@/lib/api';
import { resolveMobileHeader } from '@/lib/route-header';
import { Image } from '@/tw/image';
import { Pressable, ScrollView, Text, TextInput, View } from '@/tw';

type IconName = ComponentProps<typeof SymbolView>['name'];

const textVariants = {
  body: 'font-sans text-[15px] font-medium leading-[22px] text-puncak-ink',
  bodyMuted: 'font-sans text-[14px] font-normal leading-[20px] text-puncak-muted',
  label: 'font-sans text-[14px] font-semibold leading-[20px] text-puncak-slate',
  caption: 'font-sans text-[12px] font-medium leading-[16px] text-puncak-muted',
  title: 'font-sans text-[20px] font-bold leading-[28px] text-puncak-ink',
  hero: 'font-sans text-[24px] font-bold leading-[30px] text-puncak-ink',
  eyebrow: 'font-sans text-[12px] font-semibold uppercase leading-[16px] text-puncak-orange',
  price: 'font-sans text-[16px] font-bold leading-[24px] text-puncak-orange',
} as const;

export function AppScreen({
  children,
  contentStyle,
  className,
  contentClassName,
  headerShown = true,
}: {
  children: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  className?: string;
  contentClassName?: string;
  headerShown?: boolean;
}) {
  return (
    <ScrollView
      className={cn('flex-1 bg-puncak-page', className)}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerClassName={cn(
        'items-center px-6 pb-28 pt-4',
        contentClassName
      )}
      contentContainerStyle={contentStyle}>
      <View className="w-full max-w-[402px] gap-6">
        {headerShown ? <MobileHeader /> : null}
        {children}
      </View>
    </ScrollView>
  );
}

export function MobileHeader() {
  const pathname = usePathname();
  const header = resolveMobileHeader(pathname);

  if (header.isTab) {
    return (
      <View className="gap-2 pb-2 pt-1">
        <AppText variant="hero" className="text-[30px] leading-[36px]">
          {header.title}
        </AppText>
        {header.description ? (
          <AppText variant="bodyMuted" className="max-w-[340px]">
            {header.description}
          </AppText>
        ) : null}
      </View>
    );
  }

  return (
    <View className="min-h-[52px] flex-row items-center justify-between">
      {header.showBack ? (
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          className="h-11 w-11 items-center justify-center rounded-full bg-puncak-fill active:opacity-80"
          onPress={() => router.back()}>
          <Icon name="chevron.left" color={Colors.light.text} size={20} />
        </Pressable>
      ) : (
        <View className="h-11 w-11" />
      )}
      <View className="min-w-0 flex-1 px-3">
        <AppText variant="label" className="text-center text-[15px] font-bold text-puncak-ink" numberOfLines={1}>
          {header.title}
        </AppText>
      </View>
      <View className="h-11 w-11" />
    </View>
  );
}

export function ScreenTitle({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <View className="gap-2">
      {eyebrow ? <AppText variant="eyebrow">{eyebrow}</AppText> : null}
      <AppText variant="hero">{title}</AppText>
      {subtitle ? <AppText variant="bodyMuted">{subtitle}</AppText> : null}
    </View>
  );
}

export function AppText({
  children,
  variant = 'body',
  style,
  selectable,
  className,
  numberOfLines,
}: {
  children: ReactNode;
  variant?: keyof typeof textVariants;
  style?: StyleProp<TextStyle>;
  selectable?: boolean;
  className?: string;
  numberOfLines?: number;
}) {
  return (
    <Text
      className={cn(textVariants[variant], className)}
      numberOfLines={numberOfLines}
      selectable={selectable}
      style={style}>
      {children}
    </Text>
  );
}

export function Icon({
  name,
  color,
  size = 18,
}: {
  name: IconName;
  color?: string;
  size?: number;
}) {
  return <SymbolView name={name} size={size} tintColor={color ?? Colors.light.text} />;
}

export function PrimaryButton({
  children,
  onPress,
  disabled,
  icon,
  variant = 'primary',
  className,
}: {
  children: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  icon?: IconName;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
}) {
  const textColor =
    variant === 'secondary' ? 'text-puncak-slate' : 'text-white';
  const iconColor =
    variant === 'secondary' ? Colors.light.text : '#FFFFFF';

  return (
    <Pressable
      accessibilityRole="button"
      className={cn(
        'min-h-[52px] flex-row items-center justify-center gap-2 rounded-puncak-control border px-5 active:opacity-80',
        variant === 'primary' && 'border-puncak-orange bg-puncak-orange',
        variant === 'secondary' && 'border-puncak-line bg-white',
        variant === 'danger' && 'border-puncak-danger bg-puncak-danger',
        disabled && 'opacity-60',
        className
      )}
      disabled={disabled}
      onPress={onPress}>
      {icon ? <Icon name={icon} color={iconColor} size={17} /> : null}
      <AppText variant="label" className={cn('font-bold', textColor)}>
        {children}
      </AppText>
    </Pressable>
  );
}

export function FormInput({
  label,
  icon,
  error,
  className,
  ...props
}: ComponentProps<typeof TextInput> & {
  label: string;
  icon?: IconName;
  error?: string;
  className?: string;
}) {
  return (
    <View className={cn('gap-2', className)}>
      <AppText variant="label" className="px-1">
        {label}
      </AppText>
      <View
        className={cn(
          'min-h-[51px] flex-row items-center gap-3 rounded-none border border-puncak-line bg-puncak-fill px-4'
        )}>
        {icon ? <Icon name={icon} color={Colors.light.textTertiary} size={18} /> : null}
        <TextInput
          className="min-w-0 flex-1 font-sans text-[16px] leading-[19px] text-puncak-ink outline-none"
          placeholderTextColor={Colors.light.textTertiary}
          {...props}
        />
      </View>
      {error ? (
        <AppText selectable variant="caption" className="text-puncak-danger">
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

export function SectionHeader({
  title,
  action,
}: {
  title: string;
  action?: { label: string; href?: ComponentProps<typeof Link>['href']; onPress?: () => void };
}) {
  const actionText = (
    <AppText variant="label" className="font-semibold text-puncak-orange">
      {action?.label}
    </AppText>
  );

  return (
    <View className="flex-row items-center justify-between gap-4">
      <AppText variant="title">{title}</AppText>
      {action?.href ? (
        <Link href={action.href} asChild>
          <Pressable accessibilityRole="link">{actionText}</Pressable>
        </Link>
      ) : action ? (
        <Pressable accessibilityRole="button" onPress={action.onPress}>
          {actionText}
        </Pressable>
      ) : null}
    </View>
  );
}

export function StateBlock({
  title,
  message,
  loading,
  onRetry,
  className,
}: {
  title: string;
  message?: string;
  loading?: boolean;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <View
      className={cn(
        'items-center gap-3 rounded-puncak-card border border-puncak-line bg-white p-6 shadow-sm',
        className
      )}>
      {loading ? (
        <ActivityIndicator color={Colors.light.primary} />
      ) : (
        <Icon name="exclamationmark.circle" color={Colors.light.primary} size={26} />
      )}
      <AppText variant="label" selectable className="text-center font-bold text-puncak-ink">
        {title}
      </AppText>
      {message ? (
        <AppText variant="bodyMuted" className="text-center" selectable>
          {message}
        </AppText>
      ) : null}
      {onRetry ? (
        <PrimaryButton variant="secondary" onPress={onRetry} className="mt-1 min-h-[46px]">
          Retry
        </PrimaryButton>
      ) : null}
    </View>
  );
}

export function ImagePanel({
  imageUrl,
  imageAlt,
  children,
  style,
  className,
  fallbackLabel = 'Puncak Traveller',
}: {
  imageUrl?: string | null;
  imageAlt?: string | null;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  className?: string;
  fallbackLabel?: string;
}) {
  const [failed, setFailed] = useState(false);
  const resolved = assetUrl(imageUrl);
  const showImage = Boolean(resolved && !failed);

  return (
    <View
      className={cn(
        'relative min-h-[140px] overflow-hidden rounded-puncak-small bg-puncak-fill',
        className
      )}
      style={style}>
      {showImage ? (
        <Image
          accessibilityLabel={imageAlt ?? undefined}
          className="absolute inset-0 h-full w-full object-cover"
          placeholderContentFit="cover"
          recyclingKey={resolved ?? undefined}
          source={resolved}
          transition={180}
          onError={() => setFailed(true)}
        />
      ) : (
        <View className="absolute inset-0 items-center justify-center bg-puncak-fill px-4">
          <Icon name="photo" color={Colors.light.textTertiary} size={24} />
          <AppText variant="caption" className="mt-2 text-center text-puncak-subtle">
            {fallbackLabel}
          </AppText>
        </View>
      )}
      {children}
    </View>
  );
}

export function MetricPill({
  icon,
  children,
  className,
}: {
  icon?: IconName;
  children: ReactNode;
  className?: string;
}) {
  return (
    <View
      className={cn(
        'self-start flex-row items-center gap-1 rounded-full bg-puncak-orange-soft px-3 py-1',
        className
      )}>
      {icon ? <Icon name={icon} color={Colors.light.primary} size={13} /> : null}
      <AppText variant="caption" className="font-semibold text-puncak-orange">
        {children}
      </AppText>
    </View>
  );
}

export function Surface({
  children,
  style,
  className,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  className?: string;
}) {
  return (
    <View className={cn('gap-3 rounded-puncak-card bg-white p-5 shadow-sm', className)} style={style}>
      {children}
    </View>
  );
}
