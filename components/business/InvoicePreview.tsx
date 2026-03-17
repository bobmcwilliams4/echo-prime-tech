'use client';

import { formatCurrency } from '../../lib/business-utils';

interface PreviewLineItem {
  description: string;
  quantity: number;
  unit_price: number;
}

interface InvoicePreviewProps {
  invoiceNumber: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
  issueDate: string;
  dueDate: string;
  paymentTerms: string;
  lineItems: PreviewLineItem[];
  taxRate: number;
  discount: number;
  notes?: string;
  showPage2?: boolean;
}

function EPTLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--ept-accent)' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div>
        <div className="font-bold text-base" style={{ color: 'var(--ept-text)' }}>Echo Prime Technologies</div>
        <div className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>echo-ept.com</div>
      </div>
    </div>
  );
}

export default function InvoicePreview({
  invoiceNumber, customerName, customerEmail, customerPhone, customerAddress,
  issueDate, dueDate, paymentTerms, lineItems, taxRate, discount, notes, showPage2 = true,
}: InvoicePreviewProps) {
  const subtotal = lineItems.reduce((sum, li) => sum + li.quantity * li.unit_price, 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount - discount;
  const fmtD = (d: string) => d ? new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';

  return (
    <div className="space-y-6">
      {/* Page 1 — Invoice */}
      <div className="p-8 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <EPTLogo />
          <div className="text-right">
            <div className="text-2xl font-bold" style={{ color: 'var(--ept-accent)' }}>INVOICE</div>
            <div className="text-sm font-mono mt-1" style={{ color: 'var(--ept-text-secondary)' }}>{invoiceNumber}</div>
          </div>
        </div>

        {/* From / To / Details */}
        <div className="grid grid-cols-3 gap-6 mb-8 text-sm">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--ept-text-muted)' }}>From</div>
            <div style={{ color: 'var(--ept-text)' }}>
              <div className="font-medium">Echo Prime Technologies</div>
              <div style={{ color: 'var(--ept-text-secondary)' }}>Midland, TX 79701</div>
              <div style={{ color: 'var(--ept-text-secondary)' }}>info@echo-ept.com</div>
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--ept-text-muted)' }}>Bill To</div>
            <div style={{ color: 'var(--ept-text)' }}>
              <div className="font-medium">{customerName || '—'}</div>
              {customerEmail && <div style={{ color: 'var(--ept-text-secondary)' }}>{customerEmail}</div>}
              {customerPhone && <div style={{ color: 'var(--ept-text-secondary)' }}>{customerPhone}</div>}
              {customerAddress && <div style={{ color: 'var(--ept-text-secondary)' }}>{customerAddress}</div>}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--ept-text-muted)' }}>Details</div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span style={{ color: 'var(--ept-text-muted)' }}>Issue Date</span><span style={{ color: 'var(--ept-text)' }}>{fmtD(issueDate)}</span></div>
              <div className="flex justify-between"><span style={{ color: 'var(--ept-text-muted)' }}>Due Date</span><span style={{ color: 'var(--ept-text)' }}>{fmtD(dueDate)}</span></div>
              <div className="flex justify-between"><span style={{ color: 'var(--ept-text-muted)' }}>Terms</span><span style={{ color: 'var(--ept-text)' }}>{paymentTerms.replace(/_/g, ' ')}</span></div>
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <table className="w-full text-sm mb-6">
          <thead>
            <tr style={{ borderBottom: '2px solid var(--ept-border)' }}>
              <th className="text-left py-3 font-semibold text-xs uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>Description</th>
              <th className="text-center py-3 font-semibold text-xs uppercase tracking-wider w-20" style={{ color: 'var(--ept-text-muted)' }}>Qty</th>
              <th className="text-right py-3 font-semibold text-xs uppercase tracking-wider w-28" style={{ color: 'var(--ept-text-muted)' }}>Rate</th>
              <th className="text-right py-3 font-semibold text-xs uppercase tracking-wider w-28" style={{ color: 'var(--ept-text-muted)' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {lineItems.filter(li => li.description).map((li, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--ept-border)' }}>
                <td className="py-3" style={{ color: 'var(--ept-text)' }}>{li.description}</td>
                <td className="py-3 text-center" style={{ color: 'var(--ept-text-secondary)' }}>{li.quantity}</td>
                <td className="py-3 text-right" style={{ color: 'var(--ept-text-secondary)' }}>{formatCurrency(li.unit_price)}</td>
                <td className="py-3 text-right font-medium" style={{ color: 'var(--ept-text)' }}>{formatCurrency(li.quantity * li.unit_price)}</td>
              </tr>
            ))}
            {lineItems.filter(li => li.description).length === 0 && (
              <tr><td colSpan={4} className="py-6 text-center text-sm" style={{ color: 'var(--ept-text-muted)' }}>No line items added yet</td></tr>
            )}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64 space-y-2 text-sm">
            <div className="flex justify-between"><span style={{ color: 'var(--ept-text-muted)' }}>Subtotal</span><span style={{ color: 'var(--ept-text)' }}>{formatCurrency(subtotal)}</span></div>
            <div className="flex justify-between"><span style={{ color: 'var(--ept-text-muted)' }}>Tax ({taxRate}%)</span><span style={{ color: 'var(--ept-text)' }}>{formatCurrency(taxAmount)}</span></div>
            {discount > 0 && (
              <div className="flex justify-between"><span style={{ color: 'var(--ept-text-muted)' }}>Discount</span><span style={{ color: 'var(--ept-success)' }}>-{formatCurrency(discount)}</span></div>
            )}
            <div className="flex justify-between pt-2 font-bold text-base" style={{ borderTop: '2px solid var(--ept-border)' }}>
              <span style={{ color: 'var(--ept-text)' }}>Total Due</span>
              <span style={{ color: 'var(--ept-accent)' }}>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {notes && (
          <div className="mt-8 pt-4" style={{ borderTop: '1px solid var(--ept-border)' }}>
            <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--ept-text-muted)' }}>Notes</div>
            <div className="text-sm whitespace-pre-wrap" style={{ color: 'var(--ept-text-secondary)' }}>{notes}</div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-4 text-center text-xs" style={{ borderTop: '1px solid var(--ept-border)', color: 'var(--ept-text-muted)' }}>
          Echo Prime Technologies &bull; Midland, TX &bull; echo-ept.com &bull; info@echo-ept.com
        </div>
      </div>

      {/* Page 2 — Terms & Conditions */}
      {showPage2 && (
        <div className="p-8 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <div className="flex justify-between items-start mb-6">
            <EPTLogo />
            <div className="text-right">
              <div className="text-sm font-semibold" style={{ color: 'var(--ept-text)' }}>Terms & Conditions</div>
              <div className="text-xs font-mono" style={{ color: 'var(--ept-text-muted)' }}>{invoiceNumber}</div>
            </div>
          </div>

          <div className="space-y-4 text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
            <div>
              <div className="font-semibold mb-1" style={{ color: 'var(--ept-text)' }}>1. Payment Terms</div>
              <p>Payment is due per the terms stated on the invoice. Late payments may incur a 1.5% monthly finance charge. All prices are in US Dollars (USD).</p>
            </div>
            <div>
              <div className="font-semibold mb-1" style={{ color: 'var(--ept-text)' }}>2. Scope of Work</div>
              <p>Services are provided as described in the line items above. Any additional work outside the original scope will be quoted separately and requires written approval before proceeding.</p>
            </div>
            <div>
              <div className="font-semibold mb-1" style={{ color: 'var(--ept-text)' }}>3. Intellectual Property</div>
              <p>Upon full payment, all custom-built deliverables (websites, applications, bots, integrations) transfer to the client. Echo Prime Technologies retains the right to use generic frameworks, templates, and non-client-specific components in future projects.</p>
            </div>
            <div>
              <div className="font-semibold mb-1" style={{ color: 'var(--ept-text)' }}>4. Hosting & Maintenance</div>
              <p>Recurring hosting, maintenance, and subscription services are billed monthly. Cancellation requires 30 days written notice. Unused prepaid periods are non-refundable.</p>
            </div>
            <div>
              <div className="font-semibold mb-1" style={{ color: 'var(--ept-text)' }}>5. Warranties</div>
              <p>Echo Prime Technologies warrants that all deliverables will function as described for 30 days after delivery. Bug fixes within scope are provided at no additional charge during this period.</p>
            </div>
            <div>
              <div className="font-semibold mb-1" style={{ color: 'var(--ept-text)' }}>6. Limitation of Liability</div>
              <p>Echo Prime Technologies liability shall not exceed the total amount paid under this invoice. We are not liable for indirect, consequential, or incidental damages.</p>
            </div>
            <div>
              <div className="font-semibold mb-1" style={{ color: 'var(--ept-text)' }}>7. Confidentiality</div>
              <p>Both parties agree to keep confidential any proprietary information shared during the course of the engagement. This obligation survives termination of services.</p>
            </div>
            <div>
              <div className="font-semibold mb-1" style={{ color: 'var(--ept-text)' }}>8. Governing Law</div>
              <p>This agreement is governed by the laws of the State of Texas. Any disputes shall be resolved in Midland County, Texas.</p>
            </div>
          </div>

          <div className="mt-8 pt-4 text-center text-xs" style={{ borderTop: '1px solid var(--ept-border)', color: 'var(--ept-text-muted)' }}>
            Echo Prime Technologies &bull; Midland, TX &bull; echo-ept.com &bull; info@echo-ept.com
          </div>
        </div>
      )}
    </div>
  );
}
