import React from "react";
import type { INVOICE } from "@/types/invoiceType";
import { generateInvoicePDF } from "@/api/invoice";
import { downloadBlob } from "@/utils/DownloadBlog";
import { companyLogos } from "@/assets/companyLogos";
/* ===============================
   Utils
================================ */

const formatCurrency = (amount: number): string =>
  `₹ ${Number(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (date: string): string =>
  new Date(date).toLocaleDateString("en-IN");

/* ===============================
   Props
================================ */

interface InvoiceProps {
  invoice: INVOICE;
}

/* ===============================
   Invoice Component
================================ */

const InvoicePage: React.FC<InvoiceProps> = ({ invoice }) => {
  const {
    _id,
    createdAt,
    company,
    customer,
    items,
    charges,
    gst,
    itemsTotal,
    subTotal,
    totalAmount,
    advance,
    remainingAmount,
    payment,
  } = invoice;

  /* ===============================
     ACTION HANDLERS
  ================================ */

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = async (invoice: INVOICE) => {
    try {
      // 1️⃣ Generate PDF from backend
      const pdfBlob = await generateInvoicePDF(invoice);

      // 2️⃣ Download PDF locally
      downloadBlob(pdfBlob, `Invoice_${invoice._id}.pdf`);

      // 3️⃣ Open WhatsApp with message
      window.open(
        `https://wa.me/?text=${encodeURIComponent(
          "📄 Please find the invoice attached."
        )}`,
        "_blank"
      );
    } catch (error) {
      console.error("Invoice PDF generation failed", error);
      alert("Failed to generate invoice PDF");
    }
  };

  return (
    <>
      {/* ================= PRINT FIXES ================= */}
      <style>
        {`
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          @media print {
            body {
              background: white !important;
            }

            .invoice {
              border: none !important;
              box-shadow: none !important;
            }

            table {
              border-collapse: collapse !important;
            }

            th, td {
              border: 1px solid #000 !important;
            }

            .action-buttons {
              display: none !important;
            }
          }
        `}
      </style>

      <div style={styles.wrapper}>
        <div className="invoice" style={styles.invoice}>
          {/* HEADER */}
          <div style={styles.row}>
            <div style={styles.company}>
              <img
                src={
                  companyLogos[company.name as string] ||
                  "/assets/default-logo.png"
                }
                alt="Company Logo"
                style={styles.logo}
              />

              <div>
                <strong>{company.name}</strong>
                <div>{company.address}</div>
                <div>Phone: {company.phone}</div>
                <div>Email: {company.email}</div>
              </div>
            </div>

            <div style={styles.invoiceTitle}>
              <h2 style={styles.heading}>TAX INVOICE</h2>
              <div>Invoice No: {_id}</div>
              <div>Date: {formatDate(createdAt)}</div>
            </div>
          </div>

          {/* BILL TO */}
          <div style={styles.box}>
            <strong>BILL TO:</strong>
            <br />
            {customer.name}
            <br />
            {customer.address}
            <br />
            Phone: {customer.phone}
            {customer.PAN && <> | PAN: {customer.PAN}</>}
            {customer.GSTIN && <> | GSTIN: {customer.GSTIN}</>}
          </div>

          {/* ITEMS TABLE */}
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Description</th>
                <th style={styles.th}>Project</th>
                <th style={styles.th}>Code</th>
                <th style={{ ...styles.th, textAlign: "right" }}>Area</th>
                <th style={{ ...styles.th, textAlign: "right" }}>Rate (₹)</th>
                <th style={{ ...styles.th, textAlign: "right" }}>Amount (₹)</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, idx) => {
                const amount = item.rate * item.areaSqFt;

                return (
                  <tr key={idx}>
                    <td style={styles.td}>{item.description}</td>
                    <td style={styles.td}>{item.projectName}</td>
                    <td style={styles.td}>{item.hashingCode}</td>
                    <td style={{ ...styles.td, textAlign: "right" }}>
                      {item.areaSqFt.toLocaleString("en-IN")}
                    </td>
                    <td style={{ ...styles.td, textAlign: "right" }}>
                      {formatCurrency(item.rate)}
                    </td>
                    <td style={{ ...styles.td, textAlign: "right" }}>
                      {formatCurrency(amount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* SUMMARY */}
          <div style={styles.summary}>
            <Row label="Items Total" value={itemsTotal} />
            {charges.parking > 0 && (
              <Row label="Parking" value={charges.parking} />
            )}
            {charges.amenities > 0 && (
              <Row label="Amenities" value={charges.amenities} />
            )}
            {charges.otherCharges > 0 && (
              <Row label="Other" value={charges.otherCharges} />
            )}
            <Row label="Sub Total" value={subTotal} />
            <Row label={`GST ${gst.percentage}%`} value={gst.amount} />

            <div style={styles.total}>
              <span>TOTAL</span>
              <span>{formatCurrency(totalAmount)}</span>
            </div>

            {advance > 0 && <Row label="Advance" value={advance} />}

            <div style={styles.boldRow}>
              <span>Balance</span>
              <span>{formatCurrency(remainingAmount)}</span>
            </div>
          </div>

          {/* PAYMENT */}
          <div style={styles.payment}>
            <strong>Payment:</strong> {payment.mode}
          </div>

          {/* FOOTER */}
          <div style={styles.footer}>
            <div>
              <strong>Bank</strong>
              <br />
              HDFC Bank
              <br />
              A/C: 50200012345678
              <br />
              IFSC: HDFC0001234
            </div>

            <div>
              <strong>Terms</strong>
              <ul style={styles.terms}>
                <li>Payment as agreed</li>
                <li>Cheque subject to realization</li>
                <li>Kolkata jurisdiction</li>
                <li>GST applicable</li>
              </ul>
            </div>
          </div>

          {/* SIGNATURE */}
          <div style={styles.signature}>
            For {company.name}
            <div style={styles.signLine}></div>
            Authorized Signatory
          </div>
        </div>

        {/* ================= ACTION BUTTONS ================= */}
        <div className="action-buttons" style={styles.actions}>
          <button
            onClick={() => handleWhatsApp(invoice)}
            style={styles.whatsappBtn}
          >
            Send to WhatsApp
          </button>

          <button onClick={handlePrint} style={styles.printBtn}>
            Print / Download
          </button>
        </div>
      </div>
    </>
  );
};

export default InvoicePage;

/* ===============================
   Helper Row
================================ */

interface RowProps {
  label: string;
  value: number;
}

const Row: React.FC<RowProps> = ({ label, value }) => (
  <div style={styles.rowItem}>
    <span>{label}</span>
    <span>{formatCurrency(value)}</span>
  </div>
);

/* ===============================
   STYLES
================================ */

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: { background: "#fff", padding: 14 },

  invoice: {
    maxWidth: 880,
    margin: "auto",
    padding: 20,
    fontSize: 11.5,
    lineHeight: 1.3,
    color: "#000",

    /* TEMPORARY PREVIEW BORDER */
    border: "1.5px dashed #999",
  },

  row: { display: "flex", justifyContent: "space-between" },
  company: { display: "flex", gap: 12 },
  logo: { width: 60 },

  invoiceTitle: { textAlign: "right", fontSize: 11.5 },
  heading: { margin: 0, fontSize: 15 },

  box: { padding: 8, marginTop: 10, fontSize: 11.5 },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: 12,
    fontSize: 11.5,
  },

  th: {
    background: "#2c3e50",
    color: "#fff",
    padding: "6px 7px",
    border: "1px solid #000",
    fontSize: 11,
  },

  td: {
    padding: "6px 7px",
    border: "1px solid #000",
  },

  summary: {
    width: "40%",
    marginLeft: "auto",
    marginTop: 8,
    fontSize: 11.5,
  },

  rowItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "2px 0",
  },

  total: {
    background: "#2c3e50",
    color: "#fff",
    padding: "5px 7px",
    margin: "5px 0",
    fontWeight: "bold",
    fontSize: 12,
    display: "flex",
    justifyContent: "space-between",
  },

  boldRow: {
    display: "flex",
    justifyContent: "space-between",
    fontWeight: "bold",
  },

  payment: { marginTop: 8, fontSize: 11.5 },

  footer: {
    display: "flex",
    gap: 24,
    marginTop: 18,
    fontSize: 11,
  },

  terms: { margin: 0, paddingLeft: 14 },

  signature: {
    marginTop: 30,
    textAlign: "right",
    fontSize: 11.5,
  },

  signLine: {
    width: 150,
    borderTop: "1px solid #000",
    marginLeft: "auto",
    marginTop: 18,
  },

  actions: {
    maxWidth: 880,
    margin: "16px auto",
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
  },

  whatsappBtn: {
    background: "#25D366",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    cursor: "pointer",
    fontSize: 13,
  },

  printBtn: {
    background: "#2c3e50",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    cursor: "pointer",
    fontSize: 13,
  },
};
