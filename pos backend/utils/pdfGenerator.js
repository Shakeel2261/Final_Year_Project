import puppeteer from "puppeteer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateInvoicePDF = async (invoice) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    // Generate HTML content for the invoice
    const htmlContent = generateInvoiceHTML(invoice);

    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    // Create PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20px",
        right: "20px",
        bottom: "20px",
        left: "20px",
      },
    });

    await browser.close();

    return pdfBuffer;
  } catch (error) {
    console.error("PDF generation error:", error);
    throw error;
  }
};

const generateInvoiceHTML = (invoice) => {
  const currentDate = new Date().toLocaleDateString("en-GB");
  const dueDate = invoice.dueDate
    ? new Date(invoice.dueDate).toLocaleDateString("en-GB")
    : "N/A";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice ${invoice.invoiceNumber}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #007bff;
          padding-bottom: 20px;
        }
        .company-name {
          font-size: 28px;
          font-weight: bold;
          color: #007bff;
          margin-bottom: 10px;
        }
        .invoice-title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;
        }
        .invoice-details {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
        }
        .invoice-info, .customer-info {
          flex: 1;
        }
        .info-section h3 {
          color: #007bff;
          margin-bottom: 10px;
          border-bottom: 1px solid #ddd;
          padding-bottom: 5px;
        }
        .info-item {
          margin-bottom: 5px;
        }
        .info-label {
          font-weight: bold;
          display: inline-block;
          width: 120px;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        .items-table th,
        .items-table td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
        }
        .items-table th {
          background-color: #f8f9fa;
          font-weight: bold;
        }
        .items-table .text-right {
          text-align: right;
        }
        .totals-section {
          margin-left: auto;
          width: 300px;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          padding: 5px 0;
        }
        .total-row.final {
          border-top: 2px solid #007bff;
          font-weight: bold;
          font-size: 18px;
          margin-top: 20px;
          padding-top: 15px;
        }
        .status-badge {
          display: inline-block;
          padding: 5px 15px;
          border-radius: 20px;
          font-weight: bold;
          text-transform: uppercase;
        }
        .status-paid {
          background-color: #d4edda;
          color: #155724;
        }
        .status-partial {
          background-color: #fff3cd;
          color: #856404;
        }
        .status-outstanding {
          background-color: #f8d7da;
          color: #721c24;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 12px;
          color: #666;
          border-top: 1px solid #ddd;
          padding-top: 20px;
        }
        .notes {
          margin-top: 30px;
          padding: 15px;
          background-color: #f8f9fa;
          border-left: 4px solid #007bff;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-name">POS SYSTEM</div>
        <div class="invoice-title">INVOICE</div>
      </div>
      
      <div class="invoice-details">
        <div class="invoice-info">
          <h3>Invoice Details</h3>
          <div class="info-item">
            <span class="info-label">Invoice No:</span>
            ${invoice.invoiceNumber}
          </div>
          <div class="info-item">
            <span class="info-label">Date:</span>
            ${currentDate}
          </div>
          <div class="info-item">
            <span class="info-label">Due Date:</span>
            ${dueDate}
          </div>
          <div class="info-item">
            <span class="info-label">Status:</span>
            <span class="status-badge status-${invoice.status.toLowerCase()}">
              ${invoice.status}
            </span>
          </div>
          <div class="info-item">
            <span class="info-label">Type:</span>
            ${invoice.type}
          </div>
        </div>
        
        <div class="customer-info">
          <h3>Customer Details</h3>
          <div class="info-item">
            <span class="info-label">Name:</span>
            ${invoice.customerId?.name || "N/A"}
          </div>
          <div class="info-item">
            <span class="info-label">Phone:</span>
            ${invoice.customerId?.phone || "N/A"}
          </div>
          <div class="info-item">
            <span class="info-label">Email:</span>
            ${invoice.customerId?.email || "N/A"}
          </div>
          <div class="info-item">
            <span class="info-label">Address:</span>
            ${invoice.customerId?.address || "N/A"}
          </div>
        </div>
      </div>
      
      ${
        invoice.items && invoice.items.length > 0
          ? `
      <table class="items-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${invoice.items
            .map(
              (item) => `
            <tr>
              <td>${item.productName}</td>
              <td>${item.quantity}</td>
              <td class="text-right">Rs. ${item.unitPrice.toLocaleString()}</td>
              <td class="text-right">Rs. ${item.totalPrice.toLocaleString()}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
      `
          : ""
      }
      
      <div class="totals-section">
        <div class="total-row">
          <span>Original Amount:</span>
          <span>Rs. ${invoice.originalAmount.toLocaleString()}</span>
        </div>
        <div class="total-row">
          <span>Paid Amount:</span>
          <span>Rs. ${invoice.paidAmount.toLocaleString()}</span>
        </div>
        <div class="total-row final">
          <span>Remaining Amount:</span>
          <span>Rs. ${invoice.remainingAmount.toLocaleString()}</span>
        </div>
      </div>
      
      ${
        invoice.notes
          ? `
      <div class="notes">
        <strong>Notes:</strong> ${invoice.notes}
      </div>
      `
          : ""
      }
      
      <div class="footer">
        <p>Thank you for your business!</p>
        <p>Generated on ${currentDate}</p>
      </div>
    </body>
    </html>
  `;
};

