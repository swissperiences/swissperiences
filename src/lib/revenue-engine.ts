/**
 * Swissperiences: Revenue Engine
 * Centralized logic for financial calculations, margin tracking, and yield management.
 */

export interface RevenueCalculation {
    baseCost: number;
    marginRate: number;
    guestPrice: number;
    commissionAmount: number;
}

export const REVENUE_CONFIG = {
    DEFAULT_INVENTORY_FEE: 0.30, // 30% management fee for property owners
    DEFAULT_PARTNER_MARKUP: 0.20, // 20% curation premium for partners
};

/**
 * Calculates the final price to be charged to the guest.
 * formula: baseCost / (1 - marginRate)
 * This ensures the specified margin percentage is kept from the final price.
 */
export function calculateGuestPrice(baseCost: number, marginRate: number = REVENUE_CONFIG.DEFAULT_PARTNER_MARKUP): number {
    if (marginRate >= 1) return baseCost;
    return Math.ceil(baseCost / (1 - marginRate));
}

/**
 * Calculates the commission/management fee amount.
 */
export function calculateCommission(guestPrice: number, feeRate: number): number {
    return Math.floor(guestPrice * feeRate);
}

/**
 * Formats a currency amount for display.
 */
export function formatCurrency(amount: number, currency: 'CHF' | 'GBP' = 'CHF'): string {
    const symbol = currency === 'GBP' ? '£' : 'CHF ';
    return `${symbol}${amount.toLocaleString('en-CH', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

/**
 * Full breakdown for a line item or package.
 */
export function getRevenueBreakdown(baseCost: number, marginRate: number): RevenueCalculation {
    const guestPrice = calculateGuestPrice(baseCost, marginRate);
    return {
        baseCost,
        marginRate,
        guestPrice,
        commissionAmount: guestPrice - baseCost
    };
}
