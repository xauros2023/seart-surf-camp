"use client";

import { useCurrency } from "@/components/providers/CurrencyProvider";

/**
 * Client island that re-renders prices when the active currency changes.
 *
 * Use anywhere a price needs to follow the user's currency choice:
 *   <PriceTag amountEur={15} suffix="/ night / person" />
 *
 * Accepts either a raw number (preferred, EUR base) or a string like "15€" / "450€"
 * that we parse for backwards compatibility with existing content.json values.
 */
export default function PriceTag({
  amountEur,
  rawPrice,
  suffix,
  className,
}: {
  amountEur?: number;
  rawPrice?: string;
  suffix?: string;
  className?: string;
}) {
  const { format } = useCurrency();
  const amount = amountEur ?? parseRawPrice(rawPrice);
  return (
    <span className={className}>
      {format(amount)}
      {suffix ? <span className="ms-1 text-sm font-sans font-medium text-foreground/50">{suffix}</span> : null}
    </span>
  );
}

function parseRawPrice(value?: string): number {
  if (!value) return 0;
  const n = Number.parseInt(value.replace(/[^\d]/g, ""), 10);
  return Number.isFinite(n) ? n : 0;
}
