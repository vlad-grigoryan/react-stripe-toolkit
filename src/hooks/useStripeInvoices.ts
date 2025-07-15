import { useState, useCallback } from 'react';

// Define the structure of a Stripe Invoice object
export interface StripeInvoice {
    id: string;
    amount_paid: number;
    created: number;
    currency: string;
    customer: string;
    invoice_pdf: string;
    status: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void';
}

// Define the options for the hook
export interface UseStripeInvoicesOptions {
    listInvoicesUrl: string;
}

// Define the return value of the hook
export interface UseStripeInvoicesReturn {
    invoices: StripeInvoice[] | null;
    loading: boolean;
    error: Error | null;
    getInvoices: (customerId: string) => Promise<void>;
}

export const useStripeInvoices = (options: UseStripeInvoicesOptions): UseStripeInvoicesReturn => {
    const [invoices, setInvoices] = useState<StripeInvoice[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const getInvoices = useCallback(async (customerId: string) => {
        if (!options.listInvoicesUrl) {
            setError(new Error('Serverless function URL (listInvoicesUrl) is not configured.'));
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(options.listInvoicesUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ customerId }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch invoices.');
            }

            const data = await response.json();
            setInvoices(data.invoices);

        } catch (err: any) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [options.listInvoicesUrl]);

    return { invoices, loading, error, getInvoices };
};
