import { t } from '../i18n';

/** Prevention-vs-recovery comparison rows (shared by home + comparison pages). */
export function preventionComparison(locale: string) {
  const tt = (k: string) => t(locale, k);
  const rows = ['when', 'who', 'action', 'cost'] as const;
  return {
    columns: [
      { label: tt('home.compare.col.persistent'), highlight: true },
      { label: tt('home.compare.col.recovery') },
    ],
    rows: rows.map((r) => ({
      label: tt(`home.compare.row.${r}.label`),
      cells: [
        { value: tt(`home.compare.row.${r}.persistent`), tone: 'good' as const },
        { value: tt(`home.compare.row.${r}.recovery`), tone: (r === 'when' ? 'neutral' : 'bad') as 'neutral' | 'bad' },
      ],
    })),
  };
}

/** Cited retailer parity cards (shared by home + big-retailers page). */
export function parityCards(locale: string) {
  const tt = (k: string) => t(locale, k);
  return [
    {
      name: tt('home.parity.walmart.name'),
      quote: tt('home.parity.walmart.quote'),
      source: tt('home.parity.walmart.source'),
      sourceHref: 'https://www.walmart.com/help/article/create-or-edit-an-account/147a20c9cada4d75b8e0128b16fb6fda',
      tone: 'good' as const,
    },
    {
      name: tt('home.parity.amazon.name'),
      quote: tt('home.parity.amazon.quote'),
      source: tt('home.parity.amazon.source'),
      sourceHref: 'https://www.amazon.sg/gp/help/customer/display.html?nodeId=GU235AYZNKC6PDGQ',
      tone: 'good' as const,
    },
    {
      name: tt('home.parity.shopify.name'),
      quote: tt('home.parity.shopify.quote'),
      source: tt('home.parity.shopify.source'),
      sourceHref: 'https://www.shopify.com/legal/cookies',
      tone: 'bad' as const,
    },
  ];
}
