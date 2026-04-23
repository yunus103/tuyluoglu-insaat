/**
 * ThemeProvider — Dark mode kaldırıldı.
 * Artık sadece children'ı render eden basit bir wrapper.
 * next-themes bağımlılığı kaldırıldı.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
