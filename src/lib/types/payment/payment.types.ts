// @/lib/types/index.ts

export interface OrderType {
    amount: number,
    amount_due: number,
    amount_paid: number,
    attempts: number,
    created_at: number,
    currency: string,
    entity: string,
    id: string,
    notes: {
        description: string
    },
    offer_id: string | null,
    receipt: string,
    status: string
};