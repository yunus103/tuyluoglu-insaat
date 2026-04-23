"use client";
import { usePathname } from "next/navigation";

/** Homepage'de header şeffaf + hero tam ekran olduğu için spacer yok.
 *  Diğer tüm sayfalarda fixed header'ın altına 80px boşluk bırakır. */
export function HeaderSpacer() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return <div className="h-20" aria-hidden="true" />;
}
