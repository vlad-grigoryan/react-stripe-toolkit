import React, { useState } from 'react';
import { useStripeInvoices, StripeInvoice } from 'react-stripe-toolkit';

// Get the serverless function URL from environment variables
const listInvoicesUrl = import.meta.env.VITE_LIST_INVOICES_URL;

export const InvoicesDemo: React.FC = () => {
    const { invoices, loading, error, getInvoices } = useStripeInvoices({ listInvoicesUrl });
    const [customerId, setCustomerId] = useState('cus_SgXTnX0fqAGzlN');

    const handleFetchInvoices = () => {
        if (customerId) {
            getInvoices(customerId);
        }
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleDateString();
    };

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount / 100);
    };

    return (
        <div className="demo-section">
            <h2>Invoices Demo</h2>
            <p>This demo shows how to fetch a customer's invoice history using the <code>useStripeInvoices</code> hook.</p>
            
            <h4>Enter Stripe Customer ID</h4>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                <input
                    type="text"
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    placeholder="cus_..."
                    style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', width: '300px' }}
                />
                <button onClick={handleFetchInvoices} disabled={loading || !customerId} className="pay">
                    {loading ? 'Fetching...' : 'Get Invoices'}
                </button>
            </div>

            {error && <p className="error">Error: {error.message}</p>}

            {invoices && (
                <div>
                    <h4>Invoice History</h4>
                    {invoices.length > 0 ? (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #eee' }}>Date</th>
                                    <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #eee' }}>Amount</th>
                                    <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #eee' }}>Status</th>
                                    <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #eee' }}>Link</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.map((invoice: StripeInvoice) => (
                                    <tr key={invoice.id}>
                                        <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>{formatDate(invoice.created)}</td>
                                        <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>{formatCurrency(invoice.amount_paid, invoice.currency)}</td>
                                        <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}><span style={{ textTransform: 'capitalize' }}>{invoice.status}</span></td>
                                        <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}><a href={invoice.invoice_pdf} target="_blank" rel="noopener noreferrer">View PDF</a></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No invoices found for this customer.</p>
                    )}
                </div>
            )}
        </div>
    );
};
