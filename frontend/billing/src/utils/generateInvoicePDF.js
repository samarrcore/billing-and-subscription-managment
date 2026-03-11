import jsPDF from 'jspdf';

/**
 * Generates a branded Billabear PDF invoice.
 *
 * @param {Object}  invoice   – { id, date, plan, amount, status, paymentMethod? }
 * @param {Object}  [user]    – { name, email } (auto-read from localStorage if omitted)
 * @param {Object}  [company] – override company details
 */
export default function generateInvoicePDF(invoice, user, company) {
    const u = user || JSON.parse(localStorage.getItem('billabear_user') || '{}');
    const comp = company || {
        name: 'Billabear Inc.',
        address: '4th Floor, WeWork Galaxy\nResidency Road, Bangalore 560025\nKarnataka, India',
        gstin: '29AABCT1332L1ZD',
        pan: 'AABCT1332L',
        email: 'billing@billabear.com',
        website: 'www.billabear.com',
    };

    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const W = doc.internal.pageSize.getWidth();   // 210
    const H = doc.internal.pageSize.getHeight();   // 297
    const M = 20; // margin

    // ── Helpers ─────────────────────────────────────────────────
    const primaryR = 19, primaryG = 91, primaryB = 236;     // #135bec
    const darkR = 15, darkG = 23, darkB = 42;               // #0f172a
    const grayR = 100, grayG = 116, grayB = 139;            // #64748b

    const setColor = (r, g, b) => doc.setTextColor(r, g, b);
    const setFill = (r, g, b) => doc.setFillColor(r, g, b);

    const formatINR = (val) => {
        const n = typeof val === 'number' ? val : parseFloat(String(val).replace(/[₹,]/g, ''));
        return isNaN(n) ? String(val) : `₹${n.toLocaleString('en-IN')}`;
    };

    const rawAmount = typeof invoice.amount === 'number'
        ? invoice.amount
        : parseFloat(String(invoice.amount).replace(/[₹,]/g, ''));
    const gstRate = 18;
    const baseAmount = +(rawAmount / (1 + gstRate / 100)).toFixed(2);
    const gstAmount = +(rawAmount - baseAmount).toFixed(2);
    const cgst = +(gstAmount / 2).toFixed(2);
    const sgst = +(gstAmount / 2).toFixed(2);

    // ── Header band ─────────────────────────────────────────────
    setFill(primaryR, primaryG, primaryB);
    doc.rect(0, 0, W, 40, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    setColor(255, 255, 255);
    doc.text('BILLABEAR', M, 18);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Subscription & Billing Management', M, 26);

    // TAX INVOICE label (right side)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('TAX INVOICE', W - M, 18, { align: 'right' });
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(invoice.id, W - M, 26, { align: 'right' });

    // ── Invoice meta row ────────────────────────────────────────
    let y = 52;

    // Left: Invoice details
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    setColor(grayR, grayG, grayB);
    doc.text('INVOICE DATE', M, y);
    doc.text('DUE DATE', M + 50, y);
    doc.text('STATUS', M + 100, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    setColor(darkR, darkG, darkB);
    doc.text(invoice.date || '-', M, y + 6);
    doc.text(invoice.dueDate || invoice.date || '-', M + 50, y + 6);

    // Status badge
    const statusLabel = (invoice.status || 'Paid').toUpperCase();
    const isPaid = statusLabel === 'PAID';
    if (isPaid) { setFill(16, 185, 129); setColor(255, 255, 255); }
    else { setFill(245, 158, 11); setColor(255, 255, 255); }
    const badgeW = doc.getTextWidth(statusLabel) + 8;
    doc.roundedRect(M + 100, y + 1, badgeW, 7, 2, 2, 'F');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(statusLabel, M + 100 + badgeW / 2, y + 6, { align: 'center' });

    // ── From / To ───────────────────────────────────────────────
    y += 22;
    const colW = (W - 2 * M) / 2;

    // From (company)
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    setColor(grayR, grayG, grayB);
    doc.text('FROM', M, y);
    y += 6;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    setColor(darkR, darkG, darkB);
    doc.text(comp.name, M, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    setColor(grayR, grayG, grayB);
    const addrLines = comp.address.split('\n');
    addrLines.forEach((line, i) => doc.text(line, M, y + 5 + i * 4.5));
    doc.text(`GSTIN: ${comp.gstin}`, M, y + 5 + addrLines.length * 4.5);
    doc.text(`PAN: ${comp.pan}`, M, y + 9.5 + addrLines.length * 4.5);

    // To (customer)
    const toX = M + colW + 10;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    setColor(grayR, grayG, grayB);
    doc.text('BILL TO', toX, y - 6);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    setColor(darkR, darkG, darkB);
    doc.text(u.name || 'Customer', toX, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    setColor(grayR, grayG, grayB);
    doc.text(u.email || '-', toX, y + 5);
    if (invoice.paymentMethod) {
        doc.text(`Payment: ${invoice.paymentMethod}`, toX, y + 10);
    }

    // ── Separator ───────────────────────────────────────────────
    y += 36;
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setLineWidth(0.3);
    doc.line(M, y, W - M, y);

    // ── Line Items Table ────────────────────────────────────────
    y += 8;
    // Header row
    setFill(248, 250, 252); // slate-50
    doc.roundedRect(M, y - 4, W - 2 * M, 10, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    setColor(grayR, grayG, grayB);
    doc.text('DESCRIPTION', M + 4, y + 2);
    doc.text('HSN/SAC', M + 90, y + 2);
    doc.text('QTY', M + 115, y + 2);
    doc.text('RATE', M + 130, y + 2);
    doc.text('AMOUNT', W - M - 4, y + 2, { align: 'right' });

    // Item row
    y += 14;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    setColor(darkR, darkG, darkB);
    const planName = invoice.plan || 'Subscription Service';
    doc.setFont('helvetica', 'bold');
    doc.text(planName, M + 4, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    setColor(grayR, grayG, grayB);
    doc.text('Monthly subscription service', M + 4, y + 5);

    doc.setFontSize(9);
    setColor(darkR, darkG, darkB);
    doc.text('998314', M + 90, y);
    doc.text('1', M + 118, y);
    doc.text(formatINR(baseAmount), M + 130, y);
    doc.text(formatINR(baseAmount), W - M - 4, y, { align: 'right' });

    // Separator
    y += 14;
    doc.setDrawColor(226, 232, 240);
    doc.line(M, y, W - M, y);

    // ── Subtotal / GST / Total ──────────────────────────────────
    const labelX = W - M - 70;
    const valX = W - M - 4;
    y += 8;

    const addRow = (label, value, bold) => {
        doc.setFont('helvetica', bold ? 'bold' : 'normal');
        doc.setFontSize(9);
        setColor(grayR, grayG, grayB);
        doc.text(label, labelX, y);
        setColor(darkR, darkG, darkB);
        if (bold) doc.setFont('helvetica', 'bold');
        doc.text(value, valX, y, { align: 'right' });
        y += 6;
    };

    addRow('Subtotal', formatINR(baseAmount), false);
    addRow(`CGST (${gstRate / 2}%)`, formatINR(cgst), false);
    addRow(`SGST (${gstRate / 2}%)`, formatINR(sgst), false);

    // Total row with background
    y += 2;
    setFill(primaryR, primaryG, primaryB);
    doc.roundedRect(labelX - 4, y - 5, W - M - labelX + 8, 12, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    setColor(255, 255, 255);
    doc.text('TOTAL', labelX, y + 2);
    doc.text(formatINR(rawAmount), valX, y + 2, { align: 'right' });

    // ── GST Summary Box ─────────────────────────────────────────
    y += 22;
    setFill(248, 250, 252);
    doc.roundedRect(M, y, W - 2 * M, 28, 3, 3, 'F');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    setColor(grayR, grayG, grayB);
    doc.text('GST SUMMARY', M + 6, y + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const row1Y = y + 14;
    setColor(grayR, grayG, grayB);
    doc.text('Tax Type', M + 6, row1Y);
    doc.text('Rate', M + 50, row1Y);
    doc.text('Taxable Amount', M + 80, row1Y);
    doc.text('Tax Amount', M + 120, row1Y);

    setColor(darkR, darkG, darkB);
    doc.text(`CGST`, M + 6, row1Y + 6);
    doc.text(`${gstRate / 2}%`, M + 50, row1Y + 6);
    doc.text(formatINR(baseAmount), M + 80, row1Y + 6);
    doc.text(formatINR(cgst), M + 120, row1Y + 6);

    doc.text(`SGST`, M + 6, row1Y + 11);
    doc.text(`${gstRate / 2}%`, M + 50, row1Y + 11);
    doc.text(formatINR(baseAmount), M + 80, row1Y + 11);
    doc.text(formatINR(sgst), M + 120, row1Y + 11);

    // ── Terms & Conditions ──────────────────────────────────────
    y += 40;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    setColor(grayR, grayG, grayB);
    doc.text('TERMS & CONDITIONS', M, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    const terms = [
        '1. Payment is due as per the subscription billing cycle.',
        '2. This is a computer-generated invoice and does not require a physical signature.',
        '3. All amounts are in Indian Rupees (INR) and are inclusive of applicable GST.',
        '4. For any disputes, please contact billing@billabear.com within 7 days.',
    ];
    terms.forEach((t, i) => doc.text(t, M, y + 5 + i * 4));

    // ── Footer ──────────────────────────────────────────────────
    setFill(248, 250, 252);
    doc.rect(0, H - 18, W, 18, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    setColor(grayR, grayG, grayB);
    doc.text(`${comp.email}  •  ${comp.website}  •  GSTIN: ${comp.gstin}`, W / 2, H - 10, { align: 'center' });
    doc.text('Thank you for your business!', W / 2, H - 5, { align: 'center' });

    // ── Save ────────────────────────────────────────────────────
    doc.save(`${invoice.id || 'invoice'}.pdf`);
}
