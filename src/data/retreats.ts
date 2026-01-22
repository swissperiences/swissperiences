export type RetreatTier = 'signature' | 'basecamp' | 'corporate';

export interface RetreatPrice {
    amount: number;
    currency: string;
    label: string;
    description: string;
}

export interface Retreat {
    id: string;
    title: string;
    date: string;
    location: string;
    status: 'open' | 'full' | 'invite-only';
    tiers: {
        [key in RetreatTier]?: RetreatPrice;
    };
}

export const UPCOMING_RETREATS: Retreat[] = [
    {
        id: 'spring-2026-pilot',
        title: 'The Spring Intake',
        date: 'May 12 — 19, 2026',
        location: 'Villars-sur-Ollon, Switzerland',
        status: 'open',
        tiers: {
            signature: {
                amount: 14500,
                currency: 'CHF',
                label: 'The Signature Cohort',
                description: 'All-inclusive luxury immersion.'
            },
            basecamp: {
                amount: 3500,
                currency: 'CHF',
                label: 'The Basecamp',
                description: 'Authentic shared experience.'
            }
        }
    }
];
